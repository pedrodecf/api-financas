import { UsuarioHttpRepository } from "../../repositories/usuarios/usuario-http-repository";
import { GetByIdUseCase } from "../../use-cases/usuarios/get-by-id";
import { FastifyRequest, FastifyReply } from 'fastify';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
   const usuarioRepository = new UsuarioHttpRepository()
   const getbyemailUseCase = new GetByIdUseCase(usuarioRepository)

   const { usuario } = await getbyemailUseCase.execute({
      id: request.user.sub
   })

   return reply.code(200).send(usuario)
}