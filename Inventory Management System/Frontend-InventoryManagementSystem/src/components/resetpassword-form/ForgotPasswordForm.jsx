import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const ForgotResetPassword = () => {
    // Step 1: Enter email to send OTP
    // Step 2: Enter OTP + new password to reset

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const sendOtp = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/send-reset-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (data.Success) {
                toast.success("OTP sent to your email");
                setStep(2);
            } else {
                toast.error(data.message || "Failed to send OTP");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    const resetPassword = async (e) => {
        e.preventDefault();

        if (!otp || !newPassword || !confirmPassword) {
            toast.error("Please fill all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await res.json();

            if (data.Success) {
                toast.success("Password reset successfully. Redirecting to login...");
                setTimeout(() => {
                    window.location.href = "/login"; // Redirect to login page
                }, 2000);
            } else {
                toast.error(data.message || "Failed to reset password");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div
            className="container bg-white rounded-4 shadow-lg overflow-hidden px-4"
            style={{ maxWidth: '100%', width: '1080px', maxHeight: '95vh' }}
        >
            <ToastContainer />

            <div className="row g-0 h-100">
                <div className="col-md-6 p-5 d-flex flex-column justify-content-center">
                    {step === 1 && (
                        <>
                            <h3 className="fw-bold mb-3">Forgot Password</h3>
                            <p className="text-muted mb-4">Enter your registered email to receive an OTP</p>

                            <form onSubmit={sendOtp}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control rounded-3"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-dark w-100 rounded-pill">
                                    Send OTP
                                </button>
                            </form>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h3 className="fw-bold mb-3">Reset Password</h3>
                            <p className="text-muted mb-4">Enter the OTP sent to your email and choose a new password</p>

                            <form onSubmit={resetPassword}>
                                <div className="mb-3">
                                    <label className="form-label">OTP</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        placeholder="Enter 6-digit code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control rounded-3"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control rounded-3"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-dark w-100 rounded-pill">
                                    Reset Password
                                </button>
                            </form>
                        </>
                    )}
                </div>

                <div className="col-md-6 d-none d-md-block">
                    <img
                        src="/login-illustration.png"
                        alt="Login Illustration"
                        className="img-fluid vh-100 w-100"
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ForgotResetPassword;
