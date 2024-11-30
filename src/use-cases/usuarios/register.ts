import { Usuario } from "@prisma/client";
import { UsuarioHttpRepository } from "../../repositories/usuarios/usuario-http-repository";
import { hash } from "bcryptjs";
import { Optional } from "../../lib/types";
import { ConteudoExistenteError } from "../../errors/conteudo-existente.error";

interface RegisterUseCaseRequest {
   nome: string
   email: string
   senha: string
}

interface RegisterUseCaseResponse {
   usuario: Optional<Usuario, 'senha'>
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
         throw new ConteudoExistenteError('Já existe um usuário com esse email')
      }

      const passwordHash = await hash(senha, 6)

      const usuario = await this.usuarioRepository.create({
         nome,
         email,
         senha: passwordHash
      })

      const { senha: _, ...usuarioWithoutPassword } = usuario

      return {
         usuario: usuarioWithoutPassword
      }
   }
}