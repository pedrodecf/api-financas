import { FastifyRequest, FastifyReply } from 'fastify';
import z from 'zod';
import { UsuarioHttpRepository } from '../../repositories/usuarios/usuario-http-repository';
import { RegisterUseCase } from '../../use-cases/usuarios/register';

export async function register(request: FastifyRequest, reply: FastifyReply) {
   const registerBodySchema = z.object({
      nome: z.string(),
      email: z.string().email(),
      senha: z.string().min(6),
   });

   try {
      const { nome, email, senha } = registerBodySchema.parse(request.body);

      const usuarioRepository = new UsuarioHttpRepository();
      const registerUseCase = new RegisterUseCase(usuarioRepository);

      await registerUseCase.execute({ nome, email, senha });
   } catch (err) {
      throw err;
   }

   return reply.status(201).send();
}