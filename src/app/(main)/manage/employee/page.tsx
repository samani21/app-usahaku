"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Edit, Trash2Icon, Copy, CheckCircle2 } from 'lucide-react'

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
import Loading from '@/Components/Loading'
import Alert from '@/Components/Alert'
import MainLayout from '@/Components/Layout/MainLayout'
import CreateOrUpdateEmployee from './Components/CreateOrUpdateOutlet'

// --- DEFINISI TIPE PEGAWAI ---
export interface EmployeeType {
    id: number;
    full_name: string;
    business_id: number;
    user: {
        id: number;
        email: string;
        whatsapp: string;
        is_active: boolean;
    };
    created_at: string;
}

const EmployeesComponent = () => {
    // --- FILTER & PAGINATION STATE ---
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [dateRangeText, setDateRangeText] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [meta, setMeta] = useState<Meta>({ last_page: 1, limit: 10, page: 1, total: 0 });

    // --- DATA & UI STATE ---
    const [employeesList, setEmployeesList] = useState<EmployeeType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<EmployeeType | null>(null);
    const [deleteData, setDeleteData] = useState<EmployeeType | null>(null);

    // STATE KHUSUS PASSWORD BARU
    const [newPasswordData, setNewPasswordData] = useState<{ email: string; password: string; name: string } | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    // ==========================================
    // EFFECTS & HELPERS
    // ==========================================
    useEffect(() => {
        if (showAlert?.isOpen) {
            const timer = setTimeout(() => setShowAlert(null), 5000);
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
            return `${year}-${monthMap[month]}-${day.padStart(2, "0")}`;
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
    const fetchEmployee = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await Get<{ success: boolean; data: EmployeeType[]; meta: Meta }>(`client/employee${queryString}`);
            if (res?.success) {
                setEmployeesList(res.data);
                setMeta(res.meta);
            }
        } catch (err: any) {
            setError(err.message || "Gagal mengambil data");
        } finally {
            setLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        fetchEmployee();
    }, [fetchEmployee]);

    const handleFormSubmit = async (formData: FormData, id: number | null) => {
        setLoading(true);
        try {
            const endpoint = id ? `client/employee/${id}` : 'client/employee';
            // PENTING: Karena update pegawai di Laravel sering bermasalah jika pakai FormData biasa tanpa _method PUT

            const res = await Post<{ data: any }, any>(endpoint, formData);

            if (res) {
                fetchEmployee();
                handleCloseModal();

                // Jika Tambah Data, tangkap password dari response Backend
                if (!id && res.data?.default_password) {
                    setNewPasswordData({
                        name: res.data.profile.full_name,
                        email: res.data.profile.user.email,
                        password: res.data.default_password
                    });
                } else {
                    setShowAlert({ type: 'success', message: 'Berhasil update data', isOpen: true });
                }
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: err.message || 'Gagal proses data', isOpen: true });
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (id: number | null) => {
        setLoading(true);
        try {
            const res = await Delete(`client/employee/${id}`);
            if (res) {
                fetchEmployee();
                handleCloseModal();
                setShowAlert({ type: 'success', message: 'Berhasil hapus data', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: err.message || 'Gagal hapus data', isOpen: true });
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // UI HANDLERS
    // ==========================================
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setDataUpdate(null);
            setDeleteData(null);
        }, 300);
    };

    const copyToClipboard = () => {
        if (newPasswordData) {
            navigator.clipboard.writeText(`Login Kasir\nEmail: ${newPasswordData.email}\nPassword: ${newPasswordData.password}`);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 3000);
        }
    };

    const columns: Column<EmployeeType>[] = useMemo(() => [
        { key: "full_name", label: "Nama Pegawai" },
        {
            key: "email",
            label: "Email (Login ID)",
            render: (row) => <span className="font-medium text-slate-700">{row.user?.email || '-'}</span>
        },
        {
            key: "whatsapp",
            label: "No. WhatsApp",
            render: (row) => row.user?.whatsapp || '-'
        },
        {
            key: "actions",
            label: "Aksi",
            align: "center",
            render: (row) => (
                <div className="flex justify-center gap-2">
                    <button onClick={() => { setDataUpdate(row); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18} />
                    </button>
                    <button onClick={() => { setDeleteData(row); setIsModalOpen(true); }} className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2Icon size={18} />
                    </button>
                </div>
            ),
        },
    ], []);

    return (
        <MainLayout page='Kelola Pegawai'>
            <div className='relative space-y-6'>
                {loading && <Loading />}

                <FilterComponent
                    search={search} setSearch={setSearch}
                    dateRangeText={dateRangeText} setDateRangeText={setDateRangeText}
                    itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage}
                    setPage={setPage} handleReset={() => { setSearch(""); setDateRangeText(""); }}
                    setIsModalOpenForm={setIsModalOpen}
                />

                <div className="mt-6">
                    <DataTable<EmployeeType>
                        data={employeesList}
                        columns={columns}
                        page={page} itemsPerPage={itemsPerPage} total={meta?.total}
                        onPageChange={setPage} loading={loading} error={error}
                        rowKey={(row) => row.id}
                    />
                </div>

                {/* MODAL CRUD & DELETE */}
                {deleteData ? (
                    <ModalDelete
                        isOpen={isModalOpen} onClose={handleCloseModal}
                        deleteData={deleteData} handleDelete={onDelete}
                    />
                ) : (
                    <ModalCrud
                        isOpen={isModalOpen} title={dataUpdate ? "Edit Pegawai" : "Tambah Pegawai Baru"}
                        onClose={handleCloseModal}
                    >
                        <CreateOrUpdateEmployee
                            handleFormSubmit={handleFormSubmit}
                            data={dataUpdate}
                            loading={loading} setLoading={setLoading}
                            onCancel={handleCloseModal}
                        />
                    </ModalCrud>
                )}

                {/* MODAL KHUSUS PASSWORD BARU (UX Mulus) */}
                {newPasswordData && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Akun Pegawai Berhasil Dibuat!</h3>
                            <p className="text-sm text-slate-500">Berikan kredensial ini kepada <b>{newPasswordData.name}</b> untuk login ke aplikasi Kasir.</p>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 mt-4 relative">
                                <p className="text-sm text-slate-500">Email Login:</p>
                                <p className="font-semibold text-slate-800">{newPasswordData.email}</p>
                                <p className="text-sm text-slate-500 mt-2">Password Sementara:</p>
                                <p className="font-mono font-bold text-lg text-blue-600">{newPasswordData.password}</p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button onClick={copyToClipboard} className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold transition-colors">
                                    {isCopied ? <CheckCircle2 size={18} className="text-emerald-600" /> : <Copy size={18} />}
                                    {isCopied ? 'Tersalin!' : 'Copy Info'}
                                </button>
                                <button onClick={() => setNewPasswordData(null)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-colors">
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ALERT */}
                {showAlert?.isOpen && (
                    <Alert type={showAlert.type} message={showAlert.message} onClose={() => setShowAlert(null)} />
                )}
            </div>
        </MainLayout>
    )
}

export default EmployeesComponent