"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Search, Plus, Calendar, Tag, Percent, ShoppingBag, Edit3, Trash2,
    CheckCircle, XCircle, Info, ArrowRight, PowerOff, Power, ChevronLeft,
    ChevronRight, Loader2
} from 'lucide-react';
import MainLayout from '@/Components/Layout/MainLayout';
import CreateOrUpdatePromo from './Components/CreateOrUpdatePromo';
import { Get } from '@/utils/Get';
import { PromoType } from './Components/type';
import { Meta } from '@/types/Public';
import { Post } from '@/utils/Post';
import ModalDelete from '@/Components/CRUD/ModalDelete';
import ModalCrud from '@/Components/CRUD/ModalCrud';
import { Delete } from '@/utils/Delete';
import { AlertType } from '@/types/Alert';
import Alert from '@/Components/Alert';
import { formatImage } from '@/utils/formatImage';
import { Icon } from '@iconify/react';

// --- SKELETON LOADER (Tampilan Premium Saat Loading) ---
const PromoCardSkeleton = () => (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col justify-between animate-pulse shadow-sm">
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="h-6 w-28 bg-slate-200 rounded-full"></div>
                <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
            </div>
            <div className="h-7 w-3/4 bg-slate-200 rounded-lg mb-4"></div>
            <div className="h-12 w-full bg-slate-50 rounded-2xl mb-5"></div>
            <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="h-4 w-40 bg-slate-200 rounded mb-4"></div>
                <div className="space-y-3">
                    <div className="h-16 w-full bg-slate-50 rounded-2xl border border-slate-100"></div>
                    <div className="h-16 w-full bg-slate-50 rounded-2xl border border-slate-100"></div>
                </div>
            </div>
        </div>
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2">
            <div className="h-9 w-24 bg-slate-100 rounded-xl"></div>
            <div className="h-9 w-20 bg-slate-100 rounded-xl"></div>
            <div className="h-9 w-20 bg-slate-100 rounded-xl"></div>
        </div>
    </div>
);

