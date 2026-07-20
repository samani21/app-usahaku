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

const Sevent = ({ isDarkMode, headline, subHeadline, ctaText, imageHero, title }: Props) => {
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
            {/* Split Screen Container dengan Sudut yang Rapi */}
            <div className={`grid md:grid-cols-2 overflow-hidden rounded-[1.25rem] sm:rounded-2xl shadow-xl border transition-colors duration-300 
                ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'}
            `}>
                
                {/* Sisi Gambar (Di mobile ada di atas, di desktop memenuhi tinggi grid) */}
                <div className="h-[240px] sm:h-[300px] md:h-full min-h-[240px] md:min-h-[400px] lg:min-h-[450px] w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                    {imageHero && (
                        <img 
                            src={imageHero} 
                            alt="Hero Banner" 
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-[2s] ease-out" 
                        />
                    )}
                </div>

                {/* Sisi Teks (Padding Proporsional) */}
                <div className="p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-center">
                    
                    {/* Kicker Title */}
                    <span className={`text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4 uppercase 
                        ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}
                    `}>
                        {title || "Collection"}
                    </span>
                    
                    {/* Headline */}
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-6 sm:mb-8 leading-[1.2] sm:leading-tight tracking-tight">
                        <span className="font-semibold underline decoration-2 underline-offset-4 sm:underline-offset-8 decoration-[var(--hero-primary-color)]">
                            {headline}
                        </span>
                    </h2>

                    {/* Sub Headline */}
                    <p className={`text-sm sm:text-base md:text-lg mb-8 sm:mb-10 border-l-2 pl-4 sm:pl-6 leading-relaxed 
                        ${isDarkMode ? 'text-slate-300 border-[var(--hero-primary-color)]' : 'text-slate-600 border-[var(--hero-primary-color)]'}
                    `}>
                        {subHeadline}
                    </p>

                    {/* Tombol CTA (Disesuaikan dengan warna tema dinamis) */}
                    <button 
                        onClick={handleScroll} 
                        className="group flex items-center justify-between w-full md:max-w-[260px] py-3.5 sm:py-4 px-5 sm:px-6 bg-[var(--hero-primary-color)] text-[var(--hero-secondary-color)] text-[10px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
                    >
                        <span>{ctaText}</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                    
                </div>
            </div>
        </section>
    );
}

export default Sevent;