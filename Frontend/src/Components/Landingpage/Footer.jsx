import React from 'react';
import insta from '../../Images/insta.svg';
import twitter from '../../Images/twitter.svg';
import tiktok from '../../Images/tiktok.svg';
import facebook from '../../Images/facebook.svg';
import { motion } from 'framer-motion';

/**
 * Footer Component
 * Purpose: Displays the site footer with branding, social links, and navigational links.
 */
const Footer = () => {
    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.8, 
                ease: "easeOut",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    // --- RENDER ---
    return (
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className='text-geist dark:text-gray-100 pb-20 transition-colors duration-300'
        >
            {/* MAIN CONTAINER */}
            <div className='flex-col px-5 lg:px-25'>
                {/* TOP SECTION: Brand and Links */}
                <div className='flex flex-col items-center pt-8 lg:items-start lg:flex-row justify-center gap-15 lg:gap-100 lg:pt-20'>
                    {/* BRAND INFO */}
                    <div className='text-[#000000] dark:text-gray-100 text-center lg:text-left'>
                        <h1 className='text-audiowide text-4xl tracking-tighter text-[#2828FA]'>MEMO AI</h1>
                        <p className='font-bold text-[10px] uppercase tracking-[0.3em] mt-1 text-gray-400 dark:text-gray-500'>Your meetings, summarized</p>
                        
                        {/* SOCIAL LINKS */}
                        <div className='flex gap-8 mt-8 justify-center lg:justify-start'>
                            {[insta, twitter, tiktok, facebook].map((icon, idx) => (
                                <motion.a 
                                    key={idx}
                                    href="#"
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all"
                                >
                                    <img src={icon} alt="Social icon" className="w-5 h-5 dark:invert" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* LINKS CONTAINER */}
                    <div className='flex gap-10 md:gap-20 lg:gap-25 text-[15px] text-[#2B2B2B] dark:text-gray-300 mt-10 lg:mt-0'>
                        {/* PRODUCT LINKS */}
                        <motion.div variants={itemVariants} className='flex flex-col gap-3'>
                            <h1 className='pb-2 font-black text-[#000000] dark:text-gray-100 uppercase tracking-widest text-xs'>Product</h1>
                            {['Features', 'Roadmap', 'Changelog', 'Download'].map(link => (
                                <motion.p key={link} whileHover={{ x: 5, color: "#2828FA" }} className="cursor-pointer transition-colors font-medium text-gray-500 dark:text-gray-400">{link}</motion.p>
                            ))}
                        </motion.div>

                        {/* COMPANY LINKS */}
                        <motion.div variants={itemVariants} className='flex flex-col gap-3'>
                            <h1 className='pb-2 font-black text-[#000000] dark:text-gray-100 uppercase tracking-widest text-xs'>Company</h1>
                            {['About', 'Blog', 'Careers', 'Contact'].map(link => (
                                <motion.p key={link} whileHover={{ x: 5, color: "#2828FA" }} className="cursor-pointer transition-colors font-medium text-gray-500 dark:text-gray-400">{link}</motion.p>
                            ))}
                        </motion.div>

                        {/* LEGAL LINKS */}
                        <motion.div variants={itemVariants} className='flex flex-col gap-3'>
                            <h1 className='pb-2 font-black text-[#000000] dark:text-gray-100 uppercase tracking-widest text-xs'>Legal</h1>
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(link => (
                                <motion.p key={link} whileHover={{ x: 5, color: "#2828FA" }} className="cursor-pointer transition-colors font-medium text-gray-500 dark:text-gray-400">{link}</motion.p>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* DIVIDER */}
                <motion.div 
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    className='h-px mt-24 w-full bg-gray-100 dark:bg-gray-800 origin-left'
                />

                {/* COPYRIGHT INFO */}
                <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
                    <p className='font-bold text-[#9CA3AF] text-[12px] uppercase tracking-widest'>© 2026 Memo AI. Built for better insights.</p>
                    <div className="flex gap-4 items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 tracking-widest uppercase">System Status: Operational</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Footer;
