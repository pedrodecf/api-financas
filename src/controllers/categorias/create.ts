import z from "zod";
import { CategoriasHttpRepository } from "../../repositories/categorias/categorias-http-repository";
import { CreateUseCase } from "../../use-cases/categorias/create";
import { FastifyReply, FastifyRequest } from 'fastify'

export async function create(request: FastifyRequest, reply: FastifyReply) {
   const createBodySchema = z.object({
      nome: z.string().email(),
      avatar: z.string().optional(),
      usuarioId: z.string().uuid()
   })

   try {
      const { nome, avatar, usuarioId } = createBodySchema.parse(request.body)

      const categoriasRepository = new CategoriasHttpRepository()
      const createUseCase = new CreateUseCase(categoriasRepository)

      const { categoria } = await createUseCase.execute({ nome, avatar, usuarioId })

      reply.status(201).send(categoria);
   } catch (err) {
      throw err
   }
}