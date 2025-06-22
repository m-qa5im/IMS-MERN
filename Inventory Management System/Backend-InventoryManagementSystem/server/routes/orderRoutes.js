import express from 'express';
import { updateOrder, createOrder, getOrders, deleteOrder, getOrderSummary } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.delete('/:id', deleteOrder);
router.put('/:id', updateOrder);
router.get('/summary', getOrderSummary);


export default router;
