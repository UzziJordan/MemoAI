import React, { useEffect, useState } from "react";
import divrec from "../../Images/divrec.svg";
import { useNavigate } from "react-router-dom";
import { api } from '../../lib/api';
import { motion, AnimatePresence } from "framer-motion";

const RecordList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ================= GET FROM BACKEND =================
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await api.get('/recordings');
        // Take only first 5 for recent list
        setRecords(response.recordings.slice(0, 5));
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // ================= FORMAT DATE =================
  const formatDate = (date) => {
    if (!date) return "Unknown date";

    const d = new Date(date);
    const today = new Date();

    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();

    const time = d.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    return isToday
      ? `Today, ${time}`
      : `${d.toLocaleDateString()}, ${time}`;
  };

  // ================= FORMAT DURATION =================
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

  return (
    <div className="mt-8">
      {/* HEADER */}
      <div className="flex justify-between mb-6 items-center px-2">
        <h2 className="font-extrabold text-xl text-gray-800 tracking-tight">
          Recent Recordings
        </h2>

        <motion.span 
          whileHover={{ x: 5 }}
          onClick={() => navigate("/dashboard/library")}
          className="text-sm font-bold text-blue-600 cursor-pointer hover:underline flex items-center gap-1 transition-all"
        >
          View Library →
        </motion.span>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full"
            />
            <p className="text-gray-400 font-medium animate-pulse">Fetching your memos...</p>
          </div>
        ) : records.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-100 shadow-sm"
          >
            <p className="text-gray-400 font-bold text-lg mb-2">
              No recordings yet.
            </p>
            <p className="text-gray-400 text-sm mb-6">Start your first recording to see it here.</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard/recording")}
              className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
            >
              Start recording
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {records.map((rec, index) => (
                <motion.div
                  key={rec._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, x: 5 }}
                  onClick={() => {
                    localStorage.setItem('latestRecording', JSON.stringify(rec));
                    navigate("/dashboard/transcript");
                  }}
                  className="bg-white px-6 py-6 rounded-3xl flex justify-between items-center border border-[#EBEBEB] hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300 cursor-pointer group"
                >
                  {/* LEFT */}
                  <div className="flex gap-6 items-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                        <img src={divrec} alt="" className="w-6 h-6 group-hover:brightness-200 transition-all" />
                    </div>

                    <div>
                      <h3 className="font-bold text-lg text-gray-800 tracking-tight group-hover:text-blue-600 transition-colors">
                        {rec.title}
                      </h3>

                      {/* DATE + DURATION */}
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-400 font-medium flex items-center gap-4">
                          <span>{formatDate(rec.createdAt)}</span>
                          <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                          <span>{formatDuration(rec.duration)}</span>

                          {/* TRANSCRIPT STATUS */}
                          {rec.transcript ? (
                            <span className="text-green-500 bg-green-50 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                              Ready
                            </span>
                          ) : (
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${rec.status === 'processing' ? 'text-blue-500 bg-blue-50 animate-pulse' : 'text-gray-400 bg-gray-50'}`}>
                              {rec.status === 'processing' ? 'Processing...' : 'No transcript'}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex gap-5 items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-50 text-gray-500 px-3 py-1.5 rounded-full border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                      {rec.tag || "General"}
                    </span>

                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <span className="text-xl font-light">›</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordList;
