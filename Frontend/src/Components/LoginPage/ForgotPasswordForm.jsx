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
        <div className="bg-white shadow-sm rounded-xl p-10 w-105 text-geist">
            {/* BACK NAVIGATION */}
            <Link to="/Login" className="text-[#2828FA] text-[14px] font-semibold mb-6 inline-block">
                ← Back to Sign In
            </Link>
            
            {/* ICON INDICATOR */}
            <div className="bg-[#EFF6FF] h-16 w-16 rounded-lg flex items-center justify-center mb-6">
                <span className="text-[#3B82F6] text-[28px]">✉</span>
            </div>
            
            {/* TITLE AND DESCRIPTION */}
            <h2 className="text-[26px] text-[#111827] text-instrument-serif mb-2">
                Reset your <br />
                <span className="text-[#2563EB] italic">password.</span>
            </h2>
            
            <p className="text-[#9CA3AF] text-[14px] mb-6">
                Enter your email and we'll send a reset link within 2 minutes.
            </p>

            {message.text && (
                <div className={`mb-6 p-3 rounded-lg text-sm ${
                    message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                }`}>
                    {message.text}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                {/* EMAIL INPUT SECTION */}
                <p className="mt-6 font-semibold text-[13px] text-[#374151]">Email address</p>
                
                <div className="relative w-full mt-2 text-[#D1D5DB]">
                    <FaRegEnvelope className="absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="email"
                        placeholder="malhub@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-[#D1D5DB] rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
