import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { auth } from '../../lib/api';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

/**
 * LoginForm Component
 * Purpose: Provides a user interface for authenticating existing users.
 */
const LoginForm = () => {
    const navigate = useNavigate();

    // --- STATE AND HOOKS ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // --- HANDLERS ---
    
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            await auth.googleLogin(credentialResponse.credential);
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            alert(error.message || "Google Login failed");
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission and authentication
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            // Authentication logic
            const data = await auth.login(email, password);

            // Store name for consistency
            if (data.user && data.user.name) {
                localStorage.setItem('lastUserName', data.user.name);
            }

            navigate("/dashboard");

        } catch (error) {
            console.error(error);
            if (error.message.includes("Account not verified") || error.unverified) {
                localStorage.setItem('pendingVerificationEmail', email);
                navigate("/verify-otp", { state: { email } });
            } else {
                alert(error.message || "Login failed");
            }
        } finally {
            setLoading(false);
        }
    };

    // Animation Variants
    const formVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    // --- RENDER ---
    return (
        <motion.div 
            variants={formVariants}
            initial="hidden"
            animate="visible"
            className="bg-[#FFFFFF] dark:bg-gray-950 mt-8 pl-10 md:pl-0 py-10 w-105 text-geist dark:text-gray-100 transition-colors duration-300"
        >

            {/* TOGGLE SECTION: Switch between Sign In and Create Account */}
            <div className="flex bg-[#F3F4F6] dark:bg-gray-900 rounded-xl p-1 h-12 text-[10px] md:text-[14px] font-bold">
                <button className="bg-white dark:bg-gray-800 rounded-lg px-15 md:px-18 py-1 shadow-sm text-[#111827] dark:text-gray-100 transition-colors">
                    Sign In
                </button>
                <Link to="/SignupPage" className="flex-1">
                    <motion.button 
                        whileHover={{ color: "#2828FA" }}
                        className="w-full h-full py-1.5 text-[#9CA3AF] dark:text-gray-500"
                    >
                        Create Account
                    </motion.button>
                </Link>
            </div>

            {/* HEADING SECTION */}
            <h2 className="text-[32px] font-extrabold tracking-tight mt-15 mb-1 leading-tight">
                Welcome <br />
                <span className="text-[#2828FA] dark:text-blue-400 italic">back.</span>
            </h2>

            <p className="text-[#9CA3AF] dark:text-gray-400 text-[15px] font-medium transition-colors">
                Sign in to your Memo account to continue.
            </p>

            {/* LOGIN FORM SECTION */}
            <form onSubmit={handleSubmit} className="mt-8">
                
                {/* Google OAuth Button */}
                <div className="w-full mb-8 dark:invert-[0.9] dark:hue-rotate-180 transition-all">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            console.log('Login Failed');
                            alert("Google Login Failed");
                        }}
                        width="420"
                    />
                </div>

                {/* Form Divider */}
                <div className='flex justify-between items-center text-center opacity-50'>
                    <div className='h-0.5 flex-1 bg-[#E5E7EB] dark:bg-gray-800 transition-colors'></div>
                    <div className="text-[11px] font-bold text-[#D1D5DB] dark:text-gray-600 px-4 uppercase tracking-widest">
                        or email
                    </div>
                    <div className='h-0.5 flex-1 bg-[#E5E7EB] dark:bg-gray-800 transition-colors'></div>
                </div>

                {/* Email Input */}
                <div className="mt-8">
                    <label className="font-bold text-[12px] text-[#374151] dark:text-gray-300 uppercase tracking-widest">Email address</label>
                    <div className="relative w-full mt-2 group">
                        <FaRegEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 group-focus-within:text-[#2828FA] transition-colors" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="w-full border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-blue-400 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div className="mt-6">
                    <div className="flex justify-between items-center">
                        <label className="font-bold text-[12px] text-[#374151] dark:text-gray-300 uppercase tracking-widest">Password</label>
                        <Link to="/ForgotPassword" title="Reset password" data-testid="forgot-password-link" className="text-[#2828FA] dark:text-blue-400 text-[12px] font-bold hover:underline">
                            Forgot?
                        </Link>
                    </div>

                    <div className="relative w-full mt-2 group">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 group-focus-within:text-[#2828FA] transition-colors" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-xl pl-12 pr-12 py-3.5 focus:outline-none focus:border-blue-400 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium"
                        />

                        {/* Toggle Password Visibility */}
                        <div
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center gap-3 mt-6">
                    <input type="checkbox" className="w-5 h-5 rounded-md border-2 border-gray-200 dark:border-gray-800 accent-[#2828FA] cursor-pointer" />
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Keep me signed in</p>
                </div>

                {/* Submit Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full mt-8 py-4 rounded-xl text-white font-bold bg-[#2828FA] shadow-xl shadow-blue-100 dark:shadow-blue-900/20 hover:bg-[#1D1DFA] transition-all disabled:opacity-50"
                >
                    {loading ? "Verifying..." : "Sign in to Memo"}
                </motion.button>
            </form>

            {/* SECURITY COMPLIANCE FOOTER */}
            <div className="flex justify-center gap-6 mt-10 text-[10px] font-bold text-[#D1D5DB] dark:text-gray-700 uppercase tracking-tighter transition-colors">
                <div className="flex items-center gap-1.5 opacity-60">🛡️ <span>SSL Encrypted</span></div>
                <div className="flex items-center gap-1.5 opacity-60">🔒 <span>SOC 2 Ready</span></div>
                <div className="flex items-center gap-1.5 opacity-60">🛡️ <span>GDPR Ready</span></div>
            </div>
        </motion.div>
    );
};

export default LoginForm;
