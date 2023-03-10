import { Router } from "express";
import authr from "../middlewares/auth.middleware";
// eslint-disable-next-line max-len
import {
  changePassword,
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  loginStatus,
  loginUser,
  logout,
  updateUser,
} from "../controllers/user.controller";

const userRoute = () => {
  const router = Router();

  router.post("/users", createUser);

  router.get("/users", getAllUsers);

  router.get("/users/:id", authr, getUser);

  router.patch("/users/:id", authr, updateUser);

  router.patch("/users/change/:id", authr, changePassword);

  router.delete("/users/:id", authr, deleteUser);

  router.post("/users/login", loginUser);

  router.post("/users/logout", authr, logout);

  router.get("/users/login-status/:id", authr, loginStatus);

  return router;
};

export { userRoute };
