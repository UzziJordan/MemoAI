import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiSliders, FiPlus } from "react-icons/fi";
import Searchbar from '../../Components/Dashboard/Searchbar';
import RecordHistory from '../../Components/Dashboard/RecordHistory';
import FilterModal from "../../Components/Dashboard/FilterModal";
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/**
 * Library Component
 * Purpose: Provides a comprehensive view of all recordings with search and filtering capabilities.
 */
const Library = () => {
    // --- STATE AND HOOKS ---
    const [localSearch, setLocalSearch] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({ tags: [] });
    const { isDarkMode } = useTheme();

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    // --- RENDER ---
    return (
        <div className='text-geist pt-20 bg-[#FFFFFF] dark:bg-gray-950 h-full overflow-x-hidden transition-colors duration-300'>

            {/* GLOBAL SEARCH */}
            <Searchbar />

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto"
            >
                {/* HEADER SECTION */}
                <motion.div variants={itemVariants} className='text-black dark:text-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 md:px-12 py-8'>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Recordings Library</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Manage and search through your captured insights</p>
                    </div>

                    <Link to="/dashboard/recording">
                        <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: "#1D1DFA" }}
                            whileTap={{ scale: 0.95 }}
                            className='bg-[#2828FA] text-white items-center text-sm font-bold gap-3 flex py-3.5 px-6 rounded-2xl shadow-xl shadow-blue-100 dark:shadow-blue-900/20 transition-all'
                        >
                            <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                                <FiPlus size={16} />
                            </div>
                            <span>New Recording</span>
                        </motion.button>
                    </Link>
                </motion.div>

                {/* LOCAL SEARCH AND FILTER BAR */}
                <motion.div variants={itemVariants} className="w-full px-6 md:px-12 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 flex items-center bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-[20px] px-5 py-4 focus-within:border-blue-400 dark:focus-within:border-blue-800 focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:shadow-xl focus-within:shadow-blue-50/50 dark:focus-within:shadow-blue-900/10 transition-all duration-300">
                            <FiSearch className="text-gray-400 dark:text-gray-500 text-xl" />
                            <input
                                type="text"
                                placeholder="Search by title, transcript or summary keyword..."
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                className="bg-transparent outline-none w-full ml-4 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 font-medium"
                            />
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: isDarkMode ? "#1f2937" : "#F9FAFB" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowFilter(true)}
                            className={`p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center
                                ${filters.tags.length > 0 
                                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-md shadow-blue-100 dark:shadow-blue-900/20" 
                                    : "border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900"}`}
                        >
                            <FiSliders size={24} />
                            {filters.tags.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-950">
                                    {filters.tags.length}
                                </span>
                            )}
                        </motion.button>
                    </div>

                    {/* ACTIVE FILTERS CHIPS */}
                    <AnimatePresence>
                        {filters.tags.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex flex-wrap gap-2 mt-4"
                            >
                                {filters.tags.map(tag => (
                                    <motion.span 
                                        key={tag}
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-2 border border-blue-100 dark:border-blue-800"
                                    >
                                        {tag}
                                        <button onClick={() => setFilters({ tags: filters.tags.filter(t => t !== tag) })} className="hover:text-blue-800 dark:hover:text-blue-200">
                                            ×
                                        </button>
                                    </motion.span>
                                ))}
                                <button 
                                    onClick={() => setFilters({ tags: [] })}
                                    className="text-[11px] font-bold text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors uppercase tracking-widest ml-2"
                                >
                                    Clear all
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* RECORDINGS HISTORY LIST */}
                <motion.div variants={itemVariants} className='px-2 md:px-6'>
                    <RecordHistory
                        searchTerm={localSearch}
                        filters={filters}
                    />
                </motion.div>
            </motion.div>

            {/* FILTER MODAL */}
            <FilterModal
                isOpen={showFilter}
                onClose={() => setShowFilter(false)}
                onApply={(data) => setFilters(data)}
            />
        </div>
    );
};

export default Library;
