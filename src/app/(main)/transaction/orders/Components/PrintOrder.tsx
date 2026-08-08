import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { OrderType } from '@/types/Admin/Catalog/Order';

// Tipe data sesuaikan dengan data pesananmu
type ReceiptProps = {
    data: OrderType | null;
};

// Gunakan forwardRef agar react-to-print bisa menangkap elemen ini
const PrintOrder = forwardRef<HTMLDivElement, ReceiptProps>(({ data }, ref) => {
    // Helper untuk format angka ke Rupiah
    const formatRp = (angka: number | string) => {
        return Number(angka || 0).toLocaleString('id-ID');
    };

    // Base URL untuk QR Code
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // Generate URL struk online (pastikan slug dan qr_token ada)
    const onlineReceiptUrl = data?.qr_token
        ? `${baseUrl}/${data?.slug}/detail-order/${data?.qr_token}`
        : null;

    return (
        <div ref={ref} className="p-4 bg-white text-black font-mono w-[58mm] text-[10px]">
            {/* Header Toko */}
            <div className="text-center mb-3 border-b border-dashed border-black pb-3">
                <h2 className="font-bold text-sm uppercase leading-tight">{data?.business?.name || 'NAMA TOKO'}</h2>
                <h3 className="font-semibold text-xs mb-1.5 text-gray-800">{data?.outlet?.name || 'Cabang Utama'}</h3>

                <p className="text-[9px] mt-1">REF: {data?.order_number || '-'}</p>
                <p className="text-[9px]">
                    {data?.created_at
                        ? new Date(data.created_at).toLocaleString('id-ID', {
                            day: '2-digit', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                        })
                        : '-'}
                </p>
            </div>

            {/* Info Pelanggan & Pembayaran */}
            <div className="mb-3 border-b border-dashed border-black pb-3">
                <p>Pelanggan : {data?.customer_name || '-'}</p>
                <p>Status    : {data?.payment_status === 'paid' ? 'LUNAS' : 'BELUM LUNAS'}</p>
                <p>Metode    : {data?.payment_method?.toUpperCase() || '-'}</p>
            </div>

            {/* Item Pesanan */}
            <div className="mb-3 border-b border-dashed border-black pb-3">
                <div className="flex justify-between font-bold mb-2 border-b border-black pb-1">
                    <span>Item</span>
                    <span>Total</span>
                </div>

                {/* Looping item pesanan dinamis */}
                {data?.items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between mb-2">
                        <div className="flex flex-col pr-2">
                            <span className="font-semibold">
                                {item?.product_name}
                                {item?.variant?.name ? ` - ${item.variant.name}` : ''}
                            </span>
                            <span>{item?.qty}x @ {formatRp(item?.price)}</span>
                        </div>
                        <span className="text-right whitespace-nowrap">
                            {formatRp(item?.qty * item?.price)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="text-right font-bold text-[11px] mb-4 space-y-1">
                {Number(data?.discount_amount) > 0 && (
                    <>
                        <p className="font-normal text-[10px] flex justify-between">
                            <span>Subtotal:</span>
                            <span>{formatRp(data?.total_price ?? 0)}</span>
                        </p>
                        <p className="font-normal text-[10px] flex justify-between">
                            <span>Diskon:</span>
                            <span>-{formatRp(data?.discount_amount ?? 0)}</span>
                        </p>
                    </>
                )}

                <p className="text-xs pt-1 border-t border-dashed border-black flex justify-between">
                    <span>TOTAL:</span>
                    <span>Rp {formatRp(data?.grand_total ?? 0)}</span>
                </p>
            </div>

            {/* QR CODE STRUK ONLINE */}
            {onlineReceiptUrl && (
                <div className="mt-4 flex flex-col items-center justify-center border-t border-dashed border-black pt-4">
                    <p className="text-[10px] font-bold mb-2 text-center">Scan QR Code<br />Untuk Struk Online</p>
                    <QRCodeSVG value={onlineReceiptUrl} size={80} />
                </div>
            )}

            {/* Footer */}
            <div className="text-center text-[9px] mt-4 leading-relaxed">
                <p className="font-bold">Terima kasih atas kunjungan Anda!</p>
                <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
            </div>
        </div>
    );
});

PrintOrder.displayName = 'PrintOrder';
export default PrintOrder;