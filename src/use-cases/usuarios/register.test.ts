import { beforeEach, describe, expect, it } from "vitest";
import { UsuarioInMemoryRepository } from "../../repositories/usuarios/usuario-in-memory-repository";
import { RegisterUseCase } from "./register";
import { EmailJaCadastradoError } from "../../errors/email-ja-cadastrado.error";
import { compare } from "bcryptjs";

let usuarioRepository: UsuarioInMemoryRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
   beforeEach(() => {
      usuarioRepository = new UsuarioInMemoryRepository()
      sut = new RegisterUseCase(usuarioRepository)
   })

   it('should be able to register a new user', async () => {
      const { usuario } = await sut.execute({
         nome: 'John Doe',
         email: 'john@doe.com',
         senha: '123456'
      })

      expect(usuario.id).toEqual(expect.any(String))
      expect(usuario.nome).toEqual('John Doe')
      expect(usuario.email).toEqual('john@doe.com')
   })

   it('should not be able to register a new user with an existing email', async () => {
      const email = 'john@doe.com'

      await sut.execute({
         nome: 'John Doe',
         email,
         senha: '123456'
      })

      await expect(sut.execute({
         nome: 'John Doe',
         email,
         senha: '123456'
      })).rejects.toBeInstanceOf(EmailJaCadastradoError)
   })

   it('should hash the password before saving', async () => {
      const { usuario } = await sut.execute({
        nome: 'John Doe',
        email: 'john@doe.com',
        senha: '123456'
      })
    
      const userWithPassword = await usuarioRepository.findByEmail(usuario.email)
    
      expect(userWithPassword!.senha).not.toBe('123456')
    
      const isPasswordCorrectlyHashed = await compare(
        '123456',
        userWithPassword!.senha
      )
    
      expect(isPasswordCorrectlyHashed).toBe(true)
    })

})