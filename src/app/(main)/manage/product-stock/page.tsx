"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react' // Ganti icon biar cocok buat stok in/out

import { Meta } from '@/types/Public'
import { Get } from '@/utils/Get'
import { Post } from '@/utils/Post'
import { Column } from '@/types/Admin/CRUD'
import { AlertType } from '@/types/Alert'
import { ProductStockType } from '@/types/Admin/ProductStockType'

import FilterComponent from '@/Components/CRUD/FilterComponent'
import DataTable from '@/Components/CRUD/DataTable'
import ModalCrud from '@/Components/CRUD/ModalCrud'
import Alert from '@/Components/Alert'
import CreateOrUpdateProductStock from './Components/CreateOrUpdateProductStock'
import MainLayout from '@/Components/Layout/MainLayout'
import GlassCard from '@/Components/Layout/GlassCard' // Tambahan biar tabelnya cakep

const ProductStockComponent = () => {
    // --- FILTER & PAGINATION STATE ---
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [dateRangeText, setDateRangeText] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [meta, setMeta] = useState<Meta>({ last_page: 1, limit: 10, page: 1, total: 0 });

    // --- DATA & UI STATE ---
    const [productStockList, setProductStockList] = useState<ProductStockType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ==========================================
    // EFFECTS & HELPERS
    // ==========================================

    useEffect(() => {
        if (showAlert?.isOpen) {
            const timer = setTimeout(() => {
                setShowAlert(null);
            }, 5000);
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

    const parsedDate = useMemo(() => {
        if (!dateRangeText.includes(" - ")) return { start_date: "", end_date: "" };

        const monthMap: Record<string, string> = {
            Jan: "01", Feb: "02", Mar: "03", Apr: "04", Mei: "05", Jun: "06",
            Jul: "07", Agt: "08", Agu: "08", Sep: "09", Okt: "10", Nov: "11", Des: "12",
        };

        const formatDate = (dateStr: string) => {
            const [day, month, year] = dateStr.trim().split(" ");
            const formattedMonth = monthMap[month] || "01";
            return `${year}-${formattedMonth}-${day.padStart(2, "0")}`;
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

        return `?${params.toString()}`;
    }, [parsedDate, page, debouncedSearch, itemsPerPage]);

    // ==========================================
    // API ACTIONS
    // ==========================================
    const fetchProductStock = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await Get<{ success: boolean; data: ProductStockType[]; meta: Meta }>(`client/product-stock${queryString}`);
            if (res?.success) {
                setProductStockList(res.data);
                setMeta(res.meta);
            }
        } catch (err: any) {
            setError(err?.message || "Gagal mengambil data");
        } finally {
            setLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        fetchProductStock();
    }, [fetchProductStock]);

    const handleFormSubmit = async (formData: FormData) => {
        setLoading(true);
        try {
            const endpoint = 'client/product-stock';
            const res = await Post(endpoint, formData);

            if (res) {
                fetchProductStock();
                handleCloseModal();
                setShowAlert({ type: 'success', message: 'Berhasil simpan data', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal proses data: ' + err.message, isOpen: true });
        } finally {
            setLoading(false);
        }
    };

    const handleResetFilter = () => {
        setSearch("");
        setDateRangeText("");
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // ==========================================
    // TABLE COLUMNS CONFIG
    // ==========================================
    const columns: Column<ProductStockType>[] = useMemo(() => [
        { key: "name_outlet", label: "Outlet" },
        {
            key: "name_product",
            label: "Nama Produk",
            render: (row) => <span className="font-semibold text-slate-800">{row.name_product}</span>
        },
        {
            key: "name_variant",
            label: "Varian",
            render: (row) => row?.name_variant ? <span className="text-slate-600">{row.name_variant}</span> : <span className="text-slate-400 italic">-</span>
        },
        {
            key: "stock",
            label: "Qty",
            align: "center",
            render: (row) => {
                // Asumsi backend lu ngirim field `type` ('IN' atau 'OUT') di dalam object ProductStockType
                // Kalau nggak ada, lu bisa mapping dari reference_type
                const isOut = row.type === 'OUT' || row.reference_type === 'adjustment'; // Sesuaikan kalau beda

                return (
                    <div className={`flex items-center justify-center gap-1 font-bold ${isOut ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {isOut ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                        {row.stock}
                    </div>
                );
            }
        },
        {
            key: "reference_type",
            label: "Tipe Transaksi",
            align: "center",
            render: (row) => {
                let badgeClass = "bg-slate-100 text-slate-600";
                let label = row.reference_type;

                if (row.reference_type === 'restock') {
                    badgeClass = "bg-emerald-100 text-emerald-700";
                    label = "RESTOCK";
                } else if (row.reference_type === 'adjustment') {
                    badgeClass = "bg-amber-100 text-amber-700";
                    label = "ADJUSTMENT";
                } else if (row.reference_type === 'order') {
                    badgeClass = "bg-blue-100 text-blue-700";
                    label = "ORDER";
                }

                return (
                    <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md ${badgeClass}`}>
                        {label}
                    </span>
                );
            }
        },
        {
            key: "date",
            label: "Tanggal",
            render: (row) => <span className="text-sm text-slate-600">{row?.date ?? '-'}</span>
        },
        {
            key: "note",
            label: "Catatan",
            render: (row) => row?.note ? <span className="text-sm text-slate-500">{row.note}</span> : <span className="text-slate-300 italic">-</span>
        },
    ], []);

    return (
        <MainLayout page='Histori & Kelola Stok'>
            <div className='relative space-y-6'>
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

                <GlassCard className="mt-6 p-2">
                    <DataTable<ProductStockType>
                        data={productStockList}
                        columns={columns}
                        page={page}
                        itemsPerPage={itemsPerPage}
                        total={meta?.total}
                        onPageChange={setPage}
                        loading={loading}
                        error={error}
                        rowKey={(row) => row.id}
                    />
                </GlassCard>

                {/* MODALS */}
                {isModalOpen &&
                    <ModalCrud
                        isOpen={isModalOpen}
                        title={"Form Penyesuaian Stok"}
                        onClose={handleCloseModal}
                    >
                        <CreateOrUpdateProductStock
                            handleFormSubmit={handleFormSubmit}
                            loading={loading}
                            setLoading={setLoading}
                            onCancel={handleCloseModal}
                        />
                    </ModalCrud>
                }

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
    )
}

export default ProductStockComponent