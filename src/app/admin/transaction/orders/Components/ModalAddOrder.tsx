"use client"
import { OutletsType } from '@/types/Admin/OutletType';
import { ProductsType } from '@/types/Admin/ProductsType';
import { formatImage } from '@/utils/formatImage';
import { Get } from '@/utils/Get';
import { Post } from '@/utils/Post';
import { Icon } from '@iconify/react';
import {
    PlusIcon, TrashIcon, XIcon, CheckCircle2,
    Clock, Wallet, User, MapPin, Receipt, TagIcon
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

// Type Promo Baru
export interface PromoType {
    id: number;
    name: string;
    type: 'nominal' | 'percentage';
    value: number;
    min_purchase?: number;
    max_discount?: number;
}

type Props = {
    onClose: () => void;
    addToast: (v: string, status: string) => void;
    outlets: OutletsType[];
    handleSubmit: (token: string) => void;
}

const ModalAddOrder = ({ onClose, addToast, outlets, handleSubmit }: Props) => {
    // --- PORTAL MOUNT STATE ---
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const [loading, setLoading] = useState<boolean>(false);

    // State Data Master
    const [products, setProducts] = useState<ProductsType[]>([]);
    const [promos, setPromos] = useState<PromoType[]>([]);
    const [isDisplayItems, setIsDisplayItems] = useState<boolean>(false);

    // State Order
    const [newOrder, setNewOrder] = useState({
        customerName: '',
        customerPhone: '',
        outletId: '',
        paymentMethod: 'cash',
        paymentStatus: 'paid', // 'paid' atau 'unpaid'
        promoId: '', // Menyimpan ID promo yang dipilih
        items: [{ productId: '', variant: '', quantity: 1, price: 0, qty_package: 1 }]
    });

    const [uangDiterima, setUangDiterima] = useState<number>(0);
    const [uangDiterimaDisplay, setUangDiterimaDisplay] = useState<string>('');

    // Filter Input No HP
    const handlePhoneInputChange = (value: string) => {
        let cleaned = value.replace(/[^\d+]/g, '');
        if (cleaned.startsWith('+62')) cleaned = '62' + cleaned.substring(3);

        let numbers = cleaned.replace(/\D/g, '');
        if (numbers.startsWith('08')) numbers = '628' + numbers.substring(2);
        else if (numbers.startsWith('8')) numbers = '628' + numbers.substring(1);

        return numbers;
    };

    // --- ITEM MANAGEMENT ---
    const handleAddProductField = () => {
        setNewOrder((prev) => ({
            ...prev,
            items: [...prev.items, { productId: '', variant: '', quantity: 1, price: 0, qty_package: 1 }]
        }));
    };

    const handleProductFieldChange = (index: number, field: string, value: string) => {
        const updatedItems = [...newOrder.items];

        if (field === 'quantity') {
            updatedItems[index] = { ...updatedItems[index], quantity: Number(value) };
        } else {
            updatedItems[index] = { ...updatedItems[index], [field]: value, quantity: 1 };
        }

        if (field === 'productId') {
            const selectedProd = products.find(p => p.id === Number(value));
            updatedItems[index].variant = selectedProd && selectedProd.variants.length > 0 ? String(selectedProd.variants[0]?.id) : '';
            updatedItems[index].price = Number(selectedProd?.final_price) > 0 ? Number(selectedProd?.final_price) : Number(selectedProd?.price);
            updatedItems[index].qty_package = 1;
        }

        if (updatedItems[index].variant !== '') {
            const selectedProd = products.find(p => p.id === Number(updatedItems[index].productId));
            const selectedVariant = selectedProd?.variants.find((v) => v.id === Number(updatedItems[index].variant));
            updatedItems[index].price = Number(selectedVariant?.final_price) > 0 ? Number(selectedVariant?.final_price) : Number(selectedVariant?.price);
            updatedItems[index].qty_package = selectedVariant?.qty_package ?? 1;
        }

        setNewOrder((prev) => ({ ...prev, items: updatedItems }));
    };

    const handleRemoveProductField = (index: number) => {
        if (newOrder.items.length === 1) return;
        setNewOrder((prev) => ({
            ...prev,
            items: prev.items.filter((_, idx) => idx !== index)
        }));
    };

    // --- FETCH DATA (Products & Promos) ---
    const getProduct = async () => {
        setLoading(true);
        try {
            const res = await Get<{ success: boolean, data: { products: ProductsType[], promos: PromoType[] } }>(`client/orders/list-products?outlet=${newOrder.outletId}`);
            if (res?.success) {
                setProducts(res?.data?.products || []);
                setPromos(res?.data?.promos || []);
            }
        } catch (e: any) {
            addToast('Gagal memuat katalog. Periksa koneksi Anda.', 'error');
            setProducts([]);
            setPromos([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (newOrder.outletId !== '') {
            setIsDisplayItems(true);
            getProduct();
        }
    }, [newOrder.outletId]);

    // --- KALKULASI TOTAL & DISKON ---
    const { subTotal, discountAmount, grandTotal } = useMemo(() => {
        const sub = newOrder.items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
        let disc = 0;

        if (newOrder.promoId) {
            const selectedPromo = promos.find(p => p.id === Number(newOrder.promoId));
            if (selectedPromo) {
                if (!selectedPromo.min_purchase || sub >= selectedPromo.min_purchase) {
                    if (selectedPromo.type === 'percentage') {
                        const totalDisc = sub * (selectedPromo.value / 100);

                        disc = totalDisc > (selectedPromo?.max_discount ?? 0) ? selectedPromo?.max_discount ?? 0 : sub * (selectedPromo.value / 100);
                    } else if (selectedPromo.type === 'nominal') {
                        disc = selectedPromo.value;
                    }
                }
            }
        }

        const finalDisc = disc > sub ? sub : disc;
        const total = sub - finalDisc;

        return { subTotal: sub, discountAmount: finalDisc, grandTotal: total };
    }, [newOrder, promos]);

    // --- KALKULASI UANG ---
    const handleUangDiterimaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
        setUangDiterima(numericValue);
        setUangDiterimaDisplay(numericValue ? numericValue.toLocaleString('id-ID') : '');
    };

    const setUangPas = (nominal: number) => {
        setUangDiterima(nominal);
        setUangDiterimaDisplay(nominal ? nominal.toLocaleString('id-ID') : '');
    };

    // --- SUBMIT HANDLER ---
    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newOrder.outletId) {
            addToast('Harap pilih outlet terlebih dahulu!', 'error');
            return;
        }

        const hasEmptyProduct = newOrder.items.some(item => !item.productId);
        if (hasEmptyProduct) {
            addToast('Harap pilih produk terlebih dahulu untuk semua item!', 'error');
            return;
        }

        // VALIDASI KELEBIHAN STOK SEBELUM SUBMIT
        let isStockValid = true;
        newOrder.items.forEach((item, idx) => {
            const currentProduct = products.find(p => p.id === Number(item.productId));
            if (currentProduct && currentProduct.is_stock) {
                const isSharedStock = currentProduct.is_shared_stock ?? false;
                const variant = currentProduct.variants?.find((v) => v?.id === Number(item.variant));

                const totalConsumedOtherRows = newOrder.items
                    .filter((pr, prIdx) => {
                        if (prIdx === idx) return false;
                        if (Number(pr.productId) !== currentProduct.id) return false;
                        if (!isSharedStock && String(pr.variant) !== String(item.variant)) return false;
                        return true;
                    })
                    .reduce((sum, prItem) => {
                        const qty = Number(prItem.quantity) || 0;
                        const pkg = Number(prItem.qty_package) || 1;
                        return sum + (qty * pkg);
                    }, 0);

                const baseStock = isSharedStock
                    ? Number(currentProduct.product_stock || 0)
                    : Number(variant?.product_variant_stock ?? currentProduct.product_stock ?? 0);

                const remaining = baseStock - totalConsumedOtherRows;
                const currentQtyPackage = Number(item.qty_package) || 1;
                const maxForThisRow = Math.floor(remaining / currentQtyPackage);

                if (Number(item.quantity) > maxForThisRow) {
                    isStockValid = false;
                }
            }
        });

        if (!isStockValid) {
            addToast('Terdapat kuantitas item yang melebihi batas sisa stok (angka merah). Silakan kurangi.', 'error');
            return;
        }

        // Validasi Anti Kasir Nombok
        if (newOrder.paymentMethod === 'cash' && newOrder.paymentStatus === 'paid') {
            if (uangDiterima < grandTotal) {
                addToast('Nominal uang diterima kurang dari total tagihan!', 'error');
                return;
            }
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('outlet_id', String(newOrder.outletId));
            if (newOrder.customerName) formData.append('customer_name', newOrder.customerName);
            if (newOrder.customerPhone) formData.append('phone_number', newOrder.customerPhone);
            if (newOrder.promoId) formData.append('promo_id', newOrder.promoId);

            formData.append('payment_method', newOrder.paymentMethod);
            formData.append('payment_status', newOrder.paymentStatus);

            if (newOrder.paymentMethod === 'cash' && newOrder.paymentStatus === 'paid') {
                formData.append('cash_received', String(uangDiterima));
            } else {
                formData.append('cash_received', '0');
            }

            newOrder.items.forEach((item, index) => {
                formData.append(`items[${index}][product_id]`, String(item.productId));
                if (item.variant) formData.append(`items[${index}][variant_id]`, String(item.variant));
                formData.append(`items[${index}][qty]`, String(item.quantity));
                formData.append(`items[${index}][price]`, String(item.price));
            });

            const res = await Post<any, FormData>('client/orders', formData);
            if (res?.success) {
                addToast('Pesanan baru berhasil dibuat!', 'success');
                handleSubmit(res?.data?.qr_token);

                // Reset State
                setNewOrder({
                    customerName: '',
                    customerPhone: '',
                    outletId: '',
                    paymentMethod: 'cash',
                    paymentStatus: 'paid',
                    promoId: '',
                    items: [{ productId: '', variant: '', quantity: 1, price: 0, qty_package: 1 }]
                });
                setUangDiterima(0);
                setUangDiterimaDisplay('');
                setIsDisplayItems(false);
            } else {
                addToast('Gagal memproses pesanan. Cek kembali data Anda.', 'error');
            }
        } catch (e: any) {
            let errorMsg = e?.message || 'Terjadi kesalahan sistem.';
            if (e?.response?.data?.data && Array.isArray(e.response.data.data)) {
                errorMsg = e.response.data.data[0]?.message || 'Stok tidak mencukupi.';
            }
            addToast(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm transition-all">
            <div className="bg-slate-50 text-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* --- HEADER --- */}
                <div className="px-5 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#009662]/10 flex items-center justify-center text-[#009662]">
                            <Receipt size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 leading-tight">Buat Pesanan Baru</h2>
                            <p className="text-xs font-medium text-slate-500">Isi detail pesanan kasir</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-rose-500 transition-colors"
                    >
                        <XIcon size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* --- FORM BODY --- */}
                <form id="form-add-order" onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6">

                    {/* Section 1: Info Umum */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                            <User size={18} className="text-[#009662]" />
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Informasi Umum</h3>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                                Lokasi Outlet <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    required
                                    value={newOrder.outletId}
                                    onChange={(e) => setNewOrder({ ...newOrder, outletId: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#009662] focus:ring-2 focus:ring-[#009662]/20 font-semibold text-slate-700 cursor-pointer transition-all appearance-none"
                                >
                                    <option value="" className="text-slate-400">-- Pilih Outlet Pesanan --</option>
                                    {outlets?.map((o, i) => (
                                        <option key={i} value={o?.id}>{o?.name}</option>
                                    ))}
                                </select>
                                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama Pelanggan</label>
                                <input
                                    type="text"
                                    value={newOrder.customerName}
                                    onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                                    placeholder="Opsional"
                                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#009662] focus:ring-2 focus:ring-[#009662]/20 transition-all text-slate-700 font-medium placeholder-slate-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5">No. Handphone</label>
                                <input
                                    type="text"
                                    value={newOrder.customerPhone}
                                    onChange={(e) => setNewOrder({ ...newOrder, customerPhone: handlePhoneInputChange(e.target.value) })}
                                    placeholder="Contoh: 081234..."
                                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#009662] focus:ring-2 focus:ring-[#009662]/20 transition-all font-mono font-medium text-slate-700 placeholder-slate-400"
                                />
                                <span className="text-[10px] text-[#009662] font-semibold block mt-1">Otomatis berawalan 628</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Keranjang Produk */}
                    {isDisplayItems && (
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Receipt size={18} className="text-[#009662]" />
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Keranjang</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddProductField}
                                    className="text-xs font-bold bg-[#009662] hover:bg-[#007d51] text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                                >
                                    <PlusIcon size={14} /> Item
                                </button>
                            </div>

                            <div className="space-y-4">
                                {loading ? (
                                    <div className="p-8 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center animate-pulse gap-2">
                                        <div className="w-8 h-8 rounded-full border-2 border-[#009662] border-t-transparent animate-spin"></div>
                                        <p className="text-xs font-medium text-slate-500">Memuat katalog produk...</p>
                                    </div>
                                ) : newOrder.items.map((item, idx) => {
                                    const currentProduct = products.find(p => p.id === Number(item.productId));
                                    const variant = currentProduct?.variants?.find((v) => v?.id === Number(item.variant));
                                    const itemSubtotal = currentProduct ? ((variant?.final_price || (currentProduct?.final_price === 0 ? currentProduct.price : currentProduct?.final_price ?? 0)) * Number(item.quantity)) : 0;

                                    const isStockTracked = currentProduct ? currentProduct.is_stock : false;
                                    const isSharedStock = currentProduct ? currentProduct.is_shared_stock : false;
                                    const currentQtyPackage = Number(item.qty_package) || 1;

                                    // FIX: Stok Calculation (Kalikan qty * qty_package)
                                    const totalConsumedOtherRows = newOrder.items
                                        .filter((pr, prIdx) => {
                                            if (prIdx === idx) return false;
                                            if (Number(pr.productId) !== currentProduct?.id) return false;
                                            // Jika BUKAN shared stock, varian harus sama persis baru dikalkulasi
                                            if (!isSharedStock && String(pr.variant) !== String(item.variant)) return false;
                                            return true;
                                        })
                                        .reduce((sum, prItem) => {
                                            const qty = Number(prItem.quantity) || 0;
                                            const pkg = Number(prItem.qty_package) || 1;
                                            return sum + (qty * pkg);
                                        }, 0);

                                    // Tentukan acuan stok dasar
                                    const baseStock = isSharedStock
                                        ? Number(currentProduct?.product_stock || 0)
                                        : Number(variant?.product_variant_stock ?? currentProduct?.product_stock ?? 0);

                                    const productRemainingPhysicalStock = baseStock - totalConsumedOtherRows;

                                    // Hitung max stok row ini (dibagi qty package)
                                    const calculatedMaxStock = Math.floor(productRemainingPhysicalStock / currentQtyPackage);
                                    const maxStock = isStockTracked ? Math.max(0, calculatedMaxStock) : 99999;
                                    const isExceedingStock = isStockTracked && Number(item.quantity) > maxStock;

                                    return (
                                        <div key={idx} className={`bg-slate-50 rounded-xl border p-3 sm:p-4 flex flex-col sm:flex-row gap-4 relative group transition-colors shadow-sm ${isExceedingStock ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 hover:border-[#009662]/50'}`}>

                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProductField(idx)}
                                                disabled={newOrder.items.length === 1}
                                                className="absolute top-3 right-3 sm:relative sm:top-auto sm:right-auto sm:order-last h-8 w-8 flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg border border-rose-100 disabled:opacity-30 disabled:hover:bg-rose-50 transition-colors shrink-0"
                                            >
                                                <TrashIcon size={16} />
                                            </button>

                                            {currentProduct ? (
                                                currentProduct?.image.startsWith('usahaku') ?
                                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-slate-200 rounded-lg p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                                                        <img src={formatImage(currentProduct.image as string)} alt={currentProduct.name} className="max-w-full max-h-full object-contain" />
                                                    </div> :
                                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-slate-200 rounded-lg p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                                                        <Icon icon={currentProduct?.image} color={"#64748b"} className="text-3xl" />
                                                    </div>
                                            ) : (
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center shrink-0 text-slate-400 gap-1">
                                                    <Receipt size={18} />
                                                </div>
                                            )}

                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end mt-2 sm:mt-0">
                                                <div className="sm:col-span-5 relative">
                                                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5">PRODUK</label>
                                                    <select
                                                        value={item.productId}
                                                        onChange={(e) => handleProductFieldChange(idx, 'productId', e.target.value)}
                                                        className={`w-full px-3 py-2.5 text-sm bg-white border rounded-lg focus:ring-2 font-semibold text-slate-700 appearance-none ${isExceedingStock ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-[#009662] focus:ring-[#009662]/20'}`}
                                                    >
                                                        <option value="">-- Pilih Produk --</option>
                                                        {products.map(p => {
                                                            // Logic untuk opsi drop-down Product
                                                            const totalConsumed = newOrder.items
                                                                .filter((pr, prIdx) => Number(pr.productId) === p.id && prIdx !== idx)
                                                                .reduce((sum, prItem) => {
                                                                    const qty = Number(prItem.quantity) || 0;
                                                                    const pkg = Number(prItem.qty_package) || 1;
                                                                    return sum + (qty * pkg); // Fix
                                                                }, 0);

                                                            const pIsTracked = p.is_stock;
                                                            const stock = Number(p?.product_stock) - totalConsumed;
                                                            const isOutOfStock = pIsTracked ? stock <= 0 : false;
                                                            const priceDisplay = Number(p.final_price === 0 ? p?.price : p.final_price).toLocaleString('id-ID');

                                                            return (
                                                                <option key={p.id} value={p.id} disabled={isOutOfStock} className={isOutOfStock ? "text-slate-400" : "text-slate-700"}>
                                                                    {p.name} - Rp {priceDisplay} {pIsTracked ? (isOutOfStock ? '(Habis)' : `(Sisa Fisik: ${stock})`) : ''}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>

                                                <div className="sm:col-span-4">
                                                    <label className="block text-[10px] font-bold text-slate-500 mb-1.5">VARIAN</label>
                                                    {currentProduct && currentProduct.variants.length > 0 ? (
                                                        <select
                                                            value={item.variant}
                                                            onChange={(e) => handleProductFieldChange(idx, 'variant', e.target.value)}
                                                            className={`w-full px-3 py-2.5 text-sm bg-white border rounded-lg focus:ring-2 font-semibold text-slate-700 appearance-none ${isExceedingStock ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-[#009662] focus:ring-[#009662]/20'}`}
                                                        >
                                                            <option value="">Pilih</option>
                                                            {currentProduct.variants.map(v => {
                                                                // Logic untuk opsi drop-down Varian
                                                                const totalConsumed = newOrder.items
                                                                    .filter((pr, prIdx) => {
                                                                        if (prIdx === idx) return false;
                                                                        if (Number(pr.productId) !== currentProduct.id) return false;
                                                                        if (!currentProduct.is_shared_stock && String(pr.variant) !== String(v.id)) return false;
                                                                        return true;
                                                                    })
                                                                    .reduce((sum, prItem) => {
                                                                        const qty = Number(prItem.quantity) || 0;
                                                                        const pkg = Number(prItem.qty_package) || 1;
                                                                        return sum + (qty * pkg); // Fix
                                                                    }, 0);

                                                                const vIsTracked = currentProduct.is_stock;
                                                                const baseStok = currentProduct.is_shared_stock ? currentProduct.product_stock : (v?.product_variant_stock || 0);
                                                                const stok = Number(baseStok) - totalConsumed;
                                                                const maxStocVariant = Math.floor(stok / Number(v?.qty_package || 1));
                                                                const isOutOfStock = vIsTracked ? maxStocVariant <= 0 : false;

                                                                return (
                                                                    <option key={v?.id} value={v?.id} disabled={isOutOfStock} className={isOutOfStock ? "text-slate-400" : "text-slate-700"}>
                                                                        {v?.name} {vIsTracked ? (isOutOfStock ? '(Habis)' : `(Max: ${maxStocVariant})`) : ''}
                                                                    </option>
                                                                )
                                                            })}
                                                        </select>
                                                    ) : (
                                                        <div className="px-3 py-2.5 text-sm bg-slate-100/50 border border-slate-200 rounded-lg text-slate-400 italic text-center font-medium">
                                                            N/A
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="sm:col-span-3">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <label className="block text-[10px] font-bold text-slate-500">QTY</label>
                                                        {currentProduct && isStockTracked ? (
                                                            <span className={`text-[10px] font-bold ${isExceedingStock ? 'text-rose-500' : 'text-[#009662]'}`}>
                                                                Max: {maxStock}
                                                            </span>
                                                        ) : ''}
                                                    </div>
                                                    <div className={`flex items-center justify-between bg-white border rounded-lg p-1 h-[42px] shadow-sm ${isExceedingStock ? 'border-rose-300' : 'border-slate-200'}`}>
                                                        <button
                                                            type="button"
                                                            disabled={!currentProduct || Number(item.quantity) <= 1}
                                                            onClick={() => handleProductFieldChange(idx, 'quantity', String(Math.max(1, Number(item.quantity) - 1)))}
                                                            className="w-10 h-full flex items-center justify-center font-black text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-md disabled:opacity-30 transition-colors"
                                                        >-</button>
                                                        {/* Angka memerah jika melebihi stok yang diizinkan */}
                                                        <span className={`text-sm font-bold px-2 ${isExceedingStock ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            disabled={!currentProduct || (isStockTracked && Number(item.quantity) >= (maxStock ?? 0))}
                                                            onClick={() => handleProductFieldChange(idx, 'quantity', String(item.quantity + 1))}
                                                            className="w-10 h-full flex items-center justify-center font-black text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-md disabled:opacity-30 transition-colors"
                                                        >+</button>
                                                    </div>
                                                </div>
                                            </div>

                                            {itemSubtotal > 0 && (
                                                <div className="mt-2 sm:mt-0 sm:absolute sm:-top-3 sm:-right-3 self-end sm:self-auto bg-slate-800 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md border-2 border-white">
                                                    Rp {itemSubtotal.toLocaleString('id-ID')}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Section 3: Promo / Diskon */}
                    {isDisplayItems && promos.length > 0 && (
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                            <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-100">
                                <TagIcon size={18} className="text-amber-500" />
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Promo & Diskon</h3>
                            </div>
                            <div>
                                <select
                                    value={newOrder.promoId}
                                    onChange={(e) => setNewOrder({ ...newOrder, promoId: e.target.value })}
                                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-semibold text-slate-700 cursor-pointer transition-all appearance-none"
                                >
                                    <option value="">-- Tidak Memakai Promo --</option>
                                    {promos.map(promo => {
                                        const isEligible = !promo.min_purchase || subTotal >= promo.min_purchase;
                                        const descPromo = promo.type === 'percentage' ? `${promo.value}%` : `Rp ${promo.value.toLocaleString('id-ID')}`;
                                        return (
                                            <option key={promo.id} value={promo.id} disabled={!isEligible}>
                                                {promo.name} - Diskon {descPromo} {!isEligible && `(Min. Rp ${promo.min_purchase?.toLocaleString('id-ID')})`}
                                            </option>
                                        );
                                    })}
                                </select>
                                <p className="text-[10px] text-slate-400 font-medium mt-1.5 ml-1">Pilih promo yang berlaku untuk pelanggan ini.</p>
                            </div>
                        </div>
                    )}

                    {/* Section 4: Pembayaran */}
                    {isDisplayItems && (
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
                            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
                                <Wallet size={18} className="text-[#009662]" />
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Pembayaran</h3>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">Status Pembayaran</label>
                                <div className="bg-slate-100 p-1.5 rounded-xl flex items-center gap-1.5 border border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => setNewOrder({ ...newOrder, paymentStatus: 'paid' })}
                                        className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold rounded-lg transition-all duration-200 ${newOrder.paymentStatus === 'paid'
                                            ? 'bg-white shadow-sm text-emerald-600 ring-1 ring-emerald-100'
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                            }`}
                                    >
                                        <CheckCircle2 size={16} className={newOrder.paymentStatus === 'paid' ? 'text-emerald-500' : 'opacity-50'} />
                                        Sudah Dibayar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewOrder({ ...newOrder, paymentStatus: 'unpaid' })}
                                        className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold rounded-lg transition-all duration-200 ${newOrder.paymentStatus === 'unpaid'
                                            ? 'bg-white shadow-sm text-amber-600 ring-1 ring-amber-100'
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                            }`}
                                    >
                                        <Clock size={16} className={newOrder.paymentStatus === 'unpaid' ? 'text-amber-500' : 'opacity-50'} />
                                        Belum Dibayar
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2">Metode Bayar</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'cash', label: 'Cash', desc: 'Tunai' },
                                        { id: 'qris', label: 'QRIS', desc: 'Instan' },
                                        { id: 'transfer', label: 'Transfer', desc: 'Manual VA' },
                                    ].map((method) => {
                                        const isSelected = newOrder.paymentMethod === method.id;
                                        return (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setNewOrder({ ...newOrder, paymentMethod: method.id })}
                                                className={`p-3 rounded-xl border text-center transition-all duration-200 min-h-[64px] flex flex-col items-center justify-center ${isSelected
                                                    ? 'border-[#009662] bg-[#009662]/5 ring-1 ring-[#009662]/50'
                                                    : 'border-slate-200 bg-white hover:bg-slate-50'
                                                    }`}
                                            >
                                                <p className={`text-sm font-bold tracking-wide ${isSelected ? 'text-[#009662]' : 'text-slate-700'}`}>{method.label}</p>
                                                <p className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'text-[#009662]/80' : 'text-slate-400'}`}>
                                                    {method.desc}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Kalkulator Total & Kembalian */}
                            {newOrder.paymentStatus === 'paid' && (
                                <div className="mt-4 p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-5 animate-in fade-in slide-in-from-top-2">

                                    {/* Rincian Harga */}
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 mb-4">
                                        <div className="flex justify-between text-xs font-semibold text-slate-500">
                                            <span>Subtotal Produk</span>
                                            <span>Rp {subTotal.toLocaleString('id-ID')}</span>
                                        </div>
                                        {discountAmount > 0 && (
                                            <div className="flex justify-between text-xs font-bold text-rose-500">
                                                <span>Potongan Promo</span>
                                                <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
                                            </div>
                                        )}
                                        <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between items-center">
                                            <span className="text-xs font-black uppercase text-slate-800 tracking-wider">Total Akhir</span>
                                            <span className="text-xl font-black text-[#009662]">Rp {grandTotal.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {newOrder.paymentMethod === 'cash' && (
                                            <div className={`flex-1 p-4 rounded-xl border shadow-sm flex flex-col justify-center transition-colors ${(uangDiterima - grandTotal) >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                                                <span className="block text-[11px] font-bold uppercase tracking-wide opacity-70 mb-1">Status Uang Kembalian</span>
                                                <span className={`text-xl sm:text-2xl font-black ${(uangDiterima - grandTotal) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {(uangDiterima - grandTotal) >= 0
                                                        ? `+ Rp ${(uangDiterima - grandTotal).toLocaleString('id-ID')}`
                                                        : `- Rp ${Math.abs(uangDiterima - grandTotal).toLocaleString('id-ID')} (Kurang)`
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {newOrder.paymentMethod === 'cash' && (
                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 mb-2">Nominal Uang Diterima</label>
                                            <div className="relative mb-3">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                                    <span className="text-base font-bold text-slate-400">Rp</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="0"
                                                    value={uangDiterimaDisplay}
                                                    onChange={handleUangDiterimaChange}
                                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-[#009662] focus:ring-2 focus:ring-[#009662]/20 font-black text-slate-800 text-xl transition-all shadow-sm"
                                                />
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <button type="button" onClick={() => setUangPas(grandTotal)} className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors shadow-sm">
                                                    Uang Pas
                                                </button>
                                                {[50000, 100000].map((nominal) => (
                                                    <button key={nominal} type="button" onClick={() => setUangPas(nominal)} className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 hover:border-[#009662] hover:text-[#009662] text-slate-600 rounded-lg transition-colors shadow-sm">
                                                        {nominal.toLocaleString('id-ID')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                </form>

                {/* --- FOOTER ACTIONS --- */}
                <div className="px-5 py-4 bg-white border-t border-slate-200 flex items-center justify-end gap-3 shrink-0 z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        form="form-add-order"
                        disabled={loading || !newOrder.outletId}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-[#009662] hover:bg-[#007d51] active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-[#009662]/20 flex items-center gap-2"
                    >
                        {loading ? (
                            <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div> Memproses...</>
                        ) : 'Simpan Pesanan'}
                    </button>
                </div>
            </div>
        </div>
    );

    if (!mounted) return null;
    return createPortal(modalContent, document.body);
}

export default ModalAddOrder;