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

const Thirteen = ({ isDarkMode, headline, subHeadline, ctaText, imageHero }: Props) => {
    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="w-full max-w-7xl mx-auto py-6 px-4">
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
                
                {/* Kolom Teks */}
                <div className={`p-8 md:p-12 rounded-2xl flex flex-col justify-center transition-colors duration-500
                    ${!imageHero ? 'col-span-3' : 'md:col-span-1'}
                    ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 border border-slate-100'}
                `}>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 leading-[1.1]">
                        {headline}
                    </h2>
                    <p className="text-sm md:text-base opacity-70 leading-relaxed mb-10 max-w-sm">
                        {subHeadline}
                    </p>
                    
                    <button 
                        onClick={handleScroll} 
                        className="group inline-flex items-center gap-2 self-start text-xs font-bold tracking-[0.2em] uppercase border-b-2 border-[var(--hero-primary-color)] pb-1 transition-all hover:gap-4"
                    >
                        {ctaText}
                        <ArrowRight className="w-3.5 h-3.5 transition-transform" />
                    </button>
                </div>

                {/* Kolom Gambar */}
                {imageHero && (
                    <div className="md:col-span-2 h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg group">
                        <img 
                            src={imageHero} 
                            alt="Hero" 
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" 
                        />
                    </div>
                )}
            </div>
        </section>
    );
}

export default Thirteen;