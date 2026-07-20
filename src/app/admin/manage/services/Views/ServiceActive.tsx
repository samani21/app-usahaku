"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Edit, Trash2Icon, QrCode } from "lucide-react";

import { ProductsType } from "@/types/Admin/ProductsType";
import { Meta } from "@/types/Public";
import { Delete } from "@/utils/Delete";
import { Get } from "@/utils/Get";
import { Post } from "@/utils/Post";
import { AlertType } from "@/types/Alert";
import { Column } from "@/types/Admin/CRUD";
import { OutletsType } from "@/types/Admin/OutletType";

import GlassCard from "@/Components/Layout/GlassCard";
import FormInput from "@/Components/CRUD/FormInput/FormInput";
import FilterComponent from "@/Components/CRUD/FilterComponent";
import DataTable from "@/Components/CRUD/DataTable";
import ModalDelete from "@/Components/CRUD/ModalDelete";
import ModalCrud from "@/Components/CRUD/ModalCrud";
import Alert from "@/Components/Alert";
import { formatImage } from "@/utils/formatImage";
import ModalDetailQRCode from "../Components/ModalDetailQRCode";
import ProductFormModalContent from "../../products/Components/ProductFormModalContent"; // Ganti ke ServiceFormModalContent jika ada
import { Icon } from "@iconify/react";

interface ProductResponse {
    data: ProductsType[];
    outlets: OutletsType[];
}

