import { Zap, ArrowRight } from 'lucide-react';
import React from 'react';

type Props = {
    isBuild?: boolean;
    isDarkMode: boolean;
    headline: string;
    subHeadline: string;
    ctaText: string;
    imageHero: string | null;
    title: string;
}

const Nine = ({ isDarkMode, headline, subHeadline, ctaText, imageHero, title }: Props) => {
    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // Variabel tema dinamis agar efek cinematic tetap jalan di Light/Dark Mode
    const bgCard = isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-slate-50 text-slate-900';
    const gradientOverlay = isDarkMode 
        ? 'from-[#0f172a] via-[#0f172a]/60 to-transparent' 
        : 'from-slate-50 via-slate-50/60 to-transparent';

    return (
        <section className="w-full max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
            <div className={`${bgCard} rounded-[1.25rem] sm:rounded-2xl overflow-hidden grid md:grid-cols-12 shadow-2xl transition-colors duration-500 group/card`}>
                
                {/* Kolom Teks (Mobile: Bawah, Desktop: Kiri) */}
                <div className="order-2 md:order-1 md:col-span-7 p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-center relative z-10">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 text-[var(--hero-primary-color)] font-bold uppercase tracking-widest text-[10px] sm:text-xs">
                        <Zap className="w-3.5 h-3.5 fill-current" /> {title || "Showcase"}
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 uppercase tracking-tighter leading-[1.15] sm:leading-[1.1]">
                        {headline}
                    </h2>

                    <p className={`text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-lg leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {subHeadline}
                    </p>

                    <button
                        onClick={handleScroll}
                        className="group/btn w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(var(--hero-primary-color-rgb),0.4)] hover:-translate-y-0.5 bg-[var(--hero-primary-color)] text-[var(--hero-secondary-color)] text-sm sm:text-base"
                    >
                        {ctaText}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                </div>

                {/* Kolom Gambar dengan Cinematic Overlay (Mobile: Atas, Desktop: Kanan) */}
                <div className="order-1 md:order-2 md:col-span-5 relative h-[220px] sm:h-[300px] md:h-auto overflow-hidden">
                    {imageHero && (
                        <img
                            src={imageHero}
                            alt="Hero Banner"
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 transition-all duration-[2s] ease-out group-hover/card:scale-105 group-hover/card:grayscale-0 group-hover/card:opacity-100"
                        />
                    )}
                    
                    {/* Gradient Overlay: 
                        - Mobile (bg-gradient-to-t): Memudar ke atas, menyatu dengan teks di bawah
                        - Desktop (md:bg-gradient-to-r): Memudar ke kanan, menyatu dengan teks di kiri 
                    */}
                    <div className={`absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r ${gradientOverlay} pointer-events-none`} />
                </div>
                
            </div>
        </section>
    );
}

export default Nine;