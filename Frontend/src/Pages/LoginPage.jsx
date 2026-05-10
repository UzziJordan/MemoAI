import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from "../Components/LoginPage/Hero/HeroSection";
import LoginForm from "../Components/LoginPage/LoginForm";
import { auth } from '../lib/api';

/**
 * LoginPage Page Component
 * Purpose: Main authentication page for logging into the application.
 */
const LoginPage = () => {
    const navigate = useNavigate();
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    await auth.getProfile();
                    // If successful, user is already logged in
                    navigate('/dashboard');
                } else {
                    setCheckingSession(false);
                }
            } catch (error) {
                // Not logged in, stay on login page
                setCheckingSession(false);
            }
        };
        checkSession();
    }, [navigate]);

    if (checkingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // --- RENDER ---
    return (
        <div className="min-h-screen lg:h-256 flex flex-col lg:flex-row">
            {/* HERO SECTION: Marketing and Context */}
            <HeroSection />

            {/* FORM SECTION: User Login Interface */}
            <div className="lg:w-1/2 w-[90vw] md:w-full flex items-start md:items-center lg:items-start justify-center">
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;
