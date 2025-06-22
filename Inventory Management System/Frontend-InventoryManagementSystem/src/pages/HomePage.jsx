import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Home from '../components/home-form/Home';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/products', { replace: true }); 
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="bg-light overflow-hidden d-flex justify-content-center align-items-center min-vh-100 px-3">
      <Home />
    </div>
  );
};

export default HomePage;
