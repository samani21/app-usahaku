import React from 'react';
import { ArrowRight } from 'lucide-react';

type Props = {
    isBuild?: boolean;
    isDarkMode: boolean;
    headline: string;
    subHeadline: string;
    ctaText: string;
    imageHero: string | null;
    title: string;
}

const Six = ({ isDarkMode, headline, subHeadline, ctaText, imageHero, title }: Props) => {
    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };

    // Variabel class dinamis agar JSX lebih bersih (Brutalism butuh border & shadow kontras)
    const borderClass = isDarkMode ? 'border-white' : 'border-black';
    const bgCardClass = isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900';
    
    // Shadow responsif: lebih kecil di mobile agar tidak mentok tepi layar
    const shadowClass = isDarkMode 
        ? 'shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] sm:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]' 
        : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]';
    
    const shadowHoverClass = isDarkMode
        ? 'hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] sm:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]'
        : 'hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]';
        
    const btnShadowHoverClass = isDarkMode 
        ? 'hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]' 
        : 'hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';

    return (
        <section className="w-full max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
            {/* Kontainer dengan Border Chunky (Gaya Neo-Brutalism) */}
            <div className={`rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 relative border-[2px] sm:border-[3px] transition-all duration-300
                ${bgCardClass} ${borderClass} ${shadowClass} ${shadowHoverClass} hover:-translate-x-0.5 hover:-translate-y-0.5 sm:hover:-translate-x-1 sm:hover:-translate-y-1
            `}>
                
                <div className="grid md:grid-cols-5 gap-8 lg:gap-10 items-center">
                    {/* Kolom Teks */}
                    <div className="md:col-span-3 space-y-4 sm:space-y-5">
                        {/* Kicker Badge */}
                        <div className={`inline-block px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-black uppercase italic tracking-widest border border-current
                            ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}
                        `}>
                            {title || "Featured"}
                        </div>
                        
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-[1] sm:leading-[0.95] tracking-tighter">
                            {headline}
                        </h2>
                        
                        <p className="text-sm sm:text-base md:text-lg font-medium opacity-80 max-w-md">
                            {subHeadline}
                        </p>
                        
                        <div className="pt-2 sm:pt-4">
                            <button 
                                onClick={handleScroll} 
                                className={`group flex items-center justify-center sm:justify-start gap-3 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-3 border-[2px] sm:border-[3px] font-black text-sm sm:text-base md:text-lg uppercase transition-all active:shadow-none active:translate-x-1 active:translate-y-1
                                    bg-[var(--hero-primary-color)] text-[var(--hero-secondary-color)] ${borderClass} ${btnShadowHoverClass}
                                `}
                            >
                                {ctaText}
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>

                    {/* Kolom Gambar */}
                    <div className="md:col-span-2 relative mt-2 md:mt-0">
                        {/* Glow Efek yang lebih halus */}
                        <div className="absolute inset-0 bg-[var(--hero-primary-color)] blur-xl sm:blur-2xl opacity-20 animate-pulse" />
                        
                        {imageHero && (
                            <img 
                                src={imageHero} 
                                alt="Hero Banner" 
                                loading="lazy"
                                className={`relative z-10 w-full h-[220px] sm:h-[280px] md:h-[300px] object-cover border-[2px] sm:border-[3px] ${borderClass} ${shadowClass}`} 
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Six;