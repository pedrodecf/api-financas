import express from 'express';
import { router } from './routes';
import { errorHandler } from './middlewares/error-handler';

const app = express();

app.use(express.json());
app.use(router);
app.use(errorHandler);
app.listen(1234, () => {
   console.log('Servidor rodando na porta 1234');
 });