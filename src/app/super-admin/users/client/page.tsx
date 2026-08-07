"use client"

import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { Eye, Settings } from 'lucide-react'
import { Icon } from '@iconify/react'

import { Meta } from '@/types/Public'
import { Get } from '@/utils/Get'
import { Column } from '@/types/Admin/CRUD'
import { AlertType } from '@/types/Alert'

import FilterComponent from '@/Components/CRUD/FilterComponent'
import DataTable from '@/Components/CRUD/DataTable'
import ModalCrud from '@/Components/CRUD/ModalCrud'
import Alert from '@/Components/Alert'
import { formatImage } from '@/utils/formatImage'
import SuperAdminLayout from '../../Components/SuperAdminLayout'
import { Post } from '@/utils/Post'
import UpdateSubscriptionForm from './Components/UpdateSubscriptionForm'
import DetailBusiness from './Views/DetailBusiness'

export interface Business {
    billing_amount: number;
    category: string;
    code_ref: string;
    created_at: string;
    description: string;
    email: string;
    end_time: string;
    id: number;
    logo_url: string;
    name: string;
    plan: string;
    slug: string;
    start_time: string;
    subscription_cycle: number;
    subscription_status: string;
    updated_at: string;
    user_id: number;
    username: string;
    verified_status: number;
    whatsapp: string;
}

const BusinessPage = () => {
    // --- FILTER & PAGINATION STATE ---
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [dateRangeText, setDateRangeText] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [meta, setMeta] = useState<Meta>({ last_page: 1, limit: 10, page: 1, total: 0 });

    // --- DATA & UI STATE ---
    const [businessList, setBusinessList] = useState<Business[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'view' | 'update' | null>(null);
    const [selectedData, setSelectedData] = useState<Business | null>(null);
    const [business, setBusiness] = useState<Business | null>(null);
    // SOP Tracking Component
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

    // Helper Format
    const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    const formatDateObj = (dateString: string) => {
        if (!dateString) return '-';
        return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateString));
    };

    // ==========================================
    // API ACTIONS
    // ==========================================
    const fetchBusinesses = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await Get<{ success: boolean; data: Business[]; meta: Meta }>(`super-admin/business${queryString}`);
            if (isMounted.current && res?.success) {
                setBusinessList(res.data);
                setMeta(res.meta);
            }
        } catch (err: any) {
            if (isMounted.current) setError(err?.message || "Gagal mengambil data");
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        fetchBusinesses();
    }, [fetchBusinesses]);

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
                setSelectedData(null);
                setModalMode(null);
            }
        }, 300);
    };

    const handleView = useCallback((row: Business) => {
        setBusiness(row);
        setModalMode('view');
        setIsModalOpen(true);
    }, []);

    const handleUpdateStatus = useCallback((row: Business) => {
        setSelectedData(row);
        setModalMode('update');
        setIsModalOpen(true);
    }, []);

    const handleUpdateSubmit = async (formData: FormData, id: number | null) => {
        try {
            const res = await Post(`super-admin/business/${id}`, formData);

            if (res) {
                fetchBusinesses(); // Refresh tabel
                handleCloseModal();
                setShowAlert({ type: 'success', message: 'Paket & Status Berhasil Diupdate!', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal update data: ' + (err?.response?.data?.message || err.message), isOpen: true });
        } finally {
            setLoading(false);
        }
    };

    const columns: Column<Business>[] = useMemo(() => [
        {
            key: "logo_url",
            label: "Logo",
            width: "80px",
            align: "center",
            render: (row) => (
                row?.logo_url ?
                    <img
                        src={formatImage(row?.logo_url)}
                        alt={row?.name}
                        className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200 p-1 mx-auto"
                    /> :
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 mx-auto text-slate-400">
                        <Icon icon={'material-symbols-light:store-rounded'} className='text-2xl' />
                    </div>
            )
        },
        {
            key: "name",
            label: "Informasi Bisnis",
            render: (row) => (
                <div>
                    <p className="font-bold text-sm text-slate-800">{row.name}</p>
                    <span className="text-[11px] font-medium text-slate-500">{row.category || 'Belum ada kategori'}</span>
                </div>
            )
        },
        {
            key: "owner",
            label: "Pemilik (Owner)",
            render: (row) => (
                <div>
                    <p className="font-bold text-sm text-slate-800">{row.username}</p>
                    <span className="text-[11px] font-medium text-slate-500 block">{row.email}</span>
                    <span className="text-[11px] font-medium text-slate-500 block">{row.whatsapp}</span>
                </div>
            )
        },
        {
            key: "subscription",
            label: "Paket & Status",
            render: (row) => {
                // Helper untuk membedakan warna secara dinamis
                const getStatusStyle = (status: string) => {
                    switch (status?.toUpperCase()) {
                        case 'ACTIVE':
                            return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
                        case 'EXPIRED':
                            return 'bg-amber-100 text-amber-700 border border-amber-200';
                        case 'CANCELED':
                            return 'bg-rose-100 text-rose-700 border border-rose-200';
                        default:
                            return 'bg-slate-100 text-slate-600 border border-slate-200';
                    }
                };

                return (
                    <div>
                        <div className="flex gap-2 items-center mb-1">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(row.subscription_status)}`}>
                                {row.subscription_status || 'INACTIVE'}
                            </span>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                                Siklus: {row.subscription_cycle || 0}x
                            </span>
                        </div>
                        <p className="font-bold text-xs text-slate-800">{row.plan || 'Free'}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                            Aktif: {formatDateObj(row.start_time)} s/d {row.end_time ? formatDateObj(row.end_time) : 'Lifetime'}
                        </p>
                    </div>
                )
            }
        },
        {
            key: "actions",
            label: "Aksi",
            align: "center",
            render: (row) => (
                <div className="flex justify-center gap-2">
                    <button onClick={() => setBusiness(row)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Lihat Bisnis">
                        <Eye size={18} />
                    </button>
                    <button onClick={() => handleUpdateStatus(row)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Update Paket & Status">
                        <Settings size={18} />
                    </button>
                </div>
            ),
        },
    ], [handleView, handleUpdateStatus]);


    return (
        <SuperAdminLayout page={business ? `Detail Bisnis: ${business.name}` : 'Kelola Data Bisnis'}>
            {
                business ? <DetailBusiness idBusiness={business?.id} onBack={() => setBusiness(null)} /> :
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
                            hiddenAdd={true}
                        />

                        <div className="mt-6">
                            <DataTable<Business>
                                data={businessList}
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
                        <ModalCrud
                            isOpen={isModalOpen}
                            title={modalMode === 'view' ? 'Detail Informasi Bisnis' : 'Update Paket & Status'}
                            onClose={handleCloseModal}
                        >
                            <UpdateSubscriptionForm
                                handleFormSubmit={handleUpdateSubmit}
                                data={selectedData}
                                onCancel={handleCloseModal}
                                setLoading={setLoading}
                                loading={loading}
                            />
                        </ModalCrud>

                        {/* ALERT */}
                        {showAlert?.isOpen && (
                            <Alert
                                type={showAlert.type}
                                message={showAlert.message}
                                onClose={() => setShowAlert(null)}
                            />
                        )}
                    </div>
            }
        </SuperAdminLayout>
    )
}

export default BusinessPage