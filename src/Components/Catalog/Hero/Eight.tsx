import React from 'react';

type Props = {
    isBuild?: boolean;
    isDarkMode: boolean;
    headline: string;
    subHeadline: string;
    ctaText: string;
    imageHero: string | null;
}

const Eight = ({ isDarkMode, headline, subHeadline, ctaText }: Props) => {
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
        <section className="w-full max-w-7xl mx-auto py-6 px-4">
            <div className={`relative overflow-hidden p-8 md:p-12 border-[6px] transition-all duration-500 rounded-md
                ${isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white'
                    : 'bg-[#fdfcf8] border-slate-900 shadow-2xl'
                }`}
            >
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto">

                    {/* Judul Utama dengan Tracking yang ketat */}
                    <h2 className="text-3xl md:text-5xl font-serif font-medium tracking-tighter mb-6 leading-tight">
                        {headline}
                    </h2>

                    {/* Sub-headline dengan Font Serif Italic */}
                    <p className="text-sm md:text-base max-w-lg opacity-70 mb-10 font-serif italic tracking-[0.05em] leading-relaxed">
                        {subHeadline}
                    </p>

                    {/* Button Minimalist Editorial */}
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:block h-[1px] w-16 bg-slate-400/50" />

                        <button
                            onClick={handleScroll}
                            className="px-10 py-3 border border-slate-900 font-bold tracking-[0.2em] uppercase text-xs hover:bg-slate-900 hover:text-white transition-all duration-300"
                        >
                            {ctaText}
                        </button>

                        <div className="hidden sm:block h-[1px] w-16 bg-slate-400/50" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Eight;