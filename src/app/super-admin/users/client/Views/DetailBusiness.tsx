'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation' // Untuk tombol kembali
import { ArrowLeft, MapPin, Phone, Mail, Clock, Store, CreditCard, Package, CheckCircle2, XCircle, Settings } from 'lucide-react'
import { Icon } from '@iconify/react'

import { Get } from '@/utils/Get'
import { Post } from '@/utils/Post' // Wajib untuk fungsi update
import SuperAdminLayout from '@/app/super-admin/Components/SuperAdminLayout'
import { formatImage } from '@/utils/formatImage'
import { AlertType } from '@/types/Alert'

// IMPORT COMPONENT MODAL & ALERT
import ModalCrud from '@/Components/CRUD/ModalCrud'
import Alert from '@/Components/Alert'
// Sesuaikan path import UpdateSubscriptionForm di bawah ini dengan folder kamu:
import UpdateSubscriptionForm from '../Components/UpdateSubscriptionForm'

// --- INTERFACES ---
interface MasterBank {
    code: string;
    created_at: string;
    deleted_at: string;
    id: number;
    logo: string;
    name: string;
    updated_at: string;
}

interface BanksType {
    account_name: string;
    account_number: string;
    business_id: number;
    created_at: string;
    id: number;
    is_active: number;
    master_bank_id: number;
    updated_at: string;
    master_bank: MasterBank;
}

interface outletType {
    address: string;
    business_id: number;
    created_at: string;
    day_close: string;
    day_open: string;
    id: number;
    is_currently_open: number;
    is_open: number;
    lat: number;
    lng: number;
    name: string;
    time_close: string;
    time_open: string;
    updated_at: string;
}

interface ProductsType {
    business_id: number;
    created_at: string;
    deleted_at: string;
    description: string;
    has_variant: number;
    id: number;
    image: string;
    is_active: number;
    is_qty: number;
    is_shared_stock: number;
    is_stock: number;
    name: string;
    price: number;
    product_category_id: number;
    qrcode: string;
    slug: string;
    stock: number;
    type: string;
    updated_at: string;
    variants: VariantsType[]
}

interface VariantsType {
    created_at: string;
    current_stock: number
    deleted_at: string
    id: number
    image: string;
    is_active: number
    name: string;
    price: number
    product_id: number
    qty_package: number
    updated_at: string;
}

export interface BusinessType {
    billing_amount: number;
    category: string;
    code_ref: string;
    created_at: string;
    description: string;
    email: string;
    end_time: string;
    id: number;
    logo_url: string;
    name: string;
    plan: string;
    slug: string;
    start_time: string;
    subscription_cycle: number;
    subscription_status: string;
    updated_at: string;
    user_id: number;
    username: string;
    verified_status: number;
    whatsapp: string;
    banks: BanksType[];
    outlet: outletType[];
    products: ProductsType[]
}

type Props = {
    idBusiness: number;
    onBack: () => void;
}

