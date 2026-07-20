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

const Elevent = ({ isDarkMode, headline, subHeadline, ctaText, imageHero, title }: Props) => {
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
            <div className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 transition-all flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-12
                ${isDarkMode
                    ? 'bg-slate-900 border border-slate-800 text-white shadow-2xl'
                    : 'bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100'
                }`}
            >
                {/* Kolom Gambar dengan Efek Floating & Tilted */}
                {imageHero && (
                    <div className="w-full md:w-1/3 aspect-square max-w-[180px] sm:max-w-[240px] flex-shrink-0 mt-2 md:mt-0">
                        <div className={`w-full h-full rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden rotate-[-4deg] transition-all duration-500 hover:rotate-0 hover:scale-105 border-[4px] sm:border-[6px] 
                            ${isDarkMode ? 'border-slate-800 shadow-[0_15px_30px_rgba(0,0,0,0.5)]' : 'border-white shadow-[0_15px_30px_rgba(0,0,0,0.15)]'}
                        `}>
                            <img 
                                src={imageHero} 
                                alt="Hero Avatar" 
                                loading="lazy"
                                className="w-full h-full object-cover scale-105" 
                            />
                        </div>
                    </div>
                )}

                {/* Kolom Teks */}
                <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start w-full">
                    
                    {/* Badge / Title Kicker */}
                    <span className="inline-block mb-3 sm:mb-4 text-[10px] sm:text-xs font-black uppercase tracking-widest text-[var(--hero-primary-color)]">
                        {title || "Highlight"}
                    </span>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 leading-[1.15] sm:leading-[1.1] tracking-tight">
                        {headline}
                    </h2>
                    
                    <p className={`text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-lg leading-relaxed
                        ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}
                    `}>
                        {subHeadline}
                    </p>
                    
                    <button
                        onClick={handleScroll}
                        className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-3.5 bg-[var(--hero-primary-color)] text-[var(--hero-secondary-color)] text-sm sm:text-base rounded-full font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(var(--hero-primary-color-rgb),0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                    >
                        {ctaText}
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Elevent;