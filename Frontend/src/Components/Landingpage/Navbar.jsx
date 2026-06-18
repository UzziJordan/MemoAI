import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from '../../context/ThemeContext';

/**
 * Navbar Component
 * Purpose: Provides the main navigation bar for the landing page.
 */
const Navbar = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    // --- RENDER ---
    return (
        <nav className='bg-[#EFF2F9] dark:bg-gray-950 pt-4.25 md:pt-6.75 lg:pt-10 transition-colors duration-300'>
            {/* NAVBAR CONTAINER */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className='bg-[#F4F6F8] dark:bg-gray-900 flex items-center justify-between px-2 w-[90vw] h-15 mx-auto md:px-2 lg:px-2 rounded-xl shadow-sm border border-transparent dark:border-gray-800'
            >
                {/* LOGO */}
                <NavLink to="/">
                    <motion.h1 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='text-audiowide text-[#2828FA] dark:text-blue-400 text-2xl ml-4 cursor-pointer'
                    >
                        MEMO AI
                    </motion.h1>
                </NavLink>
                
                <div className='flex items-center gap-2 md:gap-4'>
                    {/* THEME TOGGLE */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 shadow-sm"
                    >
                        {isDarkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-blue-600" />}
                    </motion.button>

                    {/* CTA BUTTON */}
                    <NavLink to="/Onboarding">
                        <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: "#1D1DFA" }}
                            whileTap={{ scale: 0.95 }}
                            className='w-33 h-10.5 bg-[#2828FA] mr-2 rounded-xl text-[#FFFFFF] text-[12px] text-geist font-bold shadow-lg shadow-blue-100 dark:shadow-blue-900/20'
                        >
                            Get Started
                        </motion.button>
                    </NavLink>
                </div>
            </motion.div>
        </nav>
    );
};

export default Navbar;
