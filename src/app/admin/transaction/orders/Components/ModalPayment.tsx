"use client"
import { OrderType } from '@/types/Admin/Catalog/Order';
import { CheckIcon, XIcon, Wallet, RefreshCw, AlertCircle, QrCode, Ban } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react';
import { formatImage } from '@/utils/formatImage';
import { Get } from '@/utils/Get';

type Props = {
    onClose: () => void;
    activeVerifyOrder: OrderType | null;
    handleAcceptPayment: (uangDiterima?: number, transactionCode?: string, transferDate?: string) => void;
    handleRejectPayment: () => void;
    isRefreshing?: boolean;
}

const ModalPayment = ({ onClose, activeVerifyOrder, handleAcceptPayment, handleRejectPayment, isRefreshing = false }: Props) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const [isLoading, setIsLoading] = useState<boolean>(false)
    
    // State lokal agar data bisa langsung update ketika di-refresh
    const [orderData, setOrderData] = useState<OrderType | null>(activeVerifyOrder);

    // Sync orderData kalau activeVerifyOrder dari parent berubah
    useEffect(() => {
        setOrderData(activeVerifyOrder);
    }, [activeVerifyOrder]);

    // Kalkulasi Data menggunakan state lokal orderData
    const isCash = orderData?.payment_method?.toLowerCase() === 'cash';
    const totalAmount = Number(orderData?.grand_total || 0);

    // State untuk Kalkulator Uang Cash
    const [uangDiterima, setUangDiterima] = useState<number>(0);
    const [uangDiterimaDisplay, setUangDiterimaDisplay] = useState<string>('');

    // State untuk Form Pembayaran Digital
    const [transactionCode, setTransactionCode] = useState<string>('');
    const [transferDate, setTransferDate] = useState<string>('');

    const handleUangDiterimaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
        setUangDiterima(numericValue);
        setUangDiterimaDisplay(numericValue ? numericValue.toLocaleString('id-ID') : '');
    };

    const setUangPas = (nominal: number) => {
        setUangDiterima(nominal);
        setUangDiterimaDisplay(nominal ? nominal.toLocaleString('id-ID') : '');
    };

    // PERUBAHAN DISINI: 
    // Jika Cash -> wajib uang pas/lebih. 
    // Jika Transfer/QRIS -> Kasir bisa langsung klik Terima (false / tidak didisable)
    const isSubmitDisabled = isCash
        ? (uangDiterima < totalAmount)
        : false; 

    const onRefresh = async () => {
        setIsLoading(true)
        try {
            const res = await Get<{ success: Boolean, data: OrderType }>(`client/orders/detail-order?token=${orderData?.qr_token}`);
            if (res?.success) {
                setOrderData(res.data);
            }
        } catch (e: any) {
            console.error("Gagal refresh data", e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">

                {/* Header Modal */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                    <div>
                        <h3 className="text-lg font-black text-slate-900">Verifikasi Pembayaran</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {isCash ? 'Input nominal uang tunai yang diterima.' : 'Verifikasi layar HP pelanggan & klik Terima.'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                        <XIcon size={20} />
                    </button>
                </div>

                {/* Konten Modal / Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 relative">
                    
                    {isLoading ? (
                        /* --- SKELETON LOADER SAAT REFRESH --- */
                        <div className="space-y-6 animate-pulse">
                            {/* Skeleton Ringkasan Pesanan */}
                            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="h-2.5 w-16 bg-slate-200 rounded"></div>
                                    <div className="h-4 w-28 bg-slate-200 rounded"></div>
                                </div>
                                <div className="space-y-2 text-right">
                                    <div className="h-2.5 w-16 bg-slate-200 rounded ml-auto"></div>
                                    <div className="h-4 w-24 bg-slate-200 rounded ml-auto"></div>
                                </div>
                                <div className="pt-3 border-t border-slate-100 space-y-2">
                                    <div className="h-2.5 w-20 bg-slate-200 rounded"></div>
                                    <div className="h-4 w-24 bg-slate-200 rounded"></div>
                                </div>
                                <div className="pt-3 border-t border-slate-100 space-y-2 text-right">
                                    <div className="h-2.5 w-20 bg-slate-200 rounded ml-auto"></div>
                                    <div className="h-5 w-32 bg-slate-200 rounded ml-auto"></div>
                                </div>
                            </div>
                            
                            {/* Skeleton Section Bawah (Input/Upload) */}
                            <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-4">
                                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                    <div className="h-4 w-40 bg-slate-200 rounded"></div>
                                    <div className="h-7 w-24 bg-slate-200 rounded-lg"></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="h-40 bg-slate-200 rounded-xl"></div>
                                    <div className="h-40 bg-slate-200 rounded-xl"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* --- KONTEN ASLI SAAT TIDAK LOADING --- */
                        <>
                            {/* Ringkasan Pesanan Singkat */}
                            <div className="bg-[#F8FAFC] border border-slate-100 p-4 rounded-2xl grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Pelanggan</p>
                                    <p className="font-bold text-slate-800 text-sm mt-0.5">{orderData?.customer_name || 'Tanpa Nama'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Invoice</p>
                                    <p className="font-bold text-slate-800 mt-0.5">{orderData?.order_number}</p>
                                </div>
                                <div className="pt-2 border-t border-slate-100 flex flex-col justify-end">
                                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Metode Bayar</p>
                                    <p className="font-bold text-[#009662] text-sm mt-0.5 uppercase">{orderData?.payment_method}</p>
                                </div>
                                <div className="text-right pt-2 border-t border-slate-100">
                                    {/* Konsistensi Tampilan Diskon */}
                                    {Number(orderData?.discount_amount) > 0 && (
                                        <div className="mb-1 flex flex-col items-end">
                                            <span className="text-[10px] font-bold text-slate-400 line-through">
                                                Rp {Number(orderData?.total_price || 0).toLocaleString('id-ID')}
                                            </span>
                                            <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 mt-0.5">
                                                - Rp {Number(orderData?.discount_amount).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    )}
                                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Total Tagihan</p>
                                    <p className="font-black text-slate-900 text-sm mt-0.5">Rp {totalAmount.toLocaleString('id-ID')}</p>
                                </div>
                            </div>

                            {/* KONDISI: Jika Pembayaran CASH -> Tampilkan Kalkulator */}
                            {isCash ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                        <Wallet size={16} className="text-[#009662]" />
                                        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Kalkulator Kasir</h4>
                                    </div>

                                    <div className={`p-4 rounded-xl border shadow-sm transition-colors ${(uangDiterima - totalAmount) >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                                        <span className="block text-[10px] font-bold uppercase tracking-wide opacity-70">Kembalian</span>
                                        <span className={`text-2xl font-black ${(uangDiterima - totalAmount) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {(uangDiterima - totalAmount) >= 0
                                                ? `Rp ${(uangDiterima - totalAmount).toLocaleString('id-ID')}`
                                                : `- Rp ${Math.abs(uangDiterima - totalAmount).toLocaleString('id-ID')} (Kurang)`
                                            }
                                        </span>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Nominal Uang Diterima</label>
                                        <div className="relative mb-3">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                                <span className="text-sm font-bold text-slate-400">Rp</span>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="0"
                                                value={uangDiterimaDisplay}
                                                onChange={handleUangDiterimaChange}
                                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#009662] focus:ring-2 focus:ring-[#009662]/20 font-bold text-slate-700 text-lg transition-all"
                                            />
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <button type="button" onClick={() => setUangPas(totalAmount)} className="px-3 py-2 text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors">
                                                Uang Pas
                                            </button>
                                            {[50000, 100000].map((nominal) => (
                                                <button key={nominal} type="button" onClick={() => setUangPas(nominal)} className="px-3 py-2 text-xs font-bold bg-white border border-slate-200 hover:border-[#009662] hover:text-[#009662] text-slate-600 rounded-lg transition-colors shadow-sm">
                                                    {nominal.toLocaleString('id-ID')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* KONDISI: Jika BUKAN CASH (Transfer/QRIS) */
                                <div className="space-y-4 border border-slate-200 p-4 rounded-2xl bg-slate-50/50">
                                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Pembayaran Digital</h4>
                                        <button
                                            type="button"
                                            onClick={onRefresh}
                                            disabled={isLoading}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
                                        >
                                            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                                            {isLoading ? 'Mengecek...' : 'Refresh Upload'}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {/* Kolom Kiri: QR Code (Tetap ada buat opsi aja) */}
                                        <div className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center flex items-center gap-1">
                                                <QrCode size={12} /> Scan untuk Upload (Opsional)
                                            </p>
                                            <div className="bg-white p-2 border border-slate-100 rounded-xl shadow-xs ring-4 ring-slate-50">
                                                <QRCodeCanvas value={`${baseUrl}/${orderData?.slug}/detail-order/${orderData?.qr_token}`} size={110} />
                                            </div>
                                        </div>

                                        {/* Kolom Kanan: Tampilan Bukti (Atau keterangan kasir) */}
                                        <div className="flex flex-col">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center sm:text-left">
                                                Hasil Upload Bukti
                                            </p>
                                            {orderData?.payment_proof ? (
                                                <div className='flex-1 flex items-center justify-center w-full bg-white border border-emerald-200 rounded-xl p-2 shadow-sm relative overflow-hidden'>
                                                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shadow-sm">Uploaded</div>
                                                    <img src={formatImage(orderData?.payment_proof)} alt="Bukti Pembayaran" className='max-h-36 w-auto rounded-lg object-contain' />
                                                </div>
                                            ) : (
                                                <div className="flex-1 flex flex-col items-center justify-center p-4 bg-white border border-dashed border-slate-300 rounded-xl">
                                                    <AlertCircle size={24} className="text-emerald-400 mb-2" />
                                                    <p className="text-xs font-bold text-slate-600 text-center">Bisa Langsung Terima</p>
                                                    <p className="text-[10px] text-slate-400 text-center mt-1 px-2">Cek layar HP pelanggan, jika sukses silakan klik tombol Terima.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* --- FORM INPUT TAMBAHAN UNTUK DIGITAL --- */}
                                    <div className="pt-2 space-y-3">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1.5 pl-1">Kode Transaksi (Opsional)</label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: TRF-09876"
                                                value={transactionCode}
                                                onChange={(e) => setTransactionCode(e.target.value)}
                                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium text-slate-700 transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>

                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer Modal dengan Tombol Verifikasi & Tolak */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-3 shrink-0">

                    {/* Tombol Terima Pembayaran */}
                    <button
                        type="button"
                        onClick={() => handleAcceptPayment(uangDiterima, transactionCode, transferDate)}
                        disabled={isSubmitDisabled || isLoading}
                        className="w-full sm:flex-1 py-3 px-4 bg-[#009662] hover:bg-[#007d51] disabled:bg-slate-300 disabled:cursor-not-allowed disabled:text-slate-500 disabled:shadow-none text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-[#009662]/20 flex items-center justify-center gap-2 order-1 sm:order-3"
                    >
                        <CheckIcon size={18} />
                        <span>Terima</span>
                    </button>

                    {/* Tombol Tolak Pembayaran */}
                    <button
                        type="button"
                        onClick={handleRejectPayment}
                        disabled={isLoading}
                        className="w-full sm:w-auto py-3 px-4 bg-white border border-rose-200 hover:bg-rose-50 disabled:opacity-50 text-rose-500 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 order-2"
                    >
                        <Ban size={16} />
                        <span className="hidden sm:inline">Tolak</span>
                    </button>

                    {/* Tombol Batal/Tutup Modal */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto py-3 px-6 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-sm font-bold rounded-xl transition-colors text-center order-3 sm:order-1"
                    >
                        Batal
                    </button>

                </div>

            </div>
        </div>
    )
}

export default ModalPayment