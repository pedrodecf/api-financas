import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { CategoriasHttpRepository } from "../../repositories/categorias/categorias-http-repository";
import { TransacoesHttpRepository } from "../../repositories/transacoes/transacoes-http-repository";
import { UsuarioHttpRepository } from "../../repositories/usuarios/usuario-http-repository";
import { UpdateUseCase } from "../../use-cases/transacoes/update";

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateBodySchema = z.object({
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
    parcelas: z
      .object({
        total: z.number().nullable(),
        atual: z.number().nullable(),
      })
      .optional().nullable(),
  });

  const updateParamsSchema = z.object({
    id: z.coerce.number(),
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
    } = updateBodySchema.parse(request.body);
    const { id } = updateParamsSchema.parse(request.params);

    const transacoesRepository = new TransacoesHttpRepository();
    const usuariosRepository = new UsuarioHttpRepository();
    const categoriasRepository = new CategoriasHttpRepository();

    const updateUseCase = new UpdateUseCase(
      transacoesRepository,
      usuariosRepository,
      categoriasRepository
    );

    const { transacao, usuario } = await updateUseCase.execute({
      id,
      categoriaId,
      valor,
      tipo,
      descricao,
      cartaoCredito,
      custoFixo,
      data: data,
      usuarioId: request.user.sub,
      parcelas,
    });

    reply.status(201).send({ transacao, balanco: usuario.balanco });
  } catch (err) {
    throw err;
  }
}
