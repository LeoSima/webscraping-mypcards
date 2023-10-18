/**
 * Classe que representa a relação de carta e vendedor e as informações pertinentes à relação
 */
export default class CartaVendedor {

	/**
	 * @constructor
	 * @param {number} id Id do objeto
	 * @param {number} idCarta Id da carta
	 * @param {number} idVendedor Id do Vendedor
	 * @param {string} raridade Raridade da carta
	 * @param {string} qualidade Qualidade/estado da carta
	 * @param {string} quantidade Quantidade de cartas que o vendedor possui
	 * @param {number} preco Preço da carta
	 */
	constructor (id, idCarta, idVendedor, raridade, qualidade, quantidade, preco) {
		this.Id = id;
		this.IdCarta = idCarta;
		this.IdVendedor = idVendedor;
		this.Raridade = raridade;
		this.Qualidade = qualidade;
		this.Quantidade = quantidade;
		this.Preco = preco;
	}

}
