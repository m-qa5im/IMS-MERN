import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';



const LoginForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const { setUser } = useAuth();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            console.log("Login response data:", data);
            if (res.ok && data.Success) {
                setUser(data.user); // Now user object exists
                toast.success(data.message || "Login successful!");
                navigate('/poducts', { replace: true });

            } else {
                toast.error(data.message || 'Login failed');
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again later.');
            console.error(error);
        }
    };




    return (
        <div
            className="container bg-white rounded-4 shadow-lg overflow-hidden px-4"
            style={{ maxWidth: '100%', width: '1080px', maxHeight: '95vh' }}
        >

            <div className="row g-0">

                {/* Left Form Section */}
                <div className="col-md-6 p-5">
                    <h3 className="fw-bold mb-3">Login</h3>
                    <p className="text-muted mb-4">See your growth and get support!</p>

                    {/* <button className="btn btn-outline-secondary w-100 mb-4 d-flex align-items-center justify-content-center gap-2 rounded-pill">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="20" alt="Google" />
                        Sign in with Google
                    </button> */}

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label">Email*</label>
                            <input
                                type="email"
                                className="form-control rounded-3"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password*</label>
                            <input
                                type="password"
                                className="form-control rounded-3"
                                placeholder="minimum 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="row mb-3 text-center text-md-start">
                            {/* <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-start mb-2 mb-md-0">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="rememberMe" />
                                    <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                                </div>
                            </div> */}

                            <div className="col-12 d-flex justify-content-center justify-content-md-end">
                                <Link to="/forgot-password" className="text-decoration-none">Forgot password?</Link>
                            </div>
                        </div>


                        <button type="submit" className="btn btn-dark w-100 rounded-pill">Login</button>
                    </form>

                    <div className="d-flex flex-column flex-md-row justify-content-center align-items-center mt-3 small text-center text-md-start gap-1">
                        <p className="mb-0">Not registered yet?</p>
                        <Link to="/signup" className="text-decoration-none">Create a new account</Link>
                    </div>


                </div>

                {/* Right Image Section */}
                <div className="col-md-6 d-none d-md-block">
                    <img
                        src="/login-illustration.png"
                        alt="Login Illustration"
                        className="img-fluid vh-100 vw-100"
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
