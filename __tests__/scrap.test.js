/* eslint-disable no-undef */
import { describe, expect, jest } from "@jest/globals";
import Scrap from "../src/scrap/scrap.js";
import Carta from "../src/Models/carta.js";
import Vendedor from "../src/Models/vendedor.js";

describe("Testes da classe de Scrap", () => {
	it("Deve retornar uma lista de cartas", async () => {
		const listaCartas = await Scrap.recuperaCartas();

		listaCartas.forEach(carta => {
			expect(carta).toBeInstanceOf(Carta);

			expect(carta).toEqual(
				expect.objectContaining({
					Id: expect.any(Number),
					Codigo: expect.any(String),
					Nome: expect.any(String),
					Descricao: expect.any(String),
					Edicao: expect.any(String),
					Precos: expect.any(Array),
					Vendedores: expect.any(Array),
					Quantidade: expect.any(Number)
				})
			);

			carta.Precos.forEach(preco => {
				expect(preco).toBeTruthy();
			});

			carta.Vendedores.forEach(vendedor => {
				expect(vendedor).toBeInstanceOf(Vendedor);
			});
		});
	});
});

