import React from 'react';
import { Loader, Loader2 } from 'lucide-react';

type Props = {
    title?: string;
};

const Loading = ({ title = "Memuat Halaman..." }: Props) => {
    return (
        <div
            // Memperbaiki z-index dan memperhalus efek blur
            className="fixed inset-0 bg-white/50 backdrop-blur-sm z-102 flex flex-col items-center justify-center transition-all"
            role="status"
            aria-label="Loading"
        >
            <div
                // Menambahkan porsi padding (p-6), memperhalus border, dan memberi rona shadow hijau
                className="p-6 bg-white shadow-2xl shadow-[#10B981]/10 rounded-2xl border border-gray-100 flex flex-col items-center transform transition-all animate-in fade-in zoom-in-95 duration-200"
            >
                {/* Spinner menggunakan Lucide React dengan warna tema */}
                <Loader
                    size={44}
                    strokeWidth={2.5}
                    className="text-[#10B981] animate-spin mb-4"
                />

                {/* Teks dengan efek pulse halus agar pengguna tahu sistem sedang memproses */}
                <p className="text-sm font-semibold text-gray-700 animate-pulse tracking-wide">
                    {title}
                </p>
            </div>
        </div>
    );
};

export default Loading;