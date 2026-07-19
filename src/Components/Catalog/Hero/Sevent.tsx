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
        <section className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Split Screen Container dengan Sudut yang Rapi */}
            <div className={`grid md:grid-cols-2 overflow-hidden rounded-2xl shadow-xl border ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'}`}>
                
                {/* Sisi Gambar (Dibatasi tingginya agar tidak terlalu tinggi) */}
                <div className="h-[300px] md:h-[400px] w-full overflow-hidden">
                    {imageHero && (
                        <img 
                            src={imageHero} 
                            alt="Hero" 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s] ease-out" 
                        />
                    )}
                </div>

                {/* Sisi Teks (Padding Proporsional) */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <span className={`text-[10px] font-bold tracking-[0.3em] mb-4 uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        {title}
                    </span>
                    
                    <h2 className="text-3xl md:text-4xl font-light mb-8 leading-tight tracking-tight">
                        <span className={`font-semibold underline decoration-2 underline-offset-8 decoration-[var(--hero-primary-color)]`}>
                            {headline}
                        </span>
                    </h2>

                    <p className={`text-base md:text-lg mb-10 border-l-2 pl-6 leading-relaxed ${isDarkMode ? 'text-slate-400 border-[var(--hero-primary-color)]' : 'text-slate-600 border-[var(--hero-primary-color)]'}`}>
                        {subHeadline}
                    </p>

                    <button 
                        onClick={handleScroll} 
                        className="group flex items-center justify-between w-full md:max-w-[250px] py-4 px-6 bg-slate-900 text-white text-xs font-bold tracking-[0.2em] uppercase transition-all hover:bg-black"
                    >
                        {ctaText}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Sevent;