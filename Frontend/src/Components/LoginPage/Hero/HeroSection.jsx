import React from 'react';
import { NavLink } from 'react-router-dom';
import FeaturePills from "./FeaturePills";
import MeetingCard from "./MeetingCard";
import { motion } from 'framer-motion';

/**
 * HeroSection Component
 * Purpose: Main informational section on the login page showcasing the product's value proposition.
 */
const HeroSection = () => {
    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    // --- RENDER ---
    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:w-1/2 w-full bg-[#24426A] md:px-40 lg:px-20 text-geist text-[#FFFFFF] flex flex-col justify-center lg:justify-normal px-5 py-17.5 overflow-hidden"
        >
            {/* LOGO SECTION */}
            <motion.div variants={itemVariants}>
                <NavLink to="/">
                    <motion.h1 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-[30px] font-bold text-audiowide tracking-tighter"
                    > 
                        MEMO <span className="text-[#93C5FD]/50">AI</span>
                    </motion.h1>
                </NavLink>
            </motion.div>
            
            {/* BADGE SECTION */}
            <motion.div 
                variants={itemVariants}
                className="bg-[#FFFFFF]/8 border-[#FFFFFF]/12 text-[#FFFFFF]/70 flex gap-3 h-9 w-fit border-2 text-[11px] font-black uppercase tracking-widest py-2 items-center px-5 mt-10 rounded-full backdrop-blur-sm"
            >
                <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className='bg-[#4ADE80] h-2 w-2 rounded-full shadow-[0_0_8px_#4ADE80]'
                />
                AI-powered • No manual note-taking
            </motion.div>
            
            {/* HEADING SECTION */}
            <motion.h2 variants={itemVariants} className="text-[52px] font-extrabold text-white leading-tight mt-8 tracking-tighter">
                Your meetings, <br />
                <span className="italic text-[#93C5FD] font-black underline decoration-[#93C5FD]/30 underline-offset-8"> finally remembered. </span>
            </motion.h2>
            
            {/* DESCRIPTION SECTION */}
            <motion.p variants={itemVariants} className="text-[#FFFFFF]/80 text-[17px] font-medium max-w-lg mt-6 leading-relaxed">
                Record any conversation. Memo transcribes it, extracts key decisions, and turns action items into tasks automatically.
            </motion.p>
            
            {/* FEATURE HIGHLIGHTS */}
            <FeaturePills />
            
            {/* INTERACTIVE PREVIEW CARD */}
            <motion.div variants={itemVariants}>
                <MeetingCard />
            </motion.div>
            
            {/* SOCIAL PROOF SECTION */}
            <motion.div variants={itemVariants} className='flex flex-row gap-5 mt-10 items-center'>
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
                            transition={{ delay: 1.5 + idx * 0.1 }}
                            className={`${idx > 0 ? "-ml-3" : ""} w-9 h-9 rounded-full bg-linear-to-br ${user.color} flex items-center justify-center text-white font-black border-2 border-[#24426A] shadow-lg`}
                        > 
                            {user.label}
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-0.5">
                    <p className="text-[#FBBF24] tracking-widest text-sm">★★★★★</p>
                    <p className="text-[12px] font-bold uppercase tracking-widest text-[#FFFFFF]/45">
                        Trusted by <span className='text-[#FFFFFF]/90'> 12,000+ teams </span>
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default HeroSection;
