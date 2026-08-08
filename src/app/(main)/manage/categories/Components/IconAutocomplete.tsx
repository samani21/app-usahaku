"use client";

import { useEffect, useRef, useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { formatImage } from '@/utils/formatImage';

// 🔹 DAFTAR ICON LOKAL (E-Commerce, POS, & Bisnis)
// Sangat Cepat, Tanpa API. Terbagi berdasarkan kategori.
const POPULAR_ICONS = [
    // 🏪 Toko & Belanja (Store & Shopping)
    'lucide:store', 'lucide:shopping-bag', 'lucide:shopping-cart', 'mdi:storefront-outline', 'ph:storefront-duotone', 'solar:shop-bold-duotone', 'solar:cart-large-bold-duotone',

    // 💰 Transaksi & Uang (Payment & Cashier)
    'lucide:receipt', 'lucide:wallet', 'lucide:banknote', 'lucide:credit-card', 'mdi:cash-register', 'mdi:point-of-sale', 'mdi:contactless-payment-circle-outline', 'solar:wallet-bold-duotone',

    // 📦 Produk & Inventaris (Products & Inventory)
    'lucide:box', 'lucide:package', 'lucide:layers', 'lucide:archive', 'mdi:package-variant', 'ph:package-duotone', 'solar:box-bold-duotone',

    // 🏷️ Diskon & Promo (Tags & Discounts)
    'lucide:tag', 'lucide:tags', 'lucide:percent', 'mdi:ticket-percent-outline', 'ph:tag-duotone', 'solar:sale-bold-duotone',

    // 🚚 Pengiriman & Logistik (Delivery)
    'lucide:truck', 'lucide:map-pin', 'mdi:truck-delivery-outline', 'mdi:map-marker-radius-outline', 'ph:truck-duotone', 'solar:routing-bold-duotone',

    // 👥 Pelanggan & Karyawan (Users)
    'lucide:users', 'lucide:user', 'lucide:user-check', 'mdi:account-group', 'ph:users-duotone', 'solar:users-group-rounded-bold-duotone',

    // 🍔 F&B / Restoran (Untuk Kategori Produk POS)
    'lucide:coffee', 'lucide:utensils', 'lucide:cup-soda', 'mdi:food', 'mdi:chef-hat', 'mdi:food-drumstick', 'mdi:ice-cream',

    // 👕 Fashion & Retail (Untuk Kategori Produk POS)
    'mdi:tshirt-crew-outline', 'mdi:shoe-sneaker', 'mdi:hanger', 'mdi:glasses', 'mdi:watch',

    // 📈 Laporan & Analitik (Reports)
    'lucide:trending-up', 'lucide:bar-chart-3', 'lucide:pie-chart', 'ph:chart-line-up-duotone', 'solar:chart-square-bold-duotone',

    // ⚙️ UI & Dashboard Dasar
    'lucide:home', 'lucide:layout-dashboard', 'lucide:settings', 'lucide:plus', 'lucide:edit', 'lucide:trash-2', 'lucide:search'
];

type Props = {
    value?: string;
    onChange?: (val: string) => void;
    prefix?: string;
    handleDelete: () => void;
};

export default function IconAutocomplete({
    value = '',
    onChange,
    prefix = '',
    handleDelete
}: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // 🔹 FILTER LOKAL (Instant, Tanpa Loading)
    const filtered = useMemo(() => {
        if (!search.trim()) return POPULAR_ICONS;

        const lowerSearch = search.toLowerCase();
        let results = POPULAR_ICONS.filter(icon =>
            icon.toLowerCase().includes(lowerSearch) &&
            (prefix ? icon.startsWith(prefix) : true)
        );

        // FITUR AJAIB: Jika user nge-paste nama icon dari web yang tidak ada di list lokal,
        // jadikan inputannya sebagai pilihan pertama agar tetap bisa dipilih!
        if (search.trim() && !results.includes(search.trim()) && search.includes(':')) {
            results.unshift(search.trim());
        }

        return results;
    }, [search, prefix]);

    // 🔥 CLICK OUTSIDE HANDLER
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 🔹 FUNGSI COPY
    const handleCopy = () => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                        Pilih Icon Kategori / Menu
                    </label>
                    <a
                        href="https://icon-sets.iconify.design/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1 transition-colors"
                        title="Buka web pencarian icon lengkap di tab baru"
                    >
                        <Icon icon="lucide:external-link" width={12} />
                        Cari Icon Lengkap
                    </a>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onFocus={() => setOpen(true)}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setOpen(true);
                        }}
                        placeholder="Cari atau paste nama icon (misal: lucide:shopping-bag)"
                        className="w-full px-4 py-3 pl-10 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 bg-slate-50 hover:bg-white text-slate-800 transition-all duration-200 placeholder:text-slate-400 placeholder:font-medium"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Icon icon="lucide:search" width={18} />
                    </div>
                </div>

                <p className="text-[11px] text-slate-400 font-medium leading-tight">
                    *Ketik kata kunci (cart, food, box) atau <b className="text-slate-600">paste nama icon</b> dari web Iconify (contoh: <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-500">solar:wallet-bold</code>).
                </p>

                {/* State Jika Icon Sudah Terpilih */}
                {value && (
                    <div className='flex items-center justify-between p-3 mt-1 bg-emerald-50/70 border border-emerald-100 rounded-xl group transition-all'>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm text-emerald-600 border border-emerald-100">
                                {value?.startsWith('usahaku') ? (
                                    <img src={formatImage(value)} className="w-5 h-5 object-contain" alt="icon" />
                                ) : (
                                    <Icon icon={value} width={22} />
                                )}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-widest mb-0.5">Icon Aktif</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-slate-700 leading-none">
                                        {!value?.startsWith('usahaku') ? value : 'Custom Image'}
                                    </p>

                                    {/* Tombol Copy */}
                                    {!value?.startsWith('usahaku') && (
                                        <button
                                            type="button"
                                            onClick={handleCopy}
                                            className="text-slate-400 hover:text-emerald-600 transition-colors"
                                            title="Copy nama icon"
                                        >
                                            {copied ? <Icon icon="lucide:check-circle-2" width={14} className="text-emerald-500" /> : <Icon icon="lucide:copy" width={14} />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            className='px-3 py-1.5 text-xs font-bold text-rose-500 hover:text-white hover:bg-rose-500 bg-white rounded-lg transition-all shadow-sm border border-rose-100 hover:border-rose-500'
                            onClick={() => {
                                handleDelete();
                                setSearch(''); // Reset search bar saat dihapus
                            }}
                        >
                            Hapus
                        </button>
                    </div>
                )}
            </div>

            {/* DROPDOWN (Muncul saat diklik/diketik) */}
            {open && (
                <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl mt-2 max-h-56 overflow-y-auto shadow-xl shadow-slate-200/50 custom-scrollbar p-1.5">
                    {filtered.length === 0 ? (
                        <div className="p-4 text-center">
                            <p className="text-sm font-bold text-slate-700">Icon tidak ditemukan</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">Klik "Cari Icon Lengkap" lalu paste di sini.</p>
                        </div>
                    ) : (
                        filtered.map((icon, idx) => (
                            <button
                                key={`${icon}-${idx}`}
                                type="button"
                                onClick={() => {
                                    onChange?.(icon);
                                    setSearch('');
                                    setOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 cursor-pointer transition-colors text-left group"
                            >
                                <div className="w-8 h-8 rounded-md bg-slate-50 group-hover:bg-white group-hover:shadow-sm flex items-center justify-center text-slate-500 group-hover:text-emerald-600 transition-all shrink-0 border border-transparent group-hover:border-emerald-100">
                                    <Icon icon={icon} width={20} />
                                </div>

                                {/* Jika ini adalah icon hasil paste manual, beri label khusus */}
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-600 group-hover:text-emerald-700 truncate">
                                        {icon}
                                    </span>
                                    {search === icon && !POPULAR_ICONS.includes(icon) && (
                                        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">
                                            Gunakan Icon Paste
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}