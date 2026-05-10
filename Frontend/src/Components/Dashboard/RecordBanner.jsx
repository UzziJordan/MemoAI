import React from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RecordBanner = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-[#2828FA] text-white px-6 md:px-8 py-6 md:py-7 mb-4 rounded-[24px] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 shadow-lg shadow-blue-900/10"
    >
      
      {/* Banner Content */}
      <div className="max-w-md">
        <h2 className="text-[18px] md:text-[20px] font-black tracking-tight">Ready to record?</h2>
        <p className="text-[13px] md:text-[14px] font-bold text-blue-100 opacity-80 uppercase tracking-widest mt-1">Memo will transcribe and summarize everything automatically.</p>
      </div>
      
      {/* Record Button */}
      
      <Link to="recording" className="w-full md:w-auto">
        
        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: "#f8f9ff" }}
          whileTap={{ scale: 0.95 }}
          className="bg-white w-full md:w-auto flex items-center justify-center gap-3 text-[#2828FA] px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-900/20 transition-colors"
        >
          <motion.div 
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className='w-2.5 h-2.5 rounded-full bg-[#2828FA]'
          />
          Start Recording
        </motion.button>
      
      </Link>
    
    </motion.div>
  );
};
export default RecordBanner;