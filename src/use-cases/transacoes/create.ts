import { TipoTransacao, Transacao, Usuario } from "@prisma/client";
import { CategoriasRepository } from "../../repositories/categorias/categorias-repository";
import { TransacoesRepository } from "../../repositories/transacoes/transacoes-repository";
import { UsuarioRepository } from "../../repositories/usuarios/usuario-repository";
import { createTransaction } from "../../utils/create-transaction";
import { updateBalance } from "../../utils/update-balance";
import { validateCategoria } from "../../utils/validate-category";
import { validateUser } from "../../utils/validate-user";

interface CreateUseCaseRequest {
  valor: number;
  categoriaId: number;
  descricao?: string;
  data?: Date;
  tipo: TipoTransacao;
  usuarioId: string;
  custoFixo?: boolean | null;
  cartaoCredito?: boolean | null;
  parcelas?: {
    total: number | null;
    atual: number | null;
  } | null;
}

interface CreateUseCaseResponse {
  transacao: Transacao;
  usuario: Usuario;
}

export class CreateUseCase {
  constructor(
    private readonly transacoesRepository: TransacoesRepository,
    private readonly usuariosRepository: UsuarioRepository,
    private readonly categoriasRepository: CategoriasRepository
  ) {}

  async execute({
    valor,
    categoriaId,
    descricao,
    data,
    tipo,
    usuarioId,
    cartaoCredito,
    custoFixo,
    parcelas,
  }: CreateUseCaseRequest): Promise<CreateUseCaseResponse> {
    return this.transacoesRepository.$transaction(async (tx) => {
      const usuario = await validateUser({
        usuarioId,
        tx,
        usuarioRepository: this.usuariosRepository,
      });

      await validateCategoria({
        categoriaId,
        usuarioId,
        tx,
        categoriasRepository: this.categoriasRepository,
      });

      const transacao = await createTransaction({
        data: {
          valor,
          categoriaId,
          descricao,
          data: data ? new Date(data) : new Date(),
          tipo,
          usuarioId,
          cartaoCredito,
          custoFixo,
          parcelas,
        },
        tx,
        transacoesRepository: this.transacoesRepository,
      });

      const usuarioAtualizado = await updateBalance({
        usuario,
        balanceData: { valor, tipo },
        tx,
        usuariosRepository: this.usuariosRepository,
      });

      return {
        transacao,
        usuario: usuarioAtualizado,
      };
    });
  }
}
