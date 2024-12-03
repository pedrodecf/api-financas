import { beforeEach, describe, expect, it } from "vitest";
import { UsuarioInMemoryRepository } from "../../repositories/usuarios/usuario-in-memory-repository";
import { TransacoesInMemoryRepository } from "../../repositories/transacoes/transacoes-in-memory-repository";
import { DeleteUseCase } from "./delete";
import { makeTransaction } from "../../../tests/factories/make-transaction";
import { RecursoNaoEncontradoError } from "../../errors/recurso-nao-encontrado.error";
import { makeUser } from "../../../tests/factories/make-user";
import { hash } from "bcryptjs";

let transacoesRepository: TransacoesInMemoryRepository
let usuarioRepository: UsuarioInMemoryRepository
let sut: DeleteUseCase

describe('Delete Use Case', () => {
   beforeEach(() => {
      transacoesRepository = new TransacoesInMemoryRepository()
      usuarioRepository = new UsuarioInMemoryRepository()
      sut = new DeleteUseCase(
         transacoesRepository,
         usuarioRepository,
      )
   })

   it('should be able to delete a transaction', async () => {
      await usuarioRepository.create(makeUser({
         id: 'user1',
         email: 'test@email.com',
         senha: await hash('password', 6),
         balanco: 0
      }))

      const transactionToBeDeleted = await transacoesRepository.create(makeTransaction({
         id: 1,
         valor: 100,
         tipo: 'Entrada',
         usuarioId: 'user1',
      }));

      expect(transactionToBeDeleted.deleted_at).toBeNull()

      await sut.execute({
         id: 1,
         usuarioId: 'user1',
      })

      expect(transactionToBeDeleted.deleted_at).toBeInstanceOf(Date)
   })

   it('should not be able to delete a transaction if you werent the one who created it'), async () => {
      await transacoesRepository.create(makeTransaction({
         id: 1,
         valor: 100,
         tipo: 'Entrada',
         usuarioId: 'user1',
      }));

      await expect(sut.execute({
         id: 1,
         usuarioId: 'user2',
      })).rejects.toBeInstanceOf(RecursoNaoEncontradoError)
   }
})