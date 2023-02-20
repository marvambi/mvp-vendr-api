import authr from "../middlewares/auth.middleware";
// eslint-disable-next-line max-len
import resetUserDeposit from "../controllers/reset.controller";
import { Router } from "express";

const resetDepositRoute = () => {
  const router = Router();

  router.patch("/reset", authr, resetUserDeposit);

  return router;
};

export { resetDepositRoute };
