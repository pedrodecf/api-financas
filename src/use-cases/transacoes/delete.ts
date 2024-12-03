import { Transacao } from "@prisma/client";
import { TransacoesRepository } from "../../repositories/transacoes/transacoes-repository";
import { UsuarioRepository } from "../../repositories/usuarios/usuario-repository";
import { RecursoNaoEncontradoError } from "../../errors/recurso-nao-encontrado.error";

interface DeleteUseCaseRequest {
   id: number;
   usuarioId: string;
}

interface DeleteUseCaseResponse {
   transacao: Transacao;
}

export class DeleteUseCase {
   constructor(
      private readonly transacoesRepository: TransacoesRepository,
      private readonly usuariosRepository: UsuarioRepository,
   ) { }

   async execute({
      id,
      usuarioId
   }: DeleteUseCaseRequest): Promise<DeleteUseCaseResponse> {
      const usuario = await this.usuariosRepository.findById(usuarioId);

      if (!usuario) {
         throw new RecursoNaoEncontradoError('Usuário não encontrado')
      }

      const transacaoToBeDeleted = await this.transacoesRepository.findById(id);

      if (!transacaoToBeDeleted) {
         throw new RecursoNaoEncontradoError('Transação não encontrada');
      }

      if (transacaoToBeDeleted.usuarioId !== usuarioId) {
         throw new RecursoNaoEncontradoError('Transação não encontrada');
      }

      const transacao = await this.transacoesRepository.delete(id);

      return {
         transacao
      }
   }
}