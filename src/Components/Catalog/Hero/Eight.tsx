import React from 'react';

type Props = {
    isBuild?: boolean;
    isDarkMode: boolean;
    headline: string;
    subHeadline: string;
    ctaText: string;
    imageHero: string | null; // Tidak digunakan di layout tipografi murni ini
    title: string; // <-- FIX: Menambahkan title
}

const Eight = ({ isDarkMode, headline, subHeadline, ctaText, title }: Props) => {
    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };

    return (
        <section className="w-full max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
            <div className={`relative overflow-hidden p-6 sm:p-8 md:p-12 border-[4px] sm:border-[6px] transition-all duration-500 rounded-md
                ${isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'bg-[#fdfcf8] border-slate-900 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)]'
                }`}
            >
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto">

                    {/* Title / Kicker */}
                    <span className={`text-[10px] sm:text-xs font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-4 sm:mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {title || "Editorial"}
                    </span>

                    {/* Judul Utama dengan Tracking yang ketat */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium tracking-tighter mb-4 sm:mb-6 leading-[1.15] sm:leading-tight px-2">
                        {headline}
                    </h2>

                    {/* Sub-headline dengan Font Serif Italic */}
                    <p className={`text-sm md:text-base max-w-lg mb-8 sm:mb-10 font-serif italic tracking-[0.05em] leading-relaxed px-2 sm:px-4 
                        ${isDarkMode ? 'text-slate-300 opacity-90' : 'text-slate-600'}
                    `}>
                        {subHeadline}
                    </p>

                    {/* Button Minimalist Editorial */}
                    <div className="flex items-center justify-center gap-4 sm:gap-6 w-full px-4 sm:px-0">
                        <div className={`hidden sm:block h-[1px] w-12 md:w-16 ${isDarkMode ? 'bg-white/30' : 'bg-slate-900/30'}`} />

                        <button
                            onClick={handleScroll}
                            className={`w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-3 border-[1.5px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[10px] sm:text-xs transition-all duration-300
                                ${isDarkMode 
                                    ? 'border-white text-white hover:bg-white hover:text-slate-900' 
                                    : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
                                }`}
                        >
                            {ctaText}
                        </button>

                        <div className={`hidden sm:block h-[1px] w-12 md:w-16 ${isDarkMode ? 'bg-white/30' : 'bg-slate-900/30'}`} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Eight;