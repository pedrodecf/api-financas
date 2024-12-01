import { compare } from "bcryptjs";
import { CredenciaisInvalidasError } from "../../errors/credenciais-invalidas.error";
import { UsuarioHttpRepository } from "../../repositories/usuarios/usuario-http-repository";
import { Optional } from "../../lib/types";
import { Usuario } from "@prisma/client";

interface AuthenticateUseCaseRequest {
   email: string
   senha: string
}

interface AuthenticateUseCaseResponse {
   usuario: Optional<Usuario, 'senha'>
}

export class AuthenticateUseCase {
   constructor(private readonly usuarioRepository: UsuarioHttpRepository) { }

   async execute({
      email,
      senha
   }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
      const user = await this.usuarioRepository.findByEmail(email)

      if (!user) {
         throw new CredenciaisInvalidasError()
      }

      const doesPasswordMatch = await compare(senha, user.senha)

      if (!doesPasswordMatch) {
         throw new CredenciaisInvalidasError()
      }

      const { senha: _, ...usuarioWithoutPassword } = user

      return {
         usuario: usuarioWithoutPassword
      }
   }

}