import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { userRoute } from "./routes/user.routes";
import { productRoute } from "./routes/product.routes";
import { userDepositRoute } from "./routes/deposit.route";
import { resetDepositRoute } from "./routes/reset.route";
import { buyProductRoute } from "./routes/buy.route";

const app = express();

const corsOptions = {
  allowed_origins: ["http://localhost:3000"],
  credentials: true,
};

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(helmet());

app.use("/", userRoute());
app.use("/", productRoute());
app.use("/", userDepositRoute());
app.use("/", resetDepositRoute());
app.use("/", buyProductRoute());
app.get("/", (_req, res) => {
  const checkSystem = (server: string, client: string) => {
    return `${server} & ${client} are great combinations 😇`;
  };

  const the_server = "Vending RESTful API";
  const the_client = "React Product Store";
  const combination = checkSystem(the_server, the_client);

  return res.json({ message: `'Wow! 👉' ${combination}` });
});

export default app;
