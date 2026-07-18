"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Edit, Trash2Icon } from 'lucide-react'
import { Icon } from '@iconify/react'

import { Meta } from '@/types/Public'
import { Get } from '@/utils/Get'
import { Post } from '@/utils/Post'
import { Delete } from '@/utils/Delete'
import { Column } from '@/types/Admin/CRUD'
import { AlertType } from '@/types/Alert'
import { CategoriesType } from '@/types/Admin/CategoriesType'

import FilterComponent from '@/Components/CRUD/FilterComponent'
import DataTable from '@/Components/CRUD/DataTable'
import ModalDelete from '@/Components/CRUD/ModalDelete'
import ModalCrud from '@/Components/CRUD/ModalCrud'
import Alert from '@/Components/Alert'
import { formatImage } from '@/utils/formatImage'
import CreateOrUpdateCategorie from './Components/CreateOrUpdateCategorie'
import MainLayout from '@/Components/Layout/MainLayout'

const CategoriesComponent = () => {
    // --- FILTER & PAGINATION STATE ---
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [dateRangeText, setDateRangeText] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [meta, setMeta] = useState<Meta>({ last_page: 1, limit: 10, page: 1, total: 0 });

    // --- DATA & UI STATE ---
    const [categoriesList, setCategoriesList] = useState<CategoriesType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<CategoriesType | null>(null);
    const [deleteData, setDeleteData] = useState<CategoriesType | null>(null);

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

        return `?${params.toString()}`;
    }, [parsedDate, page, debouncedSearch, itemsPerPage]);

    // ==========================================
    // API ACTIONS
    // ==========================================
    const fetchCategorie = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await Get<{ success: boolean; data: CategoriesType[]; meta: Meta }>(`client/categorie${queryString}`);
            if (res?.success) {
                setCategoriesList(res.data);
                setMeta(res.meta);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setShowAlert({ type: 'error', message: 'Gagal proses data: ' + err.message, isOpen: true });
            } else {
                setShowAlert({ type: 'error', message: 'Gagal proses data.', isOpen: true });
            }
        } finally {
            setLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        fetchCategorie();
    }, [fetchCategorie]);

    const handleFormSubmit = async (formData: FormData, id: number | null) => {
        setLoading(true);
        try {
            const endpoint = id ? `client/categorie/${id}` : 'client/categorie';
            const res = await Post(endpoint, formData);

            if (res) {
                fetchCategorie();
                handleCloseModal();
                setShowAlert({ type: 'success', message: id ? 'Berhasil update data' : 'Berhasil simpan data', isOpen: true });
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setShowAlert({ type: 'error', message: 'Gagal proses data: ' + err.message, isOpen: true });
            } else {
                setShowAlert({ type: 'error', message: 'Gagal proses data.', isOpen: true });
            }
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (id: number | null) => {
        setLoading(true);
        try {
            const res = await Delete(`client/categorie/${id}`);
            if (res) {
                fetchCategorie();
                handleCloseModal();
                setShowAlert({ type: 'success', message: 'Berhasil hapus data', isOpen: true });
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setShowAlert({ type: 'error', message: 'Gagal proses data: ' + err.message, isOpen: true });
            } else {
                setShowAlert({ type: 'error', message: 'Gagal proses data.', isOpen: true });
            }
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
        setTimeout(() => {
            setDataUpdate(null);
            setDeleteData(null);
        }, 300); // Tunggu animasi tutup modal selesai
    };

    const handleEdit = useCallback((row: CategoriesType) => {
        setDataUpdate(row);
        setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback((row: CategoriesType) => {
        setDeleteData(row);
        setIsModalOpen(true);
    }, []);

    // ==========================================
    // TABLE COLUMNS CONFIG
    // ==========================================
    const columns: Column<CategoriesType>[] = useMemo(() => [
        {
            key: "icon",
            label: "Icon",
            width: "120px",
            render: (row) => {
                if (!row?.icon) return <span className="text-slate-400">-</span>;

                if (row.icon.startsWith("usahaku")) {
                    return (
                        <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shadow-sm flex items-center justify-center p-1">
                            <img src={formatImage(row.icon)} alt={row.name} className="w-full h-full object-contain" />
                        </div>
                    );
                }

                return (
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shadow-sm">
                        <Icon icon={row.icon} color={row.color || "#64748b"} className="text-3xl" />
                    </div>
                );
            }
        },
        { key: "name", label: "Nama Kategori" },
        {
            key: "actions",
            label: "Aksi",
            align: "center",
            render: (row) => (
                <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(row)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(row)} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2Icon size={18} />
                    </button>
                </div>
            ),
        },
    ], [handleEdit, handleDelete]);

    return (
        <MainLayout page='Kelola Kategori Produk'>
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
                    <DataTable<CategoriesType>
                        data={categoriesList}
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
                        title={dataUpdate ? "Edit Kategori" : "Tambah Kategori"}
                        onClose={handleCloseModal}
                    >
                        <CreateOrUpdateCategorie
                            handleFormSubmit={handleFormSubmit}
                            data={dataUpdate}
                            loading={loading}
                            setLoading={setLoading}
                            onCancel={handleCloseModal}
                        />
                    </ModalCrud>
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
        </MainLayout>)
}

export default CategoriesComponent