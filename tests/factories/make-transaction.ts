import { Transacao } from "@prisma/client";
import { faker } from "@faker-js/faker"


export function makeTransaction(override: Partial<Transacao> = {}): Transacao {
   const transacao = {
      id: faker.number.int(),
      valor: faker.number.float(),
      tipo: faker.helpers.arrayElement(['Entrada', 'Saida']),
      descricao: faker.lorem.sentence(),
      categoriaId: faker.number.int(),
      data: faker.date.recent(),
      usuarioId: faker.string.uuid(),
      deleted_at: null,
      ...override
   }

   return transacao
}