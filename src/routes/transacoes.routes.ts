import { FastifyInstance } from "fastify";
import { create } from "../controllers/transacoes/create";
import { verifyJtw } from "../middlewares/ensure-authenticated";

export async function transacoesRoutes(app: FastifyInstance) {
   app.post('/transacoes', { onRequest: [verifyJtw] }, create)
}