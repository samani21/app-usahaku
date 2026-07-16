import { ShoppingBag, Star, ArrowRight } from 'lucide-react';
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

const One = ({ isDarkMode, headline, subHeadline, ctaText, imageHero, title }: Props) => {
    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };

    const Badge = () => (
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 mb-4 
            ${isDarkMode
                ? 'bg-white/5 border-white/10 text-slate-300 backdrop-blur-md'
                : 'bg-slate-50 border-slate-200 text-slate-600 shadow-sm'
            }`}
        >
            <Star className={`w-3.5 h-3.5 ${isDarkMode ? 'text-yellow-400 fill-yellow-400' : 'text-amber-500 fill-amber-500'}`} />
            {title}
        </div>
    );

    return (
        <section className="relative w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Dekorasi Latar Belakang Subtil (Glow Effect) */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-40 blur-[100px] pointer-events-none">
                <div className={`w-[20rem] h-[20rem] rounded-full ${isDarkMode ? 'bg-[var(--hero-primary-color)]/30' : 'bg-[var(--hero-primary-color)]/20'}`}></div>
            </div>

            <div className={`relative flex flex-col lg:flex-row items-center gap-10 lg:gap-12 rounded-[2rem] overflow-hidden p-6 md:p-10 border 
                ${isDarkMode
                    ? 'bg-slate-900/80 border-white/10 shadow-xl backdrop-blur-xl text-white'
                    : 'bg-white/90 border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] backdrop-blur-xl text-slate-900'
                }`}
            >
                {/* Sisi Teks */}
                <div className="flex-1 flex flex-col items-start w-full z-10">
                    <Badge />

                    <h2 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-[1.15] tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {headline}
                    </h2>

                    <p className={`text-base md:text-lg leading-relaxed mb-8 max-w-xl ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {subHeadline}
                    </p>

                    <button
                        onClick={handleScroll}
                        className="group relative inline-flex items-center justify-center gap-3 px-6 py-3.5 w-full sm:w-auto rounded-xl text-white font-semibold transition-all duration-300 ease-out bg-[var(--hero-primary-color)] hover:shadow-[0_8px_25px_rgb(var(--hero-primary-color-rgb),0.3)] hover:-translate-y-0.5 overflow-hidden"
                    >
                        <ShoppingBag className="w-4 h-4 relative z-10" />
                        <span className="relative z-10 text-sm md:text-base">{ctaText}</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />

                        {/* Efek Kilap (Shine) pada Hover */}
                        <div className="absolute inset-0 -translate-x-full bg-white/20 group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></div>
                    </button>
                </div>

                {/* Sisi Gambar */}
                {imageHero && (
                    <div className="flex-1 w-full lg:w-auto relative group">
                        {/* Glow Image Hover */}
                        <div className={`absolute inset-0 rounded-[1.5rem] blur-xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${isDarkMode ? 'bg-white/10' : 'bg-[var(--hero-primary-color)]/20'}`}></div>

                        {/* Tinggi gambar dikurangi signifikan di sini */}
                        <div className="relative h-[280px] sm:h-[350px] lg:h-[380px] w-full rounded-[1.5rem] overflow-hidden shadow-lg ring-1 ring-black/5">
                            <img
                                src={imageHero}
                                alt="Hero"
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            {/* Overlay tipis untuk kedalaman gambar */}
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[1.5rem]"></div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default One;