export default function PromoManagement() {
    // --- STATE PENCARIAN & FILTER ---
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'semua' | 'aktif' | 'non-aktif'>('semua');

    // --- STATE PAGINATION ---
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [meta, setMeta] = useState<Meta>({ last_page: 1, limit: 10, page: 1, total: 0 });

    // --- STATE DATA & UI ---
    const [loading, setLoading] = useState<boolean>(true);
    const [promos, setPromos] = useState<PromoType[]>([]);
    const [openAddPromo, setOpenAddPromo] = useState<boolean>(false);
    const [editPromo, setEditPromo] = useState<PromoType | null>(null);

    // --- STATE MODAL & ACTION ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteData, setDeleteData] = useState<PromoType | null>(null);
    const [statusUpdateData, setStatusUpdateData] = useState<PromoType | null>(null);
    const [isSubmittingStatus, setIsSubmittingStatus] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    // ==========================================
    // EFFECTS & HELPERS
    // ==========================================
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 800);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, statusFilter]);

    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (debouncedSearch.trim()) params.append("search", debouncedSearch);
        if (statusFilter !== 'semua') params.append("status", statusFilter === 'aktif' ? '1' : '0');
        return `?${params.toString()}`;
    }, [page, limit, debouncedSearch, statusFilter]);

    const getPromo = useCallback(async () => {
        setLoading(true);
        try {
            const res = await Get<{ success: boolean, data: PromoType[], meta: Meta }>(`client/promo${queryString}`);
            if (res?.success) {
                setPromos(res?.data || []);
                if (res?.meta) setMeta(res.meta);
            }
        } catch (e: any) {
            console.error("Gagal mengambil data promo:", e);
        } finally {
            setLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        getPromo();
    }, [getPromo]);

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    const formatPromoBadge = (type: string, value: number) => {
        if (type === 'mixed_specific') return 'Spesifik (Bervariasi)';
        if (type === 'percentage') return `Global: ${value}%`;
        return `Global: ${formatRupiah(value)}`;
    };

    const formatPromoDate = (dateString: string | null, type: 'start' | 'end') => {
        if (!dateString) return type === 'start' ? 'Sekarang' : 'Selamanya';
        return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // ==========================================
    // ACTION HANDLERS
    // ==========================================
    const triggerUpdateStatus = (promo: PromoType) => {
        setStatusUpdateData(promo);
        setIsModalOpen(true);
    };

    const handleConfirmStatusUpdate = async () => {
        if (!statusUpdateData) return;
        setIsSubmittingStatus(true);
        try {
            const res = await Post(`client/promo/${statusUpdateData.id}/status`, { status: !statusUpdateData.status });
            if (res) {
                setShowAlert({ type: 'success', message: 'Berhasil mengubah status promo', isOpen: true });
                getPromo();
                handleCloseModal();
            }
        } catch (e: any) {
            setShowAlert({ type: 'error', message: 'Gagal mengubah status: ' + e.message, isOpen: true });
        } finally {
            setIsSubmittingStatus(false);
        }
    };

    const onDelete = async (id: number | null) => {
        setLoading(true);
        try {
            const res = await Delete(`client//promo/${id}`);
            if (res) {
                getPromo();
                handleCloseModal();
                setShowAlert({ type: 'success', message: 'Berhasil hapus data', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal proses data: ' + err.message, isOpen: true });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setDeleteData(null);
            setStatusUpdateData(null);
        }, 300);
    };

    if (openAddPromo) {
        return <CreateOrUpdatePromo onClose={() => {
            setOpenAddPromo(false);
            setEditPromo(null);
            getPromo();
        }} editPromo={editPromo} />
    }

    return (
        <MainLayout>
            <div className="w-full animate-in fade-in duration-300 pb-12">
                {/* --- TOP HEADER & ACTIONS --- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Kelola Promo</h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Pantau detail potongan harga toko Anda.</p>
                    </div>
                    <button onClick={() => setOpenAddPromo(true)} className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black uppercase tracking-wider rounded-full shadow-lg shadow-emerald-500/25 transition-all active:scale-95 w-full sm:w-auto">
                        <Plus size={18} strokeWidth={3} /> Tambah Promo
                    </button>
                </div>

                {/* --- SEARCH & FILTER CAPSULE --- */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-3 sm:p-4 rounded-[2rem] border border-slate-100 shadow-sm mb-6">
                    <div className="flex bg-slate-50 p-1.5 rounded-full w-full md:w-fit overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <button onClick={() => setStatusFilter('semua')} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${statusFilter === 'semua' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Semua</button>
                        <button onClick={() => setStatusFilter('aktif')} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${statusFilter === 'aktif' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}><CheckCircle size={14} /> Aktif</button>
                        <button onClick={() => setStatusFilter('non-aktif')} className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${statusFilter === 'non-aktif' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}><XCircle size={14} /> Non-Aktif</button>
                    </div>

                    <div className="relative w-full md:w-80">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                            <Search size={18} />
                        </div>
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari nama promo..." className="w-full text-sm font-bold text-slate-800 pl-11 pr-4 py-3.5 bg-slate-50 border border-transparent focus:border-slate-200 focus:bg-white rounded-full outline-none transition-all" />
                    </div>
                </div>

                {/* --- CARD LIST GRID --- */}
                {loading ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Tampilkan 4 Skeleton sebagai placeholder */}
                        {[1, 2, 3, 4].map((i) => <PromoCardSkeleton key={i} />)}
                    </div>
                ) : promos.length > 0 ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {promos.map((promo) => (
                                <div key={promo.id} className={`bg-white rounded-[2rem] border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${promo.status ? 'border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-md' : 'border-slate-200/60 opacity-80'}`}>
                                    <div className="p-5 sm:p-6">
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                                            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${promo.type === 'percentage' ? 'bg-purple-50 text-purple-600 border border-purple-100' : promo.type === 'nominal' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                                {promo.type === 'percentage' ? <Percent size={12} strokeWidth={3} /> : <Tag size={12} />}
                                                {formatPromoBadge(promo.type, promo.value)}
                                            </span>
                                            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${promo.status ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                                {promo.status ? '● Aktif' : '○ Non-Aktif'}
                                            </span>
                                        </div>

                                        <h3 className={`text-xl font-black leading-snug transition-colors line-clamp-2 ${promo.status ? 'text-slate-800 group-hover:text-emerald-600' : 'text-slate-500'}`}>
                                            {promo.name_promo}
                                        </h3>

                                        <div className={`rounded-2xl p-3 border flex flex-row flex-wrap gap-4 text-xs font-semibold mt-4 mb-5 ${promo.status ? 'bg-slate-50 border-slate-100/50 text-slate-600' : 'bg-slate-50/50 border-transparent text-slate-400'}`}>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className={promo.status ? "text-slate-400" : "text-slate-300"} />
                                                <span className={promo.status ? "text-slate-400" : "text-slate-300"}>Mulai:</span>
                                                <span className={promo.start_date ? 'text-slate-700' : 'text-amber-600 italic font-medium'}>{formatPromoDate(promo.start_date, 'start')}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className={promo.status ? "text-slate-400" : "text-slate-300"} />
                                                <span className={promo.status ? "text-slate-400" : "text-slate-300"}>Akhir:</span>
                                                <span className={promo.end_date ? 'text-slate-700' : 'text-blue-600 font-bold'}>{formatPromoDate(promo.end_date, 'end')}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-1.5 mb-3 px-1">
                                                <ShoppingBag size={14} className={promo.status ? "text-emerald-500" : "text-slate-400"} />
                                                <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">Daftar Produk ({promo.products.length})</span>
                                            </div>

                                            {promo.products.length > 0 ? (
                                                <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                                                    {promo.products.map((prod) => (
                                                        <div key={prod.id} className={`flex flex-col p-3 border rounded-2xl gap-3 transition-colors ${promo.status ? 'bg-slate-50/70 border-slate-100 hover:bg-slate-50' : 'bg-slate-50/30 border-slate-100/50'}`}>
                                                            <div className="flex items-center justify-between gap-2">
                                                                <div className="flex items-center gap-3 min-w-0">
                                                                    {
                                                                        prod?.image?.startsWith('usahaku') ?
                                                                            <img src={formatImage(prod.image)} alt={prod.name} className={`w-10 h-10 rounded-xl object-cover bg-white shrink-0 border border-slate-100 ${!promo.status && 'opacity-50 grayscale'}`} /> :
                                                                            <Icon icon={prod?.image ?? "mynaui:image"} className={`w-10 h-10 rounded-xl object-cover bg-white shrink-0 border border-slate-100 ${!promo.status && 'opacity-50 grayscale'}`} />
                                                                    }
                                                                    <div className="min-w-0">
                                                                        <h4 className={`text-xs font-bold truncate ${promo.status ? 'text-slate-800' : 'text-slate-500'}`}>{prod.name}</h4>
                                                                        {prod.variants?.length < 1 && (
                                                                            <span className={`inline-block mt-0.5 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${promo.status ? 'text-rose-500 bg-rose-50' : 'text-slate-400 bg-slate-100'}`}>-{formatRupiah(prod.cut_value)}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {prod.variants?.length < 1 && (
                                                                    <div className="flex items-center gap-2 shrink-0">
                                                                        <span className="text-[11px] text-slate-400 line-through font-medium hidden sm:block">{formatRupiah(prod.price!)}</span>
                                                                        <ArrowRight size={12} className="text-slate-300 hidden sm:block" />
                                                                        <span className={`text-xs font-black ${promo.status ? 'text-emerald-600' : 'text-slate-500'}`}>{formatRupiah(prod.final_price)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {prod.variants && prod.variants.length > 0 && (
                                                                <div className="pl-11 pr-1 space-y-2 mt-1">
                                                                    {prod.variants.map(v => (
                                                                        <div key={v.id} className="flex flex-col sm:flex-row justify-between sm:items-center bg-white/80 p-2.5 rounded-xl border border-slate-100 gap-1.5">
                                                                            <div className="flex items-center gap-1.5">
                                                                                <ArrowRight size={12} className="text-slate-300" />
                                                                                <span className={`text-[11px] font-bold ${promo.status ? 'text-slate-700' : 'text-slate-400'}`}>{v.name}</span>
                                                                                <span className={`ml-1 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${promo.status ? 'text-rose-500 bg-rose-50' : 'text-slate-400 bg-slate-100'}`}>-{formatRupiah(v.cut_value)}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1.5 ml-4 sm:ml-0">
                                                                                <span className="text-[10px] text-slate-400 line-through font-medium hidden sm:block">{formatRupiah(v.price)}</span>
                                                                                <span className={`text-xs font-black ${promo.status ? 'text-emerald-600' : 'text-slate-500'}`}>{formatRupiah(v.final_price)}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className={`flex items-start gap-3 p-4 rounded-2xl text-xs font-bold border ${promo.status ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                                    <Info size={16} className="shrink-0 mt-0.5" />
                                                    <span className="leading-relaxed">Promo Checkout: Otomatis memotong Grand Total belanja di kasir sebesar ({promo?.type === 'percentage' ? promo?.value + '%' : formatRupiah(promo?.value)}).</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* --- CARD ACTION BUTTONS (MOBILE OPTIMIZED) --- */}
                                    <div className="border-t border-slate-50 bg-slate-50/50 p-4 grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center sm:justify-end gap-2">
                                        {promo.status ? (
                                            <button onClick={() => triggerUpdateStatus(promo)} className="col-span-2 sm:col-span-1 w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl transition-all active:scale-95">
                                                <PowerOff size={14} /> Matikan
                                            </button>
                                        ) : (
                                            <button onClick={() => triggerUpdateStatus(promo)} className="col-span-2 sm:col-span-1 w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-600 font-bold text-xs rounded-xl transition-all active:scale-95 shadow-sm">
                                                <Power size={14} /> Aktifkan
                                            </button>
                                        )}
                                        <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
                                        <button onClick={() => { setOpenAddPromo(true); setEditPromo(promo); }} className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 font-bold text-xs rounded-xl transition-all active:scale-95">
                                            <Edit3 size={14} /> Edit
                                        </button>
                                        <button onClick={() => { setIsModalOpen(true); setDeleteData(promo); }} className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-transparent hover:bg-rose-50 text-rose-500 font-bold text-xs rounded-xl transition-all active:scale-95">
                                            <Trash2 size={14} /> Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {meta.last_page > 1 && (
                            <div className="flex items-center justify-between bg-white p-4 sm:px-6 sm:py-4 rounded-3xl border border-slate-100 shadow-sm mt-8">
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl transition-all active:scale-95 disabled:opacity-50">
                                    <ChevronLeft size={16} /> <span className="hidden sm:inline">Sebelumnya</span>
                                </button>
                                <span className="text-xs sm:text-sm font-bold text-slate-700">
                                    Halaman {meta.page} <span className="text-slate-400 font-medium">dari {meta.last_page}</span>
                                </span>
                                <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page === meta.last_page} className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl transition-all active:scale-95 disabled:opacity-50">
                                    <span className="hidden sm:inline">Selanjutnya</span> <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white border border-slate-100 rounded-[2rem] shadow-sm mt-4">
                        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Tag size={28} />
                        </div>
                        <h4 className="text-sm font-black text-slate-700">Data Promo Tidak Ditemukan</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto font-medium">Coba ubah kata kunci pencarian atau sesuaikan filter status.</p>
                    </div>
                )}
            </div>

            {/* Modal Handlers sama dengan kode aslinya... */}
            {deleteData ? (
                <ModalDelete isOpen={isModalOpen} onClose={handleCloseModal} deleteData={deleteData} handleDelete={onDelete} />
            ) : statusUpdateData ? (
                <ModalCrud isOpen={isModalOpen} title={"Update Status"} onClose={handleCloseModal}>
                    <div className="p-2 space-y-6">
                        <div className="text-center pt-2">
                            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-inner ${statusUpdateData.status ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                {statusUpdateData.status ? <PowerOff size={32} /> : <Power size={32} />}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">
                                Yakin ingin <strong className={statusUpdateData.status ? "text-rose-600 font-black" : "text-emerald-600 font-black"}>{statusUpdateData.status ? 'Menonaktifkan' : 'Mengaktifkan'}</strong> promo ini?
                            </p>
                            <div className="inline-block px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                                <p className="text-lg font-black text-slate-800">{statusUpdateData.name_promo}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
                            <button onClick={handleCloseModal} disabled={isSubmittingStatus} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all">Batal</button>
                            <button onClick={handleConfirmStatusUpdate} disabled={isSubmittingStatus} className={`flex items-center gap-2 px-5 py-2.5 font-bold text-xs text-white rounded-xl transition-all ${statusUpdateData.status ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                                {isSubmittingStatus ? <><Loader2 size={16} className="animate-spin" /> Memproses...</> : 'Ya, Lanjutkan'}
                            </button>
                        </div>
                    </div>
                </ModalCrud>
            ) : null}

            {showAlert?.isOpen && <Alert type={showAlert.type} message={showAlert.message} onClose={() => setShowAlert(null)} />}
        </MainLayout>
    );
}