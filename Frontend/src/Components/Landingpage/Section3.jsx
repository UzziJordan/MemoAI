import React from 'react';
import { FaCheck } from "react-icons/fa";
import Card1 from '../../Images/Card1.svg';
import { motion } from 'framer-motion';

/**
 * Section3 Component
 * Purpose: Highlights the time-saving benefits of using Memo AI for meeting summaries.
 */
const Section3 = () => {
    // --- RENDER ---
    return (
        <div className='bg-[#EFF2F9] mt-18  w-full text-geist h-auto overflow-hidden'>
            {/* MAIN CONTAINER */}
            <div className='flex flex-col-reverse justify-center items-center align-middle py-16 gap-10 lg:gap-20 md:pt-5 lg:pt-10 lg:flex-row'>
                {/* IMAGE SECTION */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className='w-full max-w-150 px-4 md:mt-2'
                >
                    <motion.img 
                        whileHover={{ scale: 1.02 }}
                        src={Card1} 
                        alt="img" 
                        className="w-full drop-shadow-2xl"
                    />
                </motion.div>
                
                {/* CONTENT SECTION */}
                <div className='w-full max-w-[450px] px-6 text-center lg:text-left '>
                    {/* BADGE */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className='h-10.5 w-25 mx-auto bg-[#2828FA]/10 rounded-3xl text-center items-center lg:mx-0 flex justify-center'
                    >
                        <p className='font-bold text-[14px] text-[#2828FA]'>WHY MEMO</p>
                    </motion.div>
                    
                    {/* HEADING AND DESCRIPTION */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className='lg:pt-6'
                    >
                        <h1 className='font-extrabold text-[32px] md:text-[40px] leading-tight text-gray-800 lg:mx-0'>Save Hours Every Week</h1>
                        <p className='text-[16px] text-[#6B7280] mt-4 font-medium leading-relaxed'>Stop relistening to hour-long recordings. Memo's AI delivers a concise 3 – 5 bullet summary in seconds, so you get the full picture without replaying a single second.</p>
                    </motion.div>
                    
                    {/* CHECKPOINTS */}
                    <div className="flex flex-col gap-3 mt-6">
                        {[
                            "Skip the playback. Keep the value.",
                            "Your time, reclaimed."
                        ].map((text, idx) => (
                            <motion.p 
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 + idx * 0.1 }}
                                className="flex gap-4 items-center justify-center lg:justify-start text-[15px] font-bold text-gray-700"
                            >
                                <span className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full shadow-sm">
                                    <FaCheck className="text-xs" />
                                </span>
                                {text}
                            </motion.p>
                        ))}
                    </div>
                    
                    {/* CTA BUTTON */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className='mt-10 flex justify-center lg:justify-start'
                    >
                        <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: "#1D1DFA" }}
                            whileTap={{ scale: 0.95 }}
                            className='bg-[#2828FA] text-[#FFFFFF] font-bold text-center px-8 h-14 rounded-2xl shadow-xl shadow-blue-100 transition-all'
                        >
                            Discover More
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Section3;
