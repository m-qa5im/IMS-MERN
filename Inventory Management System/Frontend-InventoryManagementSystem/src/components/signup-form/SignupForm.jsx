import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignupForm = () => {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        first: '',
        last: '',
        email: '',
        phone: '',
        password: '',
    });

    // Backend URL from env or fallback
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            axios.defaults.withCredentials = true; // Enable cookies for cross-origin requests

            const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
                firstname: formData.first,
                lastname: formData.last,
                email: formData.email,
                phoneno: formData.phone,
                password: formData.password,
            });

            if (data.Success === true) {
                toast.success('Registration successful! OTP sent to your email. You may verify your account now.');

                // Optionally update user or just set as logged in false until verification:
                setUser(null);

                navigate('/email-verify', {
                    state: {
                        email: formData.email,
                        first: formData.first,
                        last: formData.last,
                        phone: formData.phone
                    }
                });
            } else {
                toast.error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('There was an error!', error);

            const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
            toast.error(errorMessage);
        }
    };

    return (
        <div
            className="container bg-white rounded-4 shadow-lg overflow-hidden"
            style={{ maxWidth: '100%', width: '1080px', maxHeight: '95vh' }}
        >
            <div className="row g-0">
                {/* Left Image */}
                <div className="col-md-6 d-none d-md-block">
                    <img
                        src="/login-illustration.png"
                        alt="Register Illustration"
                        className="img-fluid h-100 w-100"
                        style={{ objectFit: 'cover' }}
                    />
                </div>

                {/* Right Form */}
                <div className="col-md-6 p-5">
                    <div className="mb-4">
                        <div className="brand-icon"></div>
                        <h3 className="fw-bold">Register</h3>
                        <p className="text-muted">Manage all your inventory efficiently</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* First and Last name */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">First name</label>
                                <input
                                    name="first"
                                    type="text"
                                    className="form-control rounded-3"
                                    placeholder="Enter your first name"
                                    value={formData.first}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Last name</label>
                                <input
                                    name="last"
                                    type="text"
                                    className="form-control rounded-3"
                                    placeholder="Enter your last name"
                                    value={formData.last}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email and Phone */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="form-control rounded-3"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Phone no.</label>
                                <input
                                    name="phone"
                                    type="text"
                                    className="form-control rounded-3"
                                    placeholder="0300-0000000"
                                    pattern="[0-9]{4}[0-9]{7}"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-3 position-relative">
                            <label className="form-label">Password</label>
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className="form-control rounded-3 pe-5"
                                placeholder="Enter your password (min 8 characters)"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                            />
                            {/* <span
                                onClick={() => setShowPassword((prev) => !prev)}
                                
                                style={{ cursor: "pointer" }}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span> */}
                        </div>

                        {/* Terms checkbox */}
                        <div className="form-check mb-3">
                            <input
                                type="checkbox"
                                name="agree"
                                className="form-check-input"
                                id="agree"
                                required
                            />
                            <label className="form-check-label" htmlFor="agree">
                                I agree to all terms, <a href="#">privacy policies</a>, and fees
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-dark w-100 rounded-pill"
                        >
                            Sign up
                        </button>
                    </form>

                    <p className="text-center mt-3 small">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;
 