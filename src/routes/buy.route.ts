import authr from "../middlewares/auth.middleware";
// eslint-disable-next-line max-len
import buyProduct from "../controllers/buy.controller";
import { Router } from "express";

const buyProductRoute = () => {
  const router = Router();

  router.post("/buy", authr, buyProduct);

  return router;
};

export { buyProductRoute };
