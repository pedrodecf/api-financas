import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { CategoriasHttpRepository } from "../../repositories/categorias/categorias-http-repository";
import { ListUseCase } from "../../use-cases/categorias/list";
import { filterObjects } from "../../lib/filter-objects";

export async function list(request: FastifyRequest, reply: FastifyReply) {
   const listQuerySchema = z.object({
      nome: z.string().optional(),
      orderBy: z.enum(['id', 'nome']),
      ordination: z.enum(['asc', 'desc']),
   })

   try {
      const { nome, orderBy, ordination } = listQuerySchema.parse(request.query)

      const categoriasRepository = new CategoriasHttpRepository()
      const listUseCase = new ListUseCase(categoriasRepository)

      const { items } = await listUseCase.execute({
         filters: {
            ...filterObjects({
               nome,
               usuarioId: request.user.sub,
            })
         },
         order: {
            orderBy,
            ordination,
         }
      })

      reply.status(200).send({ items })
   } catch (err) {
      throw err
   }
}