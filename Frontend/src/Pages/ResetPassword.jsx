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
        <div className="min-h-screen flex flex-col lg:flex-row transition-colors duration-300">
            <HeroSection />
            
            <div className="lg:w-1/2 w-full bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-6 transition-colors duration-300">
                <div className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-black/20 rounded-xl p-10 w-full max-w-md text-geist border border-transparent dark:border-gray-800 transition-colors duration-300">
                    <Link to="/Login" className="text-[#2828FA] dark:text-blue-400 text-[14px] font-semibold mb-6 inline-block hover:underline">
                        ← Back to Sign In
                    </Link>
                    
                    <div className="bg-[#EFF6FF] dark:bg-blue-900/20 h-16 w-16 rounded-lg flex items-center justify-center mb-6 transition-colors">
                        <FaLock className="text-[#3B82F6] dark:text-blue-400 text-[24px]" />
                    </div>
                    
                    <h2 className="text-[26px] text-[#111827] dark:text-gray-100 text-instrument-serif mb-2 transition-colors">
                        Create new <br />
                        <span className="text-[#2563EB] dark:text-blue-400 italic">password.</span>
                    </h2>
                    
                    <p className="text-[#9CA3AF] dark:text-gray-400 text-[14px] mb-6 transition-colors">
                        Please enter your new password below.
                    </p>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-medium transition-colors ${
                            message.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        }`}>
                            {message.text}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <p className="font-semibold text-[13px] text-[#374151] dark:text-gray-300 mb-2 transition-colors">New Password</p>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border border-[#D1D5DB] dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-black dark:text-white transition-all"
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <p className="font-semibold text-[13px] text-[#374151] dark:text-gray-300 mb-2 transition-colors">Confirm New Password</p>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border border-[#D1D5DB] dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-black dark:text-white transition-all"
                                disabled={loading}
                                required
                            />
                        </div>
                        
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl text-white font-semibold bg-[#2828FA] hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-blue-900/20"
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
