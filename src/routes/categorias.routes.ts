import { create } from '../controllers/categorias/create';
import { FastifyInstance } from "fastify";
import { verifyJtw } from '../middlewares/ensure-authenticated';
import { update } from '../controllers/categorias/update';
import { deleteC } from '../controllers/categorias/delete';

export async function categoriasRoutes(app: FastifyInstance) {
   app.post('/categorias', { onRequest: [verifyJtw] }, create)
   app.put('/categorias/:id', { onRequest: [verifyJtw] }, update)
   app.delete('/categorias/:id', { onRequest: [verifyJtw] }, deleteC)
}