import fastify from 'fastify';
import { env } from './env';
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie';
import { usuariosRoutes } from './routes/usuarios.routes';
import { categoriasRoutes } from './routes/categorias.routes';
import { errorHandler } from './middlewares/error-handler';
import { transacoesRoutes } from './routes/transacoes.routes';

export const app = fastify()

app.register(fastifyJwt, {
   secret: env.JWT_SECRET,
   cookie: {
      cookieName: 'refreshToken',
      signed: false
   },
   sign: {
      expiresIn: '10m'
   },
})

app.register(fastifyCookie)

app.register(usuariosRoutes)
app.register(categoriasRoutes)
app.register(transacoesRoutes)

app.setErrorHandler(errorHandler)