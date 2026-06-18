import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FiCopy, FiX, FiCheck } from 'react-icons/fi';
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const ShareModal = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();
  const [copied, setCopied] = useState(false);
  const inviteLink = window.location.origin; // Link to the landing page

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative z-10 border border-gray-100 dark:border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header */}
            <div className="flex justify-between items-center p-8 pb-4">
              <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">Invite Members</h2>
              <motion.button 
                whileHover={{ rotate: 90, backgroundColor: "#F3F4F6" }}
                onClick={onClose} 
                className="p-2 rounded-full transition-colors"
              >
                <FiX size={20} className="text-gray-400 dark:text-gray-500" />
              </motion.button>
            </div>

            <div className="p-8 pt-0 flex flex-col items-center">
              {/* QR Code Container */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="p-6 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-3xl mb-8 shadow-xl shadow-blue-50/50 dark:shadow-blue-900/10"
              >
                <QRCodeSVG 
                  value={inviteLink} 
                  size={160} 
                  fgColor={isDarkMode ? "#FFFFFF" : "#000000"} 
                  bgColor={isDarkMode ? "#1f2937" : "#FFFFFF"}
                />
              </motion.div>

              <p className="text-center text-gray-500 dark:text-gray-400 mb-8 font-medium leading-relaxed">
                Scan the QR code or share the link below to invite others to join your space.
              </p>

              {/* Copy Link Section */}
              <div className="w-full relative group">
                <input 
                  readOnly 
                  value={inviteLink}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl text-gray-600 dark:text-gray-300 font-bold pr-14 focus:outline-none group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors"
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
                >
                  {copied ? <FiCheck size={20} /> : <FiCopy size={20} />}
                </motion.button>
              </div>
              
              <AnimatePresence>
                {copied && (
                    <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-green-600 dark:text-green-400 mt-3 font-extrabold uppercase tracking-widest"
                    >
                        ✓ Copied to clipboard
                    </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-8 bg-gray-50/50 dark:bg-gray-800/50 text-center border-t border-gray-100 dark:border-gray-800">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
