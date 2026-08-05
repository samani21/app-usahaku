import React from 'react'

const LandingSkeleton = () => (
    <div className="min-h-screen bg-[#FAFAFA] w-full overflow-hidden animate-pulse">
        {/* Skeleton Header */}
        <div className="w-full h-24 px-6 md:px-8 flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                <div className="w-32 h-8 bg-slate-200 rounded-lg"></div>
            </div>
            <div className="hidden md:flex gap-8">
                <div className="w-16 h-4 bg-slate-200 rounded-full"></div>
                <div className="w-16 h-4 bg-slate-200 rounded-full"></div>
                <div className="w-16 h-4 bg-slate-200 rounded-full"></div>
                <div className="w-16 h-4 bg-slate-200 rounded-full"></div>
            </div>
            <div className="w-36 h-12 bg-slate-200 rounded-full hidden md:block"></div>
        </div>

        {/* Skeleton Hero Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-20 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 flex flex-col items-center lg:items-start">
                <div className="w-48 h-8 bg-slate-200 rounded-full mb-4"></div>
                <div className="w-full max-w-md h-16 bg-slate-200 rounded-2xl"></div>
                <div className="w-3/4 max-w-sm h-16 bg-slate-200 rounded-2xl"></div>
                <div className="w-full max-w-lg h-24 bg-slate-200 rounded-xl mt-6"></div>
                <div className="flex gap-4 mt-8 w-full justify-center lg:justify-start">
                    <div className="w-48 h-14 bg-slate-200 rounded-xl"></div>
                    <div className="w-40 h-14 bg-slate-200 rounded-xl"></div>
                </div>
            </div>
            <div className="w-full h-[500px] bg-slate-200 rounded-[2.5rem] shadow-sm"></div>
        </div>
    </div>
);


export default LandingSkeleton