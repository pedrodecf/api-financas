import z from "zod";
import { CategoriasHttpRepository } from "../../repositories/categorias/categorias-http-repository";
import { CreateUseCase } from "../../use-cases/categorias/create";
import { FastifyReply, FastifyRequest } from 'fastify'

export async function create(request: FastifyRequest, reply: FastifyReply) {
   const createBodySchema = z.object({
      nome: z.string(),
      avatar: z.string().optional(),
   })

   try {
      const { nome, avatar } = createBodySchema.parse(request.body)

      const categoriasRepository = new CategoriasHttpRepository()
      const createUseCase = new CreateUseCase(categoriasRepository)

      const { categoria } = await createUseCase.execute({
         nome,
         avatar,
         usuarioId: request.user.sub
      })

      reply.status(201).send(categoria);
   } catch (err) {
      throw err
   }
}