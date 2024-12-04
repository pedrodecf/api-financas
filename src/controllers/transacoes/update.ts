import { FastifyReply, FastifyRequest } from 'fastify'
import { TransacoesHttpRepository } from '../../repositories/transacoes/transacoes-http-repository'
import { UsuarioHttpRepository } from '../../repositories/usuarios/usuario-http-repository'
import { CategoriasHttpRepository } from '../../repositories/categorias/categorias-http-repository'
import z from 'zod'
import { UpdateUseCase } from '../../use-cases/transacoes/update'

export async function update(request: FastifyRequest, reply: FastifyReply) {
   const updateBodySchema = z.object({
      categoriaId: z.number(),
      valor: z.number().positive(),
      tipo: z.enum(['Entrada', 'Saida']),
      descricao: z.string().optional(),
      data: z
         .preprocess(
            (val) => (typeof val === "string" ? new Date(val) : val),
            z.date().optional()
         ),
   });

    const updateParamsSchema = z.object({
       id: z.coerce.number(),
    });

    try {
      const { categoriaId, valor, tipo, descricao, data } = updateBodySchema.parse(request.body);
      const { id } = updateParamsSchema.parse(request.params);

      const transacoesRepository = new TransacoesHttpRepository()
      const usuariosRepository = new UsuarioHttpRepository()
      const categoriasRepository = new CategoriasHttpRepository()

      const updateUseCase = new UpdateUseCase(
         transacoesRepository,
         usuariosRepository,
         categoriasRepository
      )

      const { transacao, usuario } = await updateUseCase.execute({
         id,
         categoriaId,
         valor,
         tipo,
         descricao,
         data: data,
         usuarioId: request.user.sub,
      });

      reply.status(201).send({ transacao, balanco: usuario.balanco });
   } catch (err) {
      throw err
   }
}