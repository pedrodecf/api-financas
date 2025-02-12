import { TipoTransacao, Transacao, Usuario } from "@prisma/client";
import { NaoAutorizadoError } from "../../errors/nao-autorizado.error";
import { CategoriasRepository } from "../../repositories/categorias/categorias-repository";
import { TransacoesRepository } from "../../repositories/transacoes/transacoes-repository";
import { UsuarioRepository } from "../../repositories/usuarios/usuario-repository";
import { updateBalance } from "../../utils/update-balance";
import { validateCategoria } from "../../utils/validate-category";
import { validateTransacao } from "../../utils/validate-transaction";
import { validateUser } from "../../utils/validate-user";

interface UpdateUseCaseRequest {
  id: number;
  valor: number;
  categoriaId?: number;
  descricao?: string;
  data?: Date;
  tipo: TipoTransacao;
  usuarioId: string;
  custoFixo?: boolean | null;
  cartaoCredito?: boolean | null;
  parcelas?: {
    total: number;
    atual: number;
  };
}

interface UpdateUseCaseResponse {
  transacao: Transacao;
  usuario: Usuario;
}

export class UpdateUseCase {
  constructor(
    private readonly transacoesRepository: TransacoesRepository,
    private readonly usuariosRepository: UsuarioRepository,
    private readonly categoriasRepository: CategoriasRepository
  ) {}

  async execute({
    id,
    valor,
    categoriaId,
    descricao,
    data,
    tipo,
    usuarioId,
    custoFixo,
    cartaoCredito,
    parcelas,
  }: UpdateUseCaseRequest): Promise<UpdateUseCaseResponse> {
    return this.transacoesRepository.$transaction(async (tx) => {
      const transacao = await validateTransacao({
        transacaoId: id,
        tx,
        transacoesRepository: this.transacoesRepository,
      });

      const usuario = await validateUser({
        usuarioId,
        tx,
        usuarioRepository: this.usuariosRepository,
      });

      if (transacao.usuarioId !== usuarioId) {
        throw new NaoAutorizadoError();
      }

      if (categoriaId) {
        await validateCategoria({
          categoriaId,
          usuarioId,
          tx,
          categoriasRepository: this.categoriasRepository,
        });
      }

      const transacaoAtualizada = await this.transacoesRepository.update(
        id,
        {
          valor,
          categoriaId,
          descricao,
          data,
          tipo,
          cartaoCredito,
          custoFixo,
          parcelas:
            parcelas?.atual === 0 || parcelas?.total === 0 ? undefined : parcelas,
        },
        tx
      );

      let usuarioAtualizado = usuario;

      if (transacao.valor !== valor || transacao.tipo !== tipo) {
        let valorNovo = 0;

        if (tipo === "Entrada") {
          if (transacao.tipo === "Saida") {
            valorNovo = valor + transacao.valor;
          }
          if (transacao.tipo === "Entrada") {
            valorNovo = valor - transacao.valor;
          }
        }

        if (tipo === "Saida") {
          if (transacao.tipo === "Entrada") {
            valorNovo = valor + transacao.valor;
          }

          if (transacao.tipo === "Saida") {
            valorNovo = valor - transacao.valor;
          }

          usuarioAtualizado = await updateBalance({
            usuario,
            balanceData: { valor: valorNovo, tipo },
            tx,
            usuariosRepository: this.usuariosRepository,
            isTipoSaida: true,
            saldoOriginalTransacao: transacao.valor,
          });

          return {
            transacao: transacaoAtualizada,
            usuario: usuarioAtualizado,
          };
        }

        usuarioAtualizado = await updateBalance({
          usuario,
          balanceData: { valor: valorNovo, tipo },
          tx,
          usuariosRepository: this.usuariosRepository,
        });
      }

      return {
        transacao: transacaoAtualizada,
        usuario: usuarioAtualizado,
      };
    });
  }
}
