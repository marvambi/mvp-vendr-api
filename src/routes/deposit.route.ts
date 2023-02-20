import { Router } from "express";
import authr from "../middlewares/auth.middleware";
// eslint-disable-next-line max-len
import createUserDeposit from "../controllers/deposit.controller";

const userDepositRoute = () => {
  const router = Router();

  router.patch("/deposit", authr, createUserDeposit);

  return router;
};

export { userDepositRoute };
