import React from 'react';
import { replace, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center px-4">
            <div className="p-5 bg-white shadow rounded-4" style={{ maxWidth: '600px', width: '100%' }}>
                <h1 className="mb-3 fw-bold">Inventory Management System</h1>
                <p className="mb-4 text-muted">Manage your inventory efficiently and securely.</p>

                <div className="d-flex flex-column gap-3">
                    <button
                        onClick={() => navigate('/login', {replace: true})}
                        className="btn btn-dark rounded-pill py-2"
                    >
                        Login
                    </button>

                    <button
                        onClick={() => navigate('/signup')}
                        className="btn btn-outline-dark rounded-pill py-2"
                    >
                        Signup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
