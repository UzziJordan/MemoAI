import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FilterModal = ({ isOpen, onClose, onApply }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState("");

  const tags = ["Meeting", "Lecture", "Conference", "Interview", "Client", "Others"];

  // Toggle item in the list
  const toggleItem = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Handle apply button click
  const handleApply = () => {
    let finalTags = [...selectedTags];
    
    // If 'Others' is selected and there's text in customTag, add it to the list
    if (selectedTags.includes("Others") && customTag.trim()) {
      finalTags = finalTags.filter(t => t !== "Others"); // Remove placeholder
      finalTags.push(customTag.trim()); // Add actual custom tag
    }
    
    onApply({ tags: finalTags });
    onClose();
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative z-10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Title */}
            <h2 className="text-center font-extrabold text-2xl text-gray-800 tracking-tight">Search Filter</h2>
            <p className="text-center text-gray-400 text-sm mt-1 mb-8">Refine your recordings by category</p>

            {/* Tags Section */}
            <div className="mt-7">
              <p className="text-sm font-bold text-gray-600 mb-4 uppercase tracking-widest">Select Tags</p>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <motion.button
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleItem(tag, selectedTags, setSelectedTags)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? "border-blue-600 text-blue-600 bg-blue-50 shadow-md shadow-blue-100"
                        : "border-gray-100 text-gray-500 hover:border-blue-200"
                    }`}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Custom Tag Input - Only shows if 'Others' is selected */}
            <AnimatePresence>
                {selectedTags.includes("Others") && (
                <motion.div 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                >
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Custom Tag Name</label>
                    <input 
                    type="text" 
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium"
                    placeholder="e.g. Brainstorming"
                    />
                </motion.div>
                )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApply}
                className="w-full py-4 rounded-2xl text-white font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition active:scale-95"
              >
                Apply Filters
              </motion.button>
              
              <motion.button
                whileHover={{ backgroundColor: "#F9FAFB" }}
                onClick={onClose}
                className="w-full py-4 rounded-2xl border-2 border-gray-100 text-gray-500 font-bold transition active:scale-95"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FilterModal;
