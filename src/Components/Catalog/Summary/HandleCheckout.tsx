"use client";

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { OutletsType } from '@/types/Admin/OutletType';
import Loading from '@/Components/Loading';

type Props = {
    isBuild?: boolean;
    className: string;
    children: React.ReactNode;
    selectedOutlet: OutletsType | null;
};

const HandleCheckout = ({ isBuild, className, children, selectedOutlet }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState<boolean>(false);

    // Hitung URL secara dinamis saat tombol diklik agar datanya selalu mutakhir (Up-to-date)
    const handleNavigation = () => {
        if (!selectedOutlet?.name) return;

        setLoading(true);

        // Pastikan nama outlet aman untuk URL (misal: "Outlet 1" -> "Outlet%201")
        const safeOutletName = encodeURIComponent(selectedOutlet.name);

        // Ambil segmen pertama dari pathname saat ini (tanpa slash)
        const segments = pathname.split("/").filter(Boolean);
        const currentFirstSegment = segments[0]; // Isinya mentah dari URL (bisa jadi masih berupa %20)

        let targetUrl = `/${safeOutletName}/checkout`;

        // Jika ada segmen di URL saat ini
        if (currentFirstSegment) {
            // Bandingkan secara apel-ke-apel (sama-sama di-decode)
            if (decodeURIComponent(currentFirstSegment) === selectedOutlet.name) {
                targetUrl = `/${safeOutletName}/checkout`;
            } else if (pathname === `/${currentFirstSegment}`) {
                targetUrl = `${pathname}/${safeOutletName}/checkout`;
            } else {
                targetUrl = `${pathname}/checkout`;
            }
        }

        // Jalankan navigasi jika bukan dalam mode build
        if (!isBuild) {
            router.push(targetUrl);
        } else {
            setLoading(false); // Reset loading jika cuma simulasi build
        }
    };

    if (loading) {
        return <Loading title="Sedang muat halaman" />;
    }

    return (
        <button
            onClick={handleNavigation}
            className={className}
            disabled={!selectedOutlet && !isBuild} // Mencegah klik jika outlet belum dipilih
        >
            {children}
        </button>
    );
};

export default HandleCheckout;