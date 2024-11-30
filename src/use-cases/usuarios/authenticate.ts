import { compare } from "bcryptjs";
import { CredenciaisInvalidasError } from "../../errors/credenciais-invalidas.error";
import { UsuarioHttpRepository } from "../../repositories/usuarios/usuario-http-repository";
import jwt from 'jsonwebtoken';

interface AuthenticateUseCaseRequest {
   email: string
   senha: string
}

interface AuthenticateUseCaseResponse {
   token: string
}

export class AuthenticateUseCase {
   constructor (private readonly usuarioRepository: UsuarioHttpRepository) { }

   async execute({
      email,
      senha
   }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
      const usuario = await this.usuarioRepository.findByEmail(email)

      if (!usuario) {
         throw new CredenciaisInvalidasError()
      }

      const doesPasswordMatch = await compare(senha, usuario.senha)

      if (!doesPasswordMatch) {
         throw new CredenciaisInvalidasError()
      }

      const token = jwt.sign(
         { sub: usuario.id },
         process.env.JWT_SECRET as string,
         {
            expiresIn: process.env.JWT_EXPIRES_IN,
         }
      );

      return {
         token,
      }
   }

}