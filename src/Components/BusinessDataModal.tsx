import React, { useState } from 'react';
import { Store, AlertCircle, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Props = {
    isOpen: boolean;
}
const BusinessDataModal = ({ isOpen }: Props) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            {/* Container Modal */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="relative p-6 text-center border-b border-gray-100">


                    <div className="mx-auto flex items-center justify-center w-12 h-12 bg-amber-100 text-amber-600 rounded-full mb-4">
                        <AlertCircle size={28} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900">Data Usaha Belum Lengkap</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Ups! Kamu perlu melengkapi profil usaha terlebih dahulu sebelum bisa menambah data transaksi atau produk.
                    </p>
                </div>

                {/* Content/Preview */}
                <div className="p-6 bg-gray-50/50">
                    <div className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Store size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Informasi Penting:</p>
                            <ul className="mt-1 text-xs text-gray-500 list-disc list-inside space-y-1">
                                <li>Nama & Alamat Bisnis</li>
                                <li>Nomor Kontak Usaha</li>
                                <li>Pengaturan Mata Uang</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 flex flex-col gap-3">
                    <Link href={'store'}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all active:scale-[0.98]"
                    >
                        Lengkapi Sekarang
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BusinessDataModal;