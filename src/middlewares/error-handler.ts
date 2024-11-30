import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((error) => {
      if (error.code === 'unrecognized_keys') {
        const unknownKeys = error.keys;
        return unknownKeys.map((key) => `Campo ${key} não existe`).join(', ');
      }

      const field = error.path.join('.');

      if (error.code === 'invalid_type' && error.received === 'undefined') {
        return `Campo ${field} é obrigatório`;
      }

      return `Campo ${field}: ${error.message}`;
    });

    res.status(400).json({
      status: 400,
      message: 'Erro de validação',
      errors: formattedErrors,
    });
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  }

  console.error(err);

  res.status(500).json({
    status: 500,
    message: err.message,
  });
}
