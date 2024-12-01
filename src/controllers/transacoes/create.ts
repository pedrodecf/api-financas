import { FastifyReply, FastifyRequest } from 'fastify'
import { TransacoesHttpRepository } from '../../repositories/transacoes/transacoes-http-repository'
import { CreateUseCase } from '../../use-cases/transacoes/create'
import { UsuarioHttpRepository } from '../../repositories/usuarios/usuario-http-repository'
import { CategoriasHttpRepository } from '../../repositories/categorias/categorias-http-repository'
import z from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
   const createBodySchema = z.object({
      categoriaId: z.number(),
      valor: z.number().positive(),
      tipo: z.enum(['Entrada', 'Saida']),
      descricao: z.string().optional(),
      data: z.date().optional(),
   });

   try {
      const { categoriaId, valor, tipo, descricao, data } = createBodySchema.parse(request.body);

      const transacoesRepository = new TransacoesHttpRepository()
      const usuariosRepository = new UsuarioHttpRepository()
      const categoriasRepository = new CategoriasHttpRepository()

      const createUseCase = new CreateUseCase(
         transacoesRepository,
         usuariosRepository,
         categoriasRepository
      )

      const { transacao, usuario } = await createUseCase.execute({
         categoriaId,
         valor,
         tipo,
         descricao,
         data: data ? data : new Date(),
         usuarioId: request.user.sub,
      });

      reply.status(201).send({ transacao, balanco: usuario.balanco });
   } catch (err) {
      throw err
   }
}