import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';

const app = express();

const corsOptions = {
  // eslint-disable-next-line max-len
  allowed_origins: ['http://localhost:3000'],
  credentials: true,
};

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(helmet());

app.use('/api', routes);

export default app;
