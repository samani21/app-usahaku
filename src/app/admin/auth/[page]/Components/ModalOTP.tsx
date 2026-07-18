'use client'
import { Post } from '@/utils/Post';
import { useCorrectPath } from '@/utils/useCorrectPath';
import { ArrowRight, Loader2, MessageSquareCode, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';

type Props = {
    onClose: () => void;
    themeStyles: any;
    activeScheme: any;
    showToast: (v: string, type: string) => void;
    showOtpModal: any;
    autoResendOtp: boolean;
}

const ModalOtp = ({ onClose, themeStyles, activeScheme, showToast, showOtpModal, autoResendOtp }: Props) => {
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [canResendOtp, setCanResendOtp] = useState<boolean>(false);
    const [otpTimer, setOtpTimer] = useState(60);
    const [isOtpVerifying, setIsOtpVerifying] = useState<boolean>(false);

    // State baru untuk animasi loading Resend OTP
    const [isResendingOtp, setIsResendingOtp] = useState<boolean>(false);

    const otpRefs = useRef<any>([]);
    const { getCorrectPath } = useCorrectPath();

    const handleResendOtp = async (isAuto = false) => {
        // Jika bukan dari auto trigger dan tombol belum bisa diklik, maka batalkan
        if (!canResendOtp) return;

        setIsResendingOtp(true); // Hidupkan loading resend

        try {
            const formData = {
                whatsapp: showOtpModal?.whatsapp
            }
            await Post('auth/resend-otp', formData);
            setOtpTimer(60);
            setCanResendOtp(false);
            setOtpValues(['', '', '', '', '', '']);
            showToast('Kode OTP baru telah dikirimkan kembali ke Email Anda!', 'success');
        } catch (e: any) {
            showToast(e?.message, 'error');
        } finally {
            setIsResendingOtp(false); // Matikan loading resend
        }
    };

    useEffect(() => {
        if (autoResendOtp) {
            setCanResendOtp(true);
            handleResendOtp(true); // Bypass pengecekan 'canResendOtp'
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Hentikan timer jika sudah mencapai angka 0 dan aktifkan tombol kirim ulang
        if (otpTimer <= 0) {
            setCanResendOtp(true);
            return;
        }

        const interval = setInterval(() => {
            setOtpTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [otpTimer]);

    const handleOtpChange = (val: string, index: number) => {
        const cleanVal = val.replace(/[^0-9]/g, '');
        if (!cleanVal) return;

        const newOtp = [...otpValues];
        newOtp[index] = cleanVal.slice(-1); // Ambil angka terakhir
        setOtpValues(newOtp);

        // Auto-focus input berikutnya
        if (index < 5 && cleanVal) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
        if (pastedData) {
            const newOtp = [...otpValues];
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtpValues(newOtp);
            // Fokus ke input terakhir yang terisi
            const focusIndex = pastedData.length < 6 ? pastedData.length : 5;
            otpRefs.current[focusIndex]?.focus();
        }
    };

    const handleOtpKeyDown = (e: any, index: number) => {
        if (e.key === 'Backspace') {
            const newOtp = [...otpValues];
            // Jika kosong, hapus kotak sebelumnya dan fokus ke sana
            if (!newOtp[index] && index > 0) {
                newOtp[index - 1] = '';
                setOtpValues(newOtp);
                otpRefs.current[index - 1]?.focus();
            } else {
                newOtp[index] = '';
                setOtpValues(newOtp);
            }
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        // Cek apakah OTP penuh 6 digit
        const otpString = otpValues.join('');
        if (otpString.length < 6) {
            showToast('Harap masukkan 6 digit kode OTP', 'error');
            return;
        }

        setIsOtpVerifying(true); // Tampilkan animasi loading verifikasi

        try {
            const formData = {
                // Disesuaikan menjadi email agar sinkron
                whatsapp: showOtpModal?.whatsapp,
                otp: otpString
            };
            const res: any = await Post('auth/verify-otp', formData);

            // Manajemen State: Simpan token sebelum redirect
            if (res?.access_token) {
                Cookies.set('token', res.access_token, { expires: 7, secure: true, sameSite: 'strict' });
            }

            showToast('Verifikasi berhasil!', 'success');
            window.location.href = getCorrectPath('/');
        } catch (e: any) {
            showToast(e?.message || 'Kode OTP salah atau kedaluwarsa', 'error');
            // Kosongkan form OTP jika salah agar user mudah mencoba lagi
            setOtpValues(['', '', '', '', '', '']);
            otpRefs.current[0]?.focus();
        } finally {
            setIsOtpVerifying(false); // Matikan animasi loading
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
            {/* FIX UX: Responsif Padding. P-5 untuk HP, P-6/8 untuk layar besar */}
            <div className={`max-w-md w-full p-5 sm:p-6 md:p-8 rounded-3xl border ${themeStyles.modalBg} shadow-2xl relative transition-all duration-300`}>

                {/* Close Modal Button */}
                <button
                    onClick={onClose}
                    disabled={isOtpVerifying || isResendingOtp}
                    className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-500/10 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
                >
                    <X size={16} />
                </button>

                {/* Modal Head Info */}
                <div className="text-center mb-6 mt-2 sm:mt-0">
                    <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr ${activeScheme.primary} flex items-center justify-center text-white mb-4 shadow-lg`}>
                        <MessageSquareCode size={24} />
                    </div>
                    <h3 className="text-lg font-bold tracking-tight mb-1">Verifikasi OTP Email</h3>
                    <p className="text-xs text-slate-400 leading-relaxed px-2 sm:px-0">
                        Kami telah mengirimkan 6 digit kode OTP ke email terdaftar Anda <span className="font-bold text-slate-300">{showOtpModal?.email}</span>.
                    </p>
                </div>

                {/* OTP 6-Digit Form Fields */}
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                    {/* FIX UX: Menggunakan w-full pada input dan gap dinamis agar tidak overflow */}
                    <div className="flex justify-between gap-1.5 sm:gap-3">
                        {otpValues.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el: any) => (otpRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(e.target.value, index)}
                                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                onPaste={handlePaste}
                                disabled={isOtpVerifying || isResendingOtp}
                                /* FIX UX: Ubah lebar kaku menjadi `w-full`. Tinggi (h) dan border radius diatur menyesuaikan ukuran layar */
                                className="w-full h-12 sm:h-14 md:h-16 text-center text-lg sm:text-xl font-bold bg-slate-500/5 hover:bg-slate-500/10 focus:bg-slate-500/15 border border-slate-500/15 focus:border-emerald-500/80 rounded-xl sm:rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all disabled:opacity-50"
                                required
                            />
                        ))}
                    </div>

                    {/* Countdown or Resend Block */}
                    <div className="text-center text-xs">
                        {canResendOtp ? (
                            <p className="text-slate-400 flex items-center justify-center gap-1">
                                Tidak menerima kode?{' '}
                                <button
                                    type="button"
                                    onClick={() => handleResendOtp()}
                                    disabled={isResendingOtp}
                                    className={`font-bold hover:underline flex items-center gap-1 ${activeScheme.text} disabled:opacity-50 disabled:hover:no-underline`}
                                >
                                    {isResendingOtp ? (
                                        <>
                                            <Loader2 className="animate-spin w-3 h-3" />
                                            <span>Mengirim...</span>
                                        </>
                                    ) : (
                                        'Kirim Ulang OTP'
                                    )}
                                </button>
                            </p>
                        ) : (
                            <p className="text-slate-400">
                                Kirim ulang kode OTP dalam <span className={`font-mono font-bold ${activeScheme.text}`}>{otpTimer} detik</span>
                            </p>
                        )}
                    </div>

                    {/* Modal Submit Button */}
                    <button
                        type="submit"
                        disabled={isOtpVerifying || isResendingOtp}
                        className={`w-full py-3 sm:py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r ${activeScheme.primary} shadow-lg active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2`}
                    >
                        {isOtpVerifying ? (
                            <>
                                <Loader2 className="animate-spin w-4 h-4" />
                                <span>Memverifikasi Kode...</span>
                            </>
                        ) : (
                            <>
                                <span>Verifikasi & Aktifkan Partner</span>
                                <ArrowRight size={14} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ModalOtp