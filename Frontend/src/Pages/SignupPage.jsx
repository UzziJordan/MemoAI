import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from "../Components/LoginPage/Hero/HeroSection";
import SignupForm from "../Components/LoginPage/SignupForm";
import { auth } from '../lib/api';

const SignupPage = () => {
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
        // Not logged in, stay on signup page
        setCheckingSession(false);
      }
    };
    checkSession();
  }, [navigate]);

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-256 flex flex-col lg:flex-row">
      {/* Hero Section */}
      <HeroSection />
      {/* Signup Form */}
      <div className="lg:w-1/2 w-[90vw] md:w-full flex items-start md:items-center lg:items-start justify-center">
        <SignupForm />
      </div>
    
    </div>
  );
};

export default SignupPage;
