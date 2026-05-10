import React from 'react';
import { motion } from 'framer-motion';

/**
 * MeetingCard Component
 * Purpose: Visual representation of a recorded meeting with progress indicators and status tags.
 */
const MeetingCard = () => {
    // Animation Variants
    const barVariants = {
        hidden: { width: 0 },
        visible: (width) => ({
            width: width,
            transition: { duration: 1, ease: "easeOut", delay: 0.8 }
        })
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            whileHover={{ y: -5, scale: 1.02, rotate: 0.5 }}
            className="w-80 md:w-100 rounded-[32px] border-[#FFFFFF]/10 border-2 mt-8 p-8 bg-[#FFFFFF]/5 text-geist backdrop-blur-md shadow-2xl transition-all duration-300"
        >
            {/* HEADER SECTION */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <motion.div 
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-2.5 h-2.5 bg-[#F87171] rounded-full shadow-[0_0_10px_#F87171]"
                    />
                    <p className="text-sm font-black text-white tracking-tight uppercase"> Q4 Strategy Meeting </p>
                </div>
                
                <p className="text-[#FFFFFF]/40 text-[11px] font-bold font-mono bg-white/5 px-2 py-1 rounded-md tracking-widest">14:22</p>
            </div>
            
            {/* PROGRESS VISUALIZATION */}
            <div className="space-y-3">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div variants={barVariants} custom="100%" initial="hidden" animate="visible" className="h-full bg-blue-400/40" />
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div variants={barVariants} custom="85%" initial="hidden" animate="visible" className="h-full bg-white/10" />
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div variants={barVariants} custom="92%" initial="hidden" animate="visible" className="h-full bg-white/10" />
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div variants={barVariants} custom="60%" initial="hidden" animate="visible" className="h-full bg-blue-400/40" />
                </div>
            </div>
            
            {/* STATUS TAGS */}
            <div className="flex flex-wrap gap-2.5 mt-8">
                <motion.div whileHover={{ scale: 1.05 }} className="px-3 py-1.5 rounded-xl bg-[#3B82F6]/20 border border-[#3B82F6]/30 text-[#93C5FD] text-[10px] font-black uppercase tracking-widest"> ✦ Summary ready </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="px-3 py-1.5 rounded-xl bg-[#3B82F6]/20 border border-[#3B82F6]/30 text-[#93C5FD] text-[10px] font-black uppercase tracking-widest"> ☑ 3 tasks </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest"> 47 min </motion.div>
            </div>
        </motion.div>
    );
};

export default MeetingCard;
