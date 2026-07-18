"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Edit, Trash2Icon } from "lucide-react";

import { ProductsType } from "@/types/Admin/ProductsType";
import { Meta } from "@/types/Public";
import { Delete } from "@/utils/Delete";
import { Get } from "@/utils/Get";
import { Post } from "@/utils/Post";
import { AlertType } from "@/types/Alert";
import { Column } from "@/types/Admin/CRUD";
import { OutletsType } from "@/types/Admin/OutletType";
import { Icon } from '@iconify/react'
import GlassCard from "@/Components/Layout/GlassCard";
import FormInput from "@/Components/CRUD/FormInput/FormInput";
import FilterComponent from "@/Components/CRUD/FilterComponent";
import DataTable from "@/Components/CRUD/DataTable";
import ModalDelete from "@/Components/CRUD/ModalDelete";
import ModalCrud from "@/Components/CRUD/ModalCrud";
import Alert from "@/Components/Alert";
import { formatImage } from "@/utils/formatImage";
import ModalDetailQRCode from "./Components/ModalDetailQRCode";
import ServiceFormModalContent from "./Components/ServiceFormModalContent";
import MainLayout from "@/Components/Layout/MainLayout";

interface ProductResponse {
    data: ProductsType[];
    outlets: OutletsType[];
}

export default function ListServicePage() {
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
    const [stepsPromo, setStepsPromo] = useState<number | null>(null);

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<ProductsType | null>(null);
    const [deleteData, setDeleteData] = useState<ProductsType | null>(null);
    const [openModalConfirm, setOpenModalConfirm] = useState<ProductsType | null>(null);
    const [openModalQRCode, setOpenModalQRCode] = useState<ProductsType | null>(null);

    // ==========================================
    // EFFECTS & HELPERS
    // ==========================================

    // 1. Auto-hide Alert dengan Cleanup Timer
    useEffect(() => {
        if (showAlert?.isOpen) {
            const timer = setTimeout(() => setShowAlert(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    // 2. Debounce Search
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 800);
        return () => clearTimeout(handler);
    }, [search]);

    // 3. Reset Halaman ke 1 jika filter berubah
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, dateRangeText, itemsPerPage, selectOutlet]);

    // 4. Parsing Format Tanggal
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

    // 5. Query String Builder
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
    // TABLE COLUMNS CONFIG
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
        { key: "name", label: "Nama Produk" },
        { key: "category", label: "Kategori", render: (row) => row?.category || '-' },
        {
            key: "description",
            label: "Deskripsi",
            render: (row) => {
                const htmlContent = row.description || "";
                const plainText = htmlContent.replace(/<[^>]*>/g, "");
                if (!plainText || plainText.trim() === "") return "-";
                return plainText.length > 50 ? plainText.slice(0, 50) + "..." : plainText;
            }
        },
        {
            key: "has_variant",
            label: "Varian & Stok",
            render: (row) => {
                if (!row.variants || row.variants.length === 0) return <span className="text-slate-400">-</span>;
                return (
                    <div className="space-y-1">
                        {row.variants.map((v, i) => (
                            <div key={i} className="text-sm">
                                <span className="font-semibold text-slate-700">{v.name}</span> :{" "}
                                <span className="text-emerald-600 font-bold">{v?.product_variant_stock ?? 0}</span>
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
            width: "150",
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
            label: "Status",
            align: "center",
            render: (row) => {
                const statusConfig =
                    row.is_active ? { color: "bg-emerald-100 text-emerald-700", text: "Aktif" } :
                        { color: "bg-rose-100 text-rose-700", text: "Tidak Aktif" };

                return (
                    <span className={`px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-full ${statusConfig.color}`}>
                        {statusConfig.text}
                    </span>
                );
            }
        },
        {
            key: "is_available",
            label: "Tersedia",
            align: "center",
            render: (row) => (
                <FormInput
                    type="switch"
                    label=""
                    name="is_available"
                    value={true}
                    onChange={() => { }} // Placeholder fungsi
                />
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
        <MainLayout page="Kelola Service">
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
                        title={dataUpdate ? "Edit Produk" : "Tambah Produk"}
                        onClose={handleCloseModal}
                    >
                        <ServiceFormModalContent
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
        </MainLayout>
    );
}