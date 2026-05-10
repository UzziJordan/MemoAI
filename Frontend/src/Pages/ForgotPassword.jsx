import React from 'react';
import HeroSection from "../Components/LoginPage/Hero/HeroSection";
import ForgotPasswordForm from "../Components/LoginPage/ForgotPasswordForm";

/**
 * ForgotPassword Page Component
 * Purpose: Layout for the password recovery page, combining the hero informational section and the recovery form.
 */
const ForgotPassword = () => {
    // --- RENDER ---
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* HERO SECTION: Marketing and Product Highlights */}
            <HeroSection />
            
            {/* FORM SECTION: Password Reset Interface */}
            <div className="lg:w-1/2 w-full bg-gray-100 flex items-center justify-center">
                <ForgotPasswordForm />
            </div>
        </div>
    );
};

export default ForgotPassword;
