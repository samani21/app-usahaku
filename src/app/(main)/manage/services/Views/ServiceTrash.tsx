"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { RefreshCw, PackageX, AlertCircle } from "lucide-react";

import { ProductsType } from "@/types/Admin/ProductsType";
import { Meta } from "@/types/Public";
import { Get } from "@/utils/Get";
import { Post } from "@/utils/Post";
import { AlertType } from "@/types/Alert";
import { Column } from "@/types/Admin/CRUD";

import GlassCard from "@/Components/Layout/GlassCard";
import FilterComponent from "@/Components/CRUD/FilterComponent";
import DataTable from "@/Components/CRUD/DataTable";
import Alert from "@/Components/Alert";
import { formatImage } from "@/utils/formatImage";
import { Icon } from "@iconify/react";

interface ProductResponse {
    data: ProductsType[];
}

export default function ServiceTrash() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [dateRangeText, setDateRangeText] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [meta, setMeta] = useState<Meta>({ last_page: 1, limit: 10, page: 1, total: 0 });

    const [products, setProducts] = useState<ProductsType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    // --- STATE UNTUK MODAL KONFIRMASI ---
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'product' | 'variant' | null;
        id: number | string | null;
        title: string;
        message: string;
    }>({
        isOpen: false,
        type: null,
        id: null,
        title: '',
        message: ''
    });

    // Auto-hide Alert
    useEffect(() => {
        if (showAlert?.isOpen) {
            const timer = setTimeout(() => setShowAlert(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 800);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, dateRangeText, itemsPerPage]);

    // Query String Build
    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", itemsPerPage.toString());
        if (debouncedSearch.trim()) params.append("search", debouncedSearch);
        return `?${params.toString()}`;
    }, [page, debouncedSearch, itemsPerPage]);

    // FETCH TONG SAMPAH
    const fetchTrashedProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await Get<{ success: boolean; data: ProductResponse; meta: Meta }>(`client/services/trashed${queryString}`);
            if (res?.success) {
                setProducts(res.data?.data || []);
                setMeta(res.meta);
            }
        } catch (err: any) {
            setError(err?.message || "Gagal mengambil data tong sampah");
        } finally {
            setLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        fetchTrashedProducts();
    }, [fetchTrashedProducts]);

    // --- TRIGGER BUKA MODAL ---
    const promptRestoreProduct = (id: number | string) => {
        setConfirmModal({
            isOpen: true,
            type: 'product',
            id: id,
            title: 'Pulihkan Jasa',
            message: 'Apakah Anda yakin ingin memulihkan jasa ini beserta seluruh layanannya?'
        });
    };

    const promptRestoreVariant = (id: number | string) => {
        setConfirmModal({
            isOpen: true,
            type: 'variant',
            id: id,
            title: 'Pulihkan Layanan',
            message: 'Apakah Anda yakin ingin memulihkan layanan ini?'
        });
    };

    // --- EKSEKUSI PEMULIHAN ---
    const executeRestore = async () => {
        if (!confirmModal.id) return;

        setLoading(true);
        setConfirmModal({ ...confirmModal, isOpen: false });

        try {
            const endpoint = confirmModal.type === 'product'
                ? `client/services/${confirmModal.id}/restore`
                : `client/services/variants/${confirmModal.id}/restore`;

            const res = await Post(endpoint, new FormData());
            if (res) {
                fetchTrashedProducts();
                setShowAlert({
                    type: 'success',
                    message: `Berhasil memulihkan ${confirmModal.type === 'product' ? 'jasa' : 'layanan'}!`,
                    isOpen: true
                });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal memulihkan data: ' + err.message, isOpen: true });
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // COLUMNS (DESKTOP)
    // ==========================================
    const columns: Column<ProductsType>[] = useMemo(() => [
        {
            key: "image",
            label: "Gambar",
            width: "150px",
            render: (row) => {
                if (!row?.image) return <span className="text-slate-400">-</span>;

                if (row.image.startsWith("usahaku") || row.image.startsWith("http")) {
                    return (
                        <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-1">
                            <img src={formatImage(row.image)} alt={row.name} className="w-full h-full object-contain" />
                        </div>
                    );
                }

                return (
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                        <Icon icon={row.image} color={row.color_icon || "#64748b"} className="text-3xl" />
                    </div>
                );
            }
        },
        {
            key: "name",
            label: "Nama Jasa",
            render: (row) => {
                const isProductTrashed = row.deleted_at;
                return (
                    <div>
                        <span className={`font-bold ${isProductTrashed ? 'line-through text-slate-500' : 'text-slate-800'}`}>{row.name}</span>
                        {isProductTrashed ? (
                            <span className="block text-[11px] font-bold text-rose-500 uppercase mt-1">Jasa Dihapus</span>
                        ) : (
                            <span className="block text-[11px] font-bold text-amber-500 uppercase mt-1">Layanan Dihapus</span>
                        )}
                    </div>
                );
            }
        },
        {
            key: "variants",
            label: "Tipe Layanan",
            render: (row) => {
                if (!row.variants || row.variants.length === 0) return <span className="text-slate-400">-</span>;
                return (
                    <div className="space-y-2">
                        {row.variants.map((v: any, i: number) => {
                            const isVariantTrashed = v.deleted_at;

                            return (
                                <div key={i} className={`flex items-center gap-2 text-sm ${isVariantTrashed ? 'bg-rose-50/50 p-1 rounded' : ''}`}>
                                    <span className={isVariantTrashed ? 'line-through text-slate-400' : 'text-slate-700 font-semibold'}>{v.name}</span>
                                    <span className="text-slate-400 text-xs">|</span>

                                    {isVariantTrashed && !row.deleted_at && (
                                        <button
                                            onClick={() => promptRestoreVariant(v.id)}
                                            className="ml-auto flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded hover:bg-emerald-200"
                                        >
                                            <RefreshCw size={10} /> Pulihkan Layanan
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            },
        },
        {
            key: "actions",
            label: "Aksi",
            align: "center",
            render: (row) => {
                if (row.deleted_at) {
                    return (
                        <div className="flex justify-center">
                            <button
                                onClick={() => promptRestoreProduct(row.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg font-bold text-sm transition-colors"
                            >
                                <RefreshCw size={16} /> Pulihkan Jasa
                            </button>
                        </div>
                    );
                } else {
                    return <span className="text-xs text-slate-400 italic">Jasa Aktif</span>;
                }
            },
        },
    ], []);

    return (
        <div className="space-y-6 relative pb-12">
            <FilterComponent
                search={search}
                setSearch={setSearch}
                dateRangeText={dateRangeText}
                setDateRangeText={setDateRangeText}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                setPage={setPage}
                handleReset={() => { setSearch(""); setDateRangeText(""); }}
                setIsModalOpenForm={() => { }}
            />

            <div className="mt-6">

                {/* 1. TAMPILAN MOBILE (CARDS) */}
                <div className="block md:hidden space-y-4">
                    {loading ? (
                        <div className="text-center py-6 text-slate-500 font-semibold animate-pulse">Mencari sampah...</div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <PackageX size={48} className="mb-4 opacity-50" />
                            <p className="font-semibold">Tong sampah kosong</p>
                        </div>
                    ) : (
                        products.map((row) => {
                            const isProductTrashed = row.deleted_at;

                            return (
                                <GlassCard key={row.id} className="p-4 flex flex-col gap-3">
                                    <div className="flex gap-4">

                                        {
                                            row.image?.startsWith('usahaku') ?
                                                <img
                                                    src={formatImage(row.image)}
                                                    alt={row.name}
                                                    className={`w-20 h-20 object-cover rounded-xl border border-slate-100 ${isProductTrashed ? 'grayscale opacity-60' : ''}`}
                                                /> :
                                                <Icon icon={row?.image} className={`w-20 h-20 object-cover rounded-xl border border-slate-100 ${isProductTrashed ? 'grayscale opacity-60' : ''}`} />

                                        }
                                        <div className="flex-1">
                                            <h3 className={`font-bold text-base ${isProductTrashed ? 'line-through text-slate-500' : 'text-slate-800'}`}>{row.name}</h3>
                                            {isProductTrashed ? (
                                                <span className="inline-block px-2 py-0.5 mt-1 bg-rose-100 text-rose-600 text-[10px] font-bold rounded uppercase tracking-wider">Jasa Dihapus</span>
                                            ) : (
                                                <span className="inline-block px-2 py-0.5 mt-1 bg-amber-100 text-amber-600 text-[10px] font-bold rounded uppercase tracking-wider">Layanan Dihapus</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* List Varian Mobile */}
                                    {row.variants && row.variants.length > 0 && (
                                        <div className="bg-slate-50/70 p-2.5 rounded-lg text-xs space-y-2 border border-slate-100 mt-1">
                                            {row.variants.map((v: any, i: number) => {
                                                const isVariantTrashed = v.deleted_at;
                                                return (
                                                    <div key={i} className={`flex flex-col gap-1 border-b border-slate-200/50 pb-2 last:border-0 last:pb-0 ${isVariantTrashed ? 'text-slate-500' : 'text-slate-800'}`}>
                                                        <div className="flex justify-between items-center">
                                                            <span className={`${isVariantTrashed ? 'line-through' : 'font-semibold'}`}>{v.name}</span>

                                                        </div>
                                                        {isVariantTrashed && !isProductTrashed && (
                                                            <button
                                                                onClick={() => promptRestoreVariant(v.id)}
                                                                className="flex items-center gap-1 justify-center bg-emerald-100 text-emerald-700 py-1.5 rounded mt-1 hover:bg-emerald-200 transition-colors font-bold"
                                                            >
                                                                <RefreshCw size={12} /> Pulihkan Layanan
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Tombol Restore Produk Utama Mobile */}
                                    {isProductTrashed && (
                                        <button
                                            onClick={() => promptRestoreProduct(row.id)}
                                            className="w-full flex justify-center items-center gap-2 mt-2 py-2.5 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors"
                                        >
                                            <RefreshCw size={16} /> Pulihkan Jasa
                                        </button>
                                    )}
                                </GlassCard>
                            )
                        })
                    )}
                </div>

                {/* 2. TAMPILAN DESKTOP (TABLE) */}
                <div className="hidden md:block">
                    <DataTable
                        data={products}
                        columns={columns}
                        page={page}
                        itemsPerPage={itemsPerPage}
                        total={meta.total}
                        onPageChange={setPage}
                        loading={loading}
                        error={error}
                    />
                </div>

            </div>

            {/* MODAL KONFIRMASI (CUSTOM COMPONENT) */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <GlassCard className="w-full max-w-sm p-6 bg-white animate-in zoom-in-95 duration-300 shadow-2xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                                <AlertCircle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{confirmModal.title}</h3>
                            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                                {confirmModal.message}
                            </p>
                            <div className="flex w-full gap-3">
                                <button
                                    onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                                    className="flex-1 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={executeRestore}
                                    className="flex-1 py-2.5 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors flex justify-center items-center gap-2"
                                >
                                    <RefreshCw size={16} />
                                    Ya, Pulihkan
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}

            {showAlert?.isOpen && (
                <Alert
                    type={showAlert.type}
                    message={showAlert.message}
                    onClose={() => setShowAlert(null)}
                />
            )}
        </div>
    );
}