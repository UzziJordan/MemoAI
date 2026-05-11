import React from 'react';
import { FaCheck } from "react-icons/fa";
import Card3 from '../../Images/Card3.svg';
import { motion } from 'framer-motion';

/**
 * Section5 Component
 * Purpose: Highlights the searchable transcripts feature, allowing users to find specific moments in recordings.
 */
const Section5 = () => {
    // --- RENDER ---
    return (
        <div className='bg-[#EFF2F9] mt-18 w-full text-geist h-auto overflow-hidden pb-16 lg:pb-0'>
            {/* MAIN CONTAINER */}
            <div className='flex flex-col-reverse justify-center items-center align-middle py-12 gap-10 lg:gap-20 md:pt-5 lg:pt-10 lg:flex-row'>
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
                        src={Card3} 
                        alt="img" 
                        className="w-full drop-shadow-2xl"
                    />
                </motion.div>
                
                {/* CONTENT SECTION */}
                <div className='w-full max-w-112.5 px-6 text-center lg:mx-0 lg:pt-3 lg:text-left '>
                    {/* HEADING AND DESCRIPTION */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className='lg:pt-4'
                    >
                        <h1 className='font-extrabold text-[32px] md:text-[40px] leading-tight text-gray-800 lg:mx-0 flex flex-wrap justify-center lg:justify-start gap-2'>
                            Searchable <span className='bg-[#2828FA] text-white px-3 rounded-xl transform -rotate-1'>Transcripts</span>
                        </h1>
                        <p className='text-[16px] text-[#6B7280] mt-6 font-medium leading-relaxed'>Every word is transcribed and indexed. Search across all your recordings by keyword, date, or speaker and jump straight to the exact moment that matters.</p>
                    </motion.div>
                    
                    {/* CHECKPOINTS */}
                    <div className="flex flex-col gap-4 mt-8 items-start max-w-sm mx-auto lg:ml-0 lg:max-w-none">
                        {[
                            "AI-Powered Summaries in Seconds",
                            "Action Items Extracted Automatically",
                            "Searchable Transcripts by Keyword",
                            "Speaker-Labeled Notes for Clarity"
                        ].map((text, idx) => (
                            <motion.p 
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 + idx * 0.1 }}
                                whileHover={{ x: 10, color: "#2828FA" }}
                                className="flex gap-4 text-[13px] font-bold text-gray-700 cursor-default transition-colors"
                            >
                                <span className="flex items-center justify-center w-6 h-6 border-[3px] border-gray-800 rounded-lg shrink-0">
                                    <FaCheck className="text-[10px]" />
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
                        transition={{ delay: 0.8 }}
                        className='mt-10 flex justify-center lg:justify-start'
                    >
                        <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: "#1D1DFA" }}
                            whileTap={{ scale: 0.95 }}
                            className='bg-[#2828FA] text-[#FFFFFF] font-bold text-center px-8 h-14 rounded-2xl shadow-xl shadow-blue-100 transition-all'
                        >
                            Explore Memo AI
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Section5;
