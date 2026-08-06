"use client"

import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { Edit, Trash2Icon } from 'lucide-react'
import { Icon } from '@iconify/react' // WAJIB IMPORT ICONIFY

import { Meta } from '@/types/Public'
import { Get } from '@/utils/Get'
import { Post } from '@/utils/Post'
import { Delete } from '@/utils/Delete'
import { Column } from '@/types/Admin/CRUD'
import { AlertType } from '@/types/Alert'

import FilterComponent from '@/Components/CRUD/FilterComponent'
import DataTable from '@/Components/CRUD/DataTable'
import ModalDelete from '@/Components/CRUD/ModalDelete'
import ModalCrud from '@/Components/CRUD/ModalCrud'
import Alert from '@/Components/Alert'
import SuperAdminLayout from '../../Components/SuperAdminLayout'
import CreateOrUpdate from './Components/CreateOrUpdate'

export interface CategoryType {
    id: number;
    name: string;
    icon: string;
    color: string;
    is_active: number | boolean;
    created_at: string;
    updated_at: string;
}

const CategoriesComponent = () => {
    // --- FILTER & PAGINATION STATE ---
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [meta, setMeta] = useState<Meta>({ last_page: 1, limit: 10, page: 1, total: 0 });
    const [dataStatus, setDataStatus] = useState<'active' | 'inactive'>('active');

    // --- DATA & UI STATE ---
    const [categoriesList, setCategoriesList] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<CategoryType | null>(null);
    const [deleteData, setDeleteData] = useState<CategoryType | null>(null);

    // SOP: isMounted Protection
    const isMounted = useRef(true);

    // ==========================================
    // EFFECTS & HELPERS
    // ==========================================
    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        if (showAlert?.isOpen) {
            const timer = setTimeout(() => {
                if (isMounted.current) setShowAlert(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 800);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, itemsPerPage, dataStatus]);

    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", itemsPerPage.toString());
        params.append("status", dataStatus);
        if (debouncedSearch.trim()) params.append("search", debouncedSearch);
        return `?${params.toString()}`;
    }, [page, debouncedSearch, itemsPerPage, dataStatus]);

    // ==========================================
    // API ACTIONS
    // ==========================================
    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await Get<{ success: boolean; data: CategoryType[]; meta: Meta }>(`super-admin/categories${queryString}`);
            if (isMounted.current && res?.success) {
                setCategoriesList(res.data);
                setMeta(res.meta);
            }
        } catch (err: any) {
            if (isMounted.current) setError(err?.message || "Gagal mengambil data");
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleFormSubmit = async (formData: FormData, id: number | null) => {
        try {
            const endpoint = id ? `super-admin/categories/${id}` : 'super-admin/categories';
            const res = await Post(endpoint, formData);
            if (res) {
                fetchCategories();
                handleCloseModal();
                setShowAlert({ type: 'success', message: id ? 'Berhasil update kategori' : 'Berhasil simpan kategori', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal proses data: ' + (err?.response?.data?.message || err.message), isOpen: true });
        }
    };

    const onDelete = async (id: number | null) => {
        setIsLoading(true)
        try {
            const res = await Delete(`super-admin/categories/${id}`);
            if (res) {
                fetchCategories();
                handleCloseModal();
                setShowAlert({ type: 'success', message: 'Kategori berhasil dihapus!', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal proses data: ' + err.message, isOpen: true });
        } finally {
            setIsLoading(false)
        }
    };

    // ==========================================
    // UI HANDLERS
    // ==========================================
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            if (isMounted.current) {
                setDataUpdate(null);
                setDeleteData(null);
            }
        }, 300);
    };

    const handleEdit = useCallback((row: CategoryType) => {
        setDataUpdate(row);
        setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback((row: CategoryType) => {
        setDeleteData(row);
        setIsModalOpen(true);
    }, []);

    // ==========================================
    // TABLE COLUMNS
    // ==========================================
    const columns: Column<CategoryType>[] = useMemo(() => [
        {
            key: "icon",
            label: "Ikon",
            width: "80px",
            align: "center",
            render: (row) => (
                <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center ${row.color}`}>
                    <Icon icon={row.icon} className="text-2xl" />
                </div>
            )
        },
        {
            key: "name",
            label: "Nama Kategori",
            render: (row) => <span className="font-bold text-slate-800">{row.name}</span>
        },
        {
            key: "color",
            label: "Kode Warna",
            render: (row) => <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{row.color}</span>
        },
        {
            key: "actions",
            label: "Aksi",
            align: "center",
            render: (row) => (
                <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(row)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(row)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                        <Trash2Icon size={18} />
                    </button>
                </div>
            ),
        },
    ], [handleEdit, handleDelete]);

    return (
        <SuperAdminLayout page='Kelola Kategori'>
            <div className='relative space-y-6'>
                {/* TAB STATUS AKTIF/NON-AKTIF */}
                <div className="flex gap-4 border-b border-slate-200 pb-2 mb-4">
                    <button
                        onClick={() => { setDataStatus('active'); setPage(1); }}
                        className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${dataStatus === 'active' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Aktif
                    </button>
                    <button
                        onClick={() => { setDataStatus('inactive'); setPage(1); }}
                        className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${dataStatus === 'inactive' ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Non-Aktif
                    </button>
                </div>

                <FilterComponent
                    search={search}
                    setSearch={setSearch}
                    dateRangeText="" setDateRangeText={() => { }} // Abaikan jika tidak butuh daterange
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    setPage={setPage}
                    handleReset={() => setSearch("")}
                    setIsModalOpenForm={setIsModalOpen}
                />

                <div className="mt-6">
                    <DataTable<CategoryType>
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
                        isLoading={isLoading}
                    />
                ) : (
                    <ModalCrud
                        isOpen={isModalOpen}
                        title={dataUpdate ? "Edit Kategori" : "Tambah Kategori"}
                        onClose={handleCloseModal}
                    >
                        <CreateOrUpdate
                            handleFormSubmit={handleFormSubmit}
                            data={dataUpdate}
                            onCancel={handleCloseModal}
                            setLoading={setLoading}
                            loading={loading}
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
        </SuperAdminLayout>
    )
}

export default CategoriesComponent