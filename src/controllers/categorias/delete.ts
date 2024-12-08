import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod';
import { CategoriasHttpRepository } from '../../repositories/categorias/categorias-http-repository';
import { DeleteUseCase } from '../../use-cases/categorias/delete';
import { UsuarioHttpRepository } from '../../repositories/usuarios/usuario-http-repository';
import { TransacoesHttpRepository } from '../../repositories/transacoes/transacoes-http-repository';

export async function deleteC(request: FastifyRequest, reply: FastifyReply) {
   const deleteParamsSchema = z.object({
      id: z.coerce.number(),
   });

   try {
      const { id } = deleteParamsSchema.parse(request.params);
      const usuarioId = request.user.sub;

      const categoriasRepository = new CategoriasHttpRepository();
      const usuariosRepository = new UsuarioHttpRepository();
      const transacoesRepository = new TransacoesHttpRepository();

      const deleteUseCase = new DeleteUseCase(
         categoriasRepository,
         usuariosRepository,
         transacoesRepository
      );

      const { categoria } = await deleteUseCase.execute({
         id,
         usuarioId
      });

      reply.status(200).send({ categoria });
   } catch (err) {
      throw err;
   }
}