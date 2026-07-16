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

    return (
        <section className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Kontainer dengan Border Chunky (Gaya Brutalism) */}
            <div className={`rounded-2xl p-6 md:p-10 overflow-hidden relative border-[3px] border-black transition-all duration-300
                ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white'}
                shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1
            `}>
                
                <div className="grid md:grid-cols-5 gap-8 items-center">
                    {/* Kolom Teks */}
                    <div className="md:col-span-3 space-y-5">
                        <div className="inline-block px-4 py-1 bg-black text-white text-[10px] font-black uppercase italic tracking-widest">
                            {title}
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.95] tracking-tighter">
                            {headline}
                        </h2>
                        
                        <p className="text-base md:text-lg font-medium opacity-80 max-w-md">
                            {subHeadline}
                        </p>
                        
                        <div className="pt-2">
                            <button 
                                onClick={handleScroll} 
                                className="group flex items-center gap-3 px-8 py-3.5 bg-[var(--hero-primary-color)] text-[var(--hero-secondary-color)] border-[3px] border-black font-black text-base md:text-lg uppercase transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                            >
                                {ctaText}
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>

                    {/* Kolom Gambar */}
                    <div className="md:col-span-2 relative">
                        {/* Glow Efek yang lebih halus */}
                        <div className="absolute inset-0 bg-[var(--hero-primary-color)] blur-2xl opacity-20 animate-pulse" />
                        
                        {imageHero && (
                            <img 
                                src={imageHero} 
                                alt="Hero" 
                                className="relative z-1 w-full h-56 md:h-[300px] object-cover border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" 
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Six;