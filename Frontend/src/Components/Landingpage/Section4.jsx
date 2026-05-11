import React from 'react';
import { FaCheck } from "react-icons/fa";
import Cardd2 from '../../Images/cardd2.svg';
import wave from '../../Images/wave.svg';
import micc from '../../Images/micc.svg';
import { motion } from 'framer-motion';

/**
 * Section4 Component
 * Purpose: Features the automatic extraction of action items and tasks from recordings.
 */
const Section4 = () => {
    // --- RENDER ---
    return (
        <div className='mt-18 w-full text-geist h-auto overflow-hidden'>
            {/* MAIN CONTAINER */}
            <div className='flex flex-col justify-center items-center align-middle py-16 gap-10 lg:gap-20 md:pt-5 lg:pt-10 lg:flex-row'>
                
                {/* CONTENT SECTION */}
                <div className='w-full max-w-112.5 px-6 text-center lg:text-left '>
                    {/* HEADING AND DESCRIPTION */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className='lg:pt-4'
                    >
                        <h1 className='font-extrabold text-[32px] md:text-[40px] leading-tight text-gray-800 lg:mx-0'>Never Miss an Action Item</h1>
                        <p className='text-[16px] text-[#6B7280] mt-4 font-medium leading-relaxed'>Memo automatically extracts commitments, deadlines, and to-dos from your conversations turning follow-ups into a ready-to-use task list before the meeting even ends.</p>
                    </motion.div>
                    
                    {/* CHECKPOINTS */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-8'>
                        {[
                            "Your to-dos, already written.",
                            "Action items, delivered instantly.",
                            "Turn talk into tasks",
                            "Tasks extracted."
                        ].map((text, idx) => (
                            <motion.p 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="flex gap-3 items-center text-[12px] font-bold text-gray-700"
                            >
                                <span className="flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 rounded-full shrink-0">
                                    <FaCheck size={10} />
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
                        transition={{ delay: 0.7 }}
                        className='mt-10 flex justify-center lg:justify-start'
                    >
                        <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: "#1D1DFA" }}
                            whileTap={{ scale: 0.95 }}
                            className='bg-[#2828FA] text-[#FFFFFF] font-bold text-center px-8 h-14 rounded-2xl shadow-xl shadow-blue-100 transition-all'
                        >
                            Dive deeper
                        </motion.button>
                    </motion.div>
                </div>
                
                {/* IMAGE CONTAINER */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className='relative w-full max-w-150 px-4 h-100'
                >
                    <motion.img 
                        whileHover={{ y: -10 }}
                        className='relative w-full drop-shadow-2xl z-0' 
                        src={Cardd2} 
                        alt="img" 
                    />
                    <div className='absolute bottom-60 md:bottom-50 left-4 '>
                        <motion.img 
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className='relative' 
                            src={wave} 
                            alt="" 
                        />
                        <motion.img 
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className='absolute -bottom-2 left-1/2 -translate-x-1/2' 
                            src={micc} 
                            alt="" 
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Section4;
