import { FastifyInstance } from "fastify";
import { create } from "../controllers/transacoes/create";
import { verifyJtw } from "../middlewares/ensure-authenticated";
import { list } from "../controllers/transacoes/list";
import { update } from "../controllers/transacoes/update";

export async function transacoesRoutes(app: FastifyInstance) {
   app.post('/transacoes', { onRequest: [verifyJtw] }, create)
   app.get('/transacoes', { onRequest: [verifyJtw] }, list)
   app.put('/transacoes/:id', { onRequest: [verifyJtw] }, update)
}