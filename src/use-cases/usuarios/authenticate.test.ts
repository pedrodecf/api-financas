import 'dotenv/config';
import { beforeEach, describe, expect, it } from "vitest";
import { UsuarioInMemoryRepository } from "../../repositories/usuarios/usuario-in-memory-repository";
import { AuthenticateUseCase } from "./authenticate";
import { makeUser } from "../../../tests/factories/make-user";
import { hash } from "bcryptjs";
import { CredenciaisInvalidasError } from '../../errors/credenciais-invalidas.error';

let usuarioRepository: UsuarioInMemoryRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
   beforeEach(() => {
      usuarioRepository = new UsuarioInMemoryRepository()
      sut = new AuthenticateUseCase(usuarioRepository)
   })

   it('should be able to authenticate a user', async () => {
      await usuarioRepository.create(makeUser({
         email: 'test@email.com',
         senha: await hash('password', 6)
      }))

      const { token } = await sut.execute({
         email: 'test@email.com',
         senha: 'password'
      })

      expect(token).toBeDefined()
   })

   it('should not be able to authenticate a user with invalid email', async () => {
      await usuarioRepository.create(makeUser({
         email: 'test@email.com',
         senha: await hash('password', 6)
      }))

      await expect(sut.execute({
         email: 'invalid-email',
         senha: 'password'
      })).rejects.toBeInstanceOf(CredenciaisInvalidasError)
   })

   it('should not be able to authenticate a user with invalid password', async () => {
      await usuarioRepository.create(makeUser({
         email: 'test@email.com',
         senha: await hash('password', 6)
      }))

      await expect(sut.execute({
         email: 'test@email.com',
         senha: 'invalid-password'
      })).rejects.toBeInstanceOf(CredenciaisInvalidasError)
   })
})