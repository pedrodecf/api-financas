import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod';
import { UpdateUseCase } from '../../use-cases/categorias/update';
import { UsuarioHttpRepository } from '../../repositories/usuarios/usuario-http-repository';
import { CategoriasHttpRepository } from '../../repositories/categorias/categorias-http-repository';

export async function update(request: FastifyRequest, reply: FastifyReply) {
   const updateBodySchema = z.object({
      nome: z.string(),
      avatar: z.string().optional(),
      hex: z.string().optional(),
   });

   const updateParamsSchema = z.object({
      id: z.coerce.number(),
   });

   try {
      const { nome, avatar, hex } = updateBodySchema.parse(request.body);
      const { id } = updateParamsSchema.parse(request.params);

      const usuariosRepository = new UsuarioHttpRepository()
      const categoriasRepository = new CategoriasHttpRepository()

      const updateUseCase = new UpdateUseCase(
         categoriasRepository,
         usuariosRepository
      )

      const { categoria } = await updateUseCase.execute({
         id,
         nome,
         avatar,
         hex,
         usuarioId: request.user.sub,
      });

      reply.status(201).send({ categoria });
   } catch (err) {
      throw err
   }
}