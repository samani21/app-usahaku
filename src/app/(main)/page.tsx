"use client"

import React, { useState, useEffect, useCallback } from 'react';
import {
    Wallet, ScrollText, PackageOpen, User, ChevronDown, Clock,
    CheckCircle2, XCircle, Crown, Zap, CreditCard, Sparkles,
    AlertCircle, Calendar, Filter
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import MainLayout from '@/Components/Layout/MainLayout';
import { Get } from '@/utils/Get';
import ModalSubscription from '@/Components/Layout/ModalSubscription';
import { BusinessType } from '@/types/Admin/BusinessType';
import { formatIDR } from '@/types/FormtRupiah';
import { OrderType } from '@/types/Admin/Catalog/Order';
import { StatusOrder } from '@/types/StatusOrder';
import { useCorrectPath } from '@/utils/useCorrectPath';
import Link from 'next/link';

// --- TYPES ---
interface StatsType {
    income: number;
    order: number;
    order_items: number;
    customer: number;
}

interface SalesChartType {
    name: string;
    sales: number;
    type: string;
}

interface DataType {
    income: number;
    order: number;
    order_items: number;
    customer: number;
    business: BusinessType;
    sales_chart: SalesChartType[];
    orders: OrderType[];
}

// --- UTILS ---
const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(dateString));
};

// ==========================================
// 1. CUSTOM HOOK: Mengelola Filter & Data API
// ==========================================
const useDashboardData = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);

    // Filter State
    const [startDate, setStartDate] = useState<string>(() => {
        const d = new Date();
        d.setDate(d.getDate() - 6);
        return d.toISOString().split('T')[0];
    });

    const [endDate, setEndDate] = useState<string>(() => {
        return new Date().toISOString().split('T')[0];
    });
    const [activeFilterLabel, setActiveFilterLabel] = useState('7 Hari Terakhir');

    // Data State
    const [stats, setStats] = useState<StatsType | null>(null);
    const [chartData, setChartData] = useState<SalesChartType[]>([]);
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [business, setBusiness] = useState<BusinessType | null>(null);

    // Default Inisialisasi: 7 Hari Terakhir
    // useEffect(() => {
    //     const end = new Date();
    //     const start = new Date();
    //     start.setDate(end.getDate() - 6);

    //     setStartDate(start.toISOString().split('T')[0]);
    //     setEndDate(end.toISOString().split('T')[0]);
    // }, []);

    const fetchDashboard = useCallback(async () => {
        if (!startDate || !endDate) return;
        setIsLoading(true);
        try {
            const res = await Get<{ success: boolean, data: DataType }>(`client/dashboard?start_date=${startDate}&end_date=${endDate}`);
            if (res?.success && res.data) {
                setStats({
                    income: res.data.income,
                    order: res.data.order,
                    order_items: res.data.order_items,
                    customer: res.data.customer,
                });
                setChartData(res.data.sales_chart || []);
                setOrders(res.data.orders || []);
                setBusiness(res.data.business || null);
            }
        } catch (e: any) {
            // console.error("Gagal memuat data dashboard", e);
        } finally {
            setIsLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const applyQuickFilter = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - (days - 1));

        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
        setActiveFilterLabel(`${days} Hari Terakhir`);
        setIsDateModalOpen(false);
    };

    const applyCustomFilter = () => {
        if (startDate && endDate) {
            const sFormat = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(new Date(startDate));
            const eFormat = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(new Date(endDate));
            setActiveFilterLabel(`${sFormat} - ${eFormat}`);
            setIsDateModalOpen(false);
        }
    };

    return {
        isLoading, isDateModalOpen, setIsDateModalOpen,
        startDate, setStartDate, endDate, setEndDate, activeFilterLabel,
        stats, chartData, orders, business,
        applyQuickFilter, applyCustomFilter
    };
};

