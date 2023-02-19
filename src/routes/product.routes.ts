import { Router } from 'express';
import getAProd, { createProduct, getProducts, deleteProduct, updateProduct } from '../controllers/product.controller';

const productRoute = () => {
  const router = Router();

  router.post('/product', createProduct);
  router.patch('/product/:id', updateProduct);
  router.get('/product', getProducts);
  router.get('/product/:id', getAProd.getAProd);
  router.delete('/product/:id', deleteProduct);
  return router;
};

export { productRoute };
