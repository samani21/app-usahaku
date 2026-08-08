"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    PackageMinus,
    Wallet,
    ListMinus,
    Activity
} from "lucide-react";

import { OutletsType } from "@/types/Admin/OutletType";
import { Get } from "@/utils/Get";

import GlassCard from "@/Components/Layout/GlassCard";
import MainLayout from "@/Components/Layout/MainLayout";
import { ProfitLossSummary } from "./Components/type";

// Helper Format Uang
const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Komponen Skeleton Loading agar tampilan awal tidak kosong
const DashboardSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        <div className="h-48 bg-slate-200/50 rounded-2xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="h-32 bg-slate-200/50 rounded-2xl w-full"></div>
            <div className="h-32 bg-slate-200/50 rounded-2xl w-full"></div>
            <div className="h-32 bg-slate-200/50 rounded-2xl w-full"></div>
            <div className="h-32 bg-slate-200/50 rounded-2xl w-full"></div>
        </div>
    </div>
);

export default function ProfitLossActive() {
    // --- STATE ---
    const [summary, setSummary] = useState<ProfitLossSummary | null>(null);
    const [outlets, setOutlets] = useState<OutletsType[]>([]);

    // Gunakan initialLoading untuk membedakan loading awal dan loading filter
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [isRefetching, setIsRefetching] = useState<boolean>(false);

    // Default filter: Bulan Ini
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(firstDay);
    const [endDate, setEndDate] = useState(lastDay);
    const [selectOutlet, setSelectOutlet] = useState<string>("Semua");

    // ==========================================
    // API ACTIONS
    // ==========================================
    const fetchOutlets = useCallback(async () => {
        try {
            const res = await Get<{ success: boolean; data: OutletsType[] }>('client/outlet');
            if (res?.success) setOutlets(res.data);
        } catch (err) {
            console.error("Gagal load outlet");
        }
    }, []);

    const fetchProfitLoss = useCallback(async () => {
        setIsRefetching(true);
        try {
            const params = new URLSearchParams();
            if (startDate) params.append("start_date", startDate);
            if (endDate) params.append("end_date", endDate);

            if (selectOutlet !== 'Semua') {
                const selectedOpt = outlets.find(o => o.name === selectOutlet);
                if (selectedOpt) params.append("outlet_id", String(selectedOpt.id));
            }

            const res = await Get<{ success: boolean; data: { ringkasan: ProfitLossSummary } }>(`client/finance/profit-loss?${params.toString()}`);
            if (res?.success) {
                setSummary(res.data.ringkasan);
            }
        } catch (err: any) {
            console.error("Gagal load data keuangan: ", err);
        } finally {
            setInitialLoading(false);
            setIsRefetching(false);
        }
    }, [startDate, endDate, selectOutlet, outlets]);

    useEffect(() => {
        fetchOutlets();
    }, [fetchOutlets]);

    useEffect(() => {
        // Fetch data saat parameter filter berubah
        fetchProfitLoss();
    }, [fetchProfitLoss]);


    return (
        <MainLayout>
            <div className="space-y-6 pb-4 relative">

                {/* HEADER & FILTER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Laporan Laba Rugi</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-2">
                            <Activity size={16} className="text-emerald-500" /> Pantau kesehatan finansial bisnis Anda
                        </p>
                    </div>

                    {/* FILTER TANGGAL */}
                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 focus-within:border-emerald-500 transition-colors">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="text-sm border-none bg-slate-50/50 rounded-lg p-2.5 outline-none focus:ring-0 text-slate-700 font-medium cursor-pointer"
                        />
                        <span className="text-slate-300 font-bold">-</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="text-sm border-none bg-slate-50/50 rounded-lg p-2.5 outline-none focus:ring-0 text-slate-700 font-medium cursor-pointer"
                        />
                    </div>
                </div>

                {/* FILTER OUTLET (Pill Button) */}
                <GlassCard className="p-2 w-full border-none shadow-sm bg-white/80 backdrop-blur-md">
                    <div className="flex items-center gap-2 overflow-x-auto text-slate-600 [&::-webkit-scrollbar]:hidden">
                        <button
                            onClick={() => setSelectOutlet("Semua")}
                            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-in-out flex-shrink-0 ${selectOutlet === 'Semua'
                                ? 'bg-slate-800 text-white shadow-lg shadow-slate-500/30 transform scale-100'
                                : 'bg-transparent hover:bg-slate-100 hover:text-slate-800 scale-95'
                                }`}
                        >
                            Semua Outlet
                        </button>
                        {outlets?.map((o, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectOutlet(o?.name)}
                                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-in-out flex-shrink-0 ${selectOutlet === o?.name
                                    ? 'bg-slate-800 text-white shadow-lg shadow-slate-500/30 transform scale-100'
                                    : 'bg-transparent hover:bg-slate-100 hover:text-slate-800 scale-95 border border-transparent'
                                    }`}
                            >
                                {o?.name}
                            </button>
                        ))}
                    </div>
                </GlassCard>

                {/* KONDISI RENDER: SKELETON vs DATA */}
                {initialLoading && !summary ? (
                    <DashboardSkeleton />
                ) : summary ? (
                    // Tambahkan transisi opacity saat data di-refetch (menghilangkan kedutan)
                    <div className={`space-y-6 transition-all duration-300 ${isRefetching ? 'opacity-50 grayscale-[20%]' : 'opacity-100'}`}>

                        {/* TOP SECTION: KESIMPULAN LABA BERSIH */}
                        <GlassCard className={`relative overflow-hidden p-8 md:p-10 text-center border-t-[10px] shadow-sm ${summary.laba_bersih >= 0 ? 'border-t-emerald-500' : 'border-t-rose-500'}`}>
                            {/* Watermark Icon */}
                            <div className={`absolute -right-6 -bottom-10 opacity-[0.03] transform -rotate-12 ${summary.laba_bersih >= 0 ? 'text-emerald-900' : 'text-rose-900'}`}>
                                {summary.laba_bersih >= 0 ? <TrendingUp size={280} /> : <TrendingDown size={280} />}
                            </div>

                            <div className="relative z-10">
                                <p className="text-slate-500 font-bold tracking-wide mb-3 flex items-center justify-center gap-2 uppercase text-xs">
                                    <Wallet size={18} className={summary.laba_bersih >= 0 ? 'text-emerald-500' : 'text-rose-500'} />
                                    Laba Bersih (Net Profit)
                                </p>
                                <h2 className={`text-5xl md:text-7xl font-black tracking-tight ${summary.laba_bersih >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {formatRupiah(summary.laba_bersih)}
                                </h2>
                                <p className={`inline-block mt-5 px-4 py-1.5 rounded-full text-sm font-semibold border ${summary.laba_bersih >= 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                                    {summary.laba_bersih >= 0
                                        ? "🎉 Bisnis Anda menghasilkan keuntungan bulan ini!"
                                        : "⚠️ Perhatian: Bisnis Anda mengalami kerugian."}
                                </p>
                            </div>
                        </GlassCard>

                        {/* DETAIL SECTION: 4 KOTAK METRIK */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                            {/* 1. OMZET */}
                            <GlassCard className="relative overflow-hidden p-6 border-l-4 border-l-blue-500 shadow-sm group hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute -right-4 -bottom-4 opacity-[0.04] group-hover:opacity-10 transition-opacity duration-300">
                                    <DollarSign size={120} />
                                </div>
                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Omzet</p>
                                        <h3 className="text-2xl font-black text-slate-800 mt-1.5">{formatRupiah(summary.omzet)}</h3>
                                    </div>
                                    <div className="p-2.5 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-xl shadow-inner">
                                        <DollarSign size={22} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <p className="relative z-10 text-[11px] text-slate-400 mt-4 font-medium">Pendapatan kotor dari penjualan lunas.</p>
                            </GlassCard>

                            {/* 2. HPP */}
                            <GlassCard className="relative overflow-hidden p-6 border-l-4 border-l-amber-500 shadow-sm group hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute -right-4 -bottom-4 opacity-[0.04] group-hover:opacity-10 transition-opacity duration-300">
                                    <PackageMinus size={120} />
                                </div>
                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Harga Modal (HPP)</p>
                                        <h3 className="text-2xl font-black text-slate-800 mt-1.5">{formatRupiah(summary.total_hpp)}</h3>
                                    </div>
                                    <div className="p-2.5 bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 rounded-xl shadow-inner">
                                        <PackageMinus size={22} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <p className="relative z-10 text-[11px] text-slate-400 mt-4 font-medium">Modal keseluruhan produk yang terjual.</p>
                            </GlassCard>

                            {/* 3. LABA KOTOR */}
                            <GlassCard className="relative overflow-hidden p-6 border-l-4 border-l-indigo-500 shadow-sm group hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute -right-4 -bottom-4 opacity-[0.04] group-hover:opacity-10 transition-opacity duration-300">
                                    <TrendingUp size={120} />
                                </div>
                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Laba Kotor (Gross)</p>
                                        <h3 className="text-2xl font-black text-slate-800 mt-1.5">{formatRupiah(summary.laba_kotor)}</h3>
                                    </div>
                                    <div className="p-2.5 bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 rounded-xl shadow-inner">
                                        <TrendingUp size={22} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <p className="relative z-10 text-[11px] text-slate-400 mt-4 font-medium">Omzet dikurangi dengan Harga Modal.</p>
                            </GlassCard>

                            {/* 4. PENGELUARAN */}
                            <GlassCard className="relative overflow-hidden p-6 border-l-4 border-l-rose-500 shadow-sm group hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute -right-4 -bottom-4 opacity-[0.04] group-hover:opacity-10 transition-opacity duration-300">
                                    <ListMinus size={120} />
                                </div>
                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Beban Operasional</p>
                                        <h3 className="text-2xl font-black text-slate-800 mt-1.5">{formatRupiah(summary.total_pengeluaran)}</h3>
                                    </div>
                                    <div className="p-2.5 bg-gradient-to-br from-rose-50 to-rose-100 text-rose-600 rounded-xl shadow-inner">
                                        <ListMinus size={22} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <p className="relative z-10 text-[11px] text-slate-400 mt-4 font-medium">Gaji, listrik, dll dari Buku Pengeluaran.</p>
                            </GlassCard>

                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/50 rounded-2xl border border-dashed border-slate-300">
                        <Wallet size={48} className="mx-auto text-slate-300 mb-3" />
                        <h3 className="text-lg font-bold text-slate-600">Belum Ada Transaksi</h3>
                        <p className="text-sm text-slate-500 mt-1">Tidak ada data keuangan untuk periode ini.</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}