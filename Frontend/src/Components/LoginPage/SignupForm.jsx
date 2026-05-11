import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { auth } from '../../lib/api';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

/**
 * SignupForm Component
 * Purpose: Provides a user interface for creating a new Memo account.
 */
const SignupForm = () => {
    const navigate = useNavigate();

    // --- STATE AND HOOKS ---
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agree, setAgree] = useState(false);
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

    // Handle form submission and account creation
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !password) {
            alert("Please fill all fields");
            return;
        }

        if (!agree) {
            alert("You must agree to the terms");
            return;
        }

        if (password.length < 8) {
            alert("Password must be at least 8 characters");
            return;
        }

        try {
            setLoading(true);

            const fullName = `${firstName} ${lastName}`;
            await auth.register(fullName, email, password);

            // Store name for onboarding
            localStorage.setItem('lastUserName', fullName);

            // Redirect to login after successful signup
            navigate("/login");

        } catch (err) {
            console.error(err);
            alert(err.message || "Signup failed");
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
            className="bg-white mt-8 pl-10 md:pl-0 py-10 w-105 text-geist"
        >
            
            {/* TOGGLE SECTION: Switch between Sign In and Create Account */}
            <div className="flex bg-[#F3F4F6] rounded-xl p-1 h-12 text-[10px] md:text-[14px] font-bold">
                <Link to="/Login" className="flex-1">
                    <motion.button 
                        whileHover={{ color: "#2828FA" }}
                        className="w-full h-full py-1 text-[#9CA3AF]"
                    >
                        Sign in
                    </motion.button>
                </Link>
                <button className="bg-white rounded-lg px-15 md:px-19 py-1 shadow-sm text-[#111827]">
                    Create Account
                </button>
            </div>

            {/* TITLE SECTION */}
            <h2 className="text-[32px] font-extrabold tracking-tight mt-15 mb-1 leading-tight">
                Start for <br />
                <span className="text-[#2828FA] italic">free today.</span>
            </h2>

            <p className="text-[#9CA3AF] text-[15px] font-medium">Join 2,400+ users capturing better insights.</p>

            {/* SIGNUP FORM SECTION */}
            <form onSubmit={handleSubmit} className="mt-8">

                {/* Google OAuth Button */}
                <div className="w-full mb-8">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            console.log('Login Failed');
                            alert("Google Login Failed");
                        }}
                        useOneTap
                        width="420"
                    />
                </div>

                {/* Form Divider */}
                <div className='flex justify-between items-center text-center opacity-50'>
                    <div className='h-0.5 flex-1 bg-[#E5E7EB]'></div>
                    <div className="text-[11px] font-bold text-[#D1D5DB] px-4 uppercase tracking-widest">or details</div>
                    <div className='h-0.5 flex-1 bg-[#E5E7EB]'></div>
                </div>

                {/* Name Inputs */}
                <div className='flex mt-8 gap-4'>
                    <div className='w-full'>
                        <label className="font-bold text-[12px] text-[#374151] uppercase tracking-widest">First Name</label>
                        <div className="relative mt-2 group">
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2828FA] transition-colors" />
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Philip"
                                className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl pl-12 py-3 focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className='w-full'>
                        <label className="font-bold text-[12px] text-[#374151] uppercase tracking-widest">Last Name</label>
                        <div className="relative mt-2 group">
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2828FA] transition-colors" />
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Joy"
                                className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl pl-12 py-3 focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Email Input */}
                <div className="mt-6">
                    <label className="font-bold text-[12px] text-[#374151] uppercase tracking-widest">Work Email</label>
                    <div className="relative w-full mt-2 group">
                        <FaRegEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2828FA] transition-colors" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="mail@gmail.com"
                            className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div className="mt-6">
                    <label className="font-bold text-[12px] text-[#374151] uppercase tracking-widest">Create Password</label>
                    <div className="relative w-full mt-2 group">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#2828FA] transition-colors" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl pl-12 pr-12 py-3.5 focus:outline-none focus:border-blue-400 focus:bg-white transition-all font-medium"
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

                {/* Terms and Privacy Agreement */}
                <label className="flex gap-3 text-[13px] mt-6 text-[#6B7280] mb-8 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={agree}
                        onChange={() => setAgree(!agree)}
                        className="w-5 h-5 mt-0.5 rounded-md border-2 border-gray-200 accent-[#2828FA]"
                    />
                    <span className="font-medium leading-tight">
                        I agree to Memo's{" "}
                        <span className="text-[#2828FA] font-bold hover:underline">
                            Terms of Service
                        </span>{" "}
                        and{" "}
                        <span className="text-[#2828FA] font-bold hover:underline">
                            Privacy Policy
                        </span>.
                    </span>
                </label>

                {/* Submit Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl text-white font-bold bg-[#2828FA] shadow-xl shadow-blue-100 hover:bg-[#1D1DFA] transition-all disabled:opacity-50"
                >
                    {loading ? "Creating your account..." : "Start my free trial"}
                </motion.button>
            </form>

            {/* NAVIGATION TO LOGIN */}
            <Link to="/Login">
                <p className="text-center text-[14px] text-[#9CA3AF] mt-8 font-medium">
                    Already have an account?{" "}
                    <span className="text-[#2828FA] font-bold cursor-pointer hover:underline">
                        Sign in →
                    </span>
                </p>
            </Link>
        </motion.div>
    );
};

export default SignupForm;
