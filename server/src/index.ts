import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { AuthRouter } from './modules/auth/routes.js';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/auth', AuthRouter);

app.listen(env.PORT, () => {
  console.log(`Server Running at http://localhost:${env.PORT}`);
});
