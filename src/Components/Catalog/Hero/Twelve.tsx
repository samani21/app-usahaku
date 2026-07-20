import React from 'react';
import { ArrowRight } from 'lucide-react';

type Props = {
    isBuild?: boolean;
    isDarkMode: boolean;
    headline: string;
    subHeadline: string;
    ctaText: string;
    imageHero: string | null;
    title: string; // <-- FIX: Menambahkan prop title
}

const Twelve = ({ isDarkMode, headline, subHeadline, ctaText, imageHero, title }: Props) => {
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
            <div className={`relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 md:p-12 transition-all duration-500
                ${isDarkMode
                    ? 'bg-slate-900 border border-white/10'
                    : 'bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100'
                }`}
            >
                {/* Background Gradient Subtle menggunakan warna tema */}
                <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-[var(--hero-primary-color)]/10 via-transparent to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12">

                    {/* Teks Content */}
                    <div className="max-w-xl text-center md:text-left flex flex-col items-center md:items-start w-full">

                        {/* Title / Kicker */}
                        <span className="inline-block mb-3 sm:mb-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--hero-primary-color)]">
                            {title || "Innovation"}
                        </span>

                        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 uppercase tracking-tighter leading-[1.15] sm:leading-[1.1] italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {headline}
                        </h2>

                        <p className={`text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed max-w-md md:max-w-none ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {subHeadline}
                        </p>

                        <button
                            onClick={handleScroll}
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-[var(--hero-primary-color)] text-[var(--hero-secondary-color)] rounded-full text-sm sm:text-base font-bold shadow-lg hover:shadow-[0_8px_25px_rgba(var(--hero-primary-color-rgb),0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                        >
                            {ctaText}
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                    </div>

                    {/* Orbital Element (Image Container) */}
                    <div className="flex-shrink-0 mt-2 md:mt-0">
                        <div className="relative w-52 h-52 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center">

                            {/* Layer 1: Spinning Orbital Ring (Garis dan titik yang berputar) */}
                            <div className="absolute inset-0 rounded-full border border-[var(--hero-primary-color)]/30 animate-[spin_10s_linear_infinite]">
                                {/* Titik utama */}
                                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[var(--hero-primary-color)] rounded-full shadow-[0_0_12px_var(--hero-primary-color)]" />
                                {/* Titik sekunder (opsional, agar lebih keren) */}
                                <div className="absolute bottom-4 right-4 w-1.5 h-1.5 bg-[var(--hero-primary-color)] rounded-full opacity-60" />
                            </div>

                            {/* Layer 2: Static Inner Circle (Latar statis di belakang gambar) */}
                            <div className={`absolute inset-3 rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-slate-900/5'}`} />

                            {/* Layer 3: Static Image (Gambar tetap tegak, tidak ikut berputar) */}
                            {imageHero && (
                                <img
                                    src={imageHero}
                                    loading="lazy"
                                    className="relative z-10 rounded-full object-cover w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 shadow-2xl transition-transform duration-500 hover:scale-105 border-[4px]"
                                    style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,1)' }}
                                    alt="Hero Avatar"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Twelve;