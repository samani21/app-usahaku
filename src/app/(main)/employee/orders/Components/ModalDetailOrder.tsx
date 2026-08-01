"use client"
import { OrderType } from '@/types/Admin/Catalog/Order';
import { Get } from '@/utils/Get';
import {
    XIcon, User, MapPin, Receipt,
    Wallet, Package, CheckCircle2, QrCode, AlertCircle
} from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { QRCodeCanvas } from "qrcode.react";
import { StatusOrder } from '@/types/StatusOrder';
import { formatImage } from '@/utils/formatImage';
import { Icon } from '@iconify/react';

type Props = {
    onClose: () => void;
    token: string | null;
}

const ModalDetailOrder = ({ onClose, token }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<OrderType>();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const getOrder = async () => {
        setLoading(true);
        try {
            const res = await Get<{ success: Boolean, data: OrderType }>(`employee/orders/detail-order?token=${token}`);
            if (res?.success) {
                setData(res?.data)
            }
        } catch (e: any) {
            // console.error(e);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) {
            getOrder();
        }
    }, [token])

    // Helper untuk mapping label metode bayar
    const getPaymentMethodLabel = (methodId?: string) => {
        const methods: Record<string, string> = {
            'cash': 'Tunai (Cash)',
            'qris': 'QRIS',
            'transfer': 'Transfer Bank'
        };
        return methodId ? (methods[methodId] || methodId) : '-';
    }

    const status = StatusOrder;
    const isUnpaidNonCash = data?.payment_method !== 'cash' && data?.payment_status === 'unpaid';

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all">
            <div className="bg-slate-50 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#009662]/10 flex items-center justify-center text-[#009662]">
                            <Receipt size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 leading-tight">Detail Pesanan</h2>
                            {data && <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">REF: {data.order_number}</p>}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    >
                        <XIcon size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 relative">

                    {loading ? (
                        /* Loading Skeleton */
                        <div className="space-y-6 animate-pulse">
                            <div className="h-24 bg-white rounded-xl border border-slate-100"></div>
                            <div className="h-48 bg-white rounded-xl border border-slate-100"></div>
                            <div className="h-32 bg-white rounded-xl border border-slate-100"></div>
                        </div>
                    ) : (
                        <>
                            {/* Section 1: Customer & Outlet Info */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm grid sm:grid-cols-2 gap-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -z-10" />

                                <div>
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <User size={14} className="text-[#009662]" />
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pelanggan</label>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 rounded-lg px-3.5 py-2.5">
                                        <p className="text-sm font-bold text-slate-800">{data?.customer_name || 'Tanpa Nama'}</p>
                                        <p className="text-xs font-semibold text-slate-500 font-mono mt-0.5">{data?.phone_number || '-'}</p>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <MapPin size={14} className="text-[#009662]" />
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Lokasi Outlet</label>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 rounded-lg px-3.5 py-2.5">
                                        <p className="text-sm font-bold text-slate-800">{data?.outlet?.name || 'Outlet Utama'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Payment Summary & QR Code */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row gap-6">

                                {/* Info Pembayaran (Kiri) */}
                                <div className="flex-1 space-y-4">
                                    <div className='mb-3 border-b border-slate-100 pb-2 flex items-center justify-between'>
                                        <div className="flex items-center gap-2">
                                            <Wallet size={16} className="text-slate-400" />
                                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Ringkasan Pembayaran</h3>
                                        </div>
                                        <div>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status?.[(data?.payment_status === 'unpaid' ? data?.payment_status : data?.status) ?? ""]?.bg}`}>
                                                {status?.[(data?.payment_status === 'unpaid' ? data?.payment_status : data?.status) ?? '']?.icon}
                                                <span>{status?.[(data?.payment_status === 'unpaid' ? data?.payment_status : data?.status) ?? '']?.label}</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Metode Bayar</p>
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold">
                                                {getPaymentMethodLabel(data?.payment_method)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</p>
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${data?.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'} border`}>
                                                {data?.payment_status === 'paid' ? <><CheckCircle2 size={12} /> Lunas</> : <><AlertCircle size={12} /> Belum Lunas</>}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 mt-3 space-y-2">
                                        {/* Menampilkan Diskon & Harga Normal jika ada */}
                                        {Number(data?.discount_amount) > 0 && (
                                            <>
                                                <div className="flex justify-between items-center px-1">
                                                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Harga Normal</p>
                                                    <p className="text-[11px] font-bold text-slate-400 line-through">
                                                        Rp {Number(data?.total_price || 0).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                <div className="flex justify-between items-center px-1">
                                                    <p className="text-[11px] text-rose-500 font-bold uppercase tracking-wider">Diskon Promo</p>
                                                    <p className="text-[11px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                                                        - Rp {Number(data?.discount_amount || 0).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </>
                                        )}

                                        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total Tagihan</p>
                                            <p className="text-2xl font-black text-[#009662]">
                                                Rp {Number(data?.grand_total || 0).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* QR Code (Kanan) - Logic Berubah di sini */}
                                <div className="w-full sm:w-auto flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-5 sm:pt-0 sm:pl-6">
                                    {isUnpaidNonCash ? (
                                        <>
                                            <p className="text-[10px] font-bold text-amber-500 uppercase mb-3 flex items-center gap-1 text-center">
                                                <QrCode size={12} /> Scan Untuk Bayar
                                            </p>
                                            <div className="p-2.5 bg-white border border-amber-200 rounded-xl shadow-sm ring-4 ring-amber-50">
                                                <QRCodeCanvas value={`${baseUrl}/${data?.slug}/detail-order/${data?.qr_token}`} size={130} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-1 text-center">
                                                <QrCode size={12} /> Scan Struk Online
                                            </p>
                                            <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm ring-4 ring-slate-50">
                                                {data?.qr_token ? (
                                                    <QRCodeCanvas value={`${baseUrl}/${data?.slug}/detail-order/${data?.qr_token}`} size={130} />
                                                ) : (
                                                    <div className="w-[130px] h-[130px] bg-slate-100 flex items-center justify-center rounded-lg text-slate-400 font-medium text-xs">
                                                        N/A
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Section 3: Ordered Items */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-2">
                                        <Package size={16} className="text-slate-400" />
                                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Item Dipesan</h3>
                                    </div>
                                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                        {data?.items?.length || 0} Item
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {data?.items?.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-center p-3 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-colors">
                                            {/* Foto Produk */}
                                            <div className="w-14 h-14 bg-white border border-slate-100 rounded-lg p-1 flex items-center justify-center shrink-0 shadow-sm">
                                                {item?.iamge_product ? (
                                                    item?.iamge_product?.startsWith('usahaku') ?
                                                        <img src={formatImage(item.iamge_product)} alt={item.product_name} className="max-w-full max-h-full object-contain rounded-md" /> :
                                                        <div className="max-w-full max-h-full object-contain rounded-md">
                                                            <Icon icon={item?.iamge_product} color={"#64748b"} className="text-3xl" />
                                                        </div>
                                                ) : (
                                                    <Package size={20} className="text-slate-300" />
                                                )}
                                            </div>

                                            {/* Info Produk */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-slate-800 truncate pr-2">
                                                    {item?.product_name || 'Produk Tidak Diketahui'}
                                                </h4>

                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-semibold text-[#009662]">
                                                        {item?.qty}x
                                                    </span>
                                                    <span className="text-[10px] text-slate-300">|</span>
                                                    <span className="text-xs font-medium text-slate-500">
                                                        Rp {Number(item?.price || 0).toLocaleString('id-ID')}
                                                    </span>
                                                </div>

                                                {/* Badge Variant Jika Ada */}
                                                {item?.variant && (
                                                    <div className="mt-1.5 inline-block px-2 py-0.5 bg-slate-200/70 text-slate-600 text-[10px] font-bold rounded">
                                                        Varian: {item.variant.name}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Subtotal */}
                                            <div className="text-right pl-2">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Subtotal</p>
                                                <p className="text-sm font-black text-slate-800">
                                                    Rp {Number(item.qty * item.price).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {!data?.items?.length && (
                                        <div className="text-center py-6 text-sm text-slate-400 font-medium italic">
                                            Tidak ada item yang ditemukan.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-end shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shadow-sm"
                    >
                        Tutup Panel
                    </button>
                </div>

            </div>
        </div>
    )
}

export default ModalDetailOrder