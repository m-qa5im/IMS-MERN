import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },  // Your custom product ID (like SKU)
  name: { type: String, required: true },
  category: { type: String },
  supplier: { type: String },
  quantity: { type: Number, default: 0 },
  reorderLevel: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  expiry: { type: Date }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
