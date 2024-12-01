import { create } from '../controllers/categorias/create';
import { FastifyInstance } from "fastify";
import { verifyJtw } from '../middlewares/ensure-authenticated';

export async function categoriasRoutes(app: FastifyInstance) {
   app.post('/categorias', { onRequest: [verifyJtw] }, create)
}