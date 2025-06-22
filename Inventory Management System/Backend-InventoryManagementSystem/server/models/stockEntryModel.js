import mongoose from 'mongoose';

const StockEntrySchema = new mongoose.Schema({
  productId: { type: String, required: true, ref: 'Product' },
  type: { type: String, enum: ['in', 'out'], required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  remarks: { type: String },
});

const StockEntry = mongoose.model('StockEntry', StockEntrySchema);
export default StockEntry;
