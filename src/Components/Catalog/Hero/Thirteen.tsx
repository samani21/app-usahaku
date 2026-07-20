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

const Thirteen = ({ isDarkMode, headline, subHeadline, ctaText, imageHero, title }: Props) => {
    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="w-full max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
                
                {/* Kolom Teks */}
                <div className={`p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-[2rem] flex flex-col justify-center transition-colors duration-500
                    ${!imageHero ? 'col-span-3' : 'md:col-span-1'}
                    ${isDarkMode ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 border border-slate-200 shadow-sm'}
                `}>
                    
                    {/* Title / Kicker */}
                    <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-4 sm:mb-6 text-[var(--hero-primary-color)]">
                        {title || "Editorial"}
                    </span>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4 sm:mb-6 leading-[1.15] sm:leading-[1.1] tracking-tight">
                        {headline}
                    </h2>
                    
                    <p className={`text-sm sm:text-base leading-relaxed mb-8 sm:mb-10 max-w-sm
                        ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}
                    `}>
                        {subHeadline}
                    </p>
                    
                    <button 
                        onClick={handleScroll} 
                        className="group inline-flex items-center gap-2 self-start text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase border-b-2 border-[var(--hero-primary-color)] pb-1.5 transition-all duration-300 hover:gap-4 hover:opacity-70"
                    >
                        {ctaText}
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform" />
                    </button>
                </div>

                {/* Kolom Gambar */}
                {imageHero && (
                    <div className="md:col-span-2 min-h-[250px] sm:min-h-[350px] md:h-full rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-lg group relative bg-slate-100 dark:bg-slate-800">
                        <img 
                            src={imageHero} 
                            alt="Hero Banner" 
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105" 
                        />
                        {/* Overlay super tipis agar gambar sedikit nge-blend jika di dark mode */}
                        {isDarkMode && <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Thirteen;