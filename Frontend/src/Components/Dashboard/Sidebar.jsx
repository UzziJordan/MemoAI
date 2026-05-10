import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { FaHome, FaBook, FaList, FaCog } from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";
import { FiMic } from "react-icons/fi";

import defaultImage from "../../Images/philip.svg";
import { auth } from "../../lib/api";


// ================= CONFIG =================
const navItems = [
  { name: "Home", path: "/dashboard", icon: FaHome, end: true },
  { name: "Library", path: "library", icon: FaBook },
  { name: "Transcript", path: "/dashboard/transcript", icon: FaList },
  { name: "To-Do List", path: "todo", icon: HiOutlineClipboardList },
  { name: "Settings", path: "settings", icon: FaCog },
];


// ================= COMPONENT =================
const Sidebar = ({ isOpen, setIsOpen }) => {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [profileUrl, setProfileUrl] = useState(defaultImage);

  const menuRef = useRef(null);
  const navigate = useNavigate();


  // ================= EFFECTS =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await auth.getProfile();
        setUser(currentUser);

        if (currentUser.profileImage) {
          const imagePath = currentUser.profileImage.startsWith('http') 
              ? currentUser.profileImage 
              : `http://localhost:5000${currentUser.profileImage}`;
          setProfileUrl(imagePath);
        } else {
          setProfileUrl(defaultImage);
        }
      } catch {
        setUser(null);
      }
    };

    fetchUser();

    // Listen for profile updates from Settings
    window.addEventListener('profileUpdate', fetchUser);
    return () => window.removeEventListener('profileUpdate', fetchUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // ================= HANDLERS =================
  const handleLogout = async () => {
    try {
      auth.logout();
      localStorage.removeItem("latestRecording");
      localStorage.removeItem("recordings"); 
      localStorage.removeItem("generalTodos"); 
      navigate("/Onboarding");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };


  // ================= UI =================
  return (
    <>
      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#CCCCCC] flex flex-col justify-between transition-transform duration-500
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:w-[15vw]
      `}>

        {/* ===== TOP ===== */}
        <div>
          {/* BRAND */}
          <div className="px-6 py-2 h-18 border-b border-[#CCCCCC] flex items-center justify-between overflow-hidden">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-[25px] font-bold text-[#2828FA] text-audiowide tracking-tighter">
                MEMO <span className="text-gray-300">AI</span>
              </h1>
              <p className="text-[10px] font-medium text-gray-400">Your meetings, summarized</p>
            </motion.div>
            
            {/* CLOSE BUTTON (MOBILE ONLY) */}
            <button 
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* NAV */}
          <nav className="mt-6 px-4 space-y-2">
            {navItems.map(({ name, path, icon: Icon, end }, idx) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <NavLink
                  to={path}
                  end={end}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group
                    ${isActive
                      ? "bg-[#2828FA] text-white shadow-lg shadow-blue-200"
                      : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                    }`
                  }
                >
                  <Icon size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-bold tracking-tight">{name}</span>
                </NavLink>
              </motion.div>
            ))}
          </nav>
        
        </div>


        {/* ===== BOTTOM (USER) ===== */}
        <div className="p-4 border-t border-[#CCCCCC]">
          <div
            ref={menuRef}
            onClick={() => setShowMenu((p) => !p)}
            className="relative flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-all duration-300 cursor-pointer group"
          >
            <motion.img
              whileHover={{ scale: 1.1 }}
              src={profileUrl}
              alt="User avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />

            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                    {user?.name || "Guest"}
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Free User</p>
            </div>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-0 w-full mb-3 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                >
                  <button
                    onClick={() => { navigate("settings"); }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 font-bold flex items-center gap-3 transition-colors"
                  >
                    <FaCog /> Settings
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-3 transition-colors border-t border-gray-50"
                  >
                    <FiMic /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
