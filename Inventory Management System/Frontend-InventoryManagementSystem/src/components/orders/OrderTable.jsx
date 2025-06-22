import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderForm from './OrderForm';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return !dateString || isNaN(date) ? 'N/A' : date.toISOString().split('T')[0];
};

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const fetchOrders = async () => {
    const res = await axios.get('http://localhost:5000/api/orders', { withCredentials: true });
    setOrders(res.data);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    await axios.delete(`http://localhost:5000/api/orders/${id}`, { withCredentials: true });
    fetchOrders();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h5 className="fw-bold mb-0">Orders</h5>
        <button className="btn btn-success" onClick={() => {
          setEditingOrder(null);
          setShowForm(prev => !prev);
        }}>
          {showForm ? 'Close Form' : 'Add New'}
        </button>
      </div>

      {showForm && (
        <OrderForm
          onOrderAdded={fetchOrders}
          editingOrder={editingOrder}
          onCancelEdit={() => {
            setEditingOrder(null);
            setShowForm(false);
          }}
        />
      )}

      <div className="table-responsive bg-white p-4 rounded-4 shadow mt-4">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-6)}</td>
                <td>{order.productId?.name || order.productName}</td>
                <td>{order.quantity}</td>
                <td>{order.customer}</td>
                <td>{order.status}</td>
                <td>{formatDate(order.orderDate)}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2 rounded-4"
                    onClick={() => {
                      setEditingOrder(order);
                      setShowForm(true);
                    }}
                  >Edit</button>
                  <button className="btn btn-danger btn-sm rounded-4" onClick={() => handleDelete(order._id)}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="text-center">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;