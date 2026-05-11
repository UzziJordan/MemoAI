import React from 'react';
import { FaCheck } from "react-icons/fa";
import { FiUser, FiRadio } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

import arrow from '../Images/arrrow.svg'

const Onboarding = () => {
  const navigate = useNavigate();
  const lastUserName = localStorage.getItem('lastUserName');

  const handleSignIn = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
          await auth.getProfile();
          // If successful, user has a session
          navigate('/dashboard');
      } else {
          navigate('/Login');
      }
    } catch (error) {
      // No session, go to login
      navigate('/Login');
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const illustrationVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: "backOut" } }
  };

  return (
    <div className="max-h-screen overflow-x-hidden lg:h-screen flex flex-col lg:flex-row text-geist">
      {/* Left Section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className='px-10 md:px-20 pt-10 lg: w-full lg:w-1/2 bg-white flex flex-col justify-start'
      >
        <motion.div 
          variants={itemVariants}
          className='text-[#000000] bg-[#F3F4F6] rounded-full w-fit items-center px-4 py-2 flex gap-2 shadow-sm'
        >
          <motion.p 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className='bg-[#1D8D2E] h-2.5 w-2.5 rounded-full'
          ></motion.p>
          <span className='text-[12px] font-extrabold uppercase tracking-widest'>All set up</span>
        </motion.div>
        
        <motion.div variants={itemVariants} className='text-instrument-serif text-[48px] md:text-[64px] mt-8 leading-tight font-extrabold tracking-tighter'>
          Welcome to <br />
          <span className='italic text-[#2828FA]'> MemoAI. </span>
        </motion.div>
        
        <motion.div variants={itemVariants} className='text-[#808080] mt-6 mb-6 font-medium text-[18px] w-full max-w-md leading-relaxed'>
          Your AI-powered meeting companion. Record any conversation and Memo automatically transcribes it, extracts key insights, and creates action items.
        </motion.div>

        {/* CLICKABLE SIGNED IN SECTION */}
        <motion.button 
          variants={itemVariants}
          whileHover={{ scale: 1.02, backgroundColor: "#F9FAFB", borderColor: "#2828FA" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignIn}
          className='flex p-4 items-center border-2 rounded-3xl w-full max-w-sm border-[#F3F4F6] gap-4 transition-all text-left cursor-pointer group'
        >
          <div className="p-3 bg-blue-50 text-[#2828FA] rounded-2xl group-hover:bg-[#2828FA] group-hover:text-white transition-colors">
            <FiUser size={18} />
          </div>
          <div>
            <p className='text-gray-400 text-[10px] font-bold uppercase tracking-widest'>Continue as</p>
            <p className='font-extrabold text-gray-800 text-[14px]'> {lastUserName || "Guest User"}</p>
          </div>
        </motion.button>

        {/* GET STARTED BUTTON */}
        <motion.button 
          variants={itemVariants}
          whileHover={{ scale: 1.05, backgroundColor: "#1D1DFA" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSignIn}
          className='mt-8 bg-[#2828FA] flex justify-between w-full max-w-sm rounded-3xl items-center text-white text-[16px] font-bold py-5 px-10 shadow-2xl shadow-blue-100 transition-all cursor-pointer'
        >
          <span>Get Started Now</span>
          <span className='text-3xl leading-none'> › </span> 
        </motion.button>
      </motion.div>

      {/* Right Section */}
      <div className="lg:w-1/2 mt-20 lg:mt-0 h-full py-20 lg:py-0 flex justify-center items-center bg-[#EAF3FF] lg:overflow-hidden relative">
        
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.3, delayChildren: 0.5 } }
            }}
            className='flex flex-col relative z-10'
        >
          
          <motion.div variants={illustrationVariants} className="group">
            <motion.div 
                whileHover={{ y: -5, scale: 1.02 }}
                className='flex items-center gap-6 bg-white rounded-4xl p-8 shadow-xl shadow-blue-900/5 transition-all'
            >
              <div className='p-4 h-16 w-16 rounded-2xl bg-[#FEE2E2] flex items-center justify-center'>
                <FiRadio className="text-[#FB2126] size-8" />
              </div>

              <div className='text-start'>
                <p className='text-[#2B2B2B] text-xl font-extrabold tracking-tight'>Record</p>
                <p className='text-[#A1A8B3] text-sm font-bold uppercase tracking-wide'>Meetings & Interviews</p>
              </div>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className='my-6 ml-32 opacity-20'
            > 
                <img src={arrow} alt="" className="w-12" /> 
            </motion.div>
          </motion.div>
          
          <motion.div variants={illustrationVariants} className="group">
            <motion.div 
                whileHover={{ y: -5, scale: 1.02 }}
                className='flex items-center gap-6 bg-white rounded-4xl p-8 shadow-xl shadow-blue-900/5 transition-all'
            >
              <div className='h-16 w-16 rounded-2xl text-[28px] font-black text-[#2828FA] bg-[#EFF6FF] flex items-center justify-center'>
                T
              </div>
              
              <div className='text-start'>
                <p className='text-[#2B2B2B] text-xl font-extrabold tracking-tight'>Transcribe</p>
                <p className='text-[#A1A8B3] text-sm font-bold uppercase tracking-wide'>AI-Powered Accuracy</p>
              </div>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className='my-6 ml-32 opacity-20'
            > 
                <img src={arrow} alt="" className="w-12" /> 
            </motion.div>
          </motion.div>
          
          <motion.div variants={illustrationVariants}>
            <motion.div 
                whileHover={{ y: -5, scale: 1.02 }}
                className='flex items-center gap-6 bg-white rounded-4xl p-8 shadow-xl shadow-blue-900/5 transition-all'
            >
              <div className='h-16 w-16 rounded-2xl flex items-center justify-center bg-[#F0FDF4]'>
                <FaCheck className="text-[#1D8D2E] text-2xl" />
              </div>
              <div className='text-start'>
                <p className='text-[#2B2B2B] text-xl font-extrabold tracking-tight'>Summarize</p>
                <p className='text-[#A1A8B3] text-sm font-bold uppercase tracking-wide'>Instant Action Items</p>
              </div>
            </motion.div>
          </motion.div>
        
        </motion.div>

        {/* Decorative Background Elements */}
      </div>
    </div>
  );
};
export default Onboarding;

