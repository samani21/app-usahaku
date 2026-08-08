"use client"
import { OrderType } from '@/types/Admin/Catalog/Order'
import { Meta } from '@/types/Public'
import { Get } from '@/utils/Get'
import { Post } from '@/utils/Post'
import {
    AlertCircle, CalendarIcon, Check, CheckCheck, CheckCircle2,
    Clock, Eye, FileCheck2, Hourglass, Package, PackageCheck,
    Play, PlusIcon, ScanBarcode, SearchIcon, ShoppingBagIcon,
    SlidersIcon, Wallet, XCircle, AlertTriangle, Shell, RefreshCw,
    Calendar
} from 'lucide-react'
import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { OutletsType } from '@/types/Admin/OutletType'
import Loading from '@/Components/Loading'
import ModalPayment from './Components/ModalPayment'
import ModalScan from './Components/ModalScan'
import ModalAddOrder from './Components/ModalAddOrder'
import ModalDetailOrder from './Components/ModalDetailOrder'
import MainLayout from '@/Components/Layout/MainLayout'
import DateRangeModal from '@/Components/CRUD/DateRangeModal'

type Props = {}

interface dataType {
    summary: {
        count: number;
        pending: number;
        processing: number;
        completed: number;
        paid: number;
        unpaid: number;
        expired: number;
        cancelled: number;
    }
    data: OrderType[];
    outlets: OutletsType[];
    meta: Meta;
}