// ==========================================
// 2. CUSTOM HOOK: Logika Kalkulasi Masa Aktif
// ==========================================
const useSubscriptionStatus = (business: BusinessType | null) => {
    const [daysRemaining, setDaysRemaining] = useState<number>(0);

    const planType = business?.plan || 'trial';
    const planStatus = business?.subscription_status || 'active';
    const endTime = business?.end_time || null;

    useEffect(() => {
        if (endTime) {
            const endDate = new Date(endTime);
            const now = new Date();
            const diffTime = endDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysRemaining(diffDays > 0 ? diffDays : 0);
        } else {
            setDaysRemaining(0);
        }
    }, [endTime]);

    return { planType, planStatus, endTime, daysRemaining };
};

// ==========================================
// KONTEN DASHBOARD UTAMA
// ==========================================
const Dashboard = ({ setIsSubscriptionModalOpen }: { setIsSubscriptionModalOpen: (val: boolean) => void }) => {
    const { getCorrectPath } = useCorrectPath();

    // Inisialisasi Custom Hooks
    const {
        isLoading, isDateModalOpen, setIsDateModalOpen,
        startDate, setStartDate, endDate, setEndDate, activeFilterLabel,
        stats, chartData, orders, business,
        applyQuickFilter, applyCustomFilter
    } = useDashboardData();

    const { planType, planStatus, endTime, daysRemaining } = useSubscriptionStatus(business);

    const renderSubscriptionBanner = () => {
        if (isLoading) return <div className="w-full xl:w-96 h-24 bg-white/50 animate-pulse rounded-3xl"></div>;

        if (planStatus === 'expired' || planStatus === 'canceled') {
            return (
                <div className="relative flex flex-col sm:flex-row items-center gap-5 p-4 sm:pr-5 bg-white/60 backdrop-blur-xl border border-rose-200 rounded-3xl shadow-sm">
                    <div className="p-3 rounded-2xl shadow-lg bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/30">
                        <AlertCircle className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center sm:text-left flex-1">
                        <h3 className="font-extrabold text-gray-800 flex items-center justify-center sm:justify-start text-lg tracking-tight">
                            {planType === 'premium' ? 'Premium Habis' : 'Trial Habis'}
                        </h3>
                        <p className="text-xs text-rose-600 font-bold mt-0.5">
                            Telah berakhir pada {formatDateTime(endTime)}
                        </p>
                    </div>
                    <button onClick={() => setIsSubscriptionModalOpen(true)} className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 mr-2" /> Perpanjang
                    </button>
                </div>
            );
        }

        if (planType === 'premium') {
            return (
                <div className="relative group">
                    <div className="absolute inset-0 rounded-3xl blur-lg bg-gradient-to-r from-amber-400 to-amber-600 opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className="relative flex flex-col sm:flex-row items-center gap-5 p-4 sm:pr-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-700/60 rounded-3xl shadow-xl">
                        <div className="p-3 rounded-2xl bg-slate-800/50 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                            <Crown className="w-7 h-7 text-amber-400" />
                        </div>
                        <div className="text-center sm:text-left flex-1">
                            <h3 className="font-extrabold text-white flex items-center justify-center sm:justify-start text-lg tracking-tight">
                                Paket Premium <CheckCircle2 className="w-5 h-5 ml-1.5 text-amber-400" />
                            </h3>
                            <p className="text-xs text-slate-300 font-medium mt-0.5 flex items-center justify-center sm:justify-start">
                                <Clock className="w-3 h-3 mr-1 text-slate-400" />
                                Sisa {daysRemaining} hari (Habis: {formatDateTime(endTime)})
                            </p>
                        </div>
                        {daysRemaining < 8 && (
                            <button onClick={() => setIsSubscriptionModalOpen(true)} className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-sm font-bold rounded-xl shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center">
                                <Wallet className="w-4 h-4 mr-2" /> Perpanjang
                            </button>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="relative group">
                <div className="absolute inset-0 rounded-3xl blur-lg bg-gradient-to-r from-amber-400 to-orange-500 opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative flex flex-col sm:flex-row items-center gap-5 p-4 sm:pr-5 bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-sm hover:bg-white/80 transition-all duration-300">
                    <div className="p-3 rounded-2xl shadow-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30">
                        <Zap className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center sm:text-left flex-1">
                        <h3 className="font-extrabold text-gray-800 flex items-center justify-center sm:justify-start text-lg tracking-tight">
                            Masa Trial <Sparkles className="w-4 h-4 ml-1.5 text-amber-500" />
                        </h3>
                        <p className="text-xs text-gray-600 font-medium mt-0.5 flex items-center justify-center sm:justify-start">
                            <Clock className="w-3 h-3 mr-1 text-gray-400" />
                            Sisa {daysRemaining} hari (Habis: {formatDateTime(endTime)})
                        </p>
                    </div>
                    <button onClick={() => setIsSubscriptionModalOpen(true)} className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center border border-gray-700">
                        <CreditCard className="w-4 h-4 mr-2" /> Upgrade
                    </button>
                </div>
            </div>
        );
    };

    return (
        <MainLayout>
            <main className={isDateModalOpen ? "p-4 sm:p-8 animate-fade-in relative z-100" : "p-4 sm:p-8 animate-fade-in relative z-10"}>
                {/* Header Section */}
                <div className="mb-8 flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
                            Selamat Datang, Admin! <span className="ml-2 origin-bottom-right hover:animate-wave inline-block cursor-default">👋</span>
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">Ini adalah ringkasan performa bisnis Anda.</p>
                    </div>
                    <div className="w-full xl:w-auto">
                        {renderSubscriptionBanner()}
                    </div>
                </div>

                {/* Filter Action Bar */}
                <div className="flex flex-wrap gap-4 justify-between items-center mb-6 p-4 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                    <h2 className="text-lg font-bold text-gray-800 px-2">Ringkasan Data</h2>
                    <button
                        onClick={() => setIsDateModalOpen(true)}
                        className="group flex items-center gap-3 px-5 py-2.5 bg-white/70 backdrop-blur-md border border-white shadow-sm rounded-2xl hover:shadow-md hover:border-emerald-200 hover:bg-white transition-all"
                    >
                        <div className="p-1.5 bg-emerald-100 rounded-xl group-hover:bg-emerald-500 transition-colors">
                            <Calendar className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Periode Aktif</span>
                            <span className="text-sm font-bold text-gray-800">{activeFilterLabel}</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400 ml-2 group-hover:text-emerald-500 transition-colors" />
                    </button>
                </div>

                {/* Kartu Statistik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'Total Penjualan', value: formatIDR(Number(stats?.income || 0)), icon: <Wallet className="h-6 w-6 text-white" /> },
                        { title: 'Total Order', value: stats?.order || 0, icon: <ScrollText className="h-6 w-6 text-white" /> },
                        { title: 'Produk Terjual', value: stats?.order_items || 0, icon: <PackageOpen className="h-6 w-6 text-white" /> },
                        { title: 'Pelanggan Baru', value: stats?.customer || 0, icon: <User className="h-6 w-6 text-white" /> },
                    ].map((item, idx) => (
                        <div key={idx} className="group relative overflow-hidden p-6 bg-white/50 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-full translate-x-10 -translate-y-10 pointer-events-none"></div>
                            <div className="flex items-center justify-between mb-5 relative z-10">
                                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-3.5 rounded-2xl shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{item.value}</h3>
                                <p className="text-sm font-semibold text-gray-500 mt-1">{item.title}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Grafik dan Tabel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    {/* Area Chart Section */}
                    <div className="lg:col-span-2 p-6 bg-white/50 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Grafik Penjualan</h2>
                                <p className="text-xs font-medium text-gray-500 mt-1">
                                    Menampilkan data <span className="text-emerald-600 font-bold">{chartData.length > 0 ? chartData[0].type : ''}</span>
                                </p>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                                    <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }} dy={10} />
                                    <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }} tickFormatter={(value) => `${value}M`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(16px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,1)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                                        itemStyle={{ color: '#059669', fontWeight: '900' }}
                                        formatter={(value) => [`Rp ${value} Juta`, 'Penjualan']}
                                        labelStyle={{ color: '#374151', fontWeight: 'bold', marginBottom: '4px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="#10b981"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorSales)"
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#059669', className: "shadow-lg shadow-emerald-500" }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Order Terbaru Section */}
                    <div className="p-6 bg-white/50 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Order Terbaru</h2>
                            <Link href={getCorrectPath('/transaction/orders')} className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 px-3 py-1.5 rounded-lg">
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="space-y-3.5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {orders.map((order) => {
                                const status = StatusOrder;
                                const date = new Date(order.created_at);
                                const formattedDate = date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
                                const formattedTime = date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                                const currentStatus = status?.[order?.payment_status === 'unpaid' ? order?.payment_status : order?.status];

                                return (
                                    <div key={order.id} className="group flex flex-col p-4 bg-white/60 rounded-2xl border border-white shadow-sm hover:shadow-md hover:bg-white hover:border-emerald-100 transition-all duration-300">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-extrabold text-gray-800 group-hover:text-emerald-600 transition-colors">{order.order_number}</span>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${currentStatus?.bg}`}>
                                                {currentStatus?.icon}
                                                <span>{currentStatus?.label}</span>
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex flex-col">
                                                <span className="text-gray-700 font-bold">{order.customer_name}</span>
                                                <span className="text-xs text-gray-400 mt-0.5 flex items-center font-medium">
                                                    <Clock className="w-3 h-3 mr-1" /> <span>{formattedDate} {formattedTime}</span>
                                                </span>
                                            </div>
                                            <span className="font-extrabold text-gray-900 bg-gray-50 px-2.5 py-1 rounded-lg">{formatIDR(Number(order.grand_total))}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* MODAL FILTER TANGGAL GLASSMORPHISM */}
                {isDateModalOpen && (
                    <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-fade-in">
                        <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-white transform transition-all scale-in">
                            <div className="p-6 border-b border-gray-100/50 flex justify-between items-center bg-white/50">
                                <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                                    <div className="p-2 bg-emerald-100 rounded-xl">
                                        <Filter className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    Filter Waktu
                                </h3>
                                <button onClick={() => setIsDateModalOpen(false)} className="text-gray-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-full transition-all">
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="mb-8">
                                    <p className="text-xs font-extrabold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-amber-500" /> Pilih Cepat
                                    </p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[7, 15, 30].map(days => (
                                            <button
                                                key={days}
                                                onClick={() => applyQuickFilter(days)}
                                                className="px-2 py-3 text-sm font-bold text-gray-600 bg-white/60 rounded-xl border border-gray-200/60 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-lg hover:shadow-emerald-100 transition-all"
                                            >
                                                {days} Hari
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-extrabold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-500" /> Rentang Kustom
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Mulai</label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={e => setStartDate(e.target.value)}
                                                className="w-full px-3 py-3 bg-white border border-gray-200/80 rounded-xl text-sm text-gray-700 font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all cursor-pointer shadow-sm"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Selesai</label>
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={e => setEndDate(e.target.value)}
                                                className="w-full px-3 py-3 bg-white border border-gray-200/80 rounded-xl text-sm text-gray-700 font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all cursor-pointer shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100/50 bg-gray-50/50 flex justify-end gap-3">
                                <button onClick={() => setIsDateModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200">
                                    Batal
                                </button>
                                <button
                                    onClick={applyCustomFilter}
                                    disabled={!startDate || !endDate}
                                    className="px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    Terapkan Filter
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <style>{`
                        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
                        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.5); }
                        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
                        .scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                        @keyframes wave { 0% { transform: rotate(0.0deg) } 10% { transform: rotate(14.0deg) } 20% { transform: rotate(-8.0deg) } 30% { transform: rotate(14.0deg) } 40% { transform: rotate(-4.0deg) } 50% { transform: rotate(10.0deg) } 60% { transform: rotate(0.0deg) } 100% { transform: rotate(0.0deg) } }
                        .hover\\:animate-wave:hover { animation: wave 2.5s infinite; transform-origin: 70% 70%; }
                    `}</style>
            </main>
        </MainLayout>
    );
};

export default function App() {
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#f8fafc] font-sans selection:bg-emerald-200 selection:text-emerald-900 overflow-hidden relative">

            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent relative ">
                <Dashboard setIsSubscriptionModalOpen={setIsSubscriptionModalOpen} />
            </main>
            {isSubscriptionModalOpen && <ModalSubscription onClose={() => setIsSubscriptionModalOpen(false)} />}
        </div>
    );
}