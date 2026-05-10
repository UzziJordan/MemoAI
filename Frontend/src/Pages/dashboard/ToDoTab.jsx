// ================= IMPORTS =================
import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiCircle, FiCalendar, FiPlus, FiClock, FiZap, FiArrowRight } from "react-icons/fi";
import { api } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

/**
 * ToDoTab Component
 * Purpose: Manages action items specifically associated with a particular recording.
 */
const ToDoTab = () => {

    // ================= STATE & HOOKS =================
    const [recording, setRecording] = useState(null);       // The recording object
    const [todos, setTodos] = useState([]);                 // List of tasks for this recording
    const navigate = useNavigate();                         // For page navigation


    // ================= SIDE EFFECTS =================
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
                setTodos(data.todoList || []);

                // If still processing, check again in 5 seconds
                if (data.status === 'processing') {
                    setTimeout(fetchRecording, 5000);
                }
            } catch (error) {
                console.error("Error fetching tasks for ToDoTab:", error);
            }
        };

        fetchRecording();
    }, []);


    // ================= HELPER FUNCTIONS =================

    // Formats seconds into "X min" or "Xh Ymin"
    const formatDuration = (seconds) => {
        if (!seconds) return "0 sec";
        const sec = Math.floor(seconds);
        const mins = Math.floor(sec / 60);
        const hrs = Math.floor(mins / 60);
        if (sec < 60) return `${sec} sec`;
        if (mins < 60) return `${mins} min`;
        const remainingMins = mins % 60;
        return `${hrs}h ${remainingMins}min`;
    };

    // Formats date into "Tue, 23 Mar"
    const formatFullDate = (date) => {
        if (!date) return "Unknown date";
        const d = new Date(date);
        return d.toLocaleString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    };

    // Filters for UI counts
    const pendingTodos = todos.filter(t => !t.completed);
    const completedTodos = todos.filter(t => t.completed);

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
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };


    // ================= EVENT HANDLERS =================

    // Toggles a task status and saves it to backend
    const toggleTodo = async (todoId) => {
        const newTodos = todos.map(todo => 
            todo._id === todoId ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(newTodos);

        // Update local state and localStorage
        const updatedRecording = { ...recording, todoList: newTodos };
        setRecording(updatedRecording);
        localStorage.setItem('latestRecording', JSON.stringify(updatedRecording));

        // Sync with backend
        if (recording._id) {
            try {
                const todo = newTodos.find(t => t._id === todoId);
                await api.patch(`/recordings/${recording._id}/todos/${todoId}`, {
                    completed: todo.completed
                });
            } catch (error) {
                console.error("Database sync failed:", error);
            }
        }
    };


    // ================= RENDER HELPERS =================
    if (!recording) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 font-geist">
                <p>No recording selected.</p>
                <p className="text-sm">Select a recording in the library to see action items.</p>
            </div>
        );
    }


    // ================= MAIN UI RENDER =================
    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8 text-geist font-geist pb-20"
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
                            <FiZap size={10} className="text-blue-300" /> Action Items
                        </span>
                    </div>

                    <div className="text-[13px] text-blue-100 mt-4 flex items-center gap-4 flex-wrap font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-2">
                            <FiCalendar className="text-blue-300" />
                            {formatFullDate(recording.createdAt)}
                        </span>
                        <span className="w-1.5 h-1.5 bg-blue-400/50 rounded-full" />
                        <span className="text-blue-50 font-black">
                            {completedTodos.length} / {todos.length} TASKS DONE
                        </span>
                    </div>                
                </div>
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
            </motion.div>

            {/* PENDING TASKS SECTION */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-orange-400 rounded-full" />
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Required Actions</h3>
                </div>

                <LayoutGroup>
                    <div className="grid gap-3">
                        <AnimatePresence mode="popLayout">
                            {pendingTodos.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-3xl p-12 text-center text-gray-400"
                                >
                                    <p className="text-sm font-bold">All caught up! No pending tasks.</p>
                                    <p className="text-[10px] uppercase font-black tracking-widest mt-2">Nice work!</p>
                                </motion.div>
                            ) : (
                                pendingTodos.map((todo) => (
                                    <motion.div 
                                        layout
                                        key={todo._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        onClick={() => toggleTodo(todo._id)}
                                        className="bg-white border-2 border-gray-50 rounded-2xl p-6 flex items-center gap-6 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all cursor-pointer group"
                                    >
                                        <div className="text-2xl text-gray-200 group-hover:text-blue-600 transition-colors">
                                            <FiCircle />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-800 font-bold leading-tight">{todo.task || todo.text}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg font-black uppercase text-[9px] tracking-wider border border-indigo-100">AI Identified</span>
                                                <span className="flex items-center gap-1.5 italic text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                                    <FiCalendar size={10} className="text-blue-500" /> ASAP
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-blue-600 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                            <FiArrowRight size={20} />
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </LayoutGroup>
            </div>

            {/* COMPLETED TASKS SECTION */}
            <div className="space-y-4 pt-4 pb-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-green-500 rounded-full" />
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Finalized</h3>
                </div>

                <LayoutGroup>
                    <div className="grid gap-3">
                        <AnimatePresence mode="popLayout">
                            {completedTodos.map((todo) => (
                                <motion.div 
                                    layout
                                    key={todo._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.6 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => toggleTodo(todo._id)}
                                    className="bg-white/50 border-2 border-transparent rounded-2xl p-6 flex items-center gap-6 cursor-pointer hover:opacity-100 transition-all group"
                                >
                                    <div className="text-2xl text-green-500">
                                        <FiCheckCircle />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-500 font-bold line-through leading-tight">{todo.task || todo.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </LayoutGroup>

                <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: "#F9FAFB", borderColor: "#DBEAFE" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/dashboard/todo")} 
                    className="w-full mt-8 py-5 border-2 border-dashed border-gray-100 rounded-3xl text-gray-300 font-black uppercase tracking-[0.2em] text-[11px] hover:text-blue-600 transition-all flex items-center justify-center gap-3"
                >
                    <FiPlus size={18} /> Add Manual Task
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ToDoTab;