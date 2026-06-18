// ================= IMPORTS =================
import React, { useEffect, useState } from 'react';
import { FiUpload, FiMoreHorizontal } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

// Assets
import divrec from '../../Images/divrec.svg';
import audioi from '../../Images/audio.svg';
import linkk from '../../Images/linkk.svg';
import pdf from '../../Images/pdf.svg';
import summaryi from '../../Images/summary.svg';
import transcripti from '../../Images/transcript.svg';

/**
 * RecordHistory Component
 * Purpose: Lists all voice recordings from custom backend with search and delete capabilities.
 */
const RecordHistory = ({ searchTerm = "", filters = { tags: [] } }) => {

  // ================= STATE & NAVIGATION =================
  const [recordings, setRecordings] = useState([]);         // List of recordings
  const [loading, setLoading] = useState(true);           // Loading state
  const [selectedRecording, setSelectedRecording] = useState(null); // For share modal
  const [showModal, setShowModal] = useState(false);      // Modal toggle
  const [openMenuId, setOpenMenuId] = useState(null);       // Dropdown menu toggle

  const navigate = useNavigate();


  // ================= SIDE EFFECTS =================

  // Fetch data from backend on mount
  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await api.get('/recordings');
        setRecordings(response.recordings);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecordings();
  }, []);

  // Handle clicking outside to close the 3-dot menu
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId !== null) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);


  // ================= FILTERING LOGIC =================
  const filteredRecordings = recordings.filter((rec) => {
    // 1. Search Filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      (rec?.title || "").toLowerCase().includes(searchLower) ||
      (rec?.transcript || "").toLowerCase().includes(searchLower) ||
      (rec?.summary || "").toLowerCase().includes(searchLower)
    );

    // 2. Tag Filter
    const selectedTags = filters.tags || [];
    const matchesTags = selectedTags.length === 0 || selectedTags.includes(rec.tag || "Others");

    return matchesSearch && matchesTags;
  });


  // ================= HELPER FUNCTIONS =================

  // Formats seconds to MM:SS
  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Formats date
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Returns CSS classes for tag colors
  const getTagStyles = (tag) => {
    const t = (tag || "meeting").toLowerCase();
    if (t === "product") return "bg-[#EFF6FF] text-[#2563EB]";
    if (t === "interview") return "bg-[#F5F3FF] text-[#7C3AED]";
    if (t === "lecture") return "bg-[#F0FDF4] text-[#16A34A]";
    if (t === "client") return "bg-[#FFFBEB] text-[#D97706]";
    return "bg-blue-50 text-blue-600";
  };


  // ================= EVENT HANDLERS =================

  // Delete a recording from DB and Cloudinary
  const handleDelete = async (rec, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this recording?")) return;

    try {
      await api.delete(`/recordings/${rec._id}`);
      setRecordings(recordings.filter((r) => r._id !== rec._id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete.");
    }
    setOpenMenuId(null);
  };

  // Navigate to detailed transcript view
  const handleRowClick = (rec) => {
    localStorage.setItem('latestRecording', JSON.stringify(rec));
    navigate('/dashboard/transcript');
  };

  // Open Share Modal
  const handleShareClick = (e, rec) => {
    e.stopPropagation();
    setSelectedRecording(rec);
    setShowModal(true);
  };

  // Toggle 3-dot menu
  const handleMenuClick = (e, rec) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === rec._id ? null : rec._id);
  };


  // ================= MAIN UI RENDER =================
  return (
    <div className='px-4 md:px-6 mt-2 pb-10 font-geist'>

      <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">

        {/* TABLE HEADER */}
        <div className="grid grid-cols-2 md:grid-cols-5 px-4 md:px-6 py-3 bg-[#EFF2F9] dark:bg-gray-800/50 border-b border-[#EBEBEB] dark:border-gray-800 text-[12px] md:text-[14px] font-semibold text-[#808080] dark:text-gray-400">
          <div className="col-span-1 md:col-span-2">TITLE</div>
          <div className="hidden md:block">DATE</div>
          <div className="hidden md:block">DURATION</div>
          <div className="text-right md:text-left">TAGS / ACTIONS </div>
        </div>

        {/* TABLE CONTENT */}
        {loading ? (
          <div className="p-10 text-center text-gray-400 dark:text-gray-500 text-sm italic">Loading recordings...</div>
        ) : filteredRecordings.length === 0 ? (
          <div className="p-10 text-center text-gray-400 dark:text-gray-500 text-sm italic">No recordings found.</div>
        ) : (
          filteredRecordings.map((rec) => (
            <div
              key={rec._id}
              onClick={() => handleRowClick(rec)}
              className="grid grid-cols-2 md:grid-cols-5 items-center px-4 md:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition"
            >
              {/* Title & Mobile Subtext */}
              <div className="col-span-1 md:col-span-2 flex items-center gap-3 font-semibold">
                <img src={divrec} alt="icon" className="w-8 h-8 opacity-80" />
                <div className="truncate">
                  <p className="truncate text-[#1F2937] dark:text-gray-100 text-sm md:text-base font-medium">{rec.title || "Untitled"}</p>
                  <p className="md:hidden text-[10px] text-gray-400 dark:text-gray-500 font-normal">{formatDate(rec.createdAt)} • {formatTime(rec.duration)}</p>
                </div>
              </div>

              {/* Date */}
              <div className='hidden md:block text-sm text-[#1F2937] dark:text-gray-300'>{formatDate(rec.createdAt)}</div>

              {/* Duration */}
              <div className='hidden md:block text-sm text-[#1F2937] dark:text-gray-300'>{formatTime(rec.duration)}</div>

              {/* Actions */}
              <div className="flex items-center justify-end md:justify-between gap-2">
                <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getTagStyles(rec.tag)}`}>
                  {rec.tag || "Meeting"}
                </span>

                <div className="flex gap-2">
                  <button onClick={(e) => handleShareClick(e, rec)} className="p-2 border border-[#E5E7EB] dark:border-gray-700 rounded-lg hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"><FiUpload size={16} /></button>
                  <div className="relative">
                    <button onClick={(e) => handleMenuClick(e, rec)} className="p-2 border border-[#E5E7EB] dark:border-gray-700 rounded-lg hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"><FiMoreHorizontal size={16} /></button>
                    {openMenuId === rec._id && (
                      <div className="absolute right-0 bottom-0 w-36 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg shadow-xl z-20 py-1 overflow-hidden">
                        <button onClick={(e) => handleDelete(rec, e)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold">Delete</button>
                        <button onClick={(e) => { e.stopPropagation(); handleRowClick(rec); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">View Transcript</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= SHARE MODAL ================= */}
      {showModal && selectedRecording && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl p-6 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className='flex justify-between items-center mb-4'>
              <div>
                <h2 className="text-[22px] font-bold dark:text-gray-100 transition-colors">Share & Export</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedRecording.title} • {formatTime(selectedRecording.duration)}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="px-3.5 py-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 rounded-full">✕</button>
            </div>

            <div className="space-y-3">
              {/* DOWNLOAD AUDIO */}
              <div onClick={() => {const link = document.createElement('a'); link.href = selectedRecording.audioUrl; link.download = selectedRecording.title; link.click();}} className="flex items-center justify-between px-4 py-2 border border-[#DDDDDD] dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group transition-all">
                <div className='flex gap-4 items-center'>
                  <img src={audioi} alt="" className='p-4 rounded-2xl bg-[#D4D4FE] dark:bg-blue-900/30' />
                  <div>
                    <p className="text-[#2B2B2B] dark:text-gray-200 text-[18px] font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Download Audio</p>
                    <p className="text-[16px] font-medium text-[#AAAAAA] dark:text-gray-500">Save recording file</p>
                  </div>
                </div>
                <span className='text-[#374957] dark:text-gray-400 text-[25px] '> › </span>
              </div>

              {/* COPY SUMMARY */}
              <div onClick={() => {navigator.clipboard.writeText(selectedRecording.summary || "No summary available"); alert("Summary copied!");}} className="flex items-center justify-between px-4 py-2 border border-[#DDDDDD] dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group transition-all">
                <div className='flex gap-4 items-center'>
                  <img src={summaryi} alt="" className='p-4 rounded-2xl bg-[#D4D4FE] dark:bg-blue-900/30' />
                  <div>
                    <p className="text-[#2B2B2B] dark:text-gray-200 text-[18px] font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Copy Summary</p>
                    <p className="text-[16px] font-medium text-[#AAAAAA] dark:text-gray-500">Copy AI-generated summary</p>
                  </div>
                </div>
                <span className='text-[#374957] dark:text-gray-400 text-[25px] '> › </span>
              </div>

              {/* DOWNLOAD PDF */}
              <div onClick={() => {const content = `Title: ${selectedRecording.title}\n\nSummary:\n${selectedRecording.summary}\n\nTranscript:\n${selectedRecording.transcript}`; const blob = new Blob([content], { type: "text/plain" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `${selectedRecording.title}.txt`; link.click();}} className="flex items-center justify-between px-4 py-2 border border-[#DDDDDD] dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group transition-all">
                <div className='flex gap-4 items-center'>
                  <img src={pdf} alt="" className='p-4 rounded-2xl bg-[#D4D4FE] dark:bg-blue-900/30' />
                  <div>
                    <p className="text-[#2B2B2B] dark:text-gray-200 text-[18px] font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Download PDF</p>
                    <p className="text-[16px] font-medium text-[#AAAAAA] dark:text-gray-500">Summary + full transcript as PDF</p>
                  </div>
                </div>
                <span className='text-[#374957] dark:text-gray-400 text-[25px] '> › </span>
              </div>

              {/* EXPORT TRANSCRIPT */}
              <div onClick={() => {const blob = new Blob([selectedRecording.transcript || "No transcript"], { type: "text/plain" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = `${selectedRecording.title}-transcript.txt`; link.click();}} className="flex items-center justify-between px-4 py-2 border border-[#DDDDDD] dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group transition-all">
                <div className='flex gap-4 items-center'>
                  <img src={transcripti} alt="" className='p-3 rounded-2xl bg-[#D4D4FE] dark:bg-blue-900/30' />
                  <div>
                    <p className="text-[#2B2B2B] dark:text-gray-200 text-[18px] font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Export Transcript</p>
                    <p className="text-[16px] font-medium text-[#AAAAAA] dark:text-gray-500">Download as .txt, .md or .docx</p>
                  </div>
                </div>
                <span className='text-[#374957] dark:text-gray-400 text-[25px] '> › </span>
              </div>

              {/* SHARE LINK */}
              <div onClick={() => window.open(selectedRecording.audioUrl, "_blank")} className="flex items-center justify-between px-4 py-2 border border-[#DDDDDD] dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group transition-all">
                <div className='flex gap-4 items-center'>
                  <img src={linkk} alt="" className='p-3 rounded-2xl bg-[#D4D4FE] dark:bg-blue-900/30' />
                  <div>
                    <p className="text-[#2B2B2B] dark:text-gray-200 text-[18px] font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Share Link</p>
                    <p className="text-[16px] font-medium text-[#AAAAAA] dark:text-gray-500">Anyone with link can view (read only) </p>
                  </div>
                </div>
                <span className='text-[#374957] dark:text-gray-400 text-[25px] '> › </span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <input readOnly value={selectedRecording.audioUrl || ""} className="flex-1 px-3 py-2 border border-[#DDDDDD] dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-[14px] text-[#808080] dark:text-gray-400 font-medium rounded-lg text-sm outline-none" />
              <button onClick={() => {navigator.clipboard.writeText(selectedRecording.audioUrl || ""); alert("Copied!");}} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-900/20">Copy Link</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RecordHistory;