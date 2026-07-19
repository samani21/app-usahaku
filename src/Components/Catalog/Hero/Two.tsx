import React from 'react';
import { ArrowRight } from 'lucide-react';

type Props = {
    isBuild?: boolean;
    isDarkMode: boolean;
    headline: string;
    subHeadline: string;
    ctaText: string;
    imageHero: string | null;
}

const Two = ({ isDarkMode, headline, subHeadline, ctaText, imageHero }: Props) => {
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
        <section className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Pembungkus Utama dengan Tinggi yang Direduksi */}
            <div className={`relative min-h-[400px] md:min-h-[480px] flex items-center justify-center rounded-[2rem] overflow-hidden group shadow-2xl ${isDarkMode ? 'ring-1 ring-white/10' : ''}`}>

                {/* Gambar Latar dengan Slow Zoom Effect */}
                {imageHero ? (
                    <img
                        src={imageHero}
                        alt="Hero"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 bg-slate-800" /> // Fallback jika tidak ada gambar
                )}

                {/* Gradasi Overlay (Gelap di bawah dan tengah untuk teks, transparan di atas) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-opacity duration-700" />

                {/* Border Dalam (Inner Frame) opsional untuk kesan bingkai foto */}
                <div className="absolute inset-3 md:inset-4 border border-white/20 rounded-[1.2rem] pointer-events-none hidden md:block"></div>

                {/* Konten Teks yang Lebih Rapat */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 md:p-10 w-full max-w-3xl mx-auto">

                    {/* Label Sub-judul Kecil */}
                    <span className="text-white/70 uppercase tracking-[0.3em] text-[10px] md:text-xs font-semibold mb-4">
                        Premium Collection
                    </span>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 tracking-wide drop-shadow-md leading-tight">
                        {headline}
                    </h2>

                    {/* Garis Dekoratif Editorial */}
                    <div className="w-10 h-[2px] bg-[var(--hero-primary-color)]/80 mb-4"></div>

                    <p className="text-white/90 text-base md:text-lg font-light max-w-2xl mb-8 drop-shadow-sm leading-relaxed">
                        {subHeadline}
                    </p>

                    {/* Tombol CTA Luxury (Proporsional) */}
                    <button
                        onClick={handleScroll}
                        className="group/btn relative overflow-hidden inline-flex items-center gap-3 px-8 py-3 bg-white text-black font-semibold tracking-widest uppercase text-xs md:text-sm rounded-none border border-white hover:bg-black/20 hover:text-white hover:backdrop-blur-md transition-all duration-500 ease-in-out"
                    >
                        <span className="relative z-10">{ctaText}</span>
                        <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Two;