import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { motion } from "framer-motion";

/**
 * StatsCards Component
 * Purpose: Displays summary statistics about recordings, duration, and pending tasks.
 */
const StatsCards = () => {

    // --- STATE AND HOOKS ---
    const [stats, setStats] = useState({
        totalRecordings: 0,
        totalDuration: 0,
        pendingTasks: 0,
        meetingsWithTasks: 0
    });


    // --- SIDE EFFECTS ---
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch recordings
                const recordingsResponse = await api.get('/recordings');
                const recordings = recordingsResponse.recordings;
                const totalRecordings = recordings.length;

                const totalDurationSeconds = recordings.reduce(
                    (acc, curr) => acc + (curr.duration || 0),
                    0
                );

                // Fetch general todos
                const todosResponse = await api.get('/todos');
                const pendingGeneralTodos = todosResponse.todos.filter(t => !t.completed).length;

                // Calculate pending tasks from recordings (AI generated todos)
                let meetingsWithTasks = 0;
                const pendingAiTodos = recordings.reduce((acc, rec) => {
                    const pending = (rec.todoList || []).filter(t => !t.completed).length;
                    if (pending > 0) meetingsWithTasks++;
                    return acc + pending;
                }, 0);

                setStats({
                    totalRecordings,
                    totalDuration: totalDurationSeconds,
                    pendingTasks: pendingGeneralTodos + pendingAiTodos,
                    meetingsWithTasks: meetingsWithTasks
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);


    // --- HELPERS ---
    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }

        return `${minutes}m ${seconds % 60}s`;
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };


    // --- RENDER ---
    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-5 mt-2"
        >

            {/* Total Recordings Card */}
            <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white dark:bg-gray-900 px-6 rounded-xl shadow-sm pb-5 border-2 border-transparent hover:border-blue-100 dark:hover:border-blue-900 hover:shadow-xl hover:shadow-blue-50/50 dark:hover:shadow-blue-900/10 transition-all duration-300"
            >
                <p className="text-sm pt-5 text-[#6B7280] dark:text-gray-400 text-[13px] font-bold uppercase tracking-widest">
                    TOTAL RECORDINGS
                </p>

                <h2 className="text-[28px] text-[#111827] dark:text-gray-100 font-extrabold mt-1">
                    {stats.totalRecordings}
                </h2>

                <p className="text-[12px] text-[#9CA3AF] dark:text-gray-500 font-medium">
                    Lifetime history
                </p>
            </motion.div>


            {/* Total Duration Card */}
            <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white dark:bg-gray-900 px-6 rounded-xl shadow-sm pb-5 border-2 border-transparent hover:border-blue-100 dark:hover:border-blue-900 hover:shadow-xl hover:shadow-blue-50/50 dark:hover:shadow-blue-900/10 transition-all duration-300"
            >
                <p className="text-sm pt-5 text-[#6B7280] dark:text-gray-400 text-[13px] font-bold uppercase tracking-widest">
                    TOTAL DURATION
                </p>

                <h2 className="text-[28px] text-[#111827] dark:text-gray-100 font-extrabold mt-1">
                    {formatDuration(stats.totalDuration)}
                </h2>

                <p className="text-[12px] text-[#9CA3AF] dark:text-gray-500 font-medium">
                    Across all sessions
                </p>
            </motion.div>


            {/* Pending Tasks Card */}
            <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white dark:bg-gray-900 px-6 rounded-xl shadow-sm pb-5 border-2 border-transparent hover:border-blue-100 dark:hover:border-blue-900 hover:shadow-xl hover:shadow-blue-50/50 dark:hover:shadow-blue-900/10 transition-all duration-300"
            >
                <p className="text-sm pt-5 text-[#6B7280] dark:text-gray-400 text-[13px] font-bold uppercase tracking-widest">
                    PENDING TASKS
                </p>

                <h2 className="text-[28px] text-[#111827] dark:text-gray-100 font-extrabold mt-1">
                    {stats.pendingTasks}
                </h2>

                <p className="text-[12px] text-[#9CA3AF] dark:text-gray-500 font-medium">
                    {stats.meetingsWithTasks === 1
                    ? "From 1 meeting"
                    : `From ${stats.meetingsWithTasks} meetings`}
                </p>
            </motion.div>

        </motion.div>
    );
};

export default StatsCards;
