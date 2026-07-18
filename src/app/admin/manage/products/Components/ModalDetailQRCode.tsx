'use client';
import { OutletsType } from '@/types/Admin/OutletType';
import { ProductsType } from '@/types/Admin/ProductsType';
import { ChevronDown, DownloadIcon, XIcon } from 'lucide-react';
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from 'react';
type Props = {
    onClose: () => void;
    product: ProductsType | null;
    selectOutlet: string;
    outlets: OutletsType[];
}

const ModalDetailQRCode = ({ onClose, product, selectOutlet, outlets }: Props) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [selectedOutletId, setSelectedOutletId] = useState(
        selectOutlet === 'Semua' ? (outlets[0]?.name || '') : selectOutlet
    );
    const qrValue = `${baseUrl}/${product?.slug_business}/${selectedOutletId}/detail-product/${product?.qrcode}`;
    const qrRef = useRef<HTMLDivElement>(null);
    const downloadQRCode = () => {
        const canvas = qrRef.current?.querySelector("canvas");

        if (!canvas) return;

        const newCanvas = document.createElement("canvas");
        const ctx = newCanvas.getContext("2d");

        if (!ctx) return;

        const text = product?.name || "Product 1";

        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height + 50;

        // Background putih
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

        // QR Code
        ctx.drawImage(canvas, 0, 0);

        // Teks produk
        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(text, newCanvas.width / 2, canvas.height + 30);

        const url = newCanvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.download = `qrcode-${text}.png`;
        link.href = url;
        link.click();
    };
    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-lg font-black text-slate-900 truncate">QR: {product?.name}</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col items-center gap-6">
                    {/* Outlet Selector */}
                    <div className="w-full">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block">Pilih Outlet</label>
                        <div className="relative">
                            <select
                                value={selectedOutletId}
                                onChange={(e) => setSelectedOutletId(e.target.value)}
                                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                {outlets.map((outlet) => (
                                    <option key={outlet.id} value={outlet.name}>{outlet.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* QR Code Placeholder/Message */}
                    <div ref={qrRef} className="p-6 border border-dashed border-slate-300 rounded-2xl flex flex-col items-center text-center text-slate-400">
                        <QRCodeCanvas value={String(qrValue)} size={200} />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        Tutup
                    </button>
                    <button
                        onClick={downloadQRCode} // Pasang fungsi di sini
                        className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalDetailQRCode;