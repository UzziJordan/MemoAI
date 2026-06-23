import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Dashboard/Sidebar";

/**
 * DashboardLayout Component
 * Purpose: Provides a consistent layout for all dashboard pages, including a sidebar and content area.
 */
const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- RENDER ---
    return (
        <div className="flex h-screen text-geist bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* NAVIGATION SIDEBAR */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* MAIN CONTENT AREA */}
            <div className="bg-[#EFF2F9] dark:bg-gray-950 h-screen flex-1 overflow-x-hidden w-full md:w-[85vw] transition-colors duration-300">
                <Outlet context={[isSidebarOpen, setIsSidebarOpen]} />
            </div>
        </div>
    );
};

export default DashboardLayout;
