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
import { formatImage } from '@/utils/formatImage'
import SuperAdminLayout from '../../Components/SuperAdminLayout'
import { MasterBanksType } from '@/types/Admin/Banks'
import CreateOrUpdate from './Components/CreateOrUpdate'

const MasterBanksComponent = () => {
    // --- FILTER & PAGINATION STATE ---
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [dateRangeText, setDateRangeText] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [meta, setMeta] = useState<Meta>({ last_page: 1, limit: 10, page: 1, total: 0 });

    // --- DATA & UI STATE ---
    const [banksList, setBanksList] = useState<MasterBanksType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<MasterBanksType | null>(null);
    const [deleteData, setDeleteData] = useState<MasterBanksType | null>(null);

    // Gunakan Ref untuk tracking komponen isMounted (SOP)
    const isMounted = useRef(true);

    // ==========================================
    // EFFECTS & HELPERS
    // ==========================================

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
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
    }, [debouncedSearch, dateRangeText, itemsPerPage]);

    const parsedDate = useMemo(() => {
        if (!dateRangeText.includes(" - ")) return { start_date: "", end_date: "" };

        const monthMap: Record<string, string> = {
            Jan: "01", Feb: "02", Mar: "03", Apr: "04", Mei: "05", Jun: "06",
            Jul: "07", Agt: "08", Agu: "08", Sep: "09", Okt: "10", Nov: "11", Des: "12",
        };

        const formatDate = (dateStr: string) => {
            if (!dateStr) return "";
            const parts = dateStr.trim().split(" ");
            if (parts.length !== 3) return "";
            const [day, month, year] = parts;
            return `${year}-${monthMap[month] || "01"}-${day.padStart(2, "0")}`;
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
    const fetchBanks = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await Get<{ success: boolean; data: MasterBanksType[]; meta: Meta }>(`super-admin/master-banks${queryString}`);
            if (isMounted.current && res?.success) {
                setBanksList(res.data);
                setMeta(res.meta);
            }
        } catch (err: any) {
            if (isMounted.current) setError(err?.message || "Gagal mengambil data");
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        fetchBanks();
    }, [fetchBanks]);

    const handleFormSubmit = async (formData: FormData, id: number | null) => {
        try {
            // FIX KODE SEBELUMNYA: client/banks diganti jadi endpoint master-banks yang benar
            const endpoint = id ? `super-admin/master-banks/${id}` : 'super-admin/master-banks';

            const res = await Post(endpoint, formData);

            if (res) {
                fetchBanks();
                handleCloseModal();
                setShowAlert({ type: 'success', message: id ? 'Berhasil update data bank' : 'Berhasil simpan data bank', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal proses data: ' + (err?.response?.data?.message || err.message), isOpen: true });
        }
    };

    const onDelete = async (id: number | null) => {
        setIsLoading(true)
        try {
            const res = await Delete(`super-admin/master-banks/${id}`);
            if (res) {
                fetchBanks();
                handleCloseModal();
                setShowAlert({ type: 'success', message: 'Berhasil hapus data bank', isOpen: true });
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
    const handleResetFilter = () => {
        setSearch("");
        setDateRangeText("");
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            if (isMounted.current) {
                setDataUpdate(null);
                setDeleteData(null);
            }
        }, 300);
    };

    const handleEdit = useCallback((row: MasterBanksType) => {
        setDataUpdate(row);
        setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback((row: MasterBanksType) => {
        setDeleteData(row);
        setIsModalOpen(true);
    }, []);

    // ==========================================
    // TABLE COLUMNS CONFIG
    // ==========================================
    const columns: Column<MasterBanksType>[] = useMemo(() => [
        {
            key: "icon", // Bisa diganti "logo" kalau mau, tapi string "icon" juga aman buat key aja
            label: "Logo Bank",
            width: "200px",
            render: (row) => (
                <img
                    src={formatImage(row?.logo)}
                    alt={row?.name}
                    className="w-24 h-12 rounded-md object-contain bg-white border border-slate-100 p-1"
                />
            )
        },
        { key: "code", label: "Kode Bank" },
        { key: "name", label: "Nama Bank" },
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
        <SuperAdminLayout page='Kelola Akun Bank'>
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
                    <DataTable<MasterBanksType>
                        data={banksList}
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
                        title={dataUpdate ? "Edit Master Bank" : "Tambah Master Bank"}
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

export default MasterBanksComponent