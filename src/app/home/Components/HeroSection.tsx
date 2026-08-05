import { ArrowRight, CheckCircle2, Loader2, ShoppingBag, Sparkles, TrendingUp } from 'lucide-react'
import React from 'react'
import { Hero } from './type'

type Props = {
    hero: Hero | undefined
    handleNavigation: (v: string) => void;
    loadingAction: string | null;
}

const HeroSection = ({ hero, handleNavigation, loadingAction }: Props) => {
    return (
        <section id="beranda" className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 animate-in fade-in duration-1000">
                <div className="w-[600px] h-[600px] bg-gradient-to-tr from-[#10B981]/20 to-emerald-200/20 rounded-full blur-[100px] opacity-70 mix-blend-multiply pointer-events-none"></div>
            </div>
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 animate-in fade-in duration-1000">
                <div className="w-[500px] h-[500px] bg-gradient-to-bl from-blue-100/40 to-[#10B981]/10 rounded-full blur-[80px] opacity-70 mix-blend-multiply pointer-events-none"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-in slide-in-from-bottom-8 duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
                    <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
                            <Sparkles size={16} className="text-[#10B981]" />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{hero?.tagline || "Era Baru Bisnis Digital"}</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
                            {hero?.headline_1 || "Kelola, Jual &"} <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-emerald-400">{hero?.headline_2 || "Hasilkan Lebih."}</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                            {hero?.description || 'Ekosistem all-in-one dengan kasir pintar, etalase kustom, dan sistem afiliasi cerdas yang siap mengalirkan omset ke rekening Anda.'}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button
                                onClick={() => handleNavigation('/register')}
                                disabled={loadingAction === '/register'}
                                className="px-8 py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-[#10B981] to-emerald-600 shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:transform-none"
                            >
                                {loadingAction === '/register' ? <Loader2 size={20} className="animate-spin" /> : (
                                    <>{hero?.cta_text || "Coba Gratis 14 Hari"} <ArrowRight size={20} /></>
                                )}
                            </button>
                            <a
                                href="#fitur"
                                className="px-8 py-4 rounded-xl text-slate-700 bg-white border border-slate-200 shadow-sm font-bold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center"
                            >
                                Jelajahi Fitur
                            </a>
                        </div>
                    </div>

                    <div className="relative w-full mx-auto max-w-lg lg:max-w-none perspective-1000">
                        <div className="relative transform lg:rotate-y-[-10deg] lg:rotate-x-[5deg] transition-transform duration-700 hover:rotate-0">
                            <div className="relative z-20 w-full rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-2xl p-6 ring-1 ring-slate-900/5">
                                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                    </div>
                                    <div className="h-6 w-32 bg-slate-100 rounded-md"></div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-[#10B981]/10 to-emerald-50 border border-emerald-100/50">
                                        <div className="w-8 h-8 rounded-lg bg-[#10B981] text-white flex items-center justify-center mb-3">
                                            <TrendingUp size={16} />
                                        </div>
                                        <div className="h-4 w-16 bg-emerald-200 rounded mb-2"></div>
                                        <div className="h-6 w-24 bg-[#10B981]/80 rounded"></div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mb-3">
                                            <ShoppingBag size={16} />
                                        </div>
                                        <div className="h-4 w-16 bg-slate-100 rounded mb-2"></div>
                                        <div className="h-6 w-24 bg-slate-200 rounded"></div>
                                    </div>
                                </div>

                                <div className="h-32 w-full rounded-xl bg-slate-50 border border-slate-100 relative overflow-hidden flex items-end px-4 gap-2 pt-8">
                                    {[40, 70, 45, 90, 60, 100, 80].map((height, i) => (
                                        <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-[#10B981] to-emerald-300 opacity-80" style={{ height: `${height}%` }}></div>
                                    ))}
                                </div>
                            </div>

                            <div className="absolute -right-8 top-12 z-30 w-52 p-4 rounded-xl bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/50 animate-bounce" style={{ animationDuration: '4s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#10B981]">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-800">Transaksi Berhasil!</div>
                                        <div className="text-xs text-slate-500">Rp 150.000 Masuk Kasir</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection