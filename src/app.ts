import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import { env } from "./env";
import { errorHandler } from "./middlewares/error-handler";
import { categoriasRoutes } from "./routes/categorias.routes";
import { transacoesRoutes } from "./routes/transacoes.routes";
import { usuariosRoutes } from "./routes/usuarios.routes";

export const app = fastify();

app.register(fastifyCors, {
  origin: [env.FRONT_URL],
  credentials: true,
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "23h",
  },
});

app.register(fastifyCookie);

app.register(usuariosRoutes);
app.register(categoriasRoutes);
app.register(transacoesRoutes);

app.setErrorHandler(errorHandler);
