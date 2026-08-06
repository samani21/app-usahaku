"use client"

import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { Edit, Trash2Icon } from 'lucide-react'

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

export interface PackageType {
    id: number;
    name: string;
    base_price: number;
    created_at: string;
    updated_at: string;
}

const PackagesComponent = () => {
    // --- FILTER & PAGINATION STATE ---
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [meta, setMeta] = useState<Meta>({ last_page: 1, limit: 10, page: 1, total: 0 });

    // --- DATA & UI STATE ---
    const [packagesList, setPackagesList] = useState<PackageType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<PackageType | null>(null);
    const [deleteData, setDeleteData] = useState<PackageType | null>(null);

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
    }, [debouncedSearch, itemsPerPage]);

    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", itemsPerPage.toString());
        if (debouncedSearch.trim()) params.append("search", debouncedSearch);
        return `?${params.toString()}`;
    }, [page, debouncedSearch, itemsPerPage]);

    // ==========================================
    // API ACTIONS
    // ==========================================
    const fetchPackages = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await Get<{ success: boolean; data: PackageType[]; meta: Meta }>(`super-admin/packages${queryString}`);
            if (isMounted.current && res?.success) {
                setPackagesList(res.data);
                setMeta(res.meta);
            }
        } catch (err: any) {
            if (isMounted.current) setError(err?.message || "Gagal mengambil data");
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        fetchPackages();
    }, [fetchPackages]);

    const handleFormSubmit = async (formData: FormData, id: number | null) => {
        try {
            const endpoint = id ? `super-admin/packages/${id}` : 'super-admin/packages';
            const res = await Post(endpoint, formData);
            if (res) {
                fetchPackages();
                handleCloseModal();
                setShowAlert({ type: 'success', message: id ? 'Berhasil update paket' : 'Berhasil simpan paket', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal proses data: ' + (err?.response?.data?.message || err.message), isOpen: true });
        } finally {
            setLoading(false)
            setIsLoading(false)
        }
    };

    const onDelete = async (id: number | null) => {
        setIsLoading(true)
        try {
            const res = await Delete(`super-admin/packages/${id}`);
            if (res) {
                fetchPackages();
                handleCloseModal();
                setShowAlert({ type: 'success', message: 'Paket berhasil dihapus!', isOpen: true });
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

    const handleEdit = useCallback((row: PackageType) => {
        setDataUpdate(row);
        setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback((row: PackageType) => {
        setDeleteData(row);
        setIsModalOpen(true);
    }, []);

    const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

    // ==========================================
    // TABLE COLUMNS
    // ==========================================
    const columns: Column<PackageType>[] = useMemo(() => [
        {
            key: "name",
            label: "Nama Paket",
            render: (row) => <span className="font-bold text-slate-800">{row.name}</span>
        },
        {
            key: "base_price",
            label: "Harga Dasar (Rp)",
            render: (row) => <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">{formatIDR(row.base_price)}</span>
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
        <SuperAdminLayout page='Kelola Paket Layanan'>
            <div className='relative space-y-6'>

                <FilterComponent
                    search={search}
                    setSearch={setSearch}
                    dateRangeText="" setDateRangeText={() => { }}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    setPage={setPage}
                    handleReset={() => setSearch("")}
                    setIsModalOpenForm={setIsModalOpen}
                />

                <div className="mt-6">
                    <DataTable<PackageType>
                        data={packagesList}
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
                        title={dataUpdate ? "Edit Paket Layanan" : "Tambah Paket Layanan"}
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

export default PackagesComponent