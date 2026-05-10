import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Navbar Component
 * Purpose: Provides the main navigation bar for the landing page.
 */
const Navbar = () => {
    // --- RENDER ---
    return (
        <nav className='bg-[#EFF2F9] pt-4.25 md:pt-6.75 lg:pt-10'>
            {/* NAVBAR CONTAINER */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className='bg-[#F4F6F8] flex items-center justify-between px-2 w-[90vw] h-15 mx-auto md:px-2 lg:px-2 rounded-xl shadow-sm'
            >
                {/* LOGO */}
                <NavLink to="/">
                    <motion.h1 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='text-audiowide text-[#2828FA] text-2xl ml-4 cursor-pointer'
                    >
                        MEMO AI
                    </motion.h1>
                </NavLink>
                
                {/* CTA BUTTON */}
                <NavLink to="/Onboarding">
                    <motion.button 
                        whileHover={{ scale: 1.05, backgroundColor: "#1D1DFA" }}
                        whileTap={{ scale: 0.95 }}
                        className='w-33 h-10.5 bg-[#2828FA] mr-2 rounded-xl text-[#FFFFFF] text-[12px] text-geist font-bold shadow-lg shadow-blue-100'
                    >
                        Get Started
                    </motion.button>
                </NavLink>
            </motion.div>
        </nav>
    );
};

export default Navbar;
