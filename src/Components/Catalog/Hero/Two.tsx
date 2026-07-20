import React from 'react';
import { ArrowRight } from 'lucide-react';

type Props = {
    isBuild?: boolean;
    isDarkMode: boolean;
    headline: string;
    subHeadline: string;
    ctaText: string;
    imageHero: string | null;
    title: string; // <-- FIX: Prop title ditambahkan agar datanya dinamis
}

const Two = ({ isDarkMode, headline, subHeadline, ctaText, imageHero, title }: Props) => {
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
            {/* Pembungkus Utama dengan Tinggi yang Responsif */}
            <div className={`relative min-h-[350px] sm:min-h-[400px] md:min-h-[480px] lg:min-h-[550px] flex items-center justify-center rounded-[1.25rem] sm:rounded-[2rem] overflow-hidden group shadow-2xl ${isDarkMode ? 'ring-1 ring-white/10' : ''}`}>

                {/* Gambar Latar dengan Slow Zoom Effect */}
                {imageHero ? (
                    <img
                        src={imageHero}
                        alt="Hero Banner"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute inset-0 bg-slate-800" />
                )}

                {/* Gradasi Overlay (Gelap di bawah agar teks & tombol terbaca, transparan di atas) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-700" />

                {/* Border Dalam (Inner Frame) opsional untuk kesan bingkai foto (Hidden di mobile super kecil) */}
                <div className="absolute inset-3 sm:inset-4 md:inset-5 border border-white/20 rounded-[1rem] sm:rounded-[1.2rem] pointer-events-none hidden sm:block"></div>

                {/* Konten Teks */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-5 sm:p-8 md:p-10 w-full max-w-3xl mx-auto mt-4 sm:mt-0">

                    {/* Label Sub-judul Kecil (Dibuat Dinamis menggunakan title) */}
                    <span className="text-white/80 uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] md:text-xs font-semibold mb-3 sm:mb-4">
                        {title || "Premium Collection"}
                    </span>

                    {/* Headline dengan Font Serif */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-3 sm:mb-4 tracking-wide drop-shadow-lg leading-[1.15] md:leading-tight px-2">
                        {headline}
                    </h2>

                    {/* Garis Dekoratif Editorial */}
                    <div className="w-8 sm:w-12 h-[2px] bg-[var(--hero-primary-color)]/90 mb-4 sm:mb-6 rounded-full"></div>

                    {/* Sub Headline */}
                    <p className="text-white/90 text-sm sm:text-base md:text-lg font-light max-w-xs sm:max-w-xl md:max-w-2xl mb-6 sm:mb-8 drop-shadow-md leading-relaxed">
                        {subHeadline}
                    </p>

                    {/* Tombol CTA Luxury */}
                    <button
                        onClick={handleScroll}
                        className="group/btn relative overflow-hidden inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-black font-semibold tracking-widest uppercase text-[10px] sm:text-xs md:text-sm rounded-none border border-white hover:bg-black/20 hover:text-white hover:backdrop-blur-md transition-all duration-500 ease-in-out"
                    >
                        <span className="relative z-10">{ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Two;