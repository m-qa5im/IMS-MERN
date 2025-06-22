import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async (search = '') => {
    try {
      const res = await axios.get('http://localhost:5000/api/products', {
        params: { search },
        withCredentials: true,
      });
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
      alert('Failed to fetch products.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, { withCredentials: true });
      fetchProducts(searchTerm);
    } catch (error) {
      console.error('Error deleting product:', error.response?.data || error.message);
      alert('Failed to delete product.');
    }
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleAddNewClick = () => {
    setEditProduct(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditProduct(null);
    fetchProducts(searchTerm);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    fetchProducts(val);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          placeholder="Search by Name"
          className="form-control w-50"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="btn btn-success" onClick={handleAddNewClick}>
          Add New Product
        </button>
      </div>

      {showForm && (
        <ProductForm
          productToEdit={editProduct}
          onProductAdded={handleFormClose}
          onCancelEdit={handleFormClose}
        />
      )}

      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Supplier</th>
            
            <th>Price</th>
            <th>Expiry</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center">
                No products found.
              </td>
            </tr>
          )}

          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category || '-'}</td>
              <td>{product.supplier || '-'}</td>
              
              <td>{product.price}</td>
              <td>{product.expiry ? new Date(product.expiry).toLocaleDateString() : '-'}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => handleEditClick(product)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
