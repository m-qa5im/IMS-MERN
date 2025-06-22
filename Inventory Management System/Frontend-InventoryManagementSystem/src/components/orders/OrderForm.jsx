import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderForm = ({ onOrderAdded, editingOrder, onCancelEdit }) => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ productId: '', quantity: '', customer: '', status: 'Pending' });

  useEffect(() => {
    axios.get('http://localhost:5000/api/products', { withCredentials: true }).then(res => setProducts(res.data));
  }, []);

  useEffect(() => {
    if (editingOrder) {
      setFormData({
        productId: editingOrder.productId._id || editingOrder.productId,
        quantity: editingOrder.quantity,
        customer: editingOrder.customer,
        status: editingOrder.status,
      });
    }
  }, [editingOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOrder) {
        await axios.put(`http://localhost:5000/api/orders/${editingOrder._id}`, {
          ...formData,
          quantity: Number(formData.quantity),
        }, { withCredentials: true });
      } else {
        await axios.post('http://localhost:5000/api/orders', {
          ...formData,
          quantity: Number(formData.quantity),
        }, { withCredentials: true });
      }

      onOrderAdded();
      setFormData({ productId: '', quantity: '', customer: '', status: 'Pending' });
      onCancelEdit?.();
    } catch (err) {
      console.error('Error submitting order:', err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-4 p-4">
      <h5 className="fw-bold mb-3">{editingOrder ? 'Edit Order' : 'Add Order'}</h5>
      <div className="mb-3">
        <label className="form-label">Product</label>
        <select name="productId" className="form-select" value={formData.productId} onChange={handleChange} required>
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>{product.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Quantity</label>
        <input type="number" name="quantity" className="form-control" value={formData.quantity} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Customer</label>
        <input type="text" name="customer" className="form-control" value={formData.customer} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Status</label>
        <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      <div className="d-flex justify-content-between mt-3">
        <button type="submit" className="btn btn-primary rounded-4">
          {editingOrder ? 'Update Order' : 'Save Order'}
        </button>
        {editingOrder && (
          <button type="button" className="btn btn-secondary rounded-4" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default OrderForm;