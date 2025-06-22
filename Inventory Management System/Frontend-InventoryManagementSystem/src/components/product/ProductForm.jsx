import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductFormq = ({ onProductAdded, productToEdit, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    _id: '',       // MongoDB _id for update
    id: '',        // your custom product id
    name: '',
    category: '',
    supplier: '',
    quantity: '',
    reorderLevel: '',
    price: '',
    expiry: ''
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        _id: productToEdit._id,
        id: productToEdit.id || '',
        name: productToEdit.name || '',
        category: productToEdit.category || '',
        supplier: productToEdit.supplier || '',
        quantity: productToEdit.quantity || '',
        reorderLevel: productToEdit.reorderLevel || '',
        price: productToEdit.price || '',
        expiry: productToEdit.expiry ? productToEdit.expiry.slice(0, 10) : ''
      });
    } else {
      setFormData({
        _id: '',
        id: '',
        name: '',
        category: '',
        supplier: '',
        quantity: '',
        reorderLevel: '',
        price: '',
        expiry: ''
      });
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (productToEdit) {
        // Update product by _id
        await axios.put(
          `http://localhost:5000/api/products/${formData._id}`,
          formData,
          { withCredentials: true }
        );
      } else {
        // Create new product
        await axios.post(
          'http://localhost:5000/api/products',
          formData,
          { withCredentials: true }
        );
      }
      onProductAdded();
      if (!productToEdit) {
        setFormData({
          _id: '',
          id: '',
          name: '',
          category: '',
          supplier: '',
          quantity: '',
          reorderLevel: '',
          price: '',
          expiry: ''
        });
      }
    } catch (error) {
      console.error('Error saving product:', error.response?.data || error.message);
      alert('Error saving product: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="container bg-white shadow rounded-4 p-5 w-100" style={{ maxWidth: '800px' }}>
      <h4 className="mb-4 fw-bold">{productToEdit ? 'Update Product' : 'Add New Product'}</h4>
      <form onSubmit={handleSubmit}>

        {/* MongoDB _id - readonly for update */}
        {productToEdit && (
          <div className="mb-3">
            <label className="form-label">Product DB ID (_id)</label>
            <input
              type="text"
              name="_id"
              className="form-control"
              value={formData._id}
              disabled
              readOnly
            />
          </div>
        )}

        {/* Custom Product ID (editable only when adding) */}
        <div className="mb-3">
          <label className="form-label">Custom Product ID</label>
          <input
            type="text"
            name="id"
            className="form-control"
            value={formData.id}
            onChange={handleChange}
            required
            disabled={!!productToEdit} // disable on edit, can't change custom id
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Category</label>
            <input
              type="text"
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Supplier</label>
            <input
              type="text"
              name="supplier"
              className="form-control"
              value={formData.supplier}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              name="quantity"
              className="form-control"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">Reorder Level</label>
            <input
              type="number"
              name="reorderLevel"
              className="form-control"
              value={formData.reorderLevel}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">Price</label>
            <input
              type="number"
              step="0.01"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Expiry Date</label>
          <input
            type="date"
            name="expiry"
            className="form-control"
            value={formData.expiry}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary me-2">
          {productToEdit ? 'Update Product' : 'Add Product'}
        </button>

        {productToEdit && (
          <button type="button" onClick={onCancelEdit} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default ProductFormq;
