import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../lib/api';
import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';

const OtpVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const stateEmail = location.state?.email;
        if (stateEmail) {
            setEmail(stateEmail);
        } else {
            // If no email in state, check localStorage or redirect back
            const storedEmail = localStorage.getItem('pendingVerificationEmail');
            if (storedEmail) {
                setEmail(storedEmail);
            } else {
                navigate('/signup');
            }
        }
    }, [location, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setMessage({ type: 'error', text: 'Please enter a valid 6-digit OTP' });
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: '', text: '' });
            
            const context = location.state?.context;
            
            if (context === 'forgotPassword') {
                // For forgot password, we just need to ensure the OTP is correct
                // We can either have a verify endpoint or just pass it to the reset page
                // Let's assume we want to verify it first or just trust it'll be verified during reset
                // To keep it simple and secure, we can pass it to the next page
                navigate('/reset-password', { state: { email, otp } });
            } else {
                await auth.verifyOTP(email, otp);
                localStorage.removeItem('pendingVerificationEmail');
                navigate('/dashboard');
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Verification failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setResending(true);
            setMessage({ type: '', text: '' });
            await auth.resendOTP(email);
            setMessage({ type: 'success', text: 'OTP resent successfully to your email' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to resend OTP' });
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 transition-colors duration-300">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl dark:shadow-black/20 p-10 border border-transparent dark:border-gray-800 transition-colors duration-300"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 text-[#2828FA] dark:text-blue-400 rounded-full mb-6 transition-colors">
                        <FaLock size={24} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2 transition-colors">Verify your email</h2>
                    <p className="text-gray-500 dark:text-gray-400 transition-colors">
                        We've sent a 6-digit code to <br />
                        <span className="font-bold text-gray-900 dark:text-gray-100">{email}</span>
                    </p>
                </div>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl text-sm font-medium transition-colors ${
                        message.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                        <label className="block text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 transition-colors">
                            Verification Code
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000"
                            className="w-full text-center text-3xl tracking-[1em] font-bold border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl py-4 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 transition-all"
                            maxLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full py-4 rounded-2xl text-white font-bold bg-[#2828FA] shadow-xl shadow-blue-100 dark:shadow-blue-900/20 hover:bg-[#1D1DFA] transition-all disabled:opacity-50 mb-6"
                    >
                        {loading ? 'Verifying...' : 'Verify Account'}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4 transition-colors">
                        Didn't receive the code?
                    </p>
                    <button
                        onClick={handleResend}
                        disabled={resending}
                        className="text-[#2828FA] dark:text-blue-400 font-bold hover:underline disabled:opacity-50 transition-colors"
                    >
                        {resending ? 'Resending...' : 'Resend Code'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default OtpVerification;
