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

const Fifteen = ({ isDarkMode, headline, subHeadline, ctaText, imageHero, title }: Props) => {
    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="w-full max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
            <div className={`grid md:grid-cols-2 bg-[var(--hero-primary-color)] text-white rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300
                ${isDarkMode ? 'shadow-none border border-white/10' : 'shadow-2xl shadow-[var(--hero-primary-color)]/20'}
            `}>

                {/* Bagian Teks (Mobile: Bawah, Desktop: Kiri) */}
                <div className="p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center items-start text-left order-2 md:order-1 relative z-10">

                    {/* Title / Kicker */}
                    <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase mb-4 opacity-80">
                        {title || "Featured"}
                    </span>

                    {/* Aksen Garis */}
                    <div className="w-12 h-[2px] bg-white/50 mb-6 sm:mb-8" />

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-4 sm:mb-6 leading-[1.15] sm:leading-[1.1] italic">
                        {headline}
                    </h2>

                    <p className="text-white/80 mb-8 sm:mb-10 max-w-sm text-sm sm:text-base md:text-lg leading-relaxed">
                        {subHeadline}
                    </p>

                    <button
                        onClick={handleScroll}
                        className="group flex items-center justify-center w-full sm:w-auto gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-[var(--hero-secondary-color,white)] text-[var(--hero-primary-color)] font-bold uppercase tracking-[0.15em] text-xs sm:text-sm hover:opacity-90 active:scale-95 transition-all duration-300"
                    >
                        {ctaText}
                        <ArrowRight className="w-4 h-4 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </div>

                {/* Bagian Gambar (Mobile: Atas, Desktop: Kanan) */}
                <div className="relative order-1 md:order-2 h-[240px] sm:h-[300px] md:h-auto min-h-[240px] bg-black/10">
                    {imageHero && (
                        <img
                            src={imageHero}
                            alt="Hero Banner"
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[2s] hover:scale-105"
                        />
                    )}
                    {/* Gradasi Overlay: Menyatu dengan blok warna di sebelahnya */}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[var(--hero-primary-color)] via-[var(--hero-primary-color)]/40 md:via-[var(--hero-primary-color)]/20 to-transparent pointer-events-none" />
                </div>
            </div>
        </section>
    );
}

export default Fifteen;