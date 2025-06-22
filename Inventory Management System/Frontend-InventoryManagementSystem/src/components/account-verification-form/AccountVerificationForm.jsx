import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AccountVerificationForm = () => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                'http://localhost:5000/api/auth/verify-email',
                { otp: code },
                { withCredentials: true }
            );

            if (res.data.Success) {
                toast.success('Account verified successfully! Please login.');
                navigate('/login'); // 👈 go to login page
            }
            else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Verification failed.');
        }
    };

    const handleResendCode = async () => {
        try {
            const res = await axios.post(
                'http://localhost:5000/api/auth/send-verify-otp',
                {},
                { withCredentials: true }
            );

            if (res.data.Success) {
                toast.success('OTP sent to your email!');
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to resend code.');
        }
    };

    return (
        <div className="container bg-white rounded-4 shadow-lg overflow-hidden" style={{ maxWidth: '1080px', maxHeight: '95vh' }}>
            <div className="row g-0">
                <div className="col-md-6 d-none d-md-block">
                    <img src="/login-illustration.png" alt="Verification" className="img-fluid vh-100 w-100" style={{ objectFit: 'cover' }} />
                </div>
                <div className="col-md-6 p-5">
                    <h3 className="fw-bold">Verify Account</h3>
                    <p className="text-muted">Enter the OTP sent to your email</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Verification Code</label>
                            <input
                                name="code"
                                type="text"
                                className="form-control rounded-3"
                                placeholder="Enter the 6-digit code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="d-flex justify-content-between mb-3">
                            <button type="button" onClick={handleResendCode} className="btn btn-link p-0 small">
                                Resend Code
                            </button>
                        </div>

                        <button type="submit" className="btn btn-dark w-100 rounded-pill">Verify</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AccountVerificationForm;
