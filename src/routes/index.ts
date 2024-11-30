import { Router } from 'express';
import { usuariosRouter } from './usuarios.routes';

const router = Router();

router.use('/usuarios', usuariosRouter);

export { router };