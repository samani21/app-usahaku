"use client"

import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { Edit, RefreshCw, Trash2Icon, XCircle } from 'lucide-react'

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
import CreateOrUpdate from './CreateOrUpdate'

// Definisikan tipe untuk Banner (bisa dipindah ke types file)
export interface BannerType {
    id: number;
    badge_text: string;
    normal_price: number | null;
    promo_price: number | null;
    title: string;
    highlight_text: string;
    description: string;
    button_text: string;
    theme: string;
    created_at: string;
    updated_at: string;
}

const BannersComponent = () => {
    // --- FILTER & PAGINATION STATE ---
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [dateRangeText, setDateRangeText] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [meta, setMeta] = useState<Meta>({ last_page: 1, limit: 10, page: 1, total: 0 });

    // --- DATA & UI STATE ---
    const [bannersList, setBannersList] = useState<BannerType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<BannerType | null>(null);
    const [deleteData, setDeleteData] = useState<BannerType | null>(null);
    const [restoreData, setRestoreData] = useState<BannerType | null>(null); // State baru untuk Restore

    // --- STATUS STATE (Soft Deletes) ---
    const [dataStatus, setDataStatus] = useState<'active' | 'trashed'>('active');

    // SOP: isMounted Protection
    const isMounted = useRef(true);

    // ==========================================
    // EFFECTS & HELPERS
    // ==========================================

    useEffect(() => {
        isMounted.current = true; // SOP: Pastikan remount tetap hidup
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
    }, [debouncedSearch, dateRangeText, itemsPerPage, dataStatus]);

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
        params.append("status", dataStatus); // Filter active/trashed

        if (debouncedSearch.trim()) params.append("search", debouncedSearch);
        if (parsedDate.start_date) params.append("start_date", parsedDate.start_date);
        if (parsedDate.end_date) params.append("end_date", parsedDate.end_date);

        return `?${params.toString()}`;
    }, [parsedDate, page, debouncedSearch, itemsPerPage, dataStatus]);

    // ==========================================
    // API ACTIONS
    // ==========================================
    const fetchBanners = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await Get<{ success: boolean; data: BannerType[]; meta: Meta }>(`super-admin/banners${queryString}`);
            if (isMounted.current && res?.success) {
                setBannersList(res.data);
                setMeta(res.meta);
            }
        } catch (err: any) {
            if (isMounted.current) setError(err?.message || "Gagal mengambil data");
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

    const handleFormSubmit = async (formData: FormData, id: number | null) => {
        setIsLoading(true);
        try {
            const endpoint = id ? `super-admin/banners/${id}` : 'super-admin/banners';
            const res = await Post(endpoint, formData);

            if (res) {
                fetchBanners();
                handleCloseModal();
                setShowAlert({ type: 'success', message: id ? 'Berhasil update banner' : 'Berhasil simpan banner', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal proses data: ' + (err?.response?.data?.message || err.message), isOpen: true });
        } finally {
            if (isMounted.current) {
                setLoading(false);
                setIsLoading(false);
            }
        }
    };

    const onDelete = async (id: number | null) => {
        setIsLoading(true)
        try {
            const endpoint = dataStatus === 'trashed'
                ? `super-admin/banners/${id}/force-delete`
                : `super-admin/banners/${id}`;

            const res = await Delete(endpoint);
            if (res) {
                fetchBanners();
                handleCloseModal();
                setShowAlert({
                    type: 'success',
                    message: dataStatus === 'trashed' ? 'Banner dihapus permanen!' : 'Banner dipindah ke sampah',
                    isOpen: true
                });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal proses data: ' + err.message, isOpen: true });
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    };

    const handleRestore = async () => {
        if (!restoreData) return;
        setIsLoading(true);

        try {
            const res = await Post(`super-admin/banners/${restoreData.id}/restore`, {});
            if (res) {
                fetchBanners();
                setRestoreData(null);
                setShowAlert({ type: 'success', message: 'Banner berhasil dipulihkan!', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal memulihkan: ' + err.message, isOpen: true });
        } finally {
            if (isMounted.current) setIsLoading(false);
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
                setRestoreData(null);
            }
        }, 300);
    };

    const handleEdit = useCallback((row: BannerType) => {
        setDataUpdate(row);
        setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback((row: BannerType) => {
        setDeleteData(row);
        setIsModalOpen(true);
    }, []);

    // Helper formatter mata uang
    const formatIDR = (val: number | null) => val ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val) : '-';

    // ==========================================
    // TABLE COLUMNS CONFIG
    // ==========================================
    const columns: Column<BannerType>[] = useMemo(() => [
        {
            key: "title",
            label: "Informasi Banner",
            render: (row) => (
                <div className={dataStatus === 'trashed' ? 'opacity-50 grayscale' : ''}>
                    <p className="font-bold text-sm text-slate-800">{row.title} <span className={`text-${row.theme}-500`}>{row.highlight_text}</span></p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wider">{row.badge_text}</span>
                </div>
            )
        },
        {
            key: "pricing",
            label: "Harga",
            render: (row) => (
                <div className={dataStatus === 'trashed' ? 'opacity-50 grayscale' : ''}>
                    {row.normal_price && <p className="text-xs text-slate-400 line-through">{formatIDR(row.normal_price)}</p>}
                    <p className="text-sm font-bold text-emerald-600">{formatIDR(row.promo_price) !== '-' ? formatIDR(row.promo_price) : 'Tanpa Harga'}</p>
                </div>
            )
        },
        {
            key: "actions",
            label: "Aksi",
            align: "center",
            render: (row) => (
                <div className="flex justify-center gap-2">
                    {dataStatus === 'active' ? (
                        <>
                            <button onClick={() => handleEdit(row)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(row)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg" title="Pindah ke Sampah">
                                <Trash2Icon size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setRestoreData(row)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Pulihkan Data">
                                <RefreshCw size={18} />
                            </button>
                            <button onClick={() => handleDelete(row)} className="p-2 text-rose-700 hover:bg-rose-100 rounded-lg" title="Hapus Permanen">
                                <XCircle size={18} />
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ], [handleEdit, handleDelete, dataStatus]);

    return (
        <SuperAdminLayout page='Kelola Banner Promo'>
            <div className='relative space-y-6'>
                {/* TAB NAVIGASI STATUS DATA */}
                <div className="flex gap-4 border-b border-slate-200 pb-2 mb-4">
                    <button
                        onClick={() => { setDataStatus('active'); setPage(1); }}
                        className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${dataStatus === 'active' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Banner Aktif
                    </button>
                    <button
                        onClick={() => { setDataStatus('trashed'); setPage(1); }}
                        className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${dataStatus === 'trashed' ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Tempat Sampah
                    </button>
                </div>

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
                    <DataTable<BannerType>
                        data={bannersList}
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

                {/* MODALS CRUD & DELETE */}
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
                        title={dataUpdate ? "Edit Banner" : "Tambah Banner"}
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

                {/* MODAL KHUSUS RESTORE */}
                {restoreData && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl animate-in zoom-in-95 duration-200">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <RefreshCw size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Pulihkan Data?</h3>
                            <p className="text-sm text-slate-500 mb-6">
                                Apakah Anda yakin ingin mengembalikan banner <strong>{restoreData.title}</strong> ke daftar aktif?
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setRestoreData(null)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                                    disabled={isLoading}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleRestore}
                                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 min-w-[120px]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Memproses...' : 'Ya, Pulihkan'}
                                </button>
                            </div>
                        </div>
                    </div>
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

export default BannersComponent