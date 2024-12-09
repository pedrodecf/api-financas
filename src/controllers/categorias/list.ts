import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { CategoriasHttpRepository } from "../../repositories/categorias/categorias-http-repository";
import { ListUseCase } from "../../use-cases/categorias/list";
import { filterObjects } from "../../lib/filter-objects";

export async function list(request: FastifyRequest, reply: FastifyReply) {
   const listQuerySchema = z.object({
      nome: z.string().optional(),
      page: z.coerce.number().positive(),
      quantity: z.coerce.number().positive(),
      orderBy: z.enum(['id', 'nome']),
      ordination: z.enum(['asc', 'desc']),
   })

   try {
      const { nome, page, quantity, orderBy, ordination } = listQuerySchema.parse(request.query)

      const categoriasRepository = new CategoriasHttpRepository()
      const listUseCase = new ListUseCase(categoriasRepository)

      const { items, pages, totalItems } = await listUseCase.execute({
         filters: {
            ...filterObjects({
               nome,
               usuarioId: request.user.sub,
            })
         },
         order: {
            orderBy,
            ordination,
         },
         pagination: {
            page,
            quantity,
         },
      })

      reply.status(200).send({ items, pages, totalItems })
   } catch (err) {
      throw err
   }
}