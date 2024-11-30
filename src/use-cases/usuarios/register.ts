import { Usuario } from "@prisma/client";
import { UsuarioHttpRepository } from "../../repositories/usuarios/usuario-http-repository";
import { hash } from "bcryptjs";
import { EmailJaCadastradoError } from "../../errors/email-ja-cadastrado.error";

interface RegisterUseCaseRequest {
   nome: string
   email: string
   senha: string
}

interface RegisterUseCaseResponse {
   usuario: Usuario
}

export class RegisterUseCase {
   constructor(private readonly usuarioRepository: UsuarioHttpRepository) { }

   async execute({
      nome,
      email,
      senha
   }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
      const userWithSameEmail = await this.usuarioRepository.findByEmail(email)

      if (userWithSameEmail) {
         throw new EmailJaCadastradoError()
      }

      const passwordHash = await hash(senha, 6)

      const usuario = await this.usuarioRepository.create({
         nome,
         email,
         senha: passwordHash
      })

      return {
         usuario
      }
   }
}