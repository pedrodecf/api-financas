import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { CategoriasHttpRepository } from "../../repositories/categorias/categorias-http-repository";
import { TransacoesHttpRepository } from "../../repositories/transacoes/transacoes-http-repository";
import { UsuarioHttpRepository } from "../../repositories/usuarios/usuario-http-repository";
import { CreateUseCase } from "../../use-cases/transacoes/create";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    categoriaId: z.number(),
    valor: z.number().positive(),
    tipo: z.enum(["Entrada", "Saida"]),
    descricao: z.string().optional(),
    data: z.preprocess(
      (val) => (typeof val === "string" ? new Date(val) : val),
      z.date().optional()
    ),
    custoFixo: z.boolean().optional().nullable(),
    cartaoCredito: z.boolean().optional().nullable(),
    parcelas: z.object({
      total: z.number().nullable(),
      atual: z.number().nullable(),
    }).optional().nullable(),
  });

  try {
    const {
      categoriaId,
      valor,
      tipo,
      descricao,
      data,
      cartaoCredito,
      custoFixo,
      parcelas,
    } = createBodySchema.parse(request.body);

    const transacoesRepository = new TransacoesHttpRepository();
    const usuariosRepository = new UsuarioHttpRepository();
    const categoriasRepository = new CategoriasHttpRepository();

    const createUseCase = new CreateUseCase(
      transacoesRepository,
      usuariosRepository,
      categoriasRepository
    );

    const { transacao, usuario } = await createUseCase.execute({
      categoriaId,
      valor,
      tipo,
      descricao,
      data: data,
      usuarioId: request.user.sub,
      cartaoCredito,
      custoFixo,
      parcelas,
    });

    reply.status(201).send({ transacao, balanco: usuario.balanco });
  } catch (err) {
    throw err;
  }
}
