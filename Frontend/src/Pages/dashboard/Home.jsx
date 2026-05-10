import React from 'react';
import StatsCards from "../../Components/Dashboard/StatsCards";
import RecordBanner from "../../Components/Dashboard/RecordBanner";
import RecordList from "../../Components/Dashboard/RecordList";
import Searchbar from '../../Components/Dashboard/Searchbar';

/**
 * Home Component
 * Purpose: Main landing page of the dashboard providing an overview of statistics and recent activity.
 */
const Home = () => {
    // --- RENDER ---
    return (
        <div className="flex pt-18 md:pt-20 flex-col mb-18 ">
            {/* SEARCH COMPONENT */}
            <Searchbar />

            {/* MAIN DASHBOARD CONTENT */}
            <div className="py-4 md:py-2 px-4 md:px-10 lg:px-17">
                {/* STATISTICS OVERVIEW */}
                <StatsCards />

                {/* PROMOTIONAL BANNER */}
                <RecordBanner />

                {/* RECENT RECORDINGS LIST */}
                <RecordList />
                            </div>
        </div>
    );
};

export default Home;