import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { FiSearch, FiShare2, FiBell, FiMic, FiClock, FiMenu } from "react-icons/fi";
import { api } from '../../lib/api';
import ShareModal from './ShareModal';
import NotificationDropdown from './NotificationDropdown';
import { motion, AnimatePresence } from "framer-motion";


// ================= COMPONENT =================
/**
 * Searchbar Component
 * Purpose: Provides global search functionality with a dropdown for quick results
 */
const Searchbar = () => {

    // ================= STATE =================
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    
    // UI Modals / Dropdowns
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    
    // Sidebar toggle state from DashboardLayout context
    const [isSidebarOpen, setIsSidebarOpen] = useOutletContext() || [false, () => {}];

    const location = useLocation();
    const navigate = useNavigate();
    const searchRef = useRef(null);
    
    // ================= ROUTE MAPPING =================
    const routeNames = {
        "/dashboard": "Home",
        "/dashboard/library": "Library",
        "/dashboard/transcript": "Transcript",
        "/dashboard/todo": "To-Do List",
        "/dashboard/settings": "Settings",
        "/dashboard/transcript/summary": "Summary",
    };

    const currentPage = routeNames[location.pathname] || "Home";


    // ================= EFFECTS =================

    // Fetch unread notifications count
    const fetchUnreadCount = async () => {
        try {
            const response = await api.get('/notifications');
            const unread = response.notifications.filter(n => !n.read).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error("Error fetching notifs:", error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    // Filter recordings based on search term
    useEffect(() => {
        const fetchResults = async () => {
            if (searchTerm.trim() === '') {
                setResults([]);
                return;
            }

            try {
                const response = await api.get('/recordings');
                
                const filtered = response.recordings.filter((rec) =>
                    rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (rec.transcript && rec.transcript.toLowerCase().includes(searchTerm.toLowerCase()))
                );

                setResults(filtered.slice(0, 5)); // Limit results to 5
            } catch (error) {
                console.error("Error searching recordings:", error);
            }
        };

        const timeoutId = setTimeout(fetchResults, 300); // Small debounce
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);


    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    // ================= HANDLERS =================

    const handleSelectResult = (rec) => {
        localStorage.setItem('latestRecording', JSON.stringify(rec));
        setSearchTerm('');
        setShowResults(false);
        navigate('/dashboard/transcript');
    };


    // ================= UI =================
    return (
        <div className='fixed top-0 left-0 md:left-auto w-full md:w-[85vw] h-18 bg-white border-b border-[#CCCCCC] z-30'>

            {/* ================= INNER CONTAINER ================= */}
            <div className='flex items-center justify-between px-4 md:px-10 h-full'>


                {/* ================= LEFT SIDE ================= */}
                <div className='flex items-center gap-3 md:gap-6 flex-1'>
                    
                    {/* MOBILE MENU TOGGLE */}
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 md:hidden text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <FiMenu size={24} />
                    </motion.button>

                    {/* PAGE TITLE */}
                    <div className='text-[16px] hidden sm:block md:w-28 font-bold text-[#111827] tracking-tight uppercase'>
                        {currentPage}
                    </div>


                    {/* SEARCH INPUT */}
                    <div className="w-full max-w-md relative" ref={searchRef}>

                        <motion.div 
                            initial={false}
                            animate={{ scale: showResults && searchTerm ? 1.02 : 1 }}
                            className="flex items-center bg-[#F9FAFB] border h-9 border-[#E5E7EB] gap-2 md:gap-3 px-3 md:px-5 rounded-full focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-blue-50 transition-all duration-300"
                        >
                            <FiSearch className="text-[#374957] text-lg md:text-xl" />

                            <input
                                type="text"
                                placeholder="Search your memos..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowResults(true);
                                }}
                                onFocus={() => setShowResults(true)}
                                className="bg-transparent text-[13px] w-full text-[#111827] placeholder-[#9CA3AF] outline-none font-medium"
                            />
                        </motion.div>


                        {/* ================= SEARCH DROPDOWN ================= */}
                        <AnimatePresence>
                            {showResults && searchTerm && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                    className="absolute top-11 left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-60"
                                >

                                    {results.length > 0 ? (

                                        <div className="py-2">

                                            {/* DROPDOWN HEADER */}
                                            <div className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                                Matching Recordings
                                            </div>

                                            {/* RESULT ITEMS */}
                                            {results.map((rec) => (
                                                <div
                                                    key={rec._id}
                                                    onClick={() => handleSelectResult(rec)}
                                                    className="px-5 py-4 hover:bg-blue-50/50 cursor-pointer flex items-center justify-between group transition-all duration-200"
                                                >

                                                    {/* LEFT CONTENT */}
                                                    <div className="flex items-center gap-4">

                                                        {/* ICON */}
                                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                                            <FiMic size={18} />
                                                        </div>

                                                        {/* TEXT */}
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-gray-800 truncate max-w-[200px] md:max-w-64 group-hover:text-blue-600 transition-colors">
                                                                {rec.title}
                                                            </p>

                                                            <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-0.5">
                                                                <FiClock className="text-[9px]" /> {new Date(rec.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>

                                                    </div>

                                                    {/* ACTION */}
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-blue-600 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                                        <span className="text-xl">›</span>
                                                    </div>

                                                </div>
                                            ))}
                                        </div>

                                    ) : (

                                        // NO RESULTS
                                        <div className="p-10 text-center flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-2">
                                                <FiSearch size={24} />
                                            </div>
                                            <p className="text-gray-500 font-bold text-sm">No matches found</p>
                                            <p className="text-gray-400 text-xs px-10">Try a different keyword or recording title</p>
                                        </div>

                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>


                {/* ================= RIGHT SIDE ================= */}
                <div className="flex gap-2 md:gap-3 ml-2 relative">

                    {/* SHARE BUTTON */}
                    <motion.button 
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsShareOpen(true)}
                        className="w-9 h-9 flex items-center justify-center border-2 border-[#E5E7EB] rounded-xl text-[#6B7280] hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                    >
                        <FiShare2 size={18} />
                    </motion.button>

                    {/* NOTIFICATION BUTTON */}
                    <div className="relative">
                        <motion.button 
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setIsNotifOpen(!isNotifOpen);
                                if (!isNotifOpen) setUnreadCount(0); // Soft clear
                            }}
                            className={`w-9 h-9 flex items-center justify-center border-2 border-[#E5E7EB] rounded-xl text-[#6B7280] transition-all duration-300 ${isNotifOpen ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' : 'hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50'}`}
                        >
                            <FiBell size={18} />
                            {unreadCount > 0 && !isNotifOpen && (
                                <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white"
                                >
                                    {unreadCount}
                                </motion.span>
                            )}
                        </motion.button>

                        <AnimatePresence>
                            {isNotifOpen && (
                                <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
                            )}
                        </AnimatePresence>
                    </div>

                </div>

            </div>

            {/* MODALS */}
            <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
        </div>
    );
};


// ================= EXPORT =================
export default Searchbar;
