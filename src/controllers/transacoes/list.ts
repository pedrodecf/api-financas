import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { filterObjects } from "../../lib/filter-objects";
import { TransacoesHttpRepository } from "../../repositories/transacoes/transacoes-http-repository";
import { ListUseCase } from "../../use-cases/transacoes/list";

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const listQuerySchema = z.object({
    tipo: z.enum(["Entrada", "Saida"]).optional(),
    valor: z.coerce.number().positive().optional(),
    valorMin: z.coerce.number().positive().optional(),
    valorMax: z.coerce.number().positive().optional(),
    categoriaId: z.coerce.number().optional(),
    periodoDe: z.string().optional(),
    periodoAte: z.string().optional(),
    orderBy: z.enum(["id", "data", "valor"]),
    ordination: z.enum(["asc", "desc"]),
    name: z.string().optional(),
  });
  try {
    const {
      tipo,
      valor,
      valorMin,
      valorMax,
      categoriaId,
      periodoDe,
      periodoAte,
      orderBy,
      ordination,
      name,
    } = listQuerySchema.parse(request.query);

    const transacoesRepository = new TransacoesHttpRepository();
    const listUseCase = new ListUseCase(transacoesRepository);

    const { items, balance } = await listUseCase.execute({
      filters: {
        ...filterObjects({
          name,
          tipo,
          valor,
          valorMin,
          valorMax,
          categoriaId,
          usuarioId: request.user.sub,
          periodoDe,
          periodoAte,
        }),
      },
      order: {
        orderBy,
        ordination,
      }
    });

    reply.status(200).send({ items, balance });
  } catch (err) {
    throw err;
  }
}
