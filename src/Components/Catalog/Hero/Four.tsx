import React from 'react';
import { ArrowRight } from 'lucide-react';

type Props = {
    isBuild?: boolean;
    isDarkMode: boolean;
    headline: string;
    subHeadline: string;
    ctaText: string;
    imageHero: string | null; // Tidak digunakan dalam layout ini
    title: string; // <-- FIX: Ditambahkan agar label dinamis
}

const Four = ({ isDarkMode, headline, subHeadline, ctaText, title }: Props) => {
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
            {/* Kontainer Utama dengan Padding Responsif */}
            <div className={`relative p-6 sm:p-8 md:p-12 rounded-xl sm:rounded-2xl transition-all duration-500 border
                ${isDarkMode
                    ? 'bg-slate-900 border-white/20 text-white shadow-xl'
                    : 'bg-[#faf9f6] border-[var(--hero-primary-color)]/20 text-slate-900 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]'
                }`}
            >
                {/* Aksen Sudut (Corner Accents) - Tampil di semua layar tapi lebih kecil di mobile */}
                <div className={`absolute top-3 sm:top-4 left-3 sm:left-4 w-2 sm:w-3 h-2 sm:h-3 border-t border-l ${isDarkMode ? 'border-white/40' : 'border-[var(--hero-primary-color)]/40'}`} />
                <div className={`absolute top-3 sm:top-4 right-3 sm:right-4 w-2 sm:w-3 h-2 sm:h-3 border-t border-r ${isDarkMode ? 'border-white/40' : 'border-[var(--hero-primary-color)]/40'}`} />
                <div className={`absolute bottom-3 sm:bottom-4 left-3 sm:left-4 w-2 sm:w-3 h-2 sm:h-3 border-b border-l ${isDarkMode ? 'border-white/40' : 'border-[var(--hero-primary-color)]/40'}`} />
                <div className={`absolute bottom-3 sm:bottom-4 right-3 sm:right-4 w-2 sm:w-3 h-2 sm:h-3 border-b border-r ${isDarkMode ? 'border-white/40' : 'border-[var(--hero-primary-color)]/40'}`} />

                <div className="max-w-3xl mx-auto text-center relative z-10 px-2 sm:px-0">

                    {/* Label/Kicker (Dinamis) */}
                    <p className={`text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase font-semibold mb-3 sm:mb-4 ${isDarkMode ? 'text-slate-400' : 'text-[var(--hero-primary-color)]/80'}`}>
                        {title || "Exclusive Offer"}
                    </p>

                    {/* Judul Utama Serif */}
                    <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.2] lg:leading-[1.15] mb-4 sm:mb-6
                        ${isDarkMode ? '' : 'text-[var(--hero-primary-color)]'}
                    `}>
                        {headline}
                    </h2>

                    {/* Ornamen Pembatas (Diamond Divider) */}
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-5 sm:mb-8 w-full max-w-[200px] sm:max-w-[250px] mx-auto opacity-70">
                        <div className={`h-[1px] flex-1 ${isDarkMode ? 'bg-gradient-to-r from-transparent to-white/40' : 'bg-gradient-to-r from-transparent to-[var(--hero-primary-color)]/40'}`} />
                        <div className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rotate-45 ${isDarkMode ? 'bg-white/40' : 'bg-[var(--hero-primary-color)]/40'}`} />
                        <div className={`h-[1px] flex-1 ${isDarkMode ? 'bg-gradient-to-l from-transparent to-white/40' : 'bg-gradient-to-l from-transparent to-[var(--hero-primary-color)]/40'}`} />
                    </div>

                    {/* Sub-judul */}
                    <p className={`text-sm sm:text-base md:text-lg mb-8 sm:mb-10 leading-relaxed font-serif italic max-w-xs sm:max-w-xl md:max-w-2xl mx-auto
                        ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}
                    `}>
                        {subHeadline}
                    </p>

                    {/* Tombol CTA bergaya Neo-Vintage / Tactile */}
                    <div className="relative inline-flex group cursor-pointer w-[90%] sm:w-auto">
                        {/* Bayangan Solid (Solid Offset Shadow) */}
                        <div className={`absolute inset-0 translate-x-1 sm:translate-x-1.5 translate-y-1 sm:translate-y-1.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:translate-y-0.5 
                            ${isDarkMode ? 'bg-[var(--hero-secondary-color)]' : 'bg-[var(--hero-primary-color)]'}
                        `} />

                        {/* Tombol Utama */}
                        <button
                            onClick={handleScroll}
                            className={`relative flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto px-6 py-3.5 sm:py-3 border border-current font-bold uppercase tracking-[0.15em] text-[10px] sm:text-xs md:text-sm transition-transform duration-300 ease-out group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1
                                ${isDarkMode ? 'text-[var(--hero-primary-color)] bg-slate-900' : 'bg-[#faf9f6] text-[var(--hero-primary-color)]'}
                            `}
                        >
                            {ctaText}
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Four;