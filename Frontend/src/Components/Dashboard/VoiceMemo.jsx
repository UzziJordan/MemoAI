import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FiSave, FiTag, FiEdit3 } from "react-icons/fi";

const VoiceMemoRecorder = () => {

  // ================= STATE =================
  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [duration, setDuration] = useState(0);
  const [tag, setTag] = useState("work");


  // ================= SAVE RECORDING =================
  const handleSave = () => {
    const recordings = JSON.parse(localStorage.getItem("recordings")) || [];

    const newRecording = {
      id: Date.now(),
      title: title || "Untitled Recording",
      transcript,
      summary,
      audioURL,
      duration,
      date: new Date(),
      tag, 
    };

    const updated = [newRecording, ...recordings];
    localStorage.setItem("recordings", JSON.stringify(updated));
    alert("Recording saved!");
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };


  // ================= UI =================
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-8 bg-white rounded-3xl border-2 border-gray-50 shadow-xl shadow-blue-900/5 max-w-2xl"
    >

      {/* TITLE INPUT */}
      <div className="relative group mb-6">
        <FiEdit3 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
        <input
            type="text"
            placeholder="Give your recording a name..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 pl-11 pr-4 py-4 rounded-2xl outline-none font-bold text-gray-800 transition-all shadow-inner"
        />
      </div>

      {/* TAG SELECTOR */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
            <FiTag className="text-blue-500" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Categorize Memo</p>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          {["work", "planning", "interview", "lecture", "product"].map((t) => (
            <motion.button
              key={t}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTag(t)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all duration-300
                ${tag === t
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white border-gray-100 text-gray-400 hover:border-blue-200 hover:text-blue-600"
                }`}
            >
              {t}
            </motion.button>
          ))}
        </div>
      </div>

      {/* SAVE BUTTON */}
      <motion.button
        whileHover={{ scale: 1.02, backgroundColor: "#1D1DFA" }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        className="w-full bg-[#2828FA] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-blue-100 transition-all"
      >
        <FiSave size={18} />
        Save Data to Library
      </motion.button>

    </motion.div>
  );
};

export default VoiceMemoRecorder;