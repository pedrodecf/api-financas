import { FastifyInstance } from "fastify";
import { register } from "../controllers/usuarios/register";
import { authenticate } from "../controllers/usuarios/authenticate";

export async function usuariosRoutes(app: FastifyInstance) {
   app.post('/usuarios', register)
   app.post('/usuarios/login', authenticate)
}