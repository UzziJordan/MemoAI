import React from 'react';
import { motion } from 'framer-motion';

/**
 * Section7 Component
 * Purpose: Displays user testimonials and reactions to Memo AI.
 */
const Section7 = () => {
    // Animation Variants
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const testimonials = [
        {
            name: "Amara O",
            role: "Graduate Student",
            school: "Michigan University",
            text: "Absolute game-changer for my lectures. I used to spend Sunday afternoons re-watching two hours of recorded class, now I just read the summary in two minutes and move on."
        },
        {
            name: "David K",
            role: "Product Manager",
            school: "Tech Innovators",
            text: "Memo has completely transformed our team's follow-up process. We focus 100% on the conversation now, knowing our tasks are being captured perfectly in the background."
        },
        {
            name: "Sarah J",
            role: "UX Researcher",
            school: "Design Hub",
            text: "The searchable transcripts are incredible. I can find specific user insights across 50 different interviews in seconds. It's saved me literal days of synthesis work."
        }
    ];

    // --- RENDER ---
    return (
        <div className='bg-[#EFF2F9] h-auto px-5 md:pl-25 md:pr-10 flex flex-col pt-16 pb-20 text-geist overflow-hidden'>
            {/* HEADER SECTION */}
            <div className='w-full max-w-2xl text-center lg:text-start'>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className='w-40 h-10 mx-auto lg:mx-0 bg-[#D4D4FE] text-[#2828FA] rounded-4xl font-extrabold text-[14px] flex items-center justify-center'
                >
                    <p>EARLY REACTIONS</p>
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className='font-extrabold text-[#1F2937] text-[32px] md:text-[45px] leading-tight pt-4'
                >
                    What People Are Saying About <span className="text-[#2828FA]">Memo</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className='text-[#6B7280] text-[18px] mt-4 font-medium'
                >
                    Early testers have been putting Memo through its paces. Here's what they're telling us.
                </motion.p>
            </div>

            {/* TESTIMONIALS SECTION */}
            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className='flex flex-col lg:flex-row gap-8 mt-12 items-stretch'
            >
                {testimonials.map((t, idx) => (
                    <motion.div 
                        key={idx}
                        variants={cardVariants}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className={`${idx === 1 ? "bg-white shadow-xl shadow-blue-50" : "bg-transparent border border-[#D4D4FE]"} flex-1 rounded-[32px] p-8 transition-all duration-300 group`}
                    >
                        <div className='flex flex-col gap-0'>
                            <motion.p 
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 3, delay: idx * 0.5 }}
                                className='text-[62px] h-10 font-black text-[#2828FA]/20 mb-2 leading-none'
                            >
                                " 
                            </motion.p>
                            <p className='font-bold text-[18px] leading-relaxed text-[#1F2937] group-hover:text-blue-900 transition-colors'>
                                {t.text}
                            </p>
                        </div>
                        <div className='mt-8 flex items-center gap-4 border-t border-gray-100 pt-6'>
                            <div className='h-12 w-12 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center font-bold text-gray-400'>
                                {t.name[0]}
                            </div>
                            <div className='flex-col'>
                                <p className='text-[#2828FA] font-extrabold text-[16px]'>{t.name}</p>
                                <p className='text-[#6B7280] text-[12px] font-bold uppercase tracking-wider'>
                                    {t.role} at <span className='text-gray-400'>{t.school}</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default Section7;
