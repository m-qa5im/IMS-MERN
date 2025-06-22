import Product from '../models/productModel.js';
import StockEntry from '../models/stockEntryModel.js';

// Add a stock entry and update product quantity
export const addStockEntry = async (req, res) => {
  try {
    const { productId, type, quantity, remarks } = req.body;

    if (!productId || !type || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Adjust quantity based on stock type
    let newQuantity;
    if (type === 'in') {
      newQuantity = product.quantity + quantity;
    } else if (type === 'out') {
      if (product.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      newQuantity = product.quantity - quantity;
    } else {
      return res.status(400).json({ message: 'Invalid stock type' });
    }

    // Create stock entry
    const stockEntry = new StockEntry({
      productId,
      type,
      quantity,
      remarks,
    });

    await stockEntry.save();

    // Update product quantity
    product.quantity = newQuantity;
    await product.save();

    res.status(201).json({ product, stockEntry });
  } catch (error) {
    console.error('Error adding stock entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get stock entries for a product
export const getStockEntriesByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const stockEntries = await StockEntry.find({ productId }).sort({ date: -1 });
    res.json(stockEntries);
  } catch (error) {
    console.error('Error fetching stock entries:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
