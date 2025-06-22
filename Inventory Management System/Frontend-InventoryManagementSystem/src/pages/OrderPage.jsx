import React, { useState } from 'react';
import OrderForm from '../components/orders/OrderForm.jsx';
import OrderTable from '../components/orders/OrderTable.jsx';

const OrderPage = () => {
  const [showForm, setShowForm] = useState(false);

  const handleToggleForm = () => {
    setShowForm(prev => !prev);
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Order Management</h3>
        
      </div>
      {showForm && <OrderForm onOrderAdded={handleToggleForm} />}
      <OrderTable />
    </div>
  );
};

export default OrderPage;