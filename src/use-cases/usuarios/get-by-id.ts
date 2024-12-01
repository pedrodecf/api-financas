import { Usuario } from "@prisma/client";
import { UsuarioHttpRepository } from "../../repositories/usuarios/usuario-http-repository";
import { Optional } from "../../lib/types";
import { RecursoNaoEncontradoError } from "../../errors/recurso-nao-encontrado.error";

interface GetByIdUseCaseRequest {
   id: string
}

interface GetByIdUseCaseResponse {
   usuario: Optional<Usuario, 'senha'>
}

export class GetByIdUseCase {
   constructor(private readonly usuarioRepository: UsuarioHttpRepository) { }

   async execute({
      id,
   }: GetByIdUseCaseRequest): Promise<GetByIdUseCaseResponse> {
      const user = await this.usuarioRepository.findById(id)

      if (!user) {
         throw new RecursoNaoEncontradoError('Usuário não encontrado')
      }

      const { senha: _, ...usuarioWithoutPassword } = user

      return {
         usuario: usuarioWithoutPassword
      }
   }
}