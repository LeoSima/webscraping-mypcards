import Scrap from "../scrap/scrap.js";

/**
 * Classe que representa o vendedor
 */
export default class Vendedor {

	/**
	 * @constructor
	 * @param {string} username Nome de usuário do vendedor
	 * @param {string} tipo Tipo de vendedor (Lojista, usuário, certificado, etc.)
	 * @param {string} estado UF do vendedor
	 * @param {string} cidade Cidade do vendedor
	 * @param {string} bio Bio do vendedor
	 */
	constructor (username, tipo, estado, cidade, bio) {
		this.Username = username;
		this.Tipo = tipo;
		this.Estado = estado;
		this.Cidade = cidade;
		this.Bio = bio;
	}

	static async recuperaVendedorPorNome (nomevendedor) {
		//TODO: Desenvolver lógica para recuperar vendedor do banco de dados, caso contrário, criar um vendedor (lógica para criação será desenvolvida previamente)
		return await Scrap.scrapDadosVendedor(nomevendedor);
	}

}
