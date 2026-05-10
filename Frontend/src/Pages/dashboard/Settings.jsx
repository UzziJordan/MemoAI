import React, { useEffect, useState, useRef } from 'react';
import profileimg from '../../Images/profileimg.svg';
import Searchbar from '../../Components/Dashboard/Searchbar';
import { api, auth, BASE_URL } from "../../lib/api";
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiBell, FiShield, FiTrash2, FiSave, FiEdit2, FiX } from "react-icons/fi";

/**
 * Settings Component
 * Purpose: Allows users to manage their profile, notification preferences, and export options.
 */
const Settings = () => {

    // --- STATE AND HOOKS ---
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [profileUrl, setProfileUrl] = useState(profileimg);

    // Individual states for toggles
    const [dailyReminder, setDailyReminder] = useState(false);
    const [weeklyDigest, setWeeklyDigest] = useState(false);
    const [missedTodos, setMissedTodos] = useState(false);
    const [speakerLabels, setSpeakerLabels] = useState(true);
    const [timestamps, setTimestamps] = useState(true);

    // Name states
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState("");
    const [savingName, setSavingName] = useState(false);

    // Password states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [updatingPassword, setUpdatingPassword] = useState(false);

    const fileInputRef = useRef(null);


    // --- SIDE EFFECTS ---
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await auth.getProfile();
                setUser(currentUser);
                setTempName(currentUser.name);

                // Check if user has a profile image
                if (currentUser.profileImage) {
                    const imagePath = currentUser.profileImage.startsWith('http') 
                        ? currentUser.profileImage 
                        : `${BASE_URL}${currentUser.profileImage}`;
                    setProfileUrl(imagePath);
                }
            } catch (error) {
                console.error("Failed to fetch user in Settings:", error);
                setUser(null);
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUser();
    }, []);


    // --- HANDLERS ---
    const handleNameUpdate = async () => {
        if (!tempName.trim()) {
            alert("Name cannot be empty");
            return;
        }

        try {
            setSavingName(true);
            const data = await api.patch('/user', { name: tempName });
            setUser({ ...user, name: data.user.name });
            setIsEditingName(false);

            await api.post('/notifications', {
                title: "Profile Updated",
                message: "Your name has been changed successfully.",
                type: "success"
            });

            alert("Name updated successfully!");
        } catch (error) {
            console.error("Error updating name:", error);
            alert("Failed to update name.");
        } finally {
            setSavingName(false);
        }
    };

    const handleToggleNotification = async (type, currentVal, setter) => {
        const newVal = !currentVal;
        setter(newVal);

        if (newVal) {
            let title = "";
            let message = "";

            if (type === 'daily') {
                title = "Daily Review Enabled";
                message = "You will now receive daily highlights of your recordings.";
            } else if (type === 'weekly') {
                title = "Weekly Digest Enabled";
                message = "We'll send you a summary of your most important memos every Sunday.";
            } else if (type === 'todos') {
                title = "Todo Alerts Enabled";
                message = "You'll be notified of pending tasks before they expire.";
            }

            try {
                await api.post('/notifications', { title, message, type: "info" });
            } catch (error) {
                console.error("Error creating toggle notification:", error);
            }
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('profileImage', file);
            const data = await api.patch('/user/profile-image', formData, true);
            const newImagePath = `${BASE_URL}${data.profileImage}`;
            setProfileUrl(newImagePath);
            setUser({ ...user, profileImage: data.profileImage });
            window.dispatchEvent(new Event('profileUpdate'));
            alert("Profile picture updated successfully!");
        } catch (error) {
            console.error("Error uploading profile image:", error);
            alert("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action is permanent.")) return;
        try {
            await api.delete('/user/account');
            auth.logout();
            window.location.href = '/Login';
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Failed to delete account.");
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            alert("Please fill in both password fields.");
            return;
        }

        try {
            setUpdatingPassword(true);
            await api.patch('/user/password', { currentPassword, newPassword });
            alert("Password updated successfully!");
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            console.error("Error updating password:", error);
            alert(error.message || "Failed to update password.");
        } finally {
            setUpdatingPassword(false);
        }
    };


    // --- CONSTANTS ---
    const userName = user ? user.name : "Guest";
    const userEmail = user ? user.email : "N/A";

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };


    // --- RENDER HELPERS ---
    if (loadingUser) {
        return (
            <div className='text-geist pt-20 flex flex-col justify-center items-center h-screen gap-4'>
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full"
                />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing your profile...</p>
            </div>
        );
    }


    // --- MAIN RENDER ---
    return (
        <div className='text-geist pt-20 min-h-screen bg-gray-50/50'>

            <Searchbar />

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className='max-w-4xl mx-auto px-6 flex flex-col mt-10 gap-8 pb-32'
            >

                <motion.h1 variants={sectionVariants} className="text-3xl font-black text-gray-900 tracking-tight">
                    Account Settings
                </motion.h1>


                {/* --- PROFILE SECTION --- */}
                <motion.div variants={sectionVariants} className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-gray-100">

                    <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-8">Profile Information</h2>

                    {/* PHOTO */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b border-gray-50">
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    src={profileUrl}
                                    className="h-24 w-24 rounded-[32px] object-cover border-4 border-white shadow-xl"
                                    alt="Profile"
                                />
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/40 rounded-[32px] flex items-center justify-center">
                                        <motion.div 
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            className="w-6 h-6 border-2 border-transparent border-t-white rounded-full"
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-xl font-black text-gray-800 tracking-tight">{userName}</p>
                                <p className="text-sm text-gray-400 font-medium">Your profile photo will be visible to your team</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleImageChange} 
                                className="hidden" 
                                accept="image/*"
                            />
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => fileInputRef.current.click()}
                                disabled={uploading}
                                className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                            >
                                Change Photo
                            </motion.button>
                        </div>
                    </div>

                    {/* NAME */}
                    <div className="py-8 border-b border-gray-50">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Full Display Name</label>
                            {!isEditingName && (
                                <motion.button 
                                    whileHover={{ color: "#2828FA" }}
                                    onClick={() => {setIsEditingName(true); setTempName(userName);}}
                                    className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"
                                >
                                    <FiEdit2 size={12} /> Change
                                </motion.button>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex-1 relative group">
                                <FiUser className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isEditingName ? 'text-blue-500' : 'text-gray-300'}`} />
                                <input
                                    type="text"
                                    value={isEditingName ? tempName : userName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    readOnly={!isEditingName}
                                    className={`w-full border-2 pl-12 pr-6 py-4 rounded-2xl text-base font-bold transition-all ${isEditingName ? 'bg-white border-blue-500 shadow-lg shadow-blue-100 text-gray-800' : 'bg-gray-50 border-gray-50 text-gray-400'}`}
                                />
                            </div>

                            <AnimatePresence>
                                {isEditingName && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex gap-2"
                                    >
                                        <motion.button 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleNameUpdate}
                                            disabled={savingName}
                                            className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-100"
                                        >
                                            <FiSave size={20} />
                                        </motion.button>
                                        <motion.button 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsEditingName(false)}
                                            className="bg-white border-2 border-gray-100 text-gray-400 p-4 rounded-2xl"
                                        >
                                            <FiX size={20} />
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div className="pt-8">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Primary Email</label>
                        <div className="relative group opacity-60">
                            <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                            <input
                                type="text"
                                value={userEmail}
                                readOnly
                                className="w-full bg-gray-50 border-2 border-gray-50 pl-12 pr-6 py-4 rounded-2xl text-base font-bold text-gray-400 cursor-not-allowed"
                            />
                        </div>
                        <p className="mt-2 text-[10px] text-gray-300 font-bold uppercase tracking-widest italic">Email cannot be changed on free plan</p>
                    </div>
                </motion.div>


                {/* --- SECURITY SECTION --- */}
                {!user?.googleId && (
                    <motion.div variants={sectionVariants} className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-gray-100">
                        <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                            <FiShield /> Security
                        </h2>

                        <form onSubmit={handlePasswordUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Current Password</label>
                                    <div className="relative group">
                                        <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-gray-50 border-2 border-gray-50 focus:bg-white focus:border-blue-500 pl-12 pr-6 py-4 rounded-2xl text-base font-bold text-gray-800 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">New Secure Password</label>
                                    <div className="relative group">
                                        <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-gray-50 border-2 border-gray-50 focus:bg-white focus:border-blue-500 pl-12 pr-6 py-4 rounded-2xl text-base font-bold text-gray-800 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={updatingPassword}
                                    className="bg-[#2828FA] text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#1D1DFA] transition-all disabled:opacity-50 shadow-xl shadow-blue-100"
                                >
                                    {updatingPassword ? "Verifying..." : "Update Password"}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}


                {/* --- NOTIFICATIONS SECTION --- */}
                <motion.div variants={sectionVariants} className="bg-white rounded-3xl p-8 shadow-xl shadow-blue-900/5 border border-gray-100">
                    <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                        <FiBell /> Smart Alerts
                    </h2>

                    <div className="space-y-4">
                        {[
                            { id: 'daily', label: 'Daily Review Reminder', desc: 'Summary of all meetings from the last 24h', state: dailyReminder, setter: setDailyReminder },
                            { id: 'weekly', label: 'Weekly Digest', desc: 'Executive report of your key accomplishments', state: weeklyDigest, setter: setWeeklyDigest },
                            { id: 'todos', label: 'Action Item Alerts', desc: 'Notifications for high-priority task deadlines', state: missedTodos, setter: setMissedTodos }
                        ].map((toggle, idx) => (
                            <div key={toggle.id} className={`flex justify-between items-center p-6 rounded-[24px] border-2 transition-all duration-300 ${toggle.state ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50/50 border-gray-50'}`}>
                                <div>
                                    <p className={`font-black tracking-tight ${toggle.state ? 'text-blue-700' : 'text-gray-700'}`}>{toggle.label}</p>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">{toggle.desc}</p>
                                </div>

                                <button
                                    onClick={() => handleToggleNotification(toggle.id, toggle.state, toggle.setter)}
                                    className={`w-14 h-8 flex items-center rounded-full px-1.5 transition-all duration-500 shadow-inner
                                        ${toggle.state ? "bg-blue-600" : "bg-gray-300"}`}
                                >
                                    <motion.div
                                        animate={{ x: toggle.state ? 24 : 0 }}
                                        className="bg-white w-5 h-5 rounded-full shadow-lg"
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>


                {/* --- DANGER ZONE --- */}
                <motion.div variants={sectionVariants} className="bg-red-50 rounded-3xl p-8 border border-red-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div>
                            <p className="text-red-700 font-black text-xl tracking-tight flex items-center gap-2">
                                <FiTrash2 /> Close Account
                            </p>
                            <p className="text-red-400 text-xs font-bold uppercase tracking-widest mt-1">
                                Warning: This will permanently delete all your data
                            </p>
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: "#ef4444", color: "#fff" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDeleteAccount}
                            className="bg-white text-red-500 border-2 border-red-100 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm"
                        >
                            Delete Forever
                        </motion.button>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
};

export default Settings;