const OrdersComponent = (props: Props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedOutlet, setSelectedOutlet] = useState<string>('all');
    const [dataOrders, setDataOrders] = useState<dataType>();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dateRangeText, setDateRangeText] = useState("");

    // [BARU] State untuk menyimpan waktu update terakhir
    const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date());

    // Modal States
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [activeVerifyOrder, setActiveVerifyOrder] = useState<OrderType | null>(null);
    const [isOpenScan, setIsOpenScan] = useState<boolean>(false);
    const [openModalAdd, setOpenModalAdd] = useState<boolean>(false);
    const [qrToken, setQrToken] = useState<string | null>(null);
    const [toasts, setToasts] = useState<{ message: string, type: string } | null>(null);
    const [outlets, setOutlets] = useState<OutletsType[]>([]);

    const abortControllerRef = useRef<AbortController | null>(null);

    // Reference untuk menampung ID timer
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Debounce Search Query
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const parsedDate = useMemo(() => {
        if (!dateRangeText.includes(" - ")) return { start_date: "", end_date: "" };

        const monthMap: Record<string, string> = {
            Jan: "01", Feb: "02", Mar: "03", Apr: "04", Mei: "05", Jun: "06",
            Jul: "07", Agt: "08", Agu: "08", Sep: "09", Okt: "10", Nov: "11", Des: "12",
        };

        const formatDate = (dateStr: string) => {
            const [day, month, year] = dateStr.trim().split(" ");
            const formattedMonth = monthMap[month] || "01";
            return `${year}-${formattedMonth}-${day.padStart(2, "0")}`;
        };

        const [start, end] = dateRangeText.split(" - ");
        return { start_date: formatDate(start), end_date: formatDate(end) };
    }, [dateRangeText]);

    const getOrder = useCallback(async (isBackground = false) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        if (!isBackground) setLoading(true);

        try {
            const params = new URLSearchParams({
                per_page: itemsPerPage.toString(),
                page: currentPage.toString(),
            });
            if (parsedDate.start_date) params.append("start_date", parsedDate.start_date);
            if (parsedDate.end_date) params.append("end_date", parsedDate.end_date);
            if (debouncedSearch) params.append('search', debouncedSearch);
            if (selectedStatus !== 'all') params.append('status', selectedStatus);
            if (selectedOutlet !== 'all') params.append('outlet_id', selectedOutlet);

            if (isBackground) {
                console.log(`[Auto-Refresh] Memperbarui data pada ${new Date().toLocaleTimeString()}...`);
            }

            const res = await Get<{ success: boolean, data: dataType }>(
                `client/orders?${params.toString()}`,
                { signal: controller.signal }
            );

            if (res?.success) {
                setDataOrders(res?.data);
                if (res?.data?.outlets?.length > 0) {
                    setOutlets(res.data.outlets);
                }
                // [BARU] Update state jam terakhir sukses load
                setLastFetchTime(new Date());
            } else {
                addToast('Gagal memuat pesanan. Silakan muat ulang.', 'error');
            }
        } catch (e: any) {
            if (e.isCanceled || e.name === 'AbortError' || e.message === 'canceled') {
                return;
            }
            const errorMessage = e?.message || e?.response?.data?.message || 'Koneksi terputus atau server tidak merespons.';
            addToast(errorMessage, 'error');
            setDataOrders(undefined);
        } finally {
            if (!isBackground) setLoading(false);
        }
    }, [currentPage, itemsPerPage, debouncedSearch, selectedStatus, selectedOutlet, parsedDate]);

    useEffect(() => {
        getOrder();
    }, [getOrder]);

    // --- AUTO REFRESH IDLE LOGIC ---
    const resetIdleTimer = useCallback(() => {
        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
        }

        // [TESTING] Saya set ke 10 detik (10.000 ms). 
        // Nanti silakan ubah ke 180000 untuk 3 menit.
        const IDLE_TIMEOUT_MS = 10000;

        idleTimerRef.current = setTimeout(() => {
            // Ketika idle tercapai, panggil getOrder mode background
            getOrder(true);
            // Restart timer agar terus me-refresh selama masih idle
            resetIdleTimer();
        }, IDLE_TIMEOUT_MS);
    }, [getOrder]);

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];

        resetIdleTimer();
        events.forEach(event => window.addEventListener(event, resetIdleTimer));

        return () => {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            events.forEach(event => window.removeEventListener(event, resetIdleTimer));
        };
    }, [resetIdleTimer]);
    // ---------------------------------

    const handleResetFilter = () => {
        setSearchQuery('');
        setSelectedStatus('all');
        setSelectedOutlet('all');
        setDateRangeText('');
        setCurrentPage(1);
    }

    const statusMeta: Record<string, { bg: string; icon: React.ReactNode; label: string }> = {
        pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200/60', icon: <Clock size={14} />, label: 'Menunggu' },
        unpaid: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60', icon: <Wallet size={14} />, label: 'Belum Dibayar' },
        processing: { bg: 'bg-blue-50 text-blue-700 border-blue-200/60', icon: <Package size={14} />, label: 'Diproses' },
        completed: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', icon: <CheckCircle2 size={14} />, label: 'Selesai' },
        done: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', icon: <PackageCheck size={14} />, label: 'Diterima' },
        paid: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', icon: <FileCheck2 size={14} />, label: 'Dibayar' },
        cancelled: { bg: 'bg-rose-50 text-rose-700 border-rose-200/60', icon: <XCircle size={14} />, label: 'Batal' },
        expired: { bg: 'bg-gray-50 text-gray-700 border-gray-200/60', icon: <Hourglass size={14} />, label: 'Kadaluwarsa' },
        rejected: { bg: 'bg-rose-50 text-rose-700 border-rose-200/60', icon: <Shell size={14} />, label: 'Ditolak' }
    };

    const handleTriggerProcess = (order: OrderType) => {
        if (actionLoading) return;
        setActiveVerifyOrder(order);
        setShowPaymentModal(true);
    };

    const handleUpdateStatus = async (order: OrderType, status: string, payment_status?: string, cash?: number) => {
        if (actionLoading) return;
        setActionLoading(true);
        try {
            const formData = new FormData();
            if (payment_status) formData.append('payment_status', payment_status);
            formData.append('status', status);
            if (cash) formData.append('cash_received', String(cash));

            const res = await Post<any, FormData>(`client/orders/${order?.id}`, formData);
            if (res?.success) {
                addToast('Status pesanan berhasil diperbarui', 'success');
                await getOrder(true);
                setShowPaymentModal(false);
                setActiveVerifyOrder(null);
                setIsOpenScan(false);
            }
        } catch (e: any) {
            addToast(e?.message || 'Gagal mengupdate pesanan', 'error');
        } finally {
            setActionLoading(false);
        }
    }

    const addToast = (message: string, type: string = 'success') => {
        setToasts({ message, type });
        setTimeout(() => setToasts(null), 3000);
    };

    const getPaginationGroup = (currentPage: number, lastPage: number) => {
        if (lastPage <= 7) {
            return Array.from({ length: lastPage }, (_, i) => i + 1);
        }
        if (currentPage <= 3) {
            return [1, 2, 3, 4, '...', lastPage - 1, lastPage];
        }
        if (currentPage >= lastPage - 2) {
            return [1, 2, '...', lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
        }
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage];
    };

    return (
        <MainLayout page='Kelola Orderan'>
            <div className="p-4 lg:p-6 mx-auto space-y-6">

                {/* --- METRICS CARDS --- */}
                <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 pb-2 lg:pb-0 snap-x">
                    {/* ... (Metrics Card tetap sama seperti kode sebelumnya) ... */}
                    <div className="min-w-[160px] snap-start bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center shrink-0">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Pesanan</span>
                        <p className="text-2xl font-black text-slate-800 mt-1">{dataOrders?.summary?.count || 0}</p>
                    </div>

                    <div className="min-w-[160px] snap-start bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 shadow-sm flex flex-col justify-center shrink-0">
                        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">Belum Dibayar</span>
                        <p className="text-2xl font-black text-indigo-700 mt-1">{dataOrders?.summary?.unpaid || 0}</p>
                    </div>

                    <div className="min-w-[160px] snap-start bg-amber-50/70 p-4 rounded-2xl border border-amber-100 shadow-sm flex flex-col justify-center shrink-0">
                        <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Verifikasi</span>
                        <p className="text-2xl font-black text-amber-700 mt-1">{dataOrders?.summary?.pending || 0}</p>
                    </div>

                    <div className="min-w-[160px] snap-start bg-cyan-50/70 p-4 rounded-2xl border border-cyan-100 shadow-sm flex flex-col justify-center shrink-0">
                        <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider block">Sudah Dibayar</span>
                        <p className="text-2xl font-black text-cyan-700 mt-1">{dataOrders?.summary?.paid || 0}</p>
                    </div>

                    <div className="min-w-[160px] snap-start bg-blue-50/70 p-4 rounded-2xl border border-blue-100 shadow-sm flex flex-col justify-center shrink-0">
                        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">Diproses</span>
                        <p className="text-2xl font-black text-blue-700 mt-1">{dataOrders?.summary?.processing || 0}</p>
                    </div>

                    <div className="min-w-[160px] snap-start bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-center shrink-0">
                        <span className="text-[11px] font-bold text-[#009662] uppercase tracking-wider block">Selesai</span>
                        <p className="text-2xl font-black text-[#009662] mt-1">{dataOrders?.summary?.completed || 0}</p>
                    </div>

                    <div className="min-w-[160px] snap-start bg-rose-50/70 p-4 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-center shrink-0">
                        <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">Dibatalkan</span>
                        <p className="text-2xl font-black text-rose-700 mt-1">{dataOrders?.summary?.cancelled || 0}</p>
                    </div>

                    <div className="min-w-[160px] snap-start bg-zinc-50 p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-center shrink-0">
                        <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider block">Kadaluwarsa</span>
                        <p className="text-2xl font-black text-zinc-700 mt-1">{dataOrders?.summary?.expired || 0}</p>
                    </div>
                </div>

                {/* --- TOOLBAR FILTERS & ACTIONS --- */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                        <div className="relative w-full md:max-w-md">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <SearchIcon size={18} />
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari pesanan, invoice..."
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009662]/20 focus:border-[#009662] focus:bg-white transition-all text-slate-700 placeholder-slate-400"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <button
                                onClick={() => setIsOpenScan(true)}
                                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-100"
                            >
                                <ScanBarcode size={18} />
                                <span>Scan</span>
                            </button>
                            <button
                                onClick={() => setOpenModalAdd(true)}
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-bold text-white bg-[#009662] hover:bg-[#007d51] active:scale-95 rounded-xl transition-all shadow-sm shadow-[#009662]/20"
                            >
                                <PlusIcon size={18} />
                                <span>Order Baru</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                        <div className="relative w-full">
                            <select
                                value={selectedOutlet}
                                onChange={(e) => setSelectedOutlet(e.target.value)}
                                className="w-full pl-3 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-medium focus:outline-none focus:border-[#009662] appearance-none cursor-pointer"
                            >
                                <option value="all">Semua Outlet</option>
                                {outlets?.map(o => (
                                    <option key={o.id} value={o.id}>{o.name}</option>
                                ))}
                            </select>
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</span>
                        </div>

                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
                                <Calendar size={18} />
                            </div>
                            <input
                                readOnly
                                onClick={() => setIsModalOpen(true)}
                                value={dateRangeText}
                                placeholder="Pilih rentang tanggal"
                                className="w-full cursor-pointer text-sm font-semibold text-slate-800 pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-emerald-300 focus:border-emerald-500 focus:bg-white rounded-xl outline-none transition-all placeholder:font-medium placeholder:text-slate-400 truncate"
                            />
                        </div>

                        <div className="relative w-full">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full pl-3 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-medium focus:outline-none focus:border-[#009662] appearance-none cursor-pointer"
                            >
                                <option value="all">Semua Status</option>
                                <option value="pending">Menunggu</option>
                                <option value="paid">Dibayar</option>
                                <option value="processing">Diproses</option>
                                <option value="completed">Selesai</option>
                                <option value="cancelled">Dibatalkan</option>
                            </select>
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</span>
                        </div>

                        <div className="flex flex-col items-end w-full">
                            <div className="flex items-center gap-2 w-full">
                                <button
                                    onClick={() => getOrder(false)}
                                    disabled={loading && !actionLoading}
                                    title="Refresh Data"
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-slate-600 hover:text-[#009662] bg-slate-50 hover:bg-[#009662]/10 rounded-xl transition-colors border border-slate-200 hover:border-[#009662]/30 disabled:opacity-50 text-xs font-semibold"
                                >
                                    <RefreshCw size={16} className={loading && !actionLoading ? "animate-spin text-[#009662]" : ""} />
                                    <span>Muat Ulang</span>
                                </button>
                                <button
                                    onClick={handleResetFilter}
                                    title="Reset Filter"
                                    className="flex items-center justify-center px-4 py-2.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                                >
                                    <SlidersIcon size={16} />
                                </button>
                            </div>

                            {/* [BARU] Indikator waktu update terakhir */}
                            <p className="text-[10px] text-slate-400 font-medium mt-1.5 pr-1 truncate">
                                Terakhir update: {lastFetchTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- LISTING ORDERS --- */}
                {!dataOrders?.data || dataOrders.data.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
                        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <ShoppingBagIcon size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Pesanan tidak ditemukan</h3>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">Coba gunakan kata kunci pencarian lain atau ubah filter.</p>
                        <button onClick={handleResetFilter} className="mt-4 text-sm font-bold text-[#009662] hover:underline">Hapus Filter</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {dataOrders.data.map((order) => {
                            const date = new Date(order.created_at);
                            const formattedDate = date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", });
                            const formattedTime = date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZoneName: 'short' });
                            const orderStatus = statusMeta?.[order?.payment_status === 'unpaid' ? order?.payment_status : order?.status];

                            return (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-2xl border border-slate-200 hover:border-[#009662]/30 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
                                >
                                    {/* Card Header */}
                                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="pr-3">
                                                <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-1">
                                                    {order.order_number}
                                                </span>
                                                <h3 className="text-base font-bold text-slate-800 leading-tight">
                                                    {order.customer_name || order?.user?.name || 'Tanpa Nama'}
                                                </h3>
                                            </div>

                                            {orderStatus && (
                                                <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${orderStatus.bg}`}>
                                                    {orderStatus.icon}
                                                    <span>{orderStatus.label}</span>
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                                            <span className="bg-white text-slate-600 font-bold px-2 py-1 rounded-md border border-slate-200 shadow-sm">
                                                {order.outlet?.name || '-'}
                                            </span>
                                            <div className="flex items-center gap-1.5 font-medium">
                                                <CalendarIcon size={12} className="text-slate-400" />
                                                <span>{formattedDate} • {formattedTime}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body - Products List */}
                                    <div className="p-5 flex-1 space-y-3.5 bg-white">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
                                            <ShoppingBagIcon size={14} />
                                            <span>Rincian Produk ({order.items.length})</span>
                                        </div>

                                        <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                                            {order.items.map((item, idx) => (
                                                <div key={item.id || idx} className="flex justify-between items-start text-xs text-slate-600 pb-2.5 border-b border-slate-50 last:border-0 last:pb-0">
                                                    <div className="space-y-1 flex-1 pr-3">
                                                        <p className="font-bold text-slate-800 leading-tight">{item.product?.name}</p>
                                                        {item.variant && (
                                                            <span className="inline-block text-[10px] font-bold bg-slate-100 border border-slate-200/50 text-slate-500 px-1.5 py-0.5 rounded-md">
                                                                {item.variant?.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="text-[10px] font-bold text-slate-400 mb-0.5">{item.qty}x</p>
                                                        <p className="font-black text-slate-700">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="p-5 bg-slate-50/50 border-t border-slate-200 flex flex-col gap-4">
                                        <div className="flex items-end justify-between text-xs">
                                            <div>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Metode</p>
                                                <span className="inline-block px-2.5 py-1 rounded-md font-bold text-slate-700 border border-slate-200 bg-white uppercase text-[10px]">
                                                    {order.payment_method}
                                                </span>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                {Number(order.discount_amount) > 0 && (
                                                    <div className="mb-2.5 space-y-1.5 text-right flex flex-col items-end">
                                                        <div>
                                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Harga Normal</p>
                                                            <p className="text-[11px] font-bold text-slate-400 line-through decoration-slate-400/70">
                                                                Rp {Number(order.total_price ?? 0).toLocaleString('id-ID')}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] text-rose-400 font-bold uppercase tracking-wider mb-0.5">Diskon Promo</p>
                                                            <p className="text-[11px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 inline-block">
                                                                - Rp {Number(order.discount_amount).toLocaleString('id-ID')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total Tagihan</p>
                                                <p className="text-lg font-black text-[#009662]">
                                                    Rp {Number(order.grand_total ?? 0).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200/60">
                                            <button
                                                onClick={() => setQrToken(order?.qr_token)}
                                                className="flex items-center justify-center gap-1.5 px-3 py-2 text-slate-600 hover:text-[#009662] hover:bg-[#009662]/10 border border-slate-200 hover:border-[#009662]/30 text-xs font-bold rounded-xl transition-all"
                                                title="Detail Pesanan"
                                            >
                                                <Eye size={16} /> <span className="sm:hidden ml-1">Detail</span>
                                            </button>

                                            {order.status === 'pending' && (order.payment_status === 'unpaid' || order?.payment_status === 'pending_verification') && (
                                                <button
                                                    onClick={() => handleTriggerProcess(order)}
                                                    disabled={actionLoading}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                                                >
                                                    <Wallet size={14} /> {actionLoading ? 'Loading...' : 'Bayar & Proses'}
                                                </button>
                                            )}

                                            {order.payment_status === 'paid' && order.status === 'paid' && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(order, 'processing')}
                                                        disabled={actionLoading}
                                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                                                    >
                                                        <Play size={14} fill="currentColor" /> {actionLoading ? 'Proses...' : 'Proses'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(order, 'cancelled', 'cancelled')}
                                                        disabled={actionLoading}
                                                        className="flex items-center justify-center gap-1.5 px-3 py-2 text-rose-500 hover:bg-rose-50 border border-rose-200 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-bold rounded-xl transition-all"
                                                        title="Batalkan Pesanan"
                                                    >
                                                        <XCircle size={16} /> Batalkan
                                                    </button>
                                                </>
                                            )}

                                            {order.payment_status === 'paid' && order.status === 'processing' && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(order, 'completed')}
                                                        disabled={actionLoading}
                                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#009662] hover:bg-[#007d51] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                                                    >
                                                        <Check size={16} strokeWidth={3} /> {actionLoading ? 'Menyimpan...' : 'Selesaikan'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(order, 'paid')}
                                                        disabled={actionLoading}
                                                        className="flex items-center justify-center gap-1.5 px-3 py-2 text-rose-500 hover:bg-rose-50 border border-rose-200 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-bold rounded-xl transition-all"
                                                        title="Batalkan Proses"
                                                    >
                                                        <XCircle size={16} /> Batal Proses
                                                    </button>
                                                </>
                                            )}

                                            {order.status === 'completed' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(order, 'done')}
                                                    disabled={actionLoading}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                                                >
                                                    <CheckCheck size={16} strokeWidth={2.5} /> Selesai Diterima
                                                </button>
                                            )}

                                            {(order.status === 'done' || order.status === 'cancelled' || order.status === 'expired' || order.status === 'rejected') && (
                                                <div className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-[11px] font-bold text-slate-500 bg-slate-100/80 border border-slate-200 rounded-xl">
                                                    {order.status === 'done' ? (
                                                        <><CheckCheck size={14} className="text-emerald-500" /> Riwayat Selesai</>
                                                    ) : (
                                                        <><AlertCircle size={14} className="text-rose-500" /> {order.status}</>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* --- PAGINATION --- */}
                {dataOrders?.data && dataOrders.data.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
                        <p className="text-xs text-slate-500 font-medium">
                            Menampilkan <span className="text-slate-800 font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-slate-800 font-bold">{Math.min(currentPage * itemsPerPage, Number(dataOrders?.meta?.total ?? 0))}</span> dari <span className="text-slate-800 font-bold">{Number(dataOrders?.meta?.total ?? 0)}</span> pesanan
                        </p>

                        <div className="flex items-center gap-1.5 flex-wrap justify-center">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="h-9 px-3 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm"
                            >
                                Sebelumnya
                            </button>

                            {getPaginationGroup(currentPage, Number(dataOrders?.meta?.last_page ?? 0)).map((item, index) => (
                                item === '...' ? (
                                    <span key={`dots-${index}`} className="w-9 h-9 flex items-center justify-center text-xs font-bold text-slate-400">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={`page-${item}`}
                                        onClick={() => setCurrentPage(Number(item))}
                                        className={`w-9 h-9 flex items-center justify-center text-xs font-bold rounded-xl transition-all ${currentPage === item
                                            ? 'bg-[#009662] text-white border border-[#009662] shadow-sm'
                                            : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                )
                            ))}

                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Number(dataOrders?.meta?.last_page ?? 0)))}
                                disabled={currentPage === Number(dataOrders?.meta?.last_page ?? 0)}
                                className="h-9 px-3 text-xs font-bold rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all shadow-sm"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- MODALS & NOTIFICATIONS --- */}
            {showPaymentModal && activeVerifyOrder && (
                <ModalPayment
                    onClose={() => { setShowPaymentModal(false); setActiveVerifyOrder(null) }}
                    activeVerifyOrder={activeVerifyOrder}
                    handleAcceptPayment={(v) => handleUpdateStatus(activeVerifyOrder, 'paid', 'paid', v)}
                    handleRejectPayment={() => handleUpdateStatus(activeVerifyOrder, 'rejected', 'rejected')}
                />
            )}

            {loading && !actionLoading && <Loading />}

            {isOpenScan && <ModalScan onClose={() => setIsOpenScan(false)} handleUpdateStatus={handleUpdateStatus} />}
            {openModalAdd && <ModalAddOrder onClose={() => setOpenModalAdd(false)} addToast={addToast} outlets={outlets} handleSubmit={(token: string) => { getOrder(); setQrToken(token); setOpenModalAdd(false); }} />}

            {toasts && (
                <div className="fixed bottom-6 right-4 sm:right-6 z-[100] flex flex-col gap-2.5 max-w-sm w-full">
                    <div className={`p-4 rounded-xl shadow-xl border text-sm font-semibold flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 ${toasts.type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                        toasts.type === 'info' ? 'bg-slate-800 text-white border-slate-700' :
                            'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                        {toasts.type === 'error' ? <AlertTriangle className='text-rose-600' size={20} /> : <CheckCircle2 className='text-emerald-600' size={20} />}
                        <p className="flex-1">{toasts.message}</p>
                    </div>
                </div>
            )}
            {qrToken && <ModalDetailOrder onClose={() => setQrToken(null)} token={qrToken} />}
            <DateRangeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onApply={(dates) => {
                    if (dates.length === 2) {
                        const start = dates[0].toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                        const end = dates[1].toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                        setDateRangeText(`${start} - ${end}`)
                    } else if (dates.length === 1) {
                        const single = dates[0].toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                        setDateRangeText(single)
                    } else {
                        setDateRangeText('')
                    }
                }}
            />
        </MainLayout>
    )
}

export default OrdersComponent