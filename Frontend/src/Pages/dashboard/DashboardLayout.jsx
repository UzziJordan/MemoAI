import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Dashboard/Sidebar";
import { auth } from '../../lib/api';

/**
 * DashboardLayout Component
 * Purpose: Provides a consistent layout for all dashboard pages, including a sidebar and content area.
 */
const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("No token");
                }
                await auth.getProfile();
                setLoading(false);
            } catch (error) {
                // Not authenticated
                console.error("Auth check failed:", error);
                navigate('/Login');
            }
        };
        checkAuth();
    }, [navigate]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#EFF2F9]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

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