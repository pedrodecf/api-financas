import { FastifyInstance, RouteOptions } from "fastify";
import { register } from "../controllers/usuarios/register";
import { authenticate } from "../controllers/usuarios/authenticate";
import { profile } from "../controllers/usuarios/profile";
import { verifyJtw } from "../middlewares/ensure-authenticated";
import { logout } from "../controllers/usuarios/logout";

export async function usuariosRoutes(app: FastifyInstance) {
   app.post('/usuarios', register)
   app.post('/usuarios/login', authenticate)
   app.get('/usuarios/me', { onRequest: [verifyJtw] }, profile)
   app.post('/usuarios/logout', logout)
}