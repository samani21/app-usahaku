import { Icon } from '@iconify/react'
import React from 'react'
import { Feature, Footer } from './type'

type Props = {
    feature: Feature | undefined
    footer: Footer | undefined
}

const FeatrueSection = ({ feature, footer }: Props) => {
    return (
        <section id="fitur" className="py-32 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20 animate-in slide-in-from-bottom-4 duration-700">
                    <h2 className="text-[#10B981] font-bold tracking-widest uppercase text-xs mb-4">Fitur Skala Enterprise</h2>
                    <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">{feature?.section_title || `Kekuatan di Balik ${footer?.brand_name || 'UsahaKu'}`}</h3>
                    <p className="text-xl text-slate-500 leading-relaxed">{feature?.section_desc || "Dirancang dengan presisi tingkat tinggi untuk meminimalisir *human error* dan memaksimalkan kecepatan transaksi bisnis Anda."}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {feature?.items.map((feature: any, idx: number) => (
                        <div key={idx} className="group relative bg-[#FAFAFA] rounded-3xl p-8 hover:bg-white transition-all duration-300 border border-transparent hover:border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#10B981]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <Icon icon={feature?.icon} className='text-[#10B981]' fontSize={24} />
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                                <p className="text-slate-500 leading-relaxed text-base">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeatrueSection