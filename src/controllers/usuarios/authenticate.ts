import z from "zod";
import { UsuarioHttpRepository } from "../../repositories/usuarios/usuario-http-repository";
import { AuthenticateUseCase } from "../../use-cases/usuarios/authenticate";
import { FastifyReply, FastifyRequest } from 'fastify'

export async function authenticate(
   request: FastifyRequest,
   reply: FastifyReply
) {
   const authenticateBodySchema = z.object({
      email: z.string().email(),
      senha: z.string().min(6)
   })

   try {
      const { email, senha } = authenticateBodySchema.parse(request.body)

      const usuarioRepository = new UsuarioHttpRepository()
      const authenticateUseCase = new AuthenticateUseCase(usuarioRepository)

      const { usuario } = await authenticateUseCase.execute({ email, senha })

      const token = await reply.jwtSign({
         sub: usuario.id,
      })

      const refreshToken = await reply.jwtSign({
         sub: usuario.id,
         expiresIn: '7d'
      })

      return reply
         .setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: true,
            sameSite: true,
            httpOnly: true,
         })
         .code(200)
         .send({ token })
   } catch (err) {
      throw err
   }
}