const DetailBusiness = ({ idBusiness, onBack }: Props) => {
    const router = useRouter(); // Router NEXT.js

    // --- STATE ---
    const [business, setBusiness] = useState<BusinessType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // State Modal & Alert
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    // SOP isMounted
    const isMounted = useRef(true);

    // ==========================================
    // EFFECTS & HELPERS
    // ==========================================
    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        if (showAlert?.isOpen) {
            const timer = setTimeout(() => {
                if (isMounted.current) setShowAlert(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    // --- FETCH DATA ---
    const getBusiness = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await Get<{ success: boolean; data: BusinessType }>(`super-admin/business/${idBusiness}`);
            if (isMounted.current && res?.success) {
                setBusiness(res.data);
            }
        } catch (err: any) {
            if (isMounted.current) {
                setError(err?.response?.data?.message || err.message || "Gagal memuat detail bisnis");
            }
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, [idBusiness]);

    useEffect(() => {
        getBusiness();
    }, [getBusiness]);

    // --- UPDATE SUBSCRIPTION ACTION ---
    const handleUpdateSubmit = async (formData: FormData) => {
        setIsUpdating(true);
        try {
            const res = await Post(`super-admin/business/${idBusiness}`, formData);

            if (res) {
                setIsModalOpen(false);
                getBusiness(); // Otomatis me-refresh data detail terbaru
                setShowAlert({ type: 'success', message: 'Paket & Status Berhasil Diupdate!', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal update data: ' + (err?.response?.data?.message || err.message), isOpen: true });
        } finally {
            if (isMounted.current) setIsUpdating(false);
        }
    };


    // --- FORMATTERS ---
    const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(dateStr));
    };

    // --- RENDER LOAD/ERROR ---
    if (loading && !business) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <Icon icon="eos-icons:loading" className="text-emerald-500 text-5xl" />
                <p className="text-slate-500 font-medium animate-pulse">Memuat data bisnis...</p>
            </div>
        );
    }

    if (error || !business) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 bg-white rounded-2xl border border-slate-200">
                <XCircle className="text-rose-500 w-16 h-16" />
                <p className="text-slate-700 font-bold">{error || "Data tidak ditemukan"}</p>
                <div className="flex gap-3">
                    <button onClick={() => router.back()} className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-all">
                        Kembali
                    </button>
                    <button onClick={getBusiness} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold transition-all">
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    const getStatusStyle = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'ACTIVE':
                return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
            case 'EXPIRED':
                return 'bg-amber-100 text-amber-700 border border-amber-200';
            case 'CANCELED':
                return 'bg-rose-100 text-rose-700 border border-rose-200';
            default:
                return 'bg-slate-100 text-slate-600 border border-slate-200';
        }
    };
    // --- MAIN RENDER ---
    return (
        <div className="space-y-6 pb-10">

            {/* TOMBOL KEMBALI */}
            <div className="flex items-center gap-3 mb-2">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-emerald-600 transition-all font-bold text-sm text-slate-600 shadow-sm"
                >
                    <ArrowLeft size={16} /> Kembali
                </button>
            </div>

            {/* HEADER PROFILE */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-0 opacity-50 translate-x-1/2 -translate-y-1/2"></div>

                <div className="z-10">
                    {business.logo_url ? (
                        <img src={formatImage(business.logo_url)} alt={business.name} className="w-24 h-24 rounded-2xl border border-slate-200 object-contain p-2 bg-white shadow-sm" />
                    ) : (
                        <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm">
                            <Icon icon="material-symbols-light:store-rounded" className="text-5xl text-slate-400" />
                        </div>
                    )}
                </div>

                <div className="flex-1 z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold text-slate-800">{business.name}</h1>
                        {business.verified_status === 1 && (
                            <CheckCircle2 className="text-blue-500 w-5 h-5" />
                        )}
                    </div>
                    <p className="text-sm font-medium text-emerald-600 mb-2">{business.category || 'Kategori Belum Diatur'}</p>
                    <p className="text-sm text-slate-500 line-clamp-2 max-w-2xl">{business.description || 'Tidak ada deskripsi.'}</p>
                </div>

                <div className="z-10 bg-slate-50 p-4 rounded-xl border border-slate-100 min-w-[200px]">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pemilik (Owner)</p>
                    <p className="font-bold text-slate-800 text-sm mb-2">{business.username}</p>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Phone size={14} className="text-slate-400" /> {business.whatsapp || '-'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Mail size={14} className="text-slate-400" /> {business.email || '-'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN: SUBSCRIPTION & BANKS */}
                <div className="space-y-6">

                    {/* SUBSCRIPTION CARD */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <Icon icon="mdi:crown-outline" className="text-amber-500 text-xl" /> Info Langganan
                            </h2>
                            {/* TOMBOL UPDATE SUBSCRIPTION */}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg text-xs font-bold transition-all border border-emerald-100"
                            >
                                <Settings size={14} /> Update
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                <span className="text-xs font-medium text-slate-500">Status</span>
                                {/* PANGGIL HELPER WARNA DI SINI */}
                                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${getStatusStyle(business.subscription_status)}`}>
                                    {business.subscription_status || 'INACTIVE'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                <span className="text-xs font-medium text-slate-500">Paket</span>
                                <span className="text-sm font-bold text-slate-800 capitalize">{business.plan || 'Free'}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                <span className="text-xs font-medium text-slate-500">Siklus Perpanjangan</span>
                                <span className="text-sm font-bold text-blue-600">{business.subscription_cycle}x</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                <span className="text-xs font-medium text-slate-500">Total Tagihan</span>
                                <span className="text-sm font-bold text-emerald-600">{formatIDR(business.billing_amount)}</span>
                            </div>
                            <div>
                                <span className="text-xs font-medium text-slate-500 block mb-1">Masa Aktif:</span>
                                <p className="text-xs font-bold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                                    {formatDate(business.start_time)} <br /> s/d <br /> {business.end_time ? formatDate(business.end_time) : <span className="text-emerald-500">Selamanya (Lifetime)</span>}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* BANKS CARD */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                        <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <CreditCard className="text-blue-500 w-5 h-5" /> Rekening Bank ({business.banks?.length || 0})
                        </h2>
                        {business.banks && business.banks.length > 0 ? (
                            <div className="space-y-3">
                                {business.banks.map((bank) => (
                                    <div key={bank.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {/* MENAMPILKAN LOGO BANK */}
                                            <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0">
                                                {bank.master_bank?.logo ? (
                                                    <img src={formatImage(bank.master_bank.logo)} alt={bank.master_bank.name} className="w-full h-full object-contain" />
                                                ) : (
                                                    <CreditCard size={18} className="text-slate-400" />
                                                )}
                                            </div>
                                            <div>
                                                {/* MENAMPILKAN NAMA BANK (MASTER) DAN NO REKENING */}
                                                <p className="font-bold text-sm text-slate-800">{bank.master_bank?.name || 'Bank'}</p>
                                                <p className="text-[11px] font-medium text-slate-500">{bank.account_number} - {bank.account_name}</p>
                                            </div>
                                        </div>
                                        <span className={`w-2 h-2 rounded-full shrink-0 ${bank.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} title={bank.is_active ? 'Aktif' : 'Non-aktif'}></span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 text-center py-4">Belum ada data rekening bank.</p>
                        )}
                    </div>

                </div>

                {/* RIGHT COLUMN: OUTLETS & PRODUCTS */}
                <div className="lg:col-span-2 space-y-6">

                    {/* OUTLETS CARD */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                        <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Store className="text-rose-500 w-5 h-5" /> Cabang / Outlet ({business.outlet?.length || 0})
                        </h2>
                        {business.outlet && business.outlet.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {business.outlet.map((out) => (
                                    <div key={out.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                                        <div className={`absolute top-0 left-0 w-1 h-full ${out.is_open ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                        <p className="font-bold text-sm text-slate-800 mb-1 ml-2">{out.name}</p>
                                        <div className="space-y-2 mt-3 ml-2">
                                            <div className="flex gap-2 items-start text-xs text-slate-600">
                                                <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                                <span className="line-clamp-2">{out.address}</span>
                                            </div>
                                            <div className="flex gap-2 items-center text-xs text-slate-600">
                                                <Clock size={14} className="text-slate-400 shrink-0" />
                                                <span>{out.time_open} - {out.time_close} ({out.day_open} s/d {out.day_close})</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                                <p className="text-sm text-slate-400">Belum ada data outlet.</p>
                            </div>
                        )}
                    </div>

                    {/* PRODUCTS CARD */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                        <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Package className="text-emerald-500 w-5 h-5" /> Daftar Produk ({business.products?.length || 0})
                        </h2>
                        {business.products && business.products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {business.products.map((prod) => (
                                    <div key={prod.id} className="flex gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-emerald-200 transition-all">
                                        <div className="w-16 h-16 shrink-0 rounded-lg bg-slate-100 overflow-hidden border border-slate-100">
                                            {prod.image?.startsWith('usahaku') ? (
                                                <img src={formatImage(prod.image)} alt={prod.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <Icon icon={prod?.image || "mdi:image-outline"} className="text-2xl" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center overflow-hidden">
                                            <p className="font-bold text-xs text-slate-800 truncate mb-1" title={prod.name}>{prod.name}</p>
                                            <p className="text-xs font-bold text-emerald-600 mb-1">{formatIDR(prod.price)}</p>
                                            <p className="text-[10px] font-medium text-slate-500">
                                                Stok: {prod.is_stock ? prod.stock : 'Unlimited'}
                                                {prod.has_variant === 1 && <span className="text-blue-500 ml-1">({prod.variants?.length || 0} Varian)</span>}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                                <p className="text-sm text-slate-400">Belum ada data produk.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* MODAL UPDATE SUBSCRIPTION */}
            <ModalCrud
                isOpen={isModalOpen}
                title="Update Paket & Status Langganan"
                onClose={() => setIsModalOpen(false)}
            >
                <UpdateSubscriptionForm
                    handleFormSubmit={handleUpdateSubmit}
                    data={business}
                    onCancel={() => setIsModalOpen(false)}
                    setLoading={setIsUpdating}
                    loading={isUpdating}
                />
            </ModalCrud>

            {/* ALERT */}
            {showAlert?.isOpen && (
                <Alert
                    type={showAlert.type}
                    message={showAlert.message}
                    onClose={() => setShowAlert(null)}
                />
            )}

        </div>
    )
}

export default DetailBusiness