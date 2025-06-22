import React from 'react';
import ProductTable from '../components/product/ProductTable.jsx';  
const ProductPage = () => {
  return (
    <div className="container p-4">
      <h3 className="fw-bold">Product Management</h3>
      <ProductTable/>
    </div>
  );
};

export default ProductPage;
