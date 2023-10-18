import axios from "axios";
import * as cheerio from "cheerio";
import Carta from "../Models/carta.js";
import Vendedor from "../Models/vendedor.js";

/**
 * Classe com métodos relacionados ao Scraping do site
 */
export default class Scrap {

	#URL_BASE = "https://mypcards.com/yugioh";
	#URL_PAGINA_BUSCA = `${this.#URL_BASE}?ProdutoSearch%5BexibirSomenteVenda%5D=1&ProdutoSearch%5BquantidadeRegistro%5D=20&sort=nomeptproduto&page=`;
	#URL_PAGINA_DETALHES = `${this.#URL_BASE}/produto`;

	constructor () {}

	recuperaUrlBase () { return this.#URL_BASE; }
	recuperaUrlBusca () { return this.#URL_PAGINA_BUSCA; }
	
	/**
	 * Método que faz scrap das cartas na página de busca especificada e retorna um array de objetos Carta
	 * @param {Number | String} pagina Número da página para busca
	 * @returns {Array<Carta>} Array com as cartas encontradas na página
	 */
	async #recuperaCartasDaPaginaDeBusca (pagina = 0) {
		const cartas = [];

		await axios.get(this.#URL_PAGINA_BUSCA + pagina).then(response => {
			const $ = cheerio.load(response.data);

			$(".stream-item").each((_, element) => {
				const itemDiv = $(element).find("div");

				if (!itemDiv.hasClass("outro-produto"))
					cartas.push({
						id: $(element).attr("data-key"),
						nome: itemDiv.find("div.card-dados>div.card-name>h3").text().trim()
					});
			});
		}).catch(erro => {
			console.log(erro);
			return undefined;
		});

		return cartas;
	}

	/**
	 * Faz scrap da página de detalhes da carta e monta um objeto Carta com as informações encontradas
	 * @param {Number | String} idUrlCarta ID da carta para encontrar a página com suas informações
	 * @returns {Carta} Um objeto do tipo Carta com as informações da página
	 */
	async #recuperaDetalhesCarta (idUrlCarta) {
		let carta;

		const montaArrayPrecos = ($cheerio) => {
			const precos = [];

			$cheerio(".estoque-lista-precoestoque").each((_, elemento) => {
				precos.push(
					Number($cheerio(elemento).text().replace(/R\$|\s|\./gm, "").replaceAll(",", "."))
				);
			});

			return precos;
		};

		const montaArrayVendedores = ($cheerio) => {
			const vendedores = [];

			$cheerio(".estoque-lista-nomevendedor").each((_, elemento) => {
				vendedores.push($cheerio(elemento).text().trim());
			});

			return vendedores;
		};

		const somaQuantidadeCartas = ($cheerio) => {
			let quantidade = 0;

			$cheerio(".estoque-lista-quantidadeestoque").each((_, elemento) => {
				quantidade += parseInt($cheerio(elemento).text().replace(/[^0-9]/gm, ""));
			});

			return quantidade;
		};

		await axios.get(`${this.#URL_PAGINA_DETALHES}/${idUrlCarta}`).then(response => {
			const $ = cheerio.load(response.data);

			const codigoCarta = $("#produto-codigo>div:first-child").clone().children().remove().end().text().trim();
			const nomeCarta = $("#produto-nome").clone().children().remove().end().text().trim();
			const descricaoCarta = $("#produto-detalhe>div.descricao-content>div.descricao:first-child").text().trim();
			const edicaoCarta = $("#produto-codigo").children().eq(1).find("a").text().trim();
			const precosCarta = montaArrayPrecos($);
			const vendedores = this.recuperaVendedoresPorNome(montaArrayVendedores($));
			const quantidade = somaQuantidadeCartas($);

			carta = new Carta(
				codigoCarta,
				nomeCarta,
				descricaoCarta,
				edicaoCarta,
				precosCarta,
				vendedores,
				quantidade
			);
		}).catch(erro => {
			console.log(erro);
			carta = undefined;
		});

		return carta;
	}

	/**
	 * Recebe uma lista com nomes de vendedores e retorna uma lista de objetos Vendedor
	 * @param {Array<String>} vendedoresNome Nomes dos vendedores
	 * @returns {Array<Vendedor} Lista de vendedores
	 */
	recuperaVendedoresPorNome (vendedoresNome) {
		const vendedores = [];

		vendedoresNome.forEach(async vendedorNome => {
			vendedores.push(await Vendedor.recuperaVendedorPorNome(vendedorNome));
		});
		
		return vendedores;
	}

	static async scrapDadosVendedor (nomeVendedor) {
		let vendedor;

		await axios.get(`http://mypcards.com/${nomeVendedor}`).then(response => {
			const $ = cheerio.load(response.data);

			const username = $(".loja-vendedor>h2>span>a").text().trim();
			const tipo = ($(".loja-vendedor>h2>span>i").attr("title") ?? "Usuário");
			const cidadeEstado = $(".loja-vendedor>span").clone().children().remove().end().text().trim().split(" - ");
			const cidade = cidadeEstado[0];
			const estado = cidadeEstado[1];
			const bio = $(".loja-vendedor>p.descricao").text().replaceAll("\n", " ").replaceAll("\t", " ");
			
			vendedor = new Vendedor(
				username,
				tipo,
				estado,
				cidade,
				bio
			);
		}).catch(erro => {
			console.log(erro);
			vendedor = undefined;
		});

		return vendedor;
	}

	static async recuperaCartas () {
		await axios.get(`${this.recuperaUrlBusca}1`).then(response => {
			const $ = cheerio.load(response.data);

			const qtdeCartas = Number($("div.stream-organizer>div.summary").children().eq(1).text().replace(/[^0-9]/gm, ""));
			const qtdPaginas = Math.ceil(qtdeCartas / 100);
		});

		//TRANSFERIR A QUANTIDADE DE PÁGINAS PARA UMA FUNÇÂO SEPARADA
	}

}