export default function ServiceActive() {
    // --- FILTER & PAGINATION STATE ---
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [dateRangeText, setDateRangeText] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectOutlet, setSelectOutlet] = useState<string>('Semua');
    const [meta, setMeta] = useState<Meta>({ last_page: 1, limit: 10, page: 1, total: 0 });

    // --- DATA & UI STATE ---
    const [products, setProducts] = useState<ProductsType[]>([]);
    const [outlets, setOutlets] = useState<OutletsType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<ProductsType | null>(null);
    const [deleteData, setDeleteData] = useState<ProductsType | null>(null);
    const [openModalQRCode, setOpenModalQRCode] = useState<ProductsType | null>(null);

    // ==========================================
    // EFFECTS & HELPERS
    // ==========================================

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
    }, [debouncedSearch, dateRangeText, itemsPerPage, selectOutlet]);

    const parsedDate = useMemo(() => {
        if (!dateRangeText.includes(" - ")) return { start_date: "", end_date: "" };

        const monthMap: Record<string, string> = {
            Jan: "01", Feb: "02", Mar: "03", Apr: "04", Mei: "05", Jun: "06",
            Jul: "07", Agt: "08", Agu: "08", Sep: "09", Okt: "10", Nov: "11", Des: "12",
        };
        const formatDate = (dateStr: string) => {
            const [day, month, year] = dateStr.trim().split(" ");
            return `${year}-${monthMap[month]}-${day.padStart(2, "0")}`;
        };

        const [start, end] = dateRangeText.split(" - ");
        return { start_date: formatDate(start), end_date: formatDate(end) };
    }, [dateRangeText]);

    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", itemsPerPage.toString());

        if (debouncedSearch.trim()) params.append("search", debouncedSearch);
        if (parsedDate.start_date) params.append("start_date", parsedDate.start_date);
        if (parsedDate.end_date) params.append("end_date", parsedDate.end_date);
        if (selectOutlet !== 'Semua') params.append("outlet", selectOutlet);

        return `?${params.toString()}`;
    }, [parsedDate, page, debouncedSearch, itemsPerPage, selectOutlet]);

    // ==========================================
    // API ACTIONS
    // ==========================================
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await Get<{ success: boolean; data: ProductResponse; meta: Meta }>(`client/services${queryString}`);
            if (res?.success) {
                setProducts(res.data?.data || []);
                setOutlets(res.data?.outlets || []);
                setMeta(res.meta);
            }
        } catch (err: any) {
            setError(err?.message || "Gagal mengambil data");
        } finally {
            setLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFormSubmit = async (formData: FormData, id: number | null) => {
        setLoading(true);
        try {
            const endpoint = id ? `client/services/${id}` : 'client/services';
            const res = await Post(endpoint, formData);

            if (res) {
                fetchProducts();
                handleCloseModal();
                setShowAlert({ type: 'success', message: id ? 'Berhasil update data' : 'Berhasil simpan data', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal proses data: ' + err.message, isOpen: true });
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (id: number | null) => {
        setLoading(true);
        try {
            const res = await Delete(`client/services/${id}`);
            if (res) {
                fetchProducts();
                handleCloseModal();
                setShowAlert({ type: 'success', message: 'Berhasil hapus data', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal proses data: ' + err.message, isOpen: true });
        } finally {
            setLoading(false);
        }
    };

    // --- FUNGSI BARU: TOGGLE STATUS AKTIF ---
    const handleToggleActive = async (row: ProductsType) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('is_active', row.is_active ? '0' : '1');

            const res = await Post(`client/services/${row.id}/toggle-active`, formData);
            if (res) {
                fetchProducts();
                setShowAlert({ type: 'success', message: `Status jasa ${row.name} berhasil diubah!`, isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal mengubah status: ' + err.message, isOpen: true });
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // UI HANDLERS
    // ==========================================
    const handleResetFilter = () => {
        setSearch("");
        setDateRangeText("");
        setSelectOutlet("Semua");
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setDataUpdate(null);
            setDeleteData(null);
        }, 300);
    };

    const handleEdit = useCallback((row: ProductsType) => {
        setDataUpdate(row);
        setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback((row: ProductsType) => {
        setDeleteData(row);
        setIsModalOpen(true);
    }, []);

    // ==========================================
    // TABLE COLUMNS CONFIG (Desktop)
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
        { key: "name", label: "Nama Jasa" },
        { key: "category", label: "Kategori", render: (row) => row?.category || '-' },
        {
            key: "has_variant",
            label: "Tipe Layanan",
            render: (row) => {
                if (!row.variants || row.variants.length === 0) return <span className="text-slate-400">-</span>;
                return (
                    <div className="space-y-1">
                        {row.variants.map((v, i) => (
                            <div key={i} className="text-sm">
                                {
                                    row?.is_stock ?
                                        <><span className="font-semibold text-slate-700">{v.name}</span> :{" "}
                                            <span className="text-emerald-600 font-bold">{v?.product_variant_stock ?? 0}</span>
                                        </> :
                                        <span className="font-semibold text-slate-700">{v.name}</span>
                                }
                            </div>
                        ))}
                    </div>
                );
            },
        },
        {
            key: "price",
            label: "Harga",
            align: "right",
            width: "150",
            render: (row) => <span className="font-bold text-slate-700">Rp {row.price.toLocaleString("id-ID")}</span>,
        },
        {
            key: "qrcode",
            label: "QR Code",
            align: "center",
            width: "120",
            render: (row) => (
                <button
                    onClick={() => setOpenModalQRCode(row)}
                    className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    Lihat QR
                </button>
            ),
        },
        {
            key: "is_active",
            label: "Status Aktif",
            align: "center",
            render: (row) => (
                <div className="flex justify-center items-center">
                    <FormInput
                        type="switch"
                        label=""
                        name={`is_active_${row.id}`}
                        value={row.is_active}
                        onChange={() => handleToggleActive(row)}
                    />
                </div>
            ),
        },
        {
            key: "actions",
            label: "Aksi",
            align: "center",
            render: (row) => (
                <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(row)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(row)} className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2Icon size={18} />
                    </button>
                </div>
            ),
        },
    ], [handleEdit, handleDelete]);


    return (
        <div className="space-y-6">
            <FilterComponent
                search={search}
                setSearch={setSearch}
                dateRangeText={dateRangeText}
                setDateRangeText={setDateRangeText}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                setPage={setPage}
                handleReset={handleResetFilter}
                setIsModalOpenForm={setIsModalOpen}
            />

            {/* Kategori Outlet Filter */}
            <GlassCard className="p-3 w-full">
                <div className="flex items-center gap-2 overflow-x-auto text-slate-600 [&::-webkit-scrollbar]:hidden">
                    <button
                        onClick={() => setSelectOutlet("Semua")}
                        className={`ml-2 whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-in-out flex-shrink-0 ${selectOutlet === 'Semua'
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
                            : 'bg-transparent hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                    >
                        Semua Outlet
                    </button>

                    {outlets?.map((o, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectOutlet(o?.name)}
                            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-in-out flex-shrink-0 ${selectOutlet === o?.name
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
                                : 'bg-transparent hover:bg-emerald-50 hover:text-emerald-700 border border-transparent hover:border-emerald-100'
                                }`}
                        >
                            {o?.name}
                        </button>
                    ))}
                </div>
            </GlassCard>

            <div className="mt-6">

                {/* 1. TAMPILAN MOBILE (CARDS) */}
                <div className="block md:hidden space-y-4">
                    {loading ? (
                        <div className="text-center py-6 text-slate-500 font-semibold animate-pulse">Memuat data...</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-6 text-slate-500 font-semibold">Data jasa tidak ditemukan</div>
                    ) : (
                        products.map((row) => (
                            <GlassCard key={row.id} className="p-4 flex flex-col gap-3">
                                {/* Header Info Card */}
                                <div className="flex gap-4">
                                    {
                                        row.image?.startsWith('usahaku') ?
                                            <img src={formatImage(row.image)} alt={row.name} className="w-20 h-20 object-cover rounded-xl bg-slate-50 border border-slate-100" /> :
                                            <Icon icon={row?.image} className="w-20 h-20 object-cover rounded-xl bg-slate-50 border border-slate-100" />

                                    }
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-800 text-base">{row.name}</h3>
                                        <p className="text-xs text-slate-500 mb-1">{row.category || '-'}</p>
                                        <span className="font-bold text-emerald-600 text-sm">Rp {row.price.toLocaleString("id-ID")}</span>
                                    </div>
                                </div>

                                {/* List Varian (Jika ada) */}
                                {row.variants && row.variants.length > 0 && (
                                    <div className="bg-slate-50/70 p-2.5 rounded-lg text-xs space-y-1.5 border border-slate-100 mt-1">
                                        {row.variants.map((v, i) => (
                                            <div key={i} className="flex justify-between items-center border-b border-slate-200/50 pb-1 last:border-0 last:pb-0">
                                                <span className="font-semibold text-slate-700">{v.name}</span>
                                                {
                                                    row?.is_stock ?
                                                        <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Slot: {v?.product_variant_stock ?? 0}</span> : ''
                                                }
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Footer Card (Aksi & Toggle) */}
                                <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status Aktif:</span>
                                        <FormInput
                                            type="switch"
                                            label=""
                                            name={`mobile_is_active_${row.id}`}
                                            value={row.is_active}
                                            onChange={() => handleToggleActive(row)}
                                        />
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => setOpenModalQRCode(row)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="QR Code">
                                            <QrCode size={18} />
                                        </button>
                                        <button onClick={() => handleEdit(row)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(row)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus">
                                            <Trash2Icon size={18} />
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        ))
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

            {/* MODALS */}
            {deleteData ? (
                <ModalDelete
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    deleteData={deleteData}
                    handleDelete={onDelete}
                />
            ) : (
                <ModalCrud
                    isOpen={isModalOpen}
                    title={dataUpdate ? "Edit Jasa" : "Tambah Jasa"}
                    onClose={handleCloseModal}
                >
                    <ProductFormModalContent
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onSubmit={handleFormSubmit}
                        dataUpdate={dataUpdate}
                        loading={loading}
                        setLoading={setLoading}
                    />
                </ModalCrud>
            )}

            {openModalQRCode && (
                <ModalDetailQRCode
                    onClose={() => setOpenModalQRCode(null)}
                    product={openModalQRCode}
                    selectOutlet={selectOutlet}
                    outlets={outlets}
                />
            )}

            {/* ALERT */}
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