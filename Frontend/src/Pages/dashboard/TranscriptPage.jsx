import React from 'react';
import { NavLink, Outlet } from "react-router-dom";
import Searchbar from '../../Components/Dashboard/Searchbar';

/**
 * TranscriptPage Component
 * Purpose: Provides a tabbed interface for viewing transcripts, summaries, and action items of a recording.
 */
const TranscriptPage = () => {
    // --- RENDER ---
    return (
        <div className='pt-18 md:pt-20 text-geist'>
            <Searchbar />

            {/* TAB NAVIGATION SECTION */}
            <div className="mx-4 md:mx-10 lg:mx-18 mt-6 md:mt-8 mb-4 md:mb-6">
                
                <div className="flex items-center bg-[#E4E7EE]  text-[#111827] text-[18px] md:text-base font-semibold p-1 rounded-xl w-fit">
                    
                    {/* Transcript */}
                    <NavLink
                        to="/dashboard/transcript"
                        end
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg transition ${
                                isActive
                                    ? "bg-white text-gray-900"
                                    : "text-[#111827] hover:text-gray-700"
                            }`
                        }
                    >
                        Transcript
                    </NavLink>

                    {/* Summary */}
                    <NavLink
                        to="/dashboard/transcript/summary"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg transition ${
                                isActive
                                    ? "bg-white text-gray-900"
                                    : "text-[#111827] hover:text-gray-700"
                            }`
                        }
                    >
                        Summary
                    </NavLink>

                    {/* To-Do */}
                    <NavLink
                        to="/dashboard/transcript/todo"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg transition ${
                                isActive
                                    ? "bg-white text-gray-900"
                                    : "text-[#111827] hover:text-gray-700"
                            }`
                        }
                    >
                        To-Do
                    </NavLink>

                </div>
            </div>

            {/* NESTED CONTENT SECTION */}
            <div className="mx-4 md:mx-10 lg:mx-18 text-geist">
                <Outlet />
            </div>
        </div>
    );
};

export default TranscriptPage;
