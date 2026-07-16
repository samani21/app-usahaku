import { Check, Crown, ShieldCheck, Sparkles, X, Loader2, Copy, Building2, AlertCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Get } from '@/utils/Get';
import { formatIDR } from '@/types/FormtRupiah';
import { Post } from '@/utils/Post';

type Props = {
    onClose: () => void;
}

const ModalSubscription = ({ onClose }: Props) => {
    // State Management
    const [isFetching, setIsFetching] = useState(true); // Loading untuk fetch data awal
    const [isLoading, setIsLoading] = useState(false);  // Loading untuk proses bayar / generate VA
    const [isChecking, setIsChecking] = useState(false); // Loading untuk cek status "Saya Sudah Bayar"
    const [selectedBank, setSelectedBank] = useState('bca');
    const [vaData, setVaData] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [data, setData] = useState<{
        base_price: number,
        promo: number,
        total_amount: number
    } | null>(null);

    const banks = [
        { id: 'bca', name: 'BCA Virtual Account' },
        { id: 'bni', name: 'BNI Virtual Account' },
        { id: 'bri', name: 'BRIVA' },
        { id: 'cimb', name: 'CIMB Virtual Account' }
    ];

    useEffect(() => {
        getSubscription();
    }, []);

    // Fetch data awal saat modal dibuka
    const getSubscription = async () => {
        setIsFetching(true);
        try {
            const res = await Get<{ success: boolean, data: any }>('subscription/show-subscription');
            if (res?.success) {
                setData(res?.data);
                if (res?.data?.subscription) {
                    setVaData(res?.data?.subscription);
                }
            }
        } catch (e: any) {
            // console.error("Error fetching subscription:", e);
        } finally {
            setIsFetching(false);
        }
    };

    // Fungsi Generate VA Baru
    const handlePayment = async () => {
        setIsLoading(true);
        setErrorMsg('');

        try {
            const response = await Post<any, any>('subscription/charge', {
                bank: selectedBank
            });
            if (response.status === 'success') {
                setVaData(response.data);
            }
        } catch (error: any) {
            // console.error(error);
            setErrorMsg(error.response?.data?.message || 'Gagal terhubung ke server pembayaran.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi Cek Status Pembayaran (Saat tombol "Saya Sudah Bayar" diklik)
    const handleCheckPayment = async () => {
        setIsChecking(true);
        setErrorMsg(''); // Reset pesan error sebelumnya
        try {
            const res = await Get<{ success: boolean, data: any }>('subscription/show-subscription');
            if (res?.success) {
                // Jika sukses bayar, backend is_payment bernilai true
                if (res?.data?.is_payment && res?.data?.subscription_status) {
                    window.location.reload();
                } else {
                    // Jika belum bayar, tampilkan pesan peringatan
                    setErrorMsg('Pembayaran belum terdeteksi. Silakan selesaikan pembayaran terlebih dahulu.');
                }
            }
        } catch (e: any) {
            // console.error("Error checking payment:", e);
            setErrorMsg('Gagal mengecek status pembayaran. Silakan coba lagi.');
        } finally {
            setIsChecking(false);
        }
    };

    const handleCopyVA = () => {
        if (vaData?.va_number) {
            navigator.clipboard.writeText(vaData.va_number);
            alert('Nomor VA disalin!');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xl flex items-center justify-center z-100 p-4 transition-all duration-500">
            <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-slate-200 rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] w-full max-w-md overflow-hidden transform transition-all border border-slate-800/80 relative">

                {/* Ambient Aurora Glow in Background */}
                <div className="absolute top-[-20%] left-[20%] w-[60%] h-[40%] bg-gradient-to-br from-emerald-500/10 to-amber-500/10 rounded-full blur-[60px] pointer-events-none"></div>

                {/* Tombol Close */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/60 transition-all active:scale-95 z-20"
                >
                    <X size={15} />
                </button>

                {/* KONDISI 1: JIKA VA SUDAH DIGENERATE (SUCCESS SCREEN) */}
                {vaData ? (
                    <div className="relative p-8 text-center flex flex-col items-center z-10">
                        <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                            <Check className="w-8 h-8 text-emerald-400" strokeWidth={3} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Tagihan Dibuat!</h3>
                        <p className="text-sm text-slate-400 mb-6">Silakan lakukan pembayaran ke nomor Virtual Account di bawah ini.</p>

                        <div className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-5 mb-6 text-left">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Bank</p>
                            <p className="text-sm font-semibold text-white uppercase mb-4">{vaData.bank} Virtual Account</p>

                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Nomor Virtual Account</p>
                            <div className="flex items-center justify-between bg-slate-950 rounded-xl p-3 border border-slate-800 mb-4">
                                <span className="text-lg font-mono font-bold text-amber-400">{vaData.va_number || 'Sedang diproses...'}</span>
                                <button onClick={handleCopyVA} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors">
                                    <Copy size={16} />
                                </button>
                            </div>

                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Tagihan</p>
                            <p className="text-lg font-bold text-white">Rp {parseInt(vaData.nominal).toLocaleString('id-ID')}</p>
                        </div>

                        {/* Pesan Error Jika Cek Pembayaran Gagal/Belum Dibayar */}
                        {errorMsg && (
                            <div className="w-full mb-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2 text-left animate-in fade-in zoom-in duration-300">
                                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-red-400 font-medium leading-relaxed">{errorMsg}</p>
                            </div>
                        )}

                        {/* Tombol Cek Pembayaran */}
                        <button
                            onClick={handleCheckPayment}
                            disabled={isChecking}
                            className="w-full px-5 py-3.5 mb-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all duration-300 text-center tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isChecking ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Mengecek Status...
                                </>
                            ) : (
                                'Saya Sudah Bayar'
                            )}
                        </button>

                        {/* Tombol Tutup Alternatif */}
                        <button
                            onClick={onClose}
                            className="text-[11px] font-semibold text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            Bayar Nanti / Tutup Layar
                        </button>
                    </div>
                ) : (
                    /* KONDISI 2: TAMPILAN AWAL SEBELUM CHECKOUT */
                    <>
                        {/* Modal Header */}
                        <div className="relative p-6 pt-10 pb-2 text-center">
                            <div className="mx-auto w-14 h-14 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl flex items-center justify-center mb-4 shadow-[0_10px_20px_rgba(0,0,0,0.3)] group">
                                <Crown className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform" />
                            </div>

                            <h3 className="text-2xl font-black text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                                Akses Eksklusif Pro Premium
                            </h3>
                            <p className="text-xs text-slate-400 mt-2 max-w-[85%] mx-auto leading-relaxed">
                                Tinggalkan batasan dasar. Rasakan fleksibilitas penuh sistem cerdas analitik finansial kami.
                            </p>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4 relative z-10 pt-2">
                            {/* Float Metallic Pricing Box */}
                            <div className="relative p-5 bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 rounded-2xl border border-slate-700/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden group">
                                {
                                    (data?.promo ?? 0) > 0 &&
                                    <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
                                        <Sparkles size={8} className="fill-current" /> Promo Terbatas
                                    </div>
                                }

                                {isFetching ? (
                                    /* Skeleton Loading saat fetch data */
                                    <div className="animate-pulse flex justify-between items-center h-[52px]">
                                        <div className="space-y-2">
                                            <div className="h-4 bg-slate-700 rounded w-28"></div>
                                            <div className="h-3 bg-slate-800 rounded w-32"></div>
                                        </div>
                                        <div className="space-y-2 flex flex-col items-end">
                                            <div className="h-3 bg-slate-800 rounded w-12"></div>
                                            <div className="h-6 bg-slate-700 rounded w-24"></div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Tampilan Harga Setelah Data Masuk */
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="block font-bold text-white text-sm">Paket Profesional</span>
                                            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Jaminan enkripsi aman
                                            </span>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            {
                                                (data?.base_price ?? 0) > 0 &&
                                                <span className="text-xs text-slate-500 line-through">{formatIDR(data?.base_price ?? 0)}</span>
                                            }
                                            <div className="flex items-baseline justify-end gap-1">
                                                <span className="text-2xl font-black text-amber-400 tracking-tight drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]">
                                                    {formatIDR(data?.total_amount ?? 0)}
                                                </span>
                                            </div>
                                            {
                                                (data?.promo ?? 0) > 0 &&
                                                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 mt-1">
                                                    Hemat {formatIDR(data?.promo ?? 0)}
                                                </span>
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Pilihan Bank */}
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-400 ml-1">Pilih Metode Pembayaran</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {banks.map((bank) => (
                                        <button
                                            key={bank.id}
                                            onClick={() => !isFetching && setSelectedBank(bank.id)}
                                            disabled={isFetching}
                                            className={`p-3 rounded-xl border text-left flex items-center gap-2 transition-all ${selectedBank === bank.id
                                                ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                                                : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:bg-slate-800'
                                                } ${isFetching ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <Building2 size={16} className={selectedBank === bank.id ? 'text-amber-400' : 'text-slate-500'} />
                                            <span className="text-[11px] font-semibold uppercase">{bank.id}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="flex items-center gap-2 bg-red-400/10 border border-red-500/20 p-2.5 rounded-lg mt-2">
                                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                    <p className="text-xs text-red-400">{errorMsg}</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 pt-2 pb-8 bg-slate-950/80 border-t border-slate-900/60 flex flex-col gap-2.5">
                            <button
                                onClick={handlePayment}
                                disabled={isLoading || isFetching}
                                className="w-full px-5 py-3.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-600 rounded-xl shadow-[0_4px_25px_rgba(245,158,11,0.3)] hover:shadow-[0_4px_35px_rgba(245,158,11,0.5)] active:scale-[0.99] active:brightness-95 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex justify-center items-center gap-2 uppercase tracking-wide"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" /> Memproses...
                                    </>
                                ) : isFetching ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" /> Menyiapkan Data...
                                    </>
                                ) : (
                                    'Mulai Berlangganan Sekarang 🚀'
                                )}
                            </button>

                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="w-full px-4 py-2 text-[11px] font-semibold text-slate-500 hover:text-slate-300 bg-transparent transition-colors text-center disabled:opacity-50"
                            >
                                Kembali ke Dashboard Dasar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ModalSubscription