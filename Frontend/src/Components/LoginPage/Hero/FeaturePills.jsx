import React from 'react';
import { motion } from 'framer-motion';

/**
 * FeaturePills Component
 * Purpose: Displays a set of feature highlights in a pill-shaped UI element.
 */
const FeaturePills = () => {
    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.5 }
        }
    };

    const pillVariants = {
        hidden: { opacity: 0, scale: 0.8, x: -10 },
        visible: { opacity: 1, scale: 1, x: 0 }
    };

    const pills = [
        { label: "1-click recording", icon: "🎙️" },
        { label: "AI transcription", icon: "⚡" },
        { label: "Smart summaries", icon: "✦" }
    ];

    // --- RENDER ---
    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-3 mt-10 text-geist"
        >
            {pills.map((pill, idx) => (
                <motion.span 
                    key={idx}
                    variants={pillVariants}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)", borderColor: "rgba(255, 255, 255, 0.3)" }}
                    className="bg-[#FFFFFF]/7 border-2 border-[#FFFFFF]/10 text-[12px] font-bold px-4 py-2 rounded-full cursor-default transition-colors flex items-center gap-2 backdrop-blur-md shadow-lg shadow-black/5"
                >
                    <span className="text-[14px]">{pill.icon}</span>
                    <span className="tracking-tight uppercase">{pill.label}</span>
                </motion.span>
            ))}
        </motion.div>
    );
};

export default FeaturePills;
