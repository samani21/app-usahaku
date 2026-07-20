import React from 'react';

type Props = {
    isBuild?: boolean;
    isDarkMode: boolean;
    headline: string;
    subHeadline: string;
    ctaText: string;
    imageHero: string | null; // Tidak dipakai di layout ini, fokus di teks
    title: string; // <-- FIX: Menambahkan prop title
}

const Ten = ({ headline, subHeadline, ctaText, isDarkMode, title }: Props) => {
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
            <div className={`relative overflow-hidden p-6 sm:p-10 md:p-16 rounded-2xl sm:rounded-3xl text-center border transition-all duration-500
                ${isDarkMode
                    ? 'bg-slate-900 border-white/10'
                    : 'bg-white border-slate-100 shadow-2xl shadow-slate-200/50'
                }`}
            >
                {/* Aksen Cahaya Belakang (Soft Glow) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] sm:w-full h-full bg-gradient-to-b from-[var(--hero-primary-color)]/10 sm:from-[var(--hero-primary-color)]/5 to-transparent pointer-events-none" />

                <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                    
                    {/* Badge Title / Kicker */}
                    <span className={`inline-block mb-4 sm:mb-6 px-4 sm:px-5 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-widest border
                        ${isDarkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}
                    `}>
                        {title || "Highlight"}
                    </span>

                    {/* Headline */}
                    <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight leading-[1.2] sm:leading-[1.15] ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                        {headline}
                    </h2>

                    {/* Sub Headline */}
                    <p className={`mb-8 sm:mb-10 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg px-2 sm:px-0 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {subHeadline}
                    </p>

                    {/* Tombol CTA */}
                    <button
                        onClick={handleScroll}
                        className={`w-[90%] sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0
                            ${isDarkMode
                                ? 'bg-white text-slate-900 hover:bg-slate-200'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                    >
                        {ctaText}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Ten;