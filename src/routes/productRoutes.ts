import express, { Request, Response, NextFunction } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController';

const router = express.Router();

// CRUD routes
router.get('/products', getProducts);
router.get('/products/:id', (req: Request, res: Response, next: NextFunction) => {
    getProductById(req, res).catch(next);
});
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;