import 'dotenv/config';
import { beforeEach, describe, expect, it } from "vitest";
import { UsuarioInMemoryRepository } from "../../repositories/usuarios/usuario-in-memory-repository";
import { makeUser } from "../../../tests/factories/make-user";
import { hash } from "bcryptjs";
import { GetByIdUseCase } from './get-by-id';
import { RecursoNaoEncontradoError } from '../../errors/recurso-nao-encontrado.error';

let usuarioRepository: UsuarioInMemoryRepository
let sut: GetByIdUseCase

describe('Get By Id Use Case', () => {
   beforeEach(() => {
      usuarioRepository = new UsuarioInMemoryRepository()
      sut = new GetByIdUseCase(usuarioRepository)
   })

   it('shoud be able to get a user by id', async () => {
      await usuarioRepository.create(makeUser({
         id: 'cfb5100d-9e73-49bc-ac41-09ce15fbedf8',
         email: 'test@email.com',
         senha: await hash('password', 6)
      }))

      const { usuario } = await sut.execute({
         id: 'cfb5100d-9e73-49bc-ac41-09ce15fbedf8'
      })

      expect(usuario).not.toBe(null)
      expect(usuario.email).toBe('test@email.com')
   })

   it('shoud not be able to get a user by id', async () => {
      await expect(sut.execute({
         id: '000000-0000-0000-0000-000000000000'
      })).rejects.toBeInstanceOf(RecursoNaoEncontradoError)
   })
})