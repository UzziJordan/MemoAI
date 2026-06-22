import React, { useEffect, useState } from 'react';
import { FiCalendar, FiClock, FiZap, FiCheck, FiCpu, FiDatabase, FiRefreshCw, FiX } from "react-icons/fi";
import { api } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Summary Component
 * Purpose: Displays an AI-generated summary and key takeaways from the latest recording.
 */
const Summary = () => {
    // --- STATE AND HOOKS ---
    const [recording, setRecording] = useState(null);
    const [summaryPoints, setSummaryPoints] = useState([]);
    const [retrying, setRetrying] = useState(false);

    // --- SIDE EFFECTS ---
    useEffect(() => {
        const fetchRecording = async () => {
            const latest = localStorage.getItem('latestRecording');
            if (!latest) return;

            try {
                const parsed = JSON.parse(latest);
                const recordingId = parsed._id;

                const response = await api.get(`/recordings/${recordingId}`);
                const data = response.recording;
                setRecording(data);

                // Extract summary points
                if (data.summary && data.summary !== 'AI summary currently unavailable.') {
                    const points = data.summary
                        .split(/[.!?]/)
                        .filter(p => p.trim().length > 5);
                    setSummaryPoints(points);
                } else {
                    setSummaryPoints([]);
                }

                // If still processing, check again in 5 seconds
                if (data.status === 'processing') {
                    setTimeout(fetchRecording, 5000);
                }
            } catch (error) {
                console.error("Error fetching recording for summary:", error);
            }
        };

        fetchRecording();
    }, []);


    // --- HANDLERS ---
    const handleRetryAI = async () => {
        if (!recording?._id) return;
        
        try {
            setRetrying(true);
            await api.patch(`/recordings/${recording._id}/retry-ai`, {});
            setRecording({ ...recording, status: 'processing' });
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            console.error("Retry failed:", error);
            alert("Retry failed. Please try again later.");
        } finally {
            setRetrying(false);
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    // --- RENDER HELPERS ---
    if (!recording) {
        return (
            <div className="flex flex-col text-geist items-center justify-center h-96 text-gray-500">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="p-6 bg-gray-50 rounded-full text-gray-200">
                        <FiZap size={48} />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-gray-800">No summary available.</p>
                        <p className="text-sm font-medium mt-1">Select a recording to see the AI analysis.</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    const formatDuration = (seconds) => {
        if (!seconds) return "0 sec";
        const sec = Math.floor(seconds);
        const mins = Math.floor(sec / 60);
        const hrs = Math.floor(mins / 60);
        if (sec < 60) return `${sec} sec`;
        if (mins < 60) return `${mins} min`;
        return `${hrs}h ${mins % 60}m`;
    };

    const formatFullDate = (date) => {
        if (!date) return "Unknown date";
        return new Date(date).toLocaleString("en-GB", {
            weekday: "short", day: "2-digit", month: "short",
            hour: "2-digit", minute: "2-digit", hour12: false,
        });
    };


    // --- MAIN RENDER ---
    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8 text-geist pb-20 transition-colors duration-300"
        >
            {/* HEADER SECTION */}
            <motion.div 
                variants={itemVariants}
                className="bg-linear-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl shadow-blue-900/10 relative overflow-hidden"
            >
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <h2 className="font-black text-2xl text-white tracking-tight">
                            {recording.title}
                        </h2>
                        <span className="text-[11px] bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full font-black uppercase tracking-widest flex items-center gap-2 border border-white/10">
                            <span className="animate-pulse text-blue-300">✦</span> AI Verified
                        </span>
                    </div>
                    
                    <div className="text-[13px] text-blue-100 mt-4 flex items-center gap-4 flex-wrap font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-2">
                            <FiCalendar className="text-blue-300" />
                            {formatFullDate(recording.createdAt)}
                        </span>
                        <span className="w-1.5 h-1.5 bg-blue-400/50 rounded-full" />
                        <span className="flex items-center gap-2">
                            <FiClock className="text-blue-300" />
                            {formatDuration(recording.duration)}
                        </span>
                        <span className="w-1.5 h-1.5 bg-blue-400/50 rounded-full" />
                        <span>1 Speaker</span>
                    </div>                
                </div>

                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
            </motion.div>

            {/* KEY TAKEAWAYS SECTION */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-50 dark:border-gray-800 p-10 shadow-xl shadow-blue-900/5 dark:shadow-black/20 transition-all duration-300">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                        <FiZap size={20} />
                    </div>
                    <h3 className="font-black text-gray-800 dark:text-gray-100 text-xl tracking-tight transition-colors">Executive Summary</h3>
                </div>

                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {summaryPoints.length > 0 ? (
                            <div className="grid gap-6">
                                {summaryPoints.map((point, index) => (
                                    <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex gap-6 items-start group"
                                    >
                                        <div className="w-8 h-8 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 group-hover:bg-blue-600 group-hover:text-white rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all duration-300 shadow-sm">
                                            {index + 1}
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                            {point.trim()}.
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-10 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800"
                            >
                                {recording.status === 'processing' ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <motion.div 
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            className="w-8 h-8 border-4 border-blue-100 dark:border-gray-800 border-t-blue-600 rounded-full"
                                        />
                                        <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px]">AI is analyzing your memo...</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-gray-400 dark:text-gray-500 font-bold mb-6">No summary points could be extracted.</p>
                                        <motion.button 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleRetryAI}
                                            disabled={retrying}
                                            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-blue-100 dark:shadow-blue-900/20 transition-all"
                                        >
                                            {retrying ? "RETRIYING..." : <><FiRefreshCw /> RETRY AI ANALYSIS</>}
                                        </motion.button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* STATS AND DETAILS GRID */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-50 dark:border-gray-800 p-8 shadow-lg shadow-blue-900/5 dark:shadow-black/20 transition-all"
                >
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <FiCheck className="text-green-500" /> Highlights
                    </p>
                    
                    <div className="space-y-4">
                        <div className="flex gap-4 items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <p className="text-gray-700 dark:text-gray-300 font-bold transition-colors">Captured {formatDuration(recording.duration)} of high-fidelity audio.</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <p className="text-gray-700 dark:text-gray-300 font-bold transition-colors">Processed with Gemini 2.5 Flash logic.</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-50 dark:border-gray-800 p-8 shadow-lg shadow-blue-900/5 dark:shadow-black/20 transition-all"
                >
                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <FiCpu className="text-blue-500 dark:text-blue-400" /> Processing Stack
                    </p>
                    <div className="space-y-3 font-bold text-sm transition-colors">
                        <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                            <span className="text-gray-500 dark:text-gray-400">TRANSCRIPTION</span>
                            <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg text-[11px]">AssemblyAI</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                            <span className="text-gray-500 dark:text-gray-400">REASONING</span>
                            <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg text-[11px]">Gemini 2.5</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-500 dark:text-gray-400">DATABASE</span>
                            <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg text-[11px]">MongoDB Atlas</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Summary;
