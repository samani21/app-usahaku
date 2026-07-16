import React from 'react';
import { ArrowUpRight } from 'lucide-react';

type Props = {
    isBuild?: boolean;
    isDarkMode: boolean;
    headline: string;
    subHeadline: string;
    ctaText: string;
    imageHero: string | null;
}

const Three = ({ isDarkMode, headline, subHeadline, ctaText, imageHero }: Props) => {
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
            <div className={`relative p-6 md:p-10 lg:p-12 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden transition-colors duration-300
                ${isDarkMode
                    ? 'bg-slate-900/90 border border-white/5 backdrop-blur-2xl shadow-xl text-white'
                    : 'bg-slate-50/80 border border-slate-200/50 backdrop-blur-2xl shadow-[0_8px_20px_rgb(0,0,0,0.04)] text-slate-900'
                }`}
            >
                {/* Elemen Dekoratif: Lingkaran Cahaya Latar */}
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[25rem] h-[25rem] bg-[var(--hero-primary-color)]/10 rounded-full blur-[70px] pointer-events-none" />

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-10 items-center relative z-10">

                    {/* Kolom Teks */}
                    <div className="flex-1 space-y-6 w-full">
                        {/* Garis Aksen Premium */}
                        <div className="w-12 h-1.5 rounded-full bg-gradient-to-r from-[var(--hero-primary-color)] to-[var(--hero-primary-color)]/30" />

                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight">
                                {headline}
                            </h2>
                            <p className={`text-base md:text-lg font-medium leading-relaxed max-w-xl ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                {subHeadline}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <button
                                onClick={handleScroll}
                                className="group flex items-center gap-2 px-6 py-3 rounded-full text-sm md:text-base text-[var(--hero-secondary-color)] font-bold bg-[var(--hero-primary-color)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(var(--hero-primary-color-rgb),0.3)] hover:-translate-y-1"
                            >
                                <span>{ctaText}</span>
                                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </button>
                        </div>
                    </div>

                    {/* Kolom Gambar dengan Efek Floating 3D */}
                    <div className="flex-1 relative w-full flex justify-center lg:justify-end perspective-1000">
                        {/* Area Glow di belakang gambar */}
                        <div className={`absolute inset-0 bg-gradient-to-tr from-[var(--hero-primary-color)]/20 to-transparent blur-2xl rounded-full scale-90 ${isDarkMode ? 'opacity-50' : 'opacity-80'}`} />

                        {imageHero && (
                            <div className="relative group cursor-pointer">
                                {/* Gambar Utama (Tinggi Disesuaikan) */}
                                <img
                                    src={imageHero}
                                    alt="Hero"
                                    className="relative z-10 w-full max-w-[450px] h-64 sm:h-[300px] lg:h-[350px] object-cover rounded-[1.5rem] shadow-xl rotate-2 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:rotate-0 group-hover:-translate-y-3 group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)]"
                                />

                                {/* Bayangan Dekoratif di bawah gambar */}
                                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-4/5 h-6 bg-black/20 blur-lg rounded-full transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:translate-y-3 pointer-events-none" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Three;