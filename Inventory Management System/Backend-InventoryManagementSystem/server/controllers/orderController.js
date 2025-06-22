import Order from '../models/Order.js';
import Product from '../models/productModel.js';


export const createOrder = async (req, res) => {
  try {
    const { productId, quantity, customer, status } = req.body;

    if (!productId || !quantity || !customer || !status) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Deduct stock
    product.quantity -= quantity;
    await product.save();

    // Create order
    const order = new Order({
      productId,
      productName: product.name,
      quantity,
      customer,
      status,
    });

    const savedOrder = await order.save();

    // If order status is 'Delivered', record a transaction
    if (status === 'Delivered') {
      try {
        await axios.post('http://localhost:5000/api/transactions', { orderId: savedOrder._id }, {
          withCredentials: true,
        });
      } catch (txError) {
        console.error('Transaction recording failed:', txError.message);
        // Optionally log txError.response?.data for deeper debugging
      }
    }

    res.status(201).json(savedOrder);

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

export const getOrders = async (req, res) => {
  const orders = await Order.find().populate('productId', 'name');
  res.json(orders);
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndDelete(id);
  res.json({ message: 'Order deleted' });
  const order = await Order.findById(id);
  if (order) {
    const product = await Product.findById(order.productId);
    if (product) {
      product.quantity += order.quantity;
      await product.save();
    }
    await order.remove();
    res.json({ message: 'Order deleted' });
  }

};

import axios from 'axios';

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, quantity, customer, status } = req.body;

    // Basic input validation
    if (!quantity || typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ message: 'Invalid or missing quantity' });
    }
    if (!status || typeof status !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing status' });
    }
    if (!customer || typeof customer !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing customer' });
    }

    // Fetch existing order
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const oldQuantity = order.quantity;
    const oldStatus = order.status;

    // Product change logic
    if (productId && productId !== order.productId.toString()) {
      const newProduct = await Product.findById(productId);
      if (!newProduct) return res.status(404).json({ message: 'New product not found' });

      // Restore stock of old product
      const oldProduct = await Product.findById(order.productId);
      if (oldProduct) {
        oldProduct.quantity += oldQuantity;
        await oldProduct.save();
      }

      // Check stock availability for new product
      if (newProduct.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient stock for new product' });
      }

      // Deduct stock for new product
      newProduct.quantity -= quantity;
      await newProduct.save();

      // Update order product info
      order.productId = productId;
      order.productName = newProduct.name;

    } else {
      // Same product — adjust stock based on quantity difference
      const product = await Product.findById(order.productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      const quantityDiff = quantity - oldQuantity; // positive if increasing order quantity

      if (quantityDiff > 0 && product.quantity < quantityDiff) {
        return res.status(400).json({ message: 'Insufficient stock to increase order quantity' });
      }

      product.quantity -= quantityDiff;
      await product.save();
    }

    // Update order fields
    order.quantity = quantity;
    order.customer = customer;
    order.status = status;

    // Save updated order
    const updatedOrder = await order.save();

    // If status changed to 'Delivered', post transaction (handle errors separately)
    if (oldStatus !== 'Delivered' && status === 'Delivered') {
      try {
        await axios.post('http://localhost:5000/api/transactions', { orderId: updatedOrder._id }, {
          withCredentials: true,
        });
      } catch (txError) {
        console.error('Transaction API error:', txError);
        // Optional: continue without failing order update or notify user
      }
    }

    return res.json(updatedOrder);

  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({
      message: 'Server error updating order',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
    });
  }
};

export const getOrderSummary = async (req, res) => {
  try {
    const summary = await orderModel.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      {
        $project: {
          month: "$_id",
          totalOrders: 1,
          totalSales: 1,
          _id: 0,
        },
      },
      { $sort: { month: 1 } }
    ]);

    res.json({ success: true, summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
