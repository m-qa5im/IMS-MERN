import Product from '../models/productModel.js';
import mongoose from 'mongoose';

// Create product
export const createProduct = async (req, res) => {
  try {
    const { id, name, category, supplier, quantity, reorderLevel, price, expiry } = req.body;

    // Check if product with custom id exists
    const existing = await Product.findOne({ id });
    if (existing) {
      return res.status(400).json({ message: 'Product with this custom ID already exists' });
    }

    const product = new Product({ id, name, category, supplier, quantity, reorderLevel, price, expiry });
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

// Update product by _id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;  // This is MongoDB _id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const { name, category, supplier, quantity, reorderLevel, price, expiry } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields (except custom id)
    product.name = name || product.name;
    product.category = category || product.category;
    product.supplier = supplier || product.supplier;
    product.quantity = quantity != null ? quantity : product.quantity;
    product.reorderLevel = reorderLevel != null ? reorderLevel : product.reorderLevel;
    product.price = price != null ? price : product.price;
    product.expiry = expiry || product.expiry;

    await product.save();

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
};

// Delete product by _id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;  // MongoDB _id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};

// Get low stock products
export const getLowStockProducts = async (req, res) => {
  try {
    const products = await productModel.find({
      quantity: { $lte: { $ifNull: ["$reorderLevel", 10] } }
    });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get top selling products
export const getTopSellingProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ sold: -1 }).limit(5);
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

