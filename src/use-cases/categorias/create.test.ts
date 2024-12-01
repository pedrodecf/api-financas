import { beforeEach, describe, expect, it } from "vitest";
import { UsuarioInMemoryRepository } from "../../repositories/usuarios/usuario-in-memory-repository";
import { hash } from "bcryptjs";
import { CreateUseCase } from "./create";
import { makeUser } from "../../../tests/factories/make-user";
import { makeCategory } from "../../../tests/factories/make-category";
import { CategoriasInMemoryRepository } from "../../repositories/categorias/categorias-in-memory-repository";
import { ConteudoExistenteError } from "../../errors/conteudo-existente.error";

let categoriasRepository: CategoriasInMemoryRepository
let usuarioRepository: UsuarioInMemoryRepository
let sut: CreateUseCase

describe('Create Use Case', () => {
   beforeEach(() => {
      categoriasRepository = new CategoriasInMemoryRepository()
      usuarioRepository = new UsuarioInMemoryRepository()
      sut = new CreateUseCase(
         categoriasRepository
      )
   })

   it('should be able to create a new category', async () => {
      await usuarioRepository.create(makeUser({
         id: 'usuario-id-para-teste',
         email: 'test@email.com',
         senha: await hash('password', 6),
         balanco: 0
      }))

      const { categoria } = await sut.execute({
         nome: 'Nova Categoria',
         usuarioId: 'usuario-id-para-teste',
         avatar: 'avatar-url'
      })

      expect(categoria.id).toBeGreaterThan(0)
      expect(categoria.nome).toBe('Nova Categoria')
      expect(categoria.avatar).toBe('avatar-url')
      expect(categoria.usuarioId).toBe('usuario-id-para-teste')
   })

   it('should not be able to create a new category with the same name', async () => {
      await usuarioRepository.create(makeUser({
         id: 'usuario-id-para-teste',
         email: 'test@email.com',
      }))

      await categoriasRepository.create(makeCategory({
         nome: 'Nova Categoria',
         usuarioId: 'usuario-id-para-teste'
      }))

      await expect(sut.execute({
         nome: 'Nova Categoria',
         usuarioId: 'usuario-id-para-teste',
      })).rejects.toBeInstanceOf(ConteudoExistenteError)
   })

   it('should be able to create a new category with the same name for another user', async () => {
      await usuarioRepository.create(makeUser({
         id: 'usuario-id-para-teste',
         email: 'test@email.com'
      }))

      await usuarioRepository.create(makeUser({
         id: 'usuario-id-para-teste-2',
         email: 'test2@email.com'
      }))

      await categoriasRepository.create(makeCategory({
         nome: 'Nova Categoria',
         usuarioId: 'usuario-id-para-teste'
      }))

      const { categoria } = await sut.execute({
         nome: 'Nova Categoria',
         usuarioId: 'usuario-id-para-teste-2',
      })

      expect(categoria.id).toBeGreaterThan(0)
      expect(categoria.nome).toBe('Nova Categoria')
      expect(categoria.usuarioId).toBe('usuario-id-para-teste-2')
   })
})