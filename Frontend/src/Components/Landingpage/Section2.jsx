import React from 'react';
import line1 from '../../Images/line1.svg';
import line2 from '../../Images/line2.svg';
import step1 from '../../Images/step1.svg';
import step2 from '../../Images/step2.svg';
import step3 from '../../Images/step3.svg';
import { motion } from 'framer-motion';

/**
 * Section2 Component
 * Purpose: Explains the step-by-step process of how Memo AI works.
 */
const Section2 = () => {
    // Animation Variants
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const stepVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    // --- RENDER ---
    return (
        <div className='flex flex-col items-center gap-4 text-geist dark:text-gray-100 mt-8 md:mt-6 lg:mt-17.5 overflow-hidden transition-colors duration-300'>
            {/* HEADER SECTION */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className='h-8 w-31 bg-[#2828FA]/10 dark:bg-[#2828FA]/20 mt-6 rounded-2xl flex items-center justify-center'
            >
                <p className=' text-[#2828FA] text-[13px] font-bold text-center'>HOW IT WORKS</p>
            </motion.div>
            
            {/* INTRO SECTION */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className='w-85 pt-4.75 text-center items-center md:pt-3.25 md:w-150 lg:pt-4'
            >
                <p className='text-[32px] font-extrabold tracking-tight'>Everything you need from a meeting. <span className="text-[#2828FA]">Nothing you don't.</span></p>
                <p className='text-[16px] text-[#6B7280] dark:text-gray-400 w-66.5 mx-auto md:w-112.75 mt-2 font-medium'>Built for professionals who are tired of drowning in recordings and scribbled notes.</p>
            </motion.div>
            
            {/* CONTAINER */}
            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col gap-5 md:flex md:flex-col md:gap-10 lg:flex-row lg:gap-40 mt-20 pb-10"
            >
                {/* Record */}
                <motion.div variants={stepVariants} className="flex flex-col items-center text-center w-60 group">
                    <div className="h-8 w-24 bg-[#2828FA]/10 dark:bg-gray-800 rounded-2xl text-[#2828FA] font-bold flex items-center justify-center transition-colors group-hover:bg-[#2828FA] group-hover:text-white"> STEP - 01 </div>
                    <div className="pt-4 mb-4">
                        <p className="text-[#1F2937] dark:text-gray-200 text-[25px] font-extrabold group-hover:text-[#2828FA] transition-colors">Record</p>
                        <p className="text-[#6B7280] dark:text-gray-400 text-[16px] font-medium px-4"> Tap record during meetings, lectures, or interviews. </p>
                    </div>
                    <div className="hidden lg:block">
                        <img src={line1} alt="line" />
                    </div>
                    <motion.div 
                        whileHover={{ y: -10, rotate: -2 }}
                        className="bg-[#F5F5FD] dark:bg-gray-900 w-67.5 h-45 flex items-center justify-center rounded-3xl shadow-sm hover:shadow-xl hover:shadow-blue-50 dark:hover:shadow-black/40 transition-all duration-300"
                    >
                        <img className="w-30 drop-shadow-lg" src={step1} alt="img" />
                    </motion.div>
                </motion.div>
                
                {/* Transcribe */}
                <motion.div variants={stepVariants} className="flex flex-col items-center text-center w-60 group">
                    <div className="hidden lg:block">
                        <img src={line2} alt="line" />
                    </div>
                    <div className="h-8 w-24 bg-[#2828FA]/10 dark:bg-gray-800 rounded-2xl text-[#2828FA] font-bold flex items-center justify-center mt-5 transition-colors group-hover:bg-[#2828FA] group-hover:text-white"> STEP - 02 </div>
                    <div className="pt-4 mb-4">
                        <p className="text-[#1F2937] dark:text-gray-200 text-[25px] font-extrabold group-hover:text-[#2828FA] transition-colors">Transcribe</p>
                        <p className="text-[#6B7280] dark:text-gray-400 text-[16px] font-medium px-4"> Memo AI converts speech into accurate searchable text. </p>
                    </div>
                    <motion.div 
                        whileHover={{ y: -10 }}
                        className="bg-[#F5F5FD] dark:bg-gray-900 w-67.5 h-45 flex items-center justify-center mt-2 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-blue-50 dark:hover:shadow-black/40 transition-all duration-300"
                    >
                        <img className="w-30 drop-shadow-lg" src={step2} alt="img" />
                    </motion.div>
                </motion.div>
                
                {/* Summarize */}
                <motion.div variants={stepVariants} className="flex flex-col items-center text-center w-60 group">
                    <div className="h-8 w-24 bg-[#2828FA]/10 dark:bg-gray-800 rounded-2xl text-[#2828FA] font-bold flex items-center justify-center transition-colors group-hover:bg-[#2828FA] group-hover:text-white"> STEP - 03 </div>
                    <div className="pt-4 mb-4">
                        <p className="text-[#1F2937] dark:text-gray-200 text-[25px] font-extrabold group-hover:text-[#2828FA] transition-colors">Summarize</p>
                        <p className="text-[#6B7280] dark:text-gray-400 text-[16px] font-medium px-4"> Get smart summaries, key points and action items in seconds. </p>
                    </div>
                    <div className="hidden lg:block">
                        <img src={line1} alt="line" />
                    </div>
                    <motion.div 
                        whileHover={{ y: -10, rotate: 2 }}
                        className="bg-[#F5F5FD] dark:bg-gray-900 w-67.5 h-45 flex items-center justify-center rounded-3xl shadow-sm hover:shadow-xl hover:shadow-blue-50 dark:hover:shadow-black/40 transition-all duration-300"
                    >
                        <img className="w-30 drop-shadow-lg" src={step3} alt="img" />
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Section2;
