import { Usuario } from "@prisma/client";
import { faker } from "@faker-js/faker"

export function makeUser(override: Partial<Usuario> = {}): Usuario {
   const user = {
      id: faker.string.uuid(),
      nome: faker.person.firstName(),
      email: faker.internet.email(),
      senha: faker.internet.password(),
      balanco: faker.number.float(),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      ...override
   }

   return user
}