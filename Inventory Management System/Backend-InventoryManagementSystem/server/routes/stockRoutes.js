import express from 'express';
import { addStockEntry, getStockEntriesByProduct } from '../controllers/stockController.js';

const router = express.Router();

// Create new stock entry (stock in or out)
router.post('/', addStockEntry);

// Get stock entries history for a product
router.get('/:productId', getStockEntriesByProduct);

export default router;
