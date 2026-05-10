import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Landingpage/Navbar';
import Section1 from '../Components/Landingpage/Section1';
import Section2 from '../Components/Landingpage/Section2';
import Section3 from '../Components/Landingpage/Section3';
import Section4 from '../Components/Landingpage/Section4';
import Section5 from '../Components/Landingpage/Section5';
import Section6 from '../Components/Landingpage/Section6';
import Section7 from '../Components/Landingpage/Section7';
import Footer from '../Components/Landingpage/Footer';
import { auth } from '../lib/api';

/**
 * LandingPage Page Component
 * Purpose: Main landing page assembling all marketing sections from Navbar to Footer.
 */
const LandingPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    await auth.getProfile();
                    // If user has session, redirect to dashboard immediately
                    navigate('/dashboard');
                } else {
                    setLoading(false);
                }
            } catch (error) {
                // No session, allow landing page to render
                setLoading(false);
            }
        };
        checkSession();
    }, [navigate]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // --- RENDER ---
    return (
        <div className='overflow-x-hidden'>
            {/* NAVIGATION */}
            <Navbar />

            {/* HERO AND MARKETING SECTIONS */}
            <Section1 />
            <Section2 />
            <Section3 />
            <Section4 />
            <Section5 />
            <Section6 />
            <Section7 />

            {/* FOOTER */}
            <Footer />
        </div>
    );
};

export default LandingPage;
