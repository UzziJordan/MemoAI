import React, { useEffect, useState, useRef } from 'react';
import { FiBell, FiX, FiCheck, FiInfo, FiAlertCircle, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import { api } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

const NotificationDropdown = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`, {});
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error("Error marking read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read', {});
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all read:", error);
    }
  };

  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleNotificationClick = (n) => {
    if (!n.read) markRead(n._id);
    if (n.link) navigate(n.link);
    onClose();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <FiCheckCircle className="text-green-500" />;
      case 'error': return <FiAlertCircle className="text-red-500" />;
      case 'warning': return <FiAlertCircle className="text-orange-500" />;
      default: return <FiInfo className="text-blue-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          ref={dropdownRef}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-14 right-0 w-[320px] md:w-[400px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-[100] overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-5 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Activity Alerts</h3>
            <button 
                onClick={markAllAsRead}
                className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md transition-colors"
            >
                Mark all read
            </button>
          </div>

          {/* List */}
          <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
            {loading && notifications.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center gap-3">
                 <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-6 h-6 border-2 border-blue-100 dark:border-gray-800 border-t-blue-600 rounded-full"
                />
                <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center gap-4">
                <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-200 dark:text-gray-700">
                    <FiBell size={40} />
                </div>
                <div className="space-y-1">
                    <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">All caught up!</p>
                    <p className="text-gray-400 dark:text-gray-500 text-[11px] px-6">New updates about your recordings will appear here.</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                <AnimatePresence mode="popLayout">
                  {notifications.map((n) => (
                    <motion.div 
                      key={n._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-5 flex gap-4 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 cursor-pointer transition-all relative group ${!n.read ? 'bg-white dark:bg-gray-900' : 'bg-white dark:bg-gray-900 opacity-60'}`}
                    >
                      {!n.read && <motion.div layoutId="notif-dot" className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]" />}
                      
                      <div className={`mt-1 text-xl p-2 rounded-xl h-fit ${!n.read ? 'bg-white dark:bg-gray-800 shadow-sm border border-gray-50 dark:border-gray-700' : 'bg-gray-50 dark:bg-gray-800'}`}>
                        {getIcon(n.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold text-gray-800 dark:text-gray-100 tracking-tight ${!n.read ? '' : 'text-gray-600 dark:text-gray-400'}`}>{n.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                        <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 mt-3 uppercase tracking-tighter">{new Date(n.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.1, backgroundColor: "#fee2e2", color: "#ef4444" }}
                        onClick={(e) => deleteNotification(e, n._id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 dark:text-gray-600 rounded-lg transition-all"
                      >
                        <FiTrash2 size={16} />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 text-center border-t border-gray-100 dark:border-gray-800">
            <button 
              onClick={onClose}
              className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors uppercase tracking-[0.2em]"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;
