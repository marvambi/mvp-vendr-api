import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { userRoute } from './routes/user.routes';
import connect from './utils/db';

const app = express();

const HOST = process.env.HOST || 'http://localhost';
const PORT = parseInt(process.env.PORT || '80');

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

app.use('/api', userRoute);
app.get('/', (req, res) => {
  console.log("Here: ", typeof (req));
  const checkSystem = (server: string, client: string) => {
    return `${server} & ${client} are great combinations 😇`;
  };

  const the_server = 'Vending RESTful API';
  const the_client = 'React Product Store';
  const combination = checkSystem(the_server, the_client);

  return res.json({ message: `'Wow! 👉' ${combination}` });
});

app.listen(PORT, async () => {
  await connect();

  console.log(`Application started @ URL ${HOST}:${PORT} 🎉`);
});

export default app;
