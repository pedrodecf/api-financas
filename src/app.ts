import fastify from 'fastify';
import { env } from './env';
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie';
import { usuariosRoutes } from './routes/usuarios.routes';
import { categoriasRoutes } from './routes/categorias.routes';
import { errorHandler } from './middlewares/error-handler';

export const app = fastify()

app.register(fastifyJwt, {
   secret: env.JWT_SECRET,
   cookie: {
      cookieName: 'refreshToken',
      signed: false
   },
   sign: {
      expiresIn: '23h'
   },
})

app.register(fastifyCookie)

app.register(usuariosRoutes)
app.register(categoriasRoutes)

app.setErrorHandler(errorHandler)