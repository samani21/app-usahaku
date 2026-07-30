'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { AlertCircle, CalendarIcon, Check, CheckCircle2, CheckIcon, ClockIcon, Play, ShoppingBagIcon, Signature, TimerOff, TruckIcon, XCircle, XIcon, ScanLine, RefreshCcw } from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Get } from '@/utils/Get';
import { OrderType } from '@/types/Admin/Catalog/Order';
import { Meta } from '@/types/Public';

type Props = {
    onClose: () => void;
    // Update prop type agar sinkron dengan fungsi di OrdersComponent
    handleUpdateStatus: (order: OrderType, status: string, paymentStatus?: string, cash?: number) => void;
}

interface dataType {
    summary: any;
    data: OrderType[];
    meta: Meta;
}

const statusMeta: Record<string, { bg: string; icon: React.ReactNode; label: string }> = {
    pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200/60', icon: <ClockIcon size={14} />, label: 'Menunggu' },
    unpaid: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60', icon: <ClockIcon size={14} />, label: 'Belum dibayar' },
    processing: { bg: 'bg-blue-50 text-blue-700 border-blue-200/60', icon: <TruckIcon size={14} />, label: 'Diproses' },
    completed: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', icon: <CheckIcon size={14} />, label: 'Selesai' },
    paid: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', icon: <Signature size={14} />, label: 'Dibayar' },
    cancelled: { bg: 'bg-rose-50 text-rose-700 border-rose-200/60', icon: <XIcon size={14} />, label: 'Batal' },
    expired: { bg: 'bg-gray-50 text-gray-700 border-gray-200/60', icon: <TimerOff size={14} />, label: 'Expired' }
};

const ModalScan = ({ onClose, handleUpdateStatus }: Props) => {
    const [scanError, setScanError] = useState<string | null>(null);
    const [scannedQr, setScannedQr] = useState<string | null>(null);
    const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
    const [isLoadingOrder, setIsLoadingOrder] = useState<boolean>(false);
    const [dataOrder, setDataOrder] = useState<OrderType | null>(null);

    const html5QrcodeRef = useRef<Html5Qrcode | null>(null);

    // Fungsi Inisialisasi Kamera
    const startScanner = () => {
        setIsCameraReady(false);
        setScanError(null);
        setScannedQr(null);
        setDataOrder(null);

        // Beri jeda sedikit agar DOM #reader siap jika baru di-reset
        setTimeout(() => {
            const html5Qrcode = new Html5Qrcode("reader", {
                formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                verbose: false
            });
            html5QrcodeRef.current = html5Qrcode;

            const onSuccess = (decodedText: string) => {
                // Mainkan bunyi beep
                try {
                    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(1300, ctx.currentTime);
                    gain.gain.setValueAtTime(0.05, ctx.currentTime);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.08);
                } catch (e) {
                    console.log("Audio contexts blocked or unsupported");
                }
                console.log('decodedText', decodedText)
                // Matikan kamera, lalu fetch API
                if (html5Qrcode.isScanning) {
                    html5Qrcode.stop()
                        .then(() => setScannedQr(decodedText))
                    // .catch((err) => console.error("Gagal mematikan kamera:", err));
                } else {
                    setScannedQr(decodedText);
                }
            };

            html5Qrcode.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                onSuccess,
                () => { } // onError dikosongkan agar tidak spam log
            )
                .then(() => setIsCameraReady(true))
                .catch((err) => {
                    console.error(err);
                    setScanError("Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.");
                });
        }, 100);
    };

    useEffect(() => {
        startScanner();
        return () => {
            if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
                // html5QrcodeRef.current.stop().catch(console.error);
            }
        };
    }, []);

    const handleClose = async () => {
        if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
            try { await html5QrcodeRef.current.stop(); } catch (err) { }
        }
        onClose();
    };

    // Fetch Data berdasarkan QR
    useEffect(() => {
        if (!scannedQr) return;

        const fetchOrder = async () => {
            setIsLoadingOrder(true);
            try {
                const res = await Get<{ success: Boolean, data: dataType }>(`client/orders?qr_order=${scannedQr}`);
                const foundOrder = res?.data?.data?.find((e) => e?.qr_order === scannedQr);

                if (res?.success && foundOrder) {
                    setDataOrder(foundOrder);
                } else {
                    setScanError("QR Code tidak cocok dengan pesanan manapun di database.");
                }
            } catch (e: any) {
                setScanError("Terjadi kesalahan jaringan saat mengecek pesanan.");
            } finally {
                setIsLoadingOrder(false);
            }
        };

        fetchOrder();
    }, [scannedQr]);

    const formatDate = useMemo(() => {
        if (!dataOrder) return null;
        const date = new Date(dataOrder?.created_at);
        const d = date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
        const t = date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        return `${d} • ${t}`;
    }, [dataOrder]);

    const orderStatus = statusMeta?.[dataOrder?.payment_status === 'unpaid' ? dataOrder?.payment_status : (dataOrder?.status ?? '')];

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header Modal */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <ScanLine size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 leading-tight">Scan Invoice</h3>
                            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Arahkan kamera ke QR Code pelanggan</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                    >
                        <XIcon size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/30">

                    {/* LOADING STATE */}
                    {isLoadingOrder && (
                        <div className="p-12 flex flex-col items-center justify-center space-y-4">
                            <div className="w-10 h-10 border-4 border-[#009662] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm font-bold text-slate-500">Mencari detail pesanan...</p>
                        </div>
                    )}

                    {/* HASIL: DATA DITEMUKAN */}
                    {!isLoadingOrder && dataOrder && (
                        <div className="p-6">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                {/* Card Header */}
                                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="pr-3">
                                            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mb-1">
                                                {dataOrder.order_number}
                                            </span>
                                            <h3 className="text-base font-bold text-slate-800 leading-tight">
                                                {dataOrder.customer_name || 'Tanpa Nama'}
                                            </h3>
                                        </div>
                                        {orderStatus && (
                                            <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${orderStatus.bg}`}>
                                                {orderStatus.icon} <span>{orderStatus.label}</span>
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                                        <span className="bg-white text-slate-600 font-bold px-2 py-1 rounded-md border border-slate-200 shadow-xs">
                                            {dataOrder.outlet?.name}
                                        </span>
                                        <div className="flex items-center gap-1.5 font-medium">
                                            <CalendarIcon size={12} className="text-slate-400" />
                                            <span>{formatDate}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="p-5 space-y-3.5 bg-white">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
                                        <ShoppingBagIcon size={14} />
                                        <span>Rincian Produk ({dataOrder.items.length})</span>
                                    </div>
                                    <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                                        {dataOrder.items.map((item, idx) => (
                                            <div key={item.id || idx} className="flex justify-between items-start text-xs text-slate-600 pb-2 border-b border-slate-50 last:border-0 last:pb-0">
                                                <div className="space-y-1">
                                                    <p className="font-bold text-slate-800">{item.product?.name}</p>
                                                    {item.variant && (
                                                        <span className="inline-block text-[10px] font-bold bg-slate-100 border border-slate-200/50 text-slate-500 px-1.5 py-0.5 rounded-md">
                                                            {item.variant.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-slate-400">{item.qty}x</p>
                                                    <p className="font-black text-slate-700">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Card Summary */}
                                <div className="p-5 bg-slate-50/50 border-t border-slate-100">
                                    <div className="flex items-center justify-between text-xs mb-4">
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Metode</p>
                                            <span className="inline-block px-2.5 py-1 rounded-md font-bold text-slate-700 border border-slate-200 bg-white uppercase text-[10px]">
                                                {dataOrder.payment_method}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Tagihan</p>
                                            <p className="text-lg font-black text-[#009662]">
                                                Rp {Number(dataOrder.grand_total ?? 0).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        {dataOrder.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(dataOrder, 'processing', 'paid')}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                                                >
                                                    <Play size={14} fill="currentColor" />
                                                    {dataOrder.payment_method === 'cash' ? 'Verifikasi & Proses' : 'Proses Pesanan'}
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(dataOrder, 'cancelled', 'cancelled')}
                                                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-rose-500 hover:bg-rose-50 border border-rose-200 text-xs font-bold rounded-xl transition-all"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </>
                                        )}

                                        {dataOrder.status === 'paid' && (
                                            <button
                                                onClick={() => handleUpdateStatus(dataOrder, 'processing')}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                                            >
                                                <Play size={14} fill="currentColor" /> Proses Pesanan
                                            </button>
                                        )}

                                        {dataOrder.status === 'processing' && (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(dataOrder, 'completed')}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#009662] hover:bg-[#007d51] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                                                >
                                                    <Check size={16} strokeWidth={3} /> Selesaikan Pesanan
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(dataOrder, dataOrder.payment_method === 'cash' ? 'pending' : 'paid')}
                                                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-rose-500 hover:bg-rose-50 border border-rose-200 text-xs font-bold rounded-xl transition-all"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </>
                                        )}

                                        {(dataOrder.status === 'completed' || dataOrder.status === 'cancelled') && (
                                            <div className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-xl">
                                                {dataOrder.status === 'completed' ? (
                                                    <><CheckCircle2 size={16} className="text-emerald-500" /> Transaksi Telah Selesai</>
                                                ) : (
                                                    <><AlertCircle size={16} className="text-rose-500" /> Pesanan Dibatalkan</>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* KAMERA SCANNER (Muncul jika belum scan data) */}
                    {!isLoadingOrder && !dataOrder && (
                        <div className="p-8 flex flex-col items-center">
                            <div className="relative w-full aspect-square max-w-[300px] overflow-hidden bg-slate-950 rounded-3xl border-4 border-slate-800 shadow-2xl flex items-center justify-center ring-4 ring-slate-100">

                                {/* Target box for html5-qrcode */}
                                <div id="reader" className="w-full h-full overflow-hidden [&_video]:w-full [&_video]:h-full [&_video]:object-cover"></div>

                                {!isCameraReady && !scanError && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-300 text-xs gap-3">
                                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="font-medium animate-pulse">Menyiapkan Kamera...</span>
                                    </div>
                                )}

                                {scanError && (
                                    <div className="absolute inset-0 p-6 flex flex-col items-center justify-center bg-slate-900 text-center text-rose-400 text-xs gap-2">
                                        <AlertCircle size={24} className="text-rose-500 mb-1" />
                                        <p className="font-semibold leading-relaxed">{scanError}</p>
                                    </div>
                                )}

                                {isCameraReady && (
                                    <div className="absolute w-full h-[2px] bg-indigo-500 shadow-[0_0_12px_#6366f1] animate-[bounce_2.5s_infinite] left-0 top-0 pointer-events-none z-10" />
                                )}
                            </div>

                            {isCameraReady && (
                                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                                    <span>Kamera Aktif</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Modal */}
                <div className="px-6 py-4 border-t border-slate-100 bg-white flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0">
                    <button
                        onClick={handleClose}
                        className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
                    >
                        Tutup
                    </button>

                    {/* Tombol Scan Ulang: Muncul jika hasil sudah ada atau error */}
                    {(dataOrder || scanError) && (
                        <button
                            onClick={startScanner}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
                        >
                            <RefreshCcw size={16} />
                            Scan QR Lain
                        </button>
                    )}
                </div>
            </div>

            {/* Pembersihan UI Bawaan html5-qrcode */}
            <style jsx global>{`
                #reader {
                    border: none !important;
                    background: transparent;
                }
                #reader video {
                    transform: scaleX(1);
                }
                #reader__dashboard_section_csr span, 
                #reader__dashboard_section_swaplink {
                    display: none !important; /* Menyembunyikan teks/tombol bawaan library yang jelek */
                }
            `}</style>
        </div>
    );
};

export default ModalScan;