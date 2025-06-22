import express from 'express';
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getTopSellingProducts
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/low-stock', getLowStockProducts);
router.get('/top-selling',  getTopSellingProducts);


export default router;
