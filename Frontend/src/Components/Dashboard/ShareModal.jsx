import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FiCopy, FiX, FiCheck } from 'react-icons/fi';
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

const ShareModal = ({ isOpen, onClose }) => {
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
            className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header */}
            <div className="flex justify-between items-center p-8 pb-4">
              <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Invite Members</h2>
              <motion.button 
                whileHover={{ rotate: 90, backgroundColor: "#F3F4F6" }}
                onClick={onClose} 
                className="p-2 rounded-full transition-colors"
              >
                <FiX size={20} className="text-gray-400" />
              </motion.button>
            </div>

            <div className="p-8 pt-0 flex flex-col items-center">
              {/* QR Code Container */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="p-6 bg-white border-2 border-gray-100 rounded-3xl mb-8 shadow-xl shadow-blue-50/50"
              >
                <QRCodeSVG value={inviteLink} size={160} />
              </motion.div>

              <p className="text-center text-gray-500 mb-8 font-medium leading-relaxed">
                Scan the QR code or share the link below to invite others to join your space.
              </p>

              {/* Copy Link Section */}
              <div className="w-full relative group">
                <input 
                  readOnly 
                  value={inviteLink}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-600 font-bold pr-14 focus:outline-none group-hover:border-blue-200 transition-colors"
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
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
                        className="text-xs text-green-600 mt-3 font-extrabold uppercase tracking-widest"
                    >
                        ✓ Copied to clipboard
                    </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-8 bg-gray-50/50 text-center border-t border-gray-100">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-4 bg-white border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all"
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
