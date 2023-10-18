import chalk from "chalk";
import axios from "axios";
import * as cheerio from "cheerio";

console.log(chalk.yellow("Iniciando web scraping...\n"));
const url = "https://mypcards.com/yugioh?ProdutoSearch%5BexibirSomenteVenda%5D=1&ProdutoSearch%5BquantidadeRegistro%5D=100&sort=nomeptproduto";

await axios.get(url).then((response) => {

	const cards = [];
	const $ = cheerio.load(response.data);
	$(".stream-item").each((_, element) => {
		const itemDiv = $(element).find("div.card");

		if (!itemDiv.hasClass("outro-produto"))
			cards.push({
				id: $(element).attr("data-key"),
				nome: itemDiv.find("div.card-dados>div.card-name>h3").text().trim()}
			);
	});

	console.log(cards);

}).catch(erro => {
	console.log(chalk.red(erro));
});

console.log(chalk.green("\nScraping finalizado com sucesso!"));
