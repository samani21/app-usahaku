import { CheckCheckIcon, CheckCircle2, Clock, FileCheck2, Hourglass, Package, PackageCheck, Wallet, XCircle } from "lucide-react";

export const StatusOrder: Record<string, { bg: string; icon: React.ReactNode; label: string }> = {
    pending: {
        bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
        icon: <Clock size={16} />,
        label: 'Menunggu'
    },
    unpaid: {
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
        icon: <Wallet size={16} />, // Lebih cocok untuk pembayaran dibanding Clock
        label: 'Belum Dibayar'
    },
    processing: {
        bg: 'bg-blue-50 text-blue-700 border-blue-200/60',
        icon: <Package size={16} />, // Package/Box menggambarkan proses packing/persiapan barang
        label: 'Diproses'
    },
    completed: {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        icon: <CheckCircle2 size={16} />,
        label: 'Selesai'
    },
    done: {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        icon: <PackageCheck size={16} />, // Membedakan 'completed' dan 'done' jika alurnya berbeda (misal: Selesai diterima)
        label: 'Pesanan Diterima'
    },
    paid: {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        icon: <FileCheck2 size={16} />, // Signature diganti ke konfirmasi dokumen/pembayaran sukses
        label: 'Sudah Dibayar'
    },
    cancelled: {
        bg: 'bg-rose-50 text-rose-700 border-rose-200/60',
        icon: <XCircle size={16} />,
        label: 'Dibatalkan'
    },
    expired: {
        bg: 'bg-gray-50 text-gray-700 border-gray-200/60',
        icon: <Hourglass size={16} />, // Pengganti TimerOff yang lebih umum di Lucide
        label: 'Kadaluwarsa'
    }

};