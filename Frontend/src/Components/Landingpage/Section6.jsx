import React from 'react';
import Card4 from '../../Images/card4.svg';
import universe from '../../Images/universe.svg';
import reliable from '../../Images/reliable.svg';
import { motion } from 'framer-motion';

/**
 * Section6 Component
 * Purpose: Showcases the versatility and reliability of Memo AI across different environments and scenarios.
 */
const Section6 = () => {
    // --- RENDER ---
    return (
        <div className='mt-18 w-full text-geist h-auto lg:h-125 overflow-hidden pb-16 lg:pb-0'>
            {/* MAIN CONTAINER */}
            <div className='flex flex-col justify-center items-center align-middle py-12 gap-10 lg:gap-20 md:pt-5 lg:pt-10 lg:flex-row'>
                {/* CONTENT SECTION */}
                <div className='w-full max-w-[450px] px-6 text-center lg:mx-0 lg:pt-3 lg:text-left '>
                    {/* HEADING AND DESCRIPTION */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className='lg:pt-4'
                    >
                        <h1 className='font-extrabold text-[32px] md:text-[40px] leading-tight text-gray-800 lg:mx-0'>Works Everywhere You Speak</h1>
                        <p className='text-[16px] text-[#6B7280] mt-6 font-medium leading-relaxed'>Meetings, lectures, interviews, brainstorms. Memo handles any audio scenario. Works offline, in noisy rooms, and across multiple speakers with speaker detection.</p>
                    </motion.div>
                    
                    {/* BUTTONS */}
                    <div className='flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-10'>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className='bg-[#2828FA] text-[#FFFFFF] text-center px-8 h-14 flex items-center justify-center rounded-2xl shadow-xl shadow-blue-100 cursor-default group'
                        >
                            <p className='flex gap-3 items-center font-bold'>
                                <motion.img 
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                    src={universe} 
                                    alt="Universal icon" 
                                />
                                <span>Universal</span>
                            </p>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className='bg-white border-2 border-gray-100 text-[#000000] text-center px-8 h-14 flex items-center justify-center rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-default group'
                        >
                            <p className='flex gap-3 items-center font-bold text-gray-700'>
                                <motion.img 
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    src={reliable} 
                                    alt="Reliable icon" 
                                />
                                <span>Reliable</span>
                            </p>
                        </motion.div>
                    </div>
                </div>
                
                {/* IMAGE SECTION */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className='w-full max-w-[600px] px-4'
                >
                    <motion.img 
                        whileHover={{ scale: 1.02, rotate: 1 }}
                        className='w-full drop-shadow-2xl' 
                        src={Card4} 
                        alt="Memo AI in action" 
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default Section6;
