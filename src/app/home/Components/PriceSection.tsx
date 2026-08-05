import React from 'react'
import { Pricing } from './type'
import { CheckCircle2, Info, Loader2, Sparkles } from 'lucide-react'

type Props = {
    pricing: Pricing | undefined
    handleNavigation: (v: string) => void;
    loadingAction: string | null;
}

const PriceSection = ({ pricing, handleNavigation, loadingAction }: Props) => {
    return (
        <section id="harga" className="py-32 bg-slate-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-[#10B981] font-bold tracking-widest uppercase text-xs mb-4">Investasi Terjangkau</h2>
                    <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Pilih Tingkat Akses Anda</h3>
                    <p className="text-xl text-slate-500">Mulai gratis tanpa batasan fitur selama 14 hari. Lanjutkan jika aplikasi ini terbukti menaikkan omset Anda.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
                    <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-100 hover:shadow-xl transition-all flex flex-col">
                        <div className="mb-8">
                            <div className="inline-block px-4 py-1.5 bg-slate-100 rounded-full text-slate-700 text-sm font-bold mb-4">Uji Coba Penuh</div>
                            <h4 className="text-3xl font-bold text-slate-900 mb-2">Gratis Trial</h4>
                            <p className="text-slate-500">Buktikan sendiri kehebatan sistem kami.</p>
                        </div>
                        <div className="mb-8 flex items-baseline gap-2">
                            <span className="text-6xl font-extrabold text-slate-900">Rp 0</span>
                            <span className="text-lg font-medium text-slate-500">/ {pricing?.trial_days || 14} Hari</span>
                        </div>
                        <ul className="space-y-5 mb-8 flex-grow">
                            {pricing?.trial_features.map((f: string, i: number) => (
                                <li key={i} className="flex items-start gap-4">
                                    <CheckCircle2 size={24} className="text-[#10B981] flex-shrink-0" />
                                    <span className="text-slate-600 font-medium">{f}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start mb-8">
                            <Info size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-800 font-medium leading-relaxed">
                                <b>Catatan:</b> Trial tidak butuh kartu kredit. Setelah masa trial habis, data aman.
                            </p>
                        </div>
                        <button
                            onClick={() => handleNavigation('/register')}
                            disabled={loadingAction === '/register'}
                            className="w-full py-4 rounded-xl font-bold text-slate-700 bg-slate-50 border-2 border-slate-200 hover:bg-slate-100 transition-colors mt-auto disabled:opacity-70 flex justify-center items-center"
                        >
                            {loadingAction === '/register' ? <Loader2 size={20} className="animate-spin" /> : 'Mulai Trial Sekarang'}
                        </button>
                    </div>

                    <div className="relative p-[2px] rounded-[2rem] bg-gradient-to-b from-[#10B981] via-emerald-600 to-slate-800 shadow-2xl shadow-emerald-900/20 transform md:-translate-y-4 flex flex-col">
                        <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-[#10B981] to-emerald-400 text-white text-sm font-bold px-6 py-1.5 rounded-full shadow-lg z-10">
                            PILIHAN TERBAIK
                        </div>
                        <div className="bg-slate-950 rounded-[calc(2rem-2px)] p-10 h-full relative overflow-hidden flex flex-col">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-bold mb-4">
                                        <Sparkles size={14} /> Profesional
                                    </div>
                                    <h4 className="text-3xl font-bold text-white mb-2">Mitra UMKM</h4>
                                    <p className="text-slate-400">Amankan data usaha & buka keran penghasilan tambahan.</p>
                                </div>
                                <div className="mb-10">
                                    <div className="text-slate-500 line-through text-xl font-medium mb-1 decoration-red-500/70 decoration-2">Rp {pricing?.original_price?.toLocaleString("id-ID") || "50.000"}</div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-200">Rp {((pricing?.pro_price ?? 35000) / 1000)}k</span>
                                        <span className="text-lg font-medium text-slate-400">/ bln</span>
                                    </div>
                                </div>
                                <ul className="space-y-5 mb-10 flex-grow">
                                    {pricing?.pro_features.map((f: string, i: number) => (
                                        <li key={i} className="flex items-start gap-4">
                                            <CheckCircle2 size={24} className="text-emerald-400 flex-shrink-0" />
                                            <span className="text-slate-300 font-medium">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handleNavigation('/register?plan=pro')}
                                    disabled={loadingAction === '/register?plan=pro'}
                                    className="w-full py-4 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-[#10B981] to-emerald-400 hover:scale-[1.02] transition-transform mt-auto disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center shadow-lg shadow-emerald-500/25"
                                >
                                    {loadingAction === '/register?plan=pro' ? <Loader2 size={20} className="animate-spin" /> : 'Lanjutkan Berlangganan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PriceSection