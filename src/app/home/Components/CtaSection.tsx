import { Loader2, MapPin, ShoppingBag } from 'lucide-react'
import React from 'react'
import { Ecommerce } from './type'

type Props = {
    ecom: Ecommerce | undefined
    handleNavigation: (v: string) => void;
    loadingAction: string | null
}

const CtaSection = ({ ecom, handleNavigation, loadingAction }: Props) => {
    return (
        <section id="ecommerce" className="py-24 relative overflow-hidden border-t border-slate-200">
            <div className="absolute inset-0 bg-slate-900"></div>
            <div className="absolute inset-0 opacity-40">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#10B981]/40 to-transparent rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 to-transparent rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mx-auto shadow-inner border border-white/20 mb-6">
                    <ShoppingBag size={32} />
                </div>
                <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight leading-tight">
                    {ecom?.headline_1 || 'E-commerce'} <span className="text-emerald-400">{ecom?.headline_2 || 'UMKM Lokal.'}</span>
                </h2>
                <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                    {ecom?.description || 'Temukan dan dukung berbagai produk unggulan dari UMKM yang ada di sekitar lokasi Anda. Belanja mudah, bisnis lokal berkembang.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                    <button
                        onClick={() => handleNavigation('/ecommerce')}
                        disabled={loadingAction === '/ecommerce'}
                        className="px-8 py-4 flex justify-center items-center rounded-xl bg-[#10B981] hover:bg-emerald-400 text-slate-900 font-bold text-lg shadow-xl transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {loadingAction === '/ecommerce' ? <Loader2 size={24} className="animate-spin" /> : (ecom?.btn_primary || 'Mulai Belanja')}
                    </button>
                    <button className="px-8 py-4 rounded-xl bg-slate-800/50 backdrop-blur-md border border-slate-700 text-white font-bold text-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                        <MapPin size={20} /> {ecom?.btn_secondary || 'Deteksi Lokasi Saya'}
                    </button>
                </div>
            </div>
        </section>
    )
}

export default CtaSection