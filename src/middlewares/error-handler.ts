import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error';

export function errorHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((err) => {
      if (err.code === 'unrecognized_keys') {
        const unknownKeys = err.keys;
        return unknownKeys.map((key) => `Campo ${key} não existe`).join(', ');
      }

      const field = err.path.join('.');

      if (err.code === 'invalid_type' && err.received === 'undefined') {
        return `Campo ${field} é obrigatório`;
      }

      return `Campo ${field}: ${err.message}`;
    });

    reply.status(400).send({
      status: 400,
      message: 'Erro de validação',
      errors: formattedErrors,
    });
  } else if (error instanceof AppError) {
    reply.status(error.statusCode).send({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    console.error(error);

    reply.status(500).send({
      status: 500,
      message: error.message,
    });
  }
}