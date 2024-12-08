import z from 'zod';
import { FastifyReply, FastifyRequest } from 'fastify'
import { TransacoesHttpRepository } from '../../repositories/transacoes/transacoes-http-repository';
import { UsuarioHttpRepository } from '../../repositories/usuarios/usuario-http-repository';
import { DeleteUseCase } from '../../use-cases/transacoes/delete';

export async function deleteT(request: FastifyRequest, reply: FastifyReply) {
   const deleteParamsSchema = z.object({
      id: z.coerce.number(),
   });

   try {
      const { id } = deleteParamsSchema.parse(request.params);
      const usuarioId = request.user.sub;

      const transacoesRepository = new TransacoesHttpRepository();
      const usuariosRepository = new UsuarioHttpRepository();

      const deleteUseCase = new DeleteUseCase(
         transacoesRepository,
         usuariosRepository
      );

      const { transacao } = await deleteUseCase.execute({
         id,
         usuarioId
      });

      reply.status(200).send({ transacao });
   } catch (err) {
      throw err;
   }
}

