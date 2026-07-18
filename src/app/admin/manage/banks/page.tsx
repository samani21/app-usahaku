"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Edit, Trash2Icon } from 'lucide-react'

import { Meta } from '@/types/Public'
import { Get } from '@/utils/Get'
import { Post } from '@/utils/Post'
import { Delete } from '@/utils/Delete'
import { Column } from '@/types/Admin/CRUD'
import { BanksType } from '@/types/Admin/Banks'
import { AlertType } from '@/types/Alert'

import FilterComponent from '@/Components/CRUD/FilterComponent'
import DataTable from '@/Components/CRUD/DataTable'
import ModalDelete from '@/Components/CRUD/ModalDelete'
import ModalCrud from '@/Components/CRUD/ModalCrud'
import Alert from '@/Components/Alert'
import { formatImage } from '@/utils/formatImage'
import CreateOrUpdateBanks from './Components/CreateOrUpdateBanks'
import MainLayout from '@/Components/Layout/MainLayout'

const BanksComponent = () => {
    // --- FILTER & PAGINATION STATE ---
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [dateRangeText, setDateRangeText] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [meta, setMeta] = useState<Meta>({ last_page: 1, limit: 10, page: 1, total: 0 });

    // --- DATA & UI STATE ---
    const [banksList, setBanksList] = useState<BanksType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<BanksType | null>(null);
    const [deleteData, setDeleteData] = useState<BanksType | null>(null);

    // ==========================================
    // EFFECTS & HELPERS
    // ==========================================

    // 1. Auto-hide Alert dengan Cleanup Timer
    useEffect(() => {
        if (showAlert?.isOpen) {
            const timer = setTimeout(() => {
                setShowAlert(null);
            }, 3000);
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
    // Di dalam BanksComponent.tsx, perbarui parsedDate:
    const parsedDate = useMemo(() => {
        if (!dateRangeText.includes(" - ")) return { start_date: "", end_date: "" };

        const monthMap: Record<string, string> = {
            Jan: "01", Feb: "02", Mar: "03", Apr: "04", Mei: "05", Jun: "06",
            Jul: "07", Agt: "08", Agu: "08", Sep: "09", Okt: "10", Nov: "11", Des: "12",
        };

        const formatDate = (dateStr: string) => {
            if (!dateStr) return "";
            const parts = dateStr.trim().split(" ");
            // ANTISIPASI ERROR: Jika format string salah/tidak lengkap
            if (parts.length !== 3) return "";
            const [day, month, year] = parts;
            return `${year}-${monthMap[month] || "01"}-${day.padStart(2, "0")}`;
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
    const fetchBanks = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await Get<{ success: boolean; data: BanksType[]; meta: Meta }>(`client/banks${queryString}`);
            if (res?.success) {
                setBanksList(res.data);
                setMeta(res.meta);
            }
        } catch (err: any) {
            setError(err?.message || "Gagal mengambil data");
        } finally {
            setLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        fetchBanks();
    }, [fetchBanks]);

    const handleFormSubmit = async (formData: FormData, id: number | null) => {
        try {
            const endpoint = id ? `client/banks/${id}` : 'client/banks';
            const res = await Post(endpoint, formData);

            if (res) {
                fetchBanks();
                handleCloseModal();
                setShowAlert({ type: 'success', message: id ? 'Berhasil update data' : 'Berhasil simpan data', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal proses data: ' + err.message, isOpen: true });
        }
    };

    const onDelete = async (id: number | null) => {
        setIsLoading(true)
        try {
            const res = await Delete(`client/banks/${id}`);
            if (res) {
                fetchBanks();
                handleCloseModal();
                setShowAlert({ type: 'success', message: 'Berhasil hapus data', isOpen: true });
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
            setDataUpdate(null);
            setDeleteData(null);
        }, 300); // Tunggu animasi tutup selesai sebelum mengosongkan state
    };

    const handleEdit = useCallback((row: BanksType) => {
        setDataUpdate(row);
        setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback((row: BanksType) => {
        setDeleteData(row);
        setIsModalOpen(true);
    }, []);

    // ==========================================
    // TABLE COLUMNS CONFIG
    // ==========================================
    const columns: Column<BanksType>[] = useMemo(() => [
        {
            key: "icon",
            label: "Icon",
            width: "200px",
            render: (row) => (
                <img
                    src={formatImage(row.master_bank?.logo)}
                    alt={row.master_bank?.name}
                    className="w-24 h-12 rounded-md object-contain bg-white border border-slate-100 p-1"
                />
            )
        },
        { key: "account_name", label: "Nama Akun" },
        { key: "account_number", label: "Nomor Akun" },
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
        <MainLayout page='Kelola Akun Bank'>
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
                    <DataTable<BanksType>
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
                        title={dataUpdate ? "Edit Bank" : "Tambah Bank"}
                        onClose={handleCloseModal}
                    >
                        <CreateOrUpdateBanks
                            handleFormSubmit={handleFormSubmit}
                            data={dataUpdate}
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
        </MainLayout>
    )
}

export default BanksComponent