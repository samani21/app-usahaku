"use client"

import React, { useState } from 'react';
import { Package, Trash2 } from 'lucide-react'; // Tambahan ikon biar makin cakep

import MainLayout from '@/Components/Layout/MainLayout';
import GlassCard from '@/Components/Layout/GlassCard';
import ServiceTrash from './Views/ServiceTrash';
import ServiceActive from './Views/ServiceActive';


export default function ServicePage() {
    const [activeTab, setActiveTab] = useState('active'); // 'active' atau 'trash'

    // Fungsi Render View
    const renderView = () => {
        switch (activeTab) {
            case 'active':
                return <ServiceActive />;
            case 'trash':
                // Pastikan lu udah bikin file ProductTrash.tsx ya boss!
                // Kalau belum, sementara ganti ke <ProductActive /> dulu nggak apa-apa.
                return <ServiceTrash />;
            default:
                return <ServiceActive />;
        }
    };

    return (
        <MainLayout page='Kelola Produk'>
            <div className='space-y-6'>

                {/* NAVIGATION CARD */}
                <GlassCard className="p-3 w-full">

                    {/* MODERN PILL TAB NAVIGATION */}
                    <div className="flex p-1.5 space-x-2 bg-slate-100/70 rounded-xl w-fit border border-slate-200/50">

                        {/* TAB AKTIF */}
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ease-in-out ${activeTab === 'active'
                                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/60 scale-100'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 scale-95 hover:scale-100'
                                }`}
                        >
                            <Package size={18} className={activeTab === 'active' ? 'text-blue-500' : 'text-slate-400'} />
                            Daftar Produk Aktif
                        </button>

                        {/* TAB TONG SAMPAH */}
                        <button
                            onClick={() => setActiveTab('trash')}
                            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ease-in-out ${activeTab === 'trash'
                                ? 'bg-white text-rose-600 shadow-sm ring-1 ring-slate-200/60 scale-100'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/60 scale-95 hover:scale-100'
                                }`}
                        >
                            <Trash2 size={18} className={activeTab === 'trash' ? 'text-rose-500' : 'text-slate-400'} />
                            Tong Sampah
                        </button>

                    </div>

                </GlassCard>

                {/* DYNAMIC VIEW RENDERER */}
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-in-out">
                    {renderView()}
                </div>

            </div>
        </MainLayout>
    );
}