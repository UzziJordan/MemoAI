import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaRegEnvelope } from "react-icons/fa";
import { auth } from "../../lib/api";

/**
 * ForgotPasswordForm Component
 * Purpose: Provides a form for users to request a password reset email.
 */
const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setMessage({ type: 'error', text: 'Please enter your email' });
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: '', text: '' });
            await auth.forgotPassword(email);
            // Navigate to OTP verification page, passing the email and context
            navigate('/verify-otp', { state: { email, context: 'forgotPassword' } });
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Something went wrong' });
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER ---
    return (
        <div className="bg-white dark:bg-gray-950 shadow-sm dark:shadow-black/20 rounded-xl p-10 w-105 text-geist dark:text-gray-100 transition-colors duration-300">
            {/* BACK NAVIGATION */}
            <Link to="/Login" className="text-[#2828FA] dark:text-blue-400 text-[14px] font-semibold mb-6 inline-block">
                ← Back to Sign In
            </Link>
            
            {/* ICON INDICATOR */}
            <div className="bg-[#EFF6FF] dark:bg-blue-900/20 h-16 w-16 rounded-lg flex items-center justify-center mb-6">
                <span className="text-[#3B82F6] dark:text-blue-400 text-[28px]">✉</span>
            </div>
            
            {/* TITLE AND DESCRIPTION */}
            <h2 className="text-[26px] text-[#111827] dark:text-gray-100 text-instrument-serif mb-2">
                Reset your <br />
                <span className="text-[#2563EB] dark:text-blue-400 italic">password.</span>
            </h2>
            
            <p className="text-[#9CA3AF] dark:text-gray-400 text-[14px] mb-6">
                Enter your email and we'll send a reset link within 2 minutes.
            </p>

            {message.text && (
                <div className={`mb-6 p-3 rounded-lg text-sm ${
                    message.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                }`}>
                    {message.text}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                {/* EMAIL INPUT SECTION */}
                <p className="mt-6 font-semibold text-[13px] text-[#374151] dark:text-gray-300 uppercase tracking-widest">Email address</p>
                
                <div className="relative w-full mt-2 text-[#D1D5DB] dark:text-gray-600">
                    <FaRegEnvelope className="absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="email"
                        placeholder="malhub@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-[#D1D5DB] dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white transition-all"
                        disabled={loading}
                    />
                </div>
                
                {/* ACTION BUTTON */}
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 py-3 rounded-xl text-white font-semibold bg-[#2828FA] hover:opacity-90 transition disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
};

export default ForgotPasswordForm;
