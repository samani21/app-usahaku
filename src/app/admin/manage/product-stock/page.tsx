"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Edit, Trash2Icon } from 'lucide-react'

import { Meta } from '@/types/Public'
import { Get } from '@/utils/Get'
import { Post } from '@/utils/Post'
import { Delete } from '@/utils/Delete'
import { Column } from '@/types/Admin/CRUD'
import { AlertType } from '@/types/Alert'
import { ProductStockType } from '@/types/Admin/ProductStockType'

import FilterComponent from '@/Components/CRUD/FilterComponent'
import DataTable from '@/Components/CRUD/DataTable'
import ModalCrud from '@/Components/CRUD/ModalCrud'
import Alert from '@/Components/Alert'
import CreateOrUpdateProductStock from './Components/CreateOrUpdateProductStock'
import MainLayout from '@/Components/Layout/MainLayout'

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

    // 1. Auto-hide Alert dengan Cleanup Timer
    useEffect(() => {
        if (showAlert?.isOpen) {
            const timer = setTimeout(() => {
                setShowAlert(null);
            }, 5000);
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
    }, [debouncedSearch, dateRangeText, itemsPerPage]);

    // 4. Parsing Format Tanggal
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

    // 5. Query String Builder
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

    // ==========================================
    // UI HANDLERS
    // ==========================================
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
        { key: "name_outlet", label: "Nama Outlet" },
        { key: "name_product", label: "Nama Produk" },
        {
            key: "name_variant",
            label: "Nama Variant",
            render: (row) => row?.name_variant ?? '-'
        },
        {
            key: "stock",
            label: "Stok",
            render: (row) => row?.stock ?? '0'
        },
        {
            key: "date",
            label: "Tanggal",
            render: (row) => row?.date ?? '-'
        },
        {
            key: "reference_type",
            label: "Reference",
            render: (row) => row?.reference_type ?? '-'
        },
        {
            key: "note",
            label: "Catatan",
            render: (row) => row?.note ?? '-'
        },
    ], []);

    return (
        <MainLayout page='Kelola Stok Produk'>
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

                <div className="mt-6">
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
                </div>

                {/* MODALS */}
                {isModalOpen &&
                    <ModalCrud
                        isOpen={isModalOpen}
                        title={"Tambah Stok Produk"}
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