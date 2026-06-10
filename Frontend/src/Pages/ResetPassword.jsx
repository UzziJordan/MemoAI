import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { auth } from '../lib/api';
import HeroSection from "../Components/LoginPage/Hero/HeroSection";
import { FaLock } from 'react-icons/fa';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    useEffect(() => {
        if (location.state?.email && location.state?.otp) {
            setEmail(location.state.email);
            setOtp(location.state.otp);
        } else {
            navigate('/forgot-password');
        }
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: '', text: '' });
            await auth.resetPassword(email, otp, newPassword);
            setMessage({ type: 'success', text: 'Password reset successful! Redirecting to login...' });
            setTimeout(() => {
                navigate('/Login');
            }, 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to reset password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            <HeroSection />
            
            <div className="lg:w-1/2 w-full bg-gray-100 flex items-center justify-center p-6">
                <div className="bg-white shadow-sm rounded-xl p-10 w-full max-w-md text-geist">
                    <Link to="/Login" className="text-[#2828FA] text-[14px] font-semibold mb-6 inline-block">
                        ← Back to Sign In
                    </Link>
                    
                    <div className="bg-[#EFF6FF] h-16 w-16 rounded-lg flex items-center justify-center mb-6">
                        <FaLock className="text-[#3B82F6] text-[24px]" />
                    </div>
                    
                    <h2 className="text-[26px] text-[#111827] text-instrument-serif mb-2">
                        Create new <br />
                        <span className="text-[#2563EB] italic">password.</span>
                    </h2>
                    
                    <p className="text-[#9CA3AF] text-[14px] mb-6">
                        Please enter your new password below.
                    </p>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                            message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                        }`}>
                            {message.text}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <p className="font-semibold text-[13px] text-[#374151] mb-2">New Password</p>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <p className="font-semibold text-[13px] text-[#374151] mb-2">Confirm New Password</p>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                disabled={loading}
                                required
                            />
                        </div>
                        
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl text-white font-semibold bg-[#2828FA] hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? 'Resetting...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
