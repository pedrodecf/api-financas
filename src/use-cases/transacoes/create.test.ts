import { beforeEach, describe, expect, it } from "vitest";
import { UsuarioInMemoryRepository } from "../../repositories/usuarios/usuario-in-memory-repository";
import { hash } from "bcryptjs";
import { CreateUseCase } from "./create";
import { CategoriasInMemoryRepository } from "../../repositories/categorias/categorias-in-memory-repository";
import { TransacoesInMemoryRepository } from "../../repositories/transacoes/transacoes-in-memory-repository";
import { makeUser } from "../../../tests/factories/make-user";
import { makeCategory } from "../../../tests/factories/make-category";

let transacoesRepository: TransacoesInMemoryRepository
let usuarioRepository: UsuarioInMemoryRepository
let categoriasRepository: CategoriasInMemoryRepository
let sut: CreateUseCase

describe('Create Use Case', () => {
   beforeEach(() => {
      transacoesRepository = new TransacoesInMemoryRepository()
      usuarioRepository = new UsuarioInMemoryRepository()
      categoriasRepository = new CategoriasInMemoryRepository()
      sut = new CreateUseCase(
         transacoesRepository,
         usuarioRepository,
         categoriasRepository
      )
   })

   it('should be able to create a new transaction', async () => {
      await usuarioRepository.create(makeUser({
         id: 'usuario-id-para-teste',
         email: 'test@email.com',
         senha: await hash('password', 6),
         balanco: 0
      }))

      await categoriasRepository.create(makeCategory({
         id: 123,
         usuarioId: 'usuario-id-para-teste'
      }))

      const { transacao, usuario } = await sut.execute({
         usuarioId: 'usuario-id-para-teste',
         categoriaId: 123,
         tipo: 'Entrada',
         valor: 100.0,
         descricao: 'Salário'
      })

      expect(transacao.categoriaId).toEqual(123)
      expect(transacao.usuarioId).toEqual('usuario-id-para-teste')
      expect(transacao.tipo).toEqual('Entrada')
      expect(transacao.valor).toEqual(100)
      expect(transacao.descricao).toEqual('Salário')
      expect(usuario.balanco).toEqual(100)
   })
})