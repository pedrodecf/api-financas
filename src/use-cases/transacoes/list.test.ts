import { beforeEach, describe, expect, it } from "vitest";
import { TransacoesInMemoryRepository } from "../../repositories/transacoes/transacoes-in-memory-repository";
import { ListUseCase } from "./list";
import { makeTransaction } from "../../../tests/factories/make-transaction";

let transacoesRepository: TransacoesInMemoryRepository;
let sut: ListUseCase;

describe('List Use Case', () => {
   beforeEach(() => {
      transacoesRepository = new TransacoesInMemoryRepository();
      sut = new ListUseCase(transacoesRepository);
   });

   it.only('should be able to return all transactions when no filter is applied', async () => {
      const usuarioId = 'user1';

      await transacoesRepository.create(makeTransaction({ usuarioId }));
      await transacoesRepository.create(makeTransaction({ usuarioId }));

      const test = await transacoesRepository.findByUsuarioId('user1');
      console.log(test);

      const result = await sut.execute({
         order: {
            orderBy: 'valor',
            ordination: 'asc',
         },
         pagination: {
            page: 1,
            quantity: 10,
         },
         filters: {
            usuarioId,
         },
      });


      expect(result.items.length).toBe(2);
      expect(result.totalItems).toBe(2);
   });

   it('should be able to filter transactions by user and type', async () => {
      await transacoesRepository.create(makeTransaction({
         id: 1,
         valor: 100,
         tipo: 'Entrada',
         usuarioId: 'user1',
      }));

      await transacoesRepository.create(makeTransaction({
         id: 2,
         valor: 200,
         tipo: 'Saida',
         usuarioId: 'user1',
      }));

      await transacoesRepository.create(makeTransaction({
         id: 3,
         valor: 300,
         tipo: 'Entrada',
         usuarioId: 'user2',
      }));

      const result = await sut.execute({
         order: {
            orderBy: 'id',
            ordination: 'asc',
         },
         pagination: {
            page: 1,
            quantity: 10,
         },
         filters: {
            usuarioId: 'user1',
            tipo: 'Entrada',
         },
      });

      expect(result.items.length).toBe(1);
      expect(result.items[0].id).toBe(1);
      expect(result.totalItems).toBe(1);
   });

   it('should be able to sort transactions by value in ascending order', async () => {
      await transacoesRepository.create(makeTransaction({
         id: 1,
         valor: 300,
         tipo: 'Entrada',
         usuarioId: 'user1',
      }));

      await transacoesRepository.create(makeTransaction({
         id: 2,
         valor: 100,
         tipo: 'Entrada',
         usuarioId: 'user1',
      }));

      await transacoesRepository.create(makeTransaction({
         id: 3,
         valor: 200,
         tipo: 'Entrada',
         usuarioId: 'user1',
      }));

      const result = await sut.execute({
         order: {
            orderBy: 'valor',
            ordination: 'asc',
         },
         pagination: {
            page: 1,
            quantity: 10,
         },
         filters: {
            usuarioId: 'user1',
         },
      });

      expect(result.items.map(t => t.valor)).toEqual([100, 200, 300]);
   });

   it('should be able to apply pagination correctly', async () => {
      const usuarioId = 'user1';
      for (let i = 1; i <= 10; i++) {
         await transacoesRepository.create(makeTransaction({
            id: i,
            valor: i * 10,
            tipo: 'Entrada',
            usuarioId,
         }));
      }

      const result = await sut.execute({
         order: {
            orderBy: 'id',
            ordination: 'asc',
         },
         pagination: {
            page: 2,
            quantity: 3,
         },
         filters: {
            usuarioId,
         },
      });

      expect(result.items.length).toBe(3);
      expect(result.items[0].id).toBe(4);
      expect(result.items[2].id).toBe(6);
      expect(result.totalItems).toBe(10);
   });

   it('should be able to count transactions correctly with filters', async () => {
      await transacoesRepository.create(makeTransaction({
         id: 1,
         valor: 100,
         tipo: 'Entrada',
         usuarioId: 'user1',
      }));

      await transacoesRepository.create(makeTransaction({
         id: 2,
         valor: 200,
         tipo: 'Saida',
         usuarioId: 'user1',
      }));

      await transacoesRepository.create(makeTransaction({
         id: 3,
         valor: 300,
         tipo: 'Entrada',
         usuarioId: 'user2',
      }));

      const result = await sut.execute({
         order: {
            orderBy: 'id',
            ordination: 'asc',
         },
         pagination: {
            page: 1,
            quantity: 10,
         },
         filters: {
            usuarioId: 'user1',
            tipo: 'Entrada',
         },
      });

      expect(result.totalItems).toBe(1);
      expect(result.items.length).toBe(1);
   });

   it('should be able to count all transactions for a user when no other filters are applied', async () => {
      await transacoesRepository.create(makeTransaction({
         id: 1,
         valor: 100,
         tipo: 'Entrada',
         usuarioId: 'user1',
      }));

      await transacoesRepository.create(makeTransaction({
         id: 2,
         valor: 200,
         tipo: 'Saida',
         usuarioId: 'user1',
      }));

      await transacoesRepository.create(makeTransaction({
         id: 3,
         valor: 300,
         tipo: 'Entrada',
         usuarioId: 'user2',
      }));

      const result = await sut.execute({
         order: {
            orderBy: 'id',
            ordination: 'asc',
         },
         pagination: {
            page: 1,
            quantity: 10,
         },
         filters: {
            usuarioId: 'user1',
         },
      });

      expect(result.totalItems).toBe(2);
      expect(result.items.length).toBe(2);
   });
});
