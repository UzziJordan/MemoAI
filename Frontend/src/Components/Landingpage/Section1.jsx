import React from 'react';
import Phone from '../../Images/Phone.svg';
import imagep1 from '../../Images/imagep1.svg';
import imagep2 from '../../Images/imagep2.svg';
import imagep3 from '../../Images/imagep3.svg';
import { motion } from 'framer-motion';

/**
 * Section1 Component
 * Purpose: Hero section of the landing page featuring the main value proposition and CTA.
 */
const Section1 = () => {
    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "backOut" } }
    };

    // --- RENDER ---
    return (
        <div className='bg-[#EFF2F9] dark:bg-gray-950 text-geist dark:text-gray-100 pb-[48.28px] px-4 pt-6 flex flex-col justify-between md:px-33 md:pt-12 lg:px-[5vw] lg:pt-22 lg:flex-row overflow-hidden transition-colors duration-300'>
            {/* CONTENT CONTAINER */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className='flex flex-col justify-center lg:w-[50%]'
            >
                {/* BADGE */}
                <motion.div 
                    variants={itemVariants}
                    className='bg-[#E9E9FF] dark:bg-blue-900/30 w-60.5 h-8.25 text-[#2828FA] rounded-2xl text-center items-center align-middle flex justify-center'
                >
                    <p className='text-dm-sans font-extrabold text-[13px] tracking-tight'>• AI-POWERED MEETING NOTES</p>
                </motion.div>
                
                {/* HEADING */}
                <motion.p 
                    variants={itemVariants}
                    className='text-geist dark:text-gray-100 font-extrabold text-[50px] leading-tight mt-6 md:text-[65px] lg:text-[60px] lg:w-110.25'
                >
                    Your meetings <span className='text-[#2828FA] underline decoration-blue-200 dark:decoration-blue-900/50'>summarized</span>
                </motion.p>
                
                {/* DESCRIPTION */}
                <motion.div 
                    variants={itemVariants}
                    className='text-[#6B7280] dark:text-gray-400 text-[16px] w-79 pt-4 md:text-[18px] md:w-110 lg:text-[16px] lg:w-108'
                >
                    <p className="font-medium">Memo records your meetings, lectures, and interviews then instantly delivers AI-generated transcripts, smart summaries, and action items. </p>
                    <p className="mt-2 font-bold text-gray-800 dark:text-gray-200 tracking-tight">Stop relistening, Start doing.</p>
                </motion.div>
                
                {/* CTA BUTTON */}
                <motion.div 
                    variants={itemVariants}
                    className='pt-8 font-semibold'
                >
                    <motion.button 
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(40, 40, 250, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        className='bg-[#2828FA] text-[#FFFFFF] flex text-center items-center align-middle text-[17px] gap-2 px-6 py-2 rounded-2xl h-16 w-fit shadow-xl shadow-blue-100 dark:shadow-blue-900/20 transition-all'
                    >
                        <img className='w-6 h-6' src={Phone} alt="Phone" />
                        <span className="font-bold">Join the Waitlist</span>
                    </motion.button>
                </motion.div>
                
                {/* USER COUNT */}
                <motion.div 
                    variants={itemVariants}
                    className='flex text-center items-center gap-3 py-8 text-[12px] w-87'
                >
                    <div className="flex items-center">
                        {[
                            { color: "from-[#60A5FA] to-[#3B82F6]", label: "A" },
                            { color: "from-[#34D399] to-[#10B981]", label: "M" },
                            { color: "from-[#A78BFA] to-[#7C3AED]", label: "R" },
                            { color: "from-[#FB923C] to-[#EA580C]", label: "S" }
                        ].map((user, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 + idx * 0.1 }}
                                className={`${idx > 0 ? "-ml-3" : ""} w-9 h-9 rounded-full bg-linear-to-br ${user.color} flex items-center justify-center text-white font-bold border-2 border-white dark:border-gray-800 shadow-sm`}
                            >
                                {user.label}
                            </motion.div>
                        ))}
                    </div>
                    <p className='text-[#6B7280] dark:text-gray-400 font-medium'>Join <span className='text-[#1F2937] dark:text-gray-200 font-bold'>2,400+</span> early adopters today</p>
                </motion.div>
            </motion.div>
            
            {/* IMAGES CONTAINER */}
            <div className="flex justify-center items-center pt-10 lg:w-[50%] relative">
                <motion.img 
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.8 }}
                    whileHover={{ y: -10, rotate: -2 }}
                    src={imagep1} 
                    alt="phone" 
                    className="w-56 -mb-25 -mr-20 relative z-0 drop-shadow-2xl transition-all" 
                />
                <motion.img 
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.6 }}
                    whileHover={{ y: -10 }}
                    src={imagep2} 
                    alt="phone" 
                    className="w-64 z-10 drop-shadow-2xl transition-all" 
                />
                <motion.img 
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 1 }}
                    whileHover={{ y: -10, rotate: 2 }}
                    src={imagep3} 
                    alt="phone" 
                    className="w-56 -mb-25 -ml-20 z-20 drop-shadow-2xl transition-all" 
                />
            </div>
        </div>
    );
};

export default Section1;
