import { Router } from "express";
import authr from "../middlewares/auth.middleware";
import getAProd, {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../controllers/product.controller";

const productRoute = () => {
  const router = Router();

  router.post("/product", authr, createProduct);
  router.patch("/product/:id", updateProduct);
  router.get("/product", getProducts);
  router.get("/product/:id", getAProd.getAProd);
  router.delete("/product/:id", authr, deleteProduct);
  return router;
};

export { productRoute };
