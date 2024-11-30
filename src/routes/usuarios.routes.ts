import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { register } from '../controllers/usuarios/register';
import { authenticate } from '../controllers/usuarios/authenticate';

const usuariosRouter = Router();

usuariosRouter.post('/', asyncHandler(register));
usuariosRouter.post('/login', asyncHandler(authenticate));

export { usuariosRouter };
