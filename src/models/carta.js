// eslint-disable-next-line no-unused-vars
import Vendedor from "./vendedor";

/**
 * Classe que representa uma carta
 */
export default class Carta {

	/**
	 * @constructor
	 * @param {string} codigo
	 * @param {string} nome
	 * @param {string} descricao
	 * @param {string} edicao
	 * @param {Array.<number>} precos
	 * @param {Array.<Vendedor>} vendedores
	 * @param {number} quantidade
	 */
	constructor (codigo, nome, descricao, edicao, precos, vendedores, quantidade) {
		this.Codigo = codigo;
		this.Nome = nome;
		this.Descricao = descricao;
		this.Edicao = edicao;
		this.Precos = precos;
		this.Vendedores = vendedores;
		this.Quantidade = quantidade;
	}

}
