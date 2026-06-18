import React, { useState, useEffect } from 'react';
import Searchbar from '../../Components/Dashboard/Searchbar';
import { FiPlus, FiTrash2, FiCheckCircle, FiCircle, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { api } from '../../lib/api';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/**
 * ToDoList Component
 * Purpose: Manages a general list of tasks for the user, with persistence and progress tracking.
 */
const ToDoList = () => {

    // ================= STATE & HOOKS =================
    const [tasks, setTasks] = useState([]);                 
    const [loading, setLoading] = useState(true);           
    const [showInput, setShowInput] = useState(false);      
    const [newTask, setNewTask] = useState("");             
    const { isDarkMode } = useTheme();


    // ================= SIDE EFFECTS =================

    // Fetch user-specific tasks from backend on mount
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await api.get('/todos');
                setTasks(response.todos || []);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);


    // ================= LOGIC & FILTERING =================

    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const pendingTasks = safeTasks.filter(t => !t.completed);
    const completedTasks = safeTasks.filter(t => t.completed);

    // Calculate weekly progress (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const completedThisWeek = completedTasks.filter(task =>
        new Date(task.createdAt) >= sevenDaysAgo
    ).length;

    const weeklyGoal = 8;
    const progressPercent = Math.min((completedThisWeek / weeklyGoal) * 100, 100);


    // ================= EVENT HANDLERS =================

    // Create a new task in backend
    const handleAddTask = async () => {
        if (!newTask.trim()) return;

        try {
            const taskData = {
                text: newTask,
                completed: false
            };

            const response = await api.post('/todos', taskData);

            setTasks([response.todo, ...safeTasks]);
            setNewTask("");
            setShowInput(false);
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Failed to add task.");
        }
    };

    // Toggle completion status in backend
    const toggleTask = async (id) => {
        try {
            const taskToToggle = safeTasks.find(t => t._id === id);
            const response = await api.patch(`/todos/${id}`, {
                completed: !taskToToggle.completed
            });

            setTasks(safeTasks.map(task => task._id === id ? response.todo : task));
        } catch (error) {
            console.error("Error toggling task:", error);
        }
    };

    // Remove task from backend
    const handleDeleteTask = async (id) => {
        if (!window.confirm("Delete this task?")) return;

        try {
            await api.delete(`/todos/${id}`);
            setTasks(safeTasks.filter(t => t._id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task.");
        }
    };

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
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
    };


    // ================= MAIN UI RENDER =================
    return (
        <div className='text-geist pt-20 font-geist min-h-screen bg-gray-50/30 dark:bg-gray-950 transition-colors duration-300'>

            <Searchbar />

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="pt-10 px-6 md:px-18 max-w-5xl mx-auto"
            >

                {/* HEADER & COUNTERS */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight transition-colors">Focus & Tasks</h1>
                        {loading ? (
                            <div className="flex items-center gap-2 mt-2">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-blue-100 dark:border-gray-800 border-t-blue-600 rounded-full" />
                                <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">Syncing items...</p>
                            </div>
                        ) : (
                            <div className="flex gap-4 mt-2">
                                <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100 dark:border-orange-800 transition-colors">{pendingTasks.length} PENDING</span>
                                <span className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 dark:border-green-800 transition-colors">{completedTasks.length} DONE</span>
                            </div>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#1D1DFA" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowInput(!showInput)}
                        className="bg-[#2828FA] text-white px-6 py-3.5 rounded-2xl font-bold shadow-xl shadow-blue-100 dark:shadow-blue-900/40 transition-all flex items-center gap-3"
                    >
                        <FiPlus size={20} /> ADD NEW TASK
                    </motion.button>
                </motion.div>

                {/* TASK INPUT AREA */}
                <AnimatePresence>
                    {showInput && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="flex gap-3 bg-white dark:bg-gray-900 p-2 rounded-3xl border-2 border-blue-100 dark:border-blue-900 shadow-xl shadow-blue-900/5 dark:shadow-black/20">
                                <input
                                    autoFocus
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    className="flex-1 px-6 py-4 bg-transparent rounded-2xl outline-none font-bold text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600"
                                    placeholder="What needs to be done today?"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                                />
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleAddTask} 
                                    className="bg-[#2828FA] text-white px-8 rounded-2xl font-black uppercase tracking-widest text-xs"
                                >
                                    Confirm
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* PROGRESS BAR */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 border-2 border-gray-50 dark:border-gray-800 rounded-4xl p-8 mt-8 shadow-xl shadow-blue-900/5 dark:shadow-black/20 transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">Weekly Momentum</p>
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-200 transition-colors">You've finished {completedThisWeek} tasks this week</p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tighter transition-colors">{Math.round(progressPercent)}%</span>
                        </div>
                    </div>
                    <div className="w-full h-3 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full"
                        />
                    </div>
                </motion.div>

                {/* TASKS CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 pb-20">

                    {/* PENDING LIST */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1.5 h-6 bg-orange-400 rounded-full" />
                            <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Active Pipeline</h3>
                        </div>

                        <LayoutGroup>
                            <div className="space-y-3">
                                {loading ? (
                                    <div className="p-12 text-center text-gray-300 dark:text-gray-600 font-bold uppercase tracking-widest text-[10px]">Syncing...</div>
                                ) : pendingTasks.length === 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-gray-50/50 dark:bg-gray-900/50 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl p-12 text-center"
                                    >
                                        <p className="text-gray-400 dark:text-gray-500 font-bold text-sm transition-colors">Nothing pending.</p>
                                        <p className="text-gray-300 dark:text-gray-600 text-[10px] uppercase font-black tracking-widest mt-2 transition-colors">Enjoy your free time!</p>
                                    </motion.div>
                                ) : pendingTasks.map(task => (
                                    <motion.div 
                                        layout
                                        key={task._id} 
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        whileHover={{ x: 5, borderColor: isDarkMode ? "#1e3a8a" : "#DBEAFE" }}
                                        className="bg-white dark:bg-gray-900 border-2 border-gray-50 dark:border-gray-800 rounded-2xl p-5 flex justify-between items-center shadow-sm hover:shadow-lg hover:shadow-blue-900/5 dark:hover:shadow-black/20 transition-all group"
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            <button 
                                                onClick={() => toggleTask(task._id)}
                                                className="mt-1 text-gray-300 dark:text-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                            >
                                                <FiCircle size={22} />
                                            </button>
                                            <p className="text-gray-800 dark:text-gray-100 font-bold leading-tight pt-0.5 transition-colors">{task.text}</p>
                                        </div>
                                        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleDeleteTask(task._id)} 
                                                className="p-2 text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </LayoutGroup>
                    </div>

                    {/* COMPLETED LIST */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-1.5 h-6 bg-green-500 rounded-full" />
                            <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Completed</h3>
                        </div>

                        <LayoutGroup>
                            <div className="space-y-3">
                                {completedTasks.map(task => (
                                    <motion.div 
                                        layout
                                        key={task._id} 
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="bg-white/50 dark:bg-gray-900/50 border-2 border-transparent rounded-2xl p-5 flex justify-between items-center opacity-70 hover:opacity-100 transition-all group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <button 
                                                onClick={() => toggleTask(task._id)}
                                                className="mt-1 text-green-500 dark:text-green-400"
                                            >
                                                <FiCheckCircle size={22} />
                                            </button>
                                            <p className="line-through text-gray-400 dark:text-gray-600 font-bold leading-tight pt-0.5 transition-colors">{task.text}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteTask(task._id)} 
                                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 dark:text-gray-700 hover:text-red-500 transition-all"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </LayoutGroup>
                    </div>

                </div>

            </motion.div>
        </div>
    );
};

export default ToDoList;