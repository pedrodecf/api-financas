import { Categoria, Usuario } from "@prisma/client";
import { faker } from "@faker-js/faker"

export function makeCategory(override: Partial<Categoria> = {}): Categoria {
   const categoria = {
      id: faker.number.int(),
      nome: faker.commerce.department(),
      avatar: faker.image.avatar(),
      usuarioId: faker.string.uuid(),
      deleted_at: null,
      ...override
   }

   return categoria
}