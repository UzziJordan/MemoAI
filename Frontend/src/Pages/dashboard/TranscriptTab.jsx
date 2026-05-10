import React, { useEffect, useState, useRef } from 'react';
import { FiSearch, FiEdit, FiShare2, FiCalendar, FiClock, FiVolume2, FiMoreVertical, FiZap, FiX, FiArrowRight } from "react-icons/fi";
import wavve from '../../Images/wavve.svg';
import playi from '../../Images/frplay.svg';
import pausei from '../../Images/frpause.svg'
import { api } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

// Icons for Share Modal
import audioi from '../../Images/audio.svg';
import linkk from '../../Images/linkk.svg';
import pdf from '../../Images/pdf.svg';
import summaryi from '../../Images/summary.svg';
import transcripti from '../../Images/transcript.svg';

/**
 * TranscriptTab Component
 * Displays the full transcript, media player, and sharing options for a recording.
 */
const TranscriptTab = () => {

    // ================= STATE & REFS =================
    const [recording, setRecording] = useState(null);       // Current recording data
    const [isPlaying, setIsPlaying] = useState(false);       // Playback state
    const [currentTime, setCurrentTime] = useState(0);       // Current audio time
    const [showShareModal, setShowShareModal] = useState(false); // Modal visibility
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [loading, setLoading] = useState(true);

    const audioRef = useRef(null); // Reference to the HTML5 audio element


    // ================= SIDE EFFECTS =================
    useEffect(() => {
        const fetchRecording = async () => {
            const latest = localStorage.getItem('latestRecording');
            if (!latest) {
                setLoading(false);
                return;
            }

            try {
                const parsed = JSON.parse(latest);
                const recordingId = parsed._id;

                const response = await api.get(`/recordings/${recordingId}`);
                setRecording(response.recording);
                setNewTitle(response.recording.title);

                // If still processing, check again in 5 seconds
                if (response.recording.status === 'processing') {
                    setTimeout(fetchRecording, 5000);
                }
            } catch (error) {
                console.error("Error fetching recording:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecording();
    }, []);


    // ================= HELPER FUNCTIONS =================
    
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
        const d = new Date(date);
        return d.toLocaleString("en-GB", {
            weekday: "short", day: "2-digit", month: "short",
            hour: "2-digit", minute: "2-digit", hour12: false,
        });
    };

    const formatTimeShort = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate playback progress percentage
    const progress = recording?.duration > 0 ? (currentTime / recording.duration) * 100 : 0;

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };


    // ================= EVENT HANDLERS =================

    const togglePlayback = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const handleRename = async () => {
        if (!recording || !newTitle.trim()) return;
        try {
            const response = await api.patch(`/recordings/${recording._id}`, {
                title: newTitle.trim()
            });
            const updatedRecording = response.recording;
            setRecording(updatedRecording);
            localStorage.setItem('latestRecording', JSON.stringify(updatedRecording));
            setShowRenameModal(false);
        } catch (error) {
            console.error("Error renaming:", error);
            alert("Failed to rename recording.");
        }
    };


    // ================= RENDER HELPERS =================
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4 text-geist">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full"
                />
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Loading capture...</p>
            </div>
        );
    }

    if (!recording) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500 font-geist">
                <div className="p-6 bg-gray-50 rounded-full text-gray-200 mb-4">
                    <FiSearch size={48} />
                </div>
                <p className="font-bold text-gray-800">No recording selected.</p>
                <p className="text-sm font-medium">Please select a memo from your library.</p>
            </div>
        );
    }


    // ================= MAIN UI RENDER =================
    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mx-0 gap-6 pb-20 font-geist"
        >

            {/* Hidden Audio Engine */}
            <audio
                ref={audioRef}
                src={recording.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
            />

            {/* TOP HEADER BAR */}
            <motion.div variants={itemVariants} className="bg-white px-8 py-6 rounded-3xl flex flex-col border-2 border-gray-50 md:flex-row justify-between items-start md:items-center gap-6 shadow-xl shadow-blue-900/5">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                        {recording.title}
                    </h1>
                    <div className="text-[13px] text-gray-400 mt-2 flex items-center gap-4 flex-wrap font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                            <FiCalendar className="text-blue-500" />
                            <span>{formatFullDate(recording.createdAt)}</span>
                        </div>
                        <span className="w-1 h-1 bg-gray-200 rounded-full" />
                        <div className="flex items-center gap-2">
                            <FiClock className="text-blue-500" />
                            <span>{formatDuration(recording.duration)}</span>
                        </div>
                        <span className="w-1 h-1 bg-gray-200 rounded-full" />
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-[10px]">1 SPEAKER</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <motion.button 
                        whileHover={{ scale: 1.05, backgroundColor: "#F9FAFB" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowRenameModal(true)} 
                        className="flex-1 md:flex-none flex items-center justify-center gap-2.5 px-6 py-3 border-2 border-gray-100 rounded-2xl text-sm text-gray-600 transition-all font-black uppercase tracking-widest"
                    >
                        <FiEdit size={16} /> Edit
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.05, backgroundColor: "#1D1DFA" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowShareModal(true)} 
                        className="flex-1 md:flex-none flex items-center justify-center gap-2.5 px-6 py-3 bg-[#2828FA] text-white rounded-2xl text-sm transition-all shadow-xl shadow-blue-100 font-black uppercase tracking-widest"
                    >
                        <FiShare2 size={16} /> Share
                    </motion.button>
                </div>
            </motion.div>

            <div className='mt-8 flex flex-col lg:flex-row gap-8'>

                {/* LEFT PLAYER PANEL */}
                <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 border-2 border-gray-50 w-full lg:w-96 h-fit shadow-xl shadow-blue-900/5">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Now Playing</p>
                            <h3 className="font-black text-gray-800 tracking-tight truncate w-48">{recording.title}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <FiVolume2 size={18} />
                        </div>
                    </div>

                    <div className='my-8 opacity-40 group cursor-pointer relative'>
                        <img src={wavve} alt="Waveform" className="w-full h-12 object-cover" />
                        <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 to-transparent w-full h-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className='bg-gray-50 rounded-3xl p-6 border border-gray-100'>
                        <div className='flex justify-between items-center mb-6'>
                            <div className='flex items-center gap-4'>
                                <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={togglePlayback} 
                                    className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100 group"
                                >
                                    {isPlaying ? 
                                        <img src={pausei} alt="Pause" className="w-4 h-4 brightness-200" /> : 
                                        <img src={playi} alt="Play" className="w-4 h-4 brightness-200 ml-0.5" />
                                    }
                                </motion.button>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</p>
                                    <p className="text-sm font-black font-mono text-gray-800">
                                        {formatTimeShort(currentTime)} <span className="text-gray-300 mx-1">/</span> {formatTimeShort(recording.duration)}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white px-3 py-1 rounded-lg text-[10px] font-black text-blue-600 border border-blue-50 shadow-sm">1.0X</div>
                        </div>

                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div 
                                animate={{ width: `${progress}%` }}
                                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                                className="h-full bg-blue-600 rounded-full" 
                            />
                        </div>
                    </div>

                    <div className="mt-10">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Identified Speakers</p>
                        <div className='flex justify-between items-center p-4 bg-blue-50/50 rounded-2xl border border-blue-50'>
                            <div className='flex items-center gap-4'>
                                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-blue-100">ME</div>
                                <div>
                                    <p className="text-sm font-black text-gray-800">Host (You)</p>
                                    <p className="text-[10px] text-blue-400 font-bold uppercase">98% confidence</p>
                                </div>
                            </div>
                            <FiMoreVertical className="text-gray-300" />
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT TRANSCRIPT PANEL */}
                <motion.div variants={itemVariants} className="bg-white rounded-[32px] border-2 border-gray-50 flex-1 min-h-[500px] shadow-xl shadow-blue-900/5 overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-gray-50/30">
                        <div>
                            <h3 className="text-xl font-black text-gray-800 tracking-tight">Full Transcript</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Word-for-word capture</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input 
                                    placeholder="Search transcript..." 
                                    className="bg-white border-2 border-gray-100 text-sm font-bold pl-11 pr-4 py-2.5 rounded-xl focus:border-blue-400 focus:outline-none transition-all w-full sm:w-48" 
                                />
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    navigator.clipboard.writeText(recording.transcript);
                                    alert("Transcript copied!");
                                }} 
                                className="px-5 py-2.5 bg-white border-2 border-gray-100 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:border-blue-100 hover:text-blue-600 transition-all shadow-sm"
                            >
                                Copy All
                            </motion.button>
                        </div>
                    </div>

                    <div className="p-10 flex-1 bg-white">
                        <AnimatePresence mode="wait">
                            {recording.transcript ? (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-10"
                                >
                                    <div className="relative pl-8 border-l-4 border-blue-50">
                                        <div className="absolute -left-[10px] top-0 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-sm" />
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">Me (00:00)</p>
                                        <p className="text-gray-700 text-lg font-medium leading-relaxed whitespace-pre-wrap selection:bg-blue-100 selection:text-blue-900">
                                            {recording.transcript}
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                    <motion.div 
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="p-6 bg-blue-50 rounded-full text-blue-200 mb-4"
                                    >
                                        <FiZap size={40} />
                                    </motion.div>
                                    <p className="text-gray-400 font-bold">Transcription is in progress...</p>
                                    <p className="text-[10px] text-gray-300 uppercase font-black tracking-widest mt-2">Checking every 5 seconds</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {showShareModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowShareModal(false)}
                            className="absolute inset-0 bg-black/70 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl relative z-10 p-10"
                        >
                            <div className='flex justify-between items-center mb-8'>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Export Memo</h2>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Select your preferred format</p>
                                </div>
                                <button onClick={() => setShowShareModal(false)} className="p-3 bg-gray-50 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <FiX size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { name: 'Download Audio', desc: 'High-quality MP3 file', icon: audioi, action: () => {const link = document.createElement('a'); link.href = recording.audioUrl; link.download = recording.title; link.click();} },
                                    { name: 'Executive Summary', desc: 'AI-generated bullet points', icon: summaryi, action: () => {navigator.clipboard.writeText(recording.summary); alert("Summary copied!");} },
                                    { name: 'Research PDF', desc: 'Full transcript + summary', icon: pdf, action: () => {} },
                                    { name: 'Raw Transcript', desc: 'Clean text (.txt) file', icon: transcripti, action: () => {} }
                                ].map((item, idx) => (
                                    <motion.div 
                                        key={idx}
                                        whileHover={{ x: 10, backgroundColor: "#F9FAFB" }}
                                        onClick={item.action}
                                        className="flex items-center justify-between p-4 border-2 border-gray-50 rounded-3xl cursor-pointer transition-colors"
                                    >
                                        <div className='flex gap-5 items-center'>
                                            <div className='p-3 rounded-2xl bg-blue-50'>
                                                <img src={item.icon} alt="" className='w-6 h-6' />
                                            </div>
                                            <div>
                                                <p className="text-gray-800 font-black text-sm tracking-tight">{item.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.desc}</p>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm">
                                            <FiArrowRight size={14} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showRenameModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowRenameModal(false)}
                            className="absolute inset-0 bg-black/70 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative z-10"
                        >
                            <div className="p-8 border-b border-gray-100">
                                <h2 className="text-xl font-black text-gray-800 tracking-tight">Rename Memo</h2>
                            </div>
                            <div className="p-8">
                                <input 
                                    autoFocus
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold transition-all"
                                />
                            </div>
                            <div className="p-8 bg-gray-50 flex gap-4">
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowRenameModal(false)} className="flex-1 py-4 bg-white border-2 border-gray-100 rounded-2xl font-black uppercase text-[11px] tracking-widest text-gray-400">Cancel</motion.button>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleRename} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-blue-100">Save</motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TranscriptTab;
