import { create } from '../controllers/categorias/create';
import { FastifyInstance } from "fastify";

export async function categoriasRoutes(app: FastifyInstance) {
   app.post('/categorias', create)
}