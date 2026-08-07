"use client"

import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { Edit, RefreshCw, Trash2Icon, XCircle, KeyRound, ShieldAlert, CheckCircle } from 'lucide-react'

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
import UpdateUserForm from './Components/UpdateUserForm'
import ResetPasswordForm from './Components/ResetPasswordForm'

export interface UserType {
    id: number;
    name: string;
    email: string;
    whatsapp: string;
    role: string;
    is_active: number;
    status: string;
    created_at: string;
    updated_at: string;
}

const UsersComponent = () => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [meta, setMeta] = useState<Meta>({ last_page: 1, limit: 10, page: 1, total: 0 });
    const [dataStatus, setDataStatus] = useState<'active' | 'trashed'>('active');

    const [usersList, setUsersList] = useState<UserType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'edit' | 'password' | 'delete'>('edit');
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

    const isMounted = useRef(true);

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

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await Get<{ success: boolean; data: UserType[]; meta: Meta }>(`super-admin/users${queryString}`);
            if (isMounted.current && res?.success) {
                setUsersList(res.data);
                setMeta(res.meta);
            }
        } catch (err: any) {
            if (isMounted.current) setError(err?.message || "Gagal mengambil data user");
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, [queryString]);

    // --- HANDLER UPDATE USER ---
    const handleUpdateUser = async (formData: FormData, id: number) => {
        setIsLoading(true);
        try {
            const res = await Post(`super-admin/users/${id}`, formData);
            if (res) {
                fetchUsers();
                handleCloseModal();
                setShowAlert({ type: 'success', message: 'Data User berhasil diupdate!', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal update user: ' + (err?.response?.data?.message || err.message), isOpen: true });
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    };

    // --- HANDLER RESET PASSWORD ---
    const handleResetPassword = async (formData: FormData, id: number) => {
        setIsLoading(true);
        try {
            const res = await Post(`super-admin/users/${id}/reset-password`, formData);
            if (res) {
                handleCloseModal();
                setShowAlert({ type: 'success', message: 'Password berhasil direset!', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal reset password: ' + (err?.response?.data?.message || err.message), isOpen: true });
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Handle Delete / Force Delete
    const onDelete = async (id: number | null) => {
        setIsLoading(true);
        try {
            const endpoint = dataStatus === 'trashed'
                ? `super-admin/users/${id}/force-delete`
                : `super-admin/users/${id}`;

            const res = await Delete(endpoint);
            if (res) {
                fetchUsers();
                handleCloseModal();
                setShowAlert({
                    type: 'success',
                    message: dataStatus === 'trashed' ? 'User dihapus permanen!' : 'User dipindah ke sampah',
                    isOpen: true
                });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal proses data: ' + err.message, isOpen: true });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = async (id: number) => {
        if (!confirm("Pulihkan akun user ini?")) return;
        try {
            const res = await Post(`super-admin/users/${id}/restore`, {});
            if (res) {
                fetchUsers();
                setShowAlert({ type: 'success', message: 'User berhasil dipulihkan!', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal memulihkan: ' + err.message, isOpen: true });
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            if (isMounted.current) setSelectedUser(null);
        }, 300);
    };

    const columns: Column<UserType>[] = useMemo(() => [
        {
            key: "name",
            label: "Pengguna",
            render: (row) => (
                <div className={dataStatus === 'trashed' ? 'opacity-50 grayscale' : ''}>
                    <p className="font-bold text-sm text-slate-800">{row.name}</p>
                    <span className="text-xs text-slate-500">{row.email}</span>
                </div>
            )
        },
        {
            key: "whatsapp",
            label: "WhatsApp",
            render: (row) => <span className="text-xs font-medium text-slate-600">{row.whatsapp || '-'}</span>
        },
        {
            key: "role",
            label: "Role",
            render: (row) => <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold uppercase">{row.role}</span>
        },
        {
            key: "status",
            label: "Akses Akun",
            render: (row) => (
                <div className="flex flex-col gap-1 items-start">
                    {/* Status Akses (Active/Suspend) */}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${row.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {row.status === 'active' ? <CheckCircle size={12} /> : <ShieldAlert size={12} />}
                        {row.status === 'active' ? 'AKTIF' : 'SUSPENDED'}
                    </span>

                    {/* Indikator Verifikasi (Hanya tampilan tambahan) */}
                    {row.is_active === 1 ? (
                        <span className="text-[9px] font-bold text-blue-500">Verified</span>
                    ) : (
                        <span className="text-[9px] font-medium text-slate-400">Unverified</span>
                    )}
                </div>
            )
        },
        {
            key: "actions",
            label: "Aksi",
            align: "center",
            render: (row) => (
                <div className="flex justify-center gap-1">
                    {dataStatus === 'active' ? (
                        <>
                            <button onClick={() => { setSelectedUser(row); setModalType('edit'); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit User">
                                <Edit size={16} />
                            </button>
                            <button onClick={() => { setSelectedUser(row); setModalType('password'); setIsModalOpen(true); }} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Reset Password">
                                <KeyRound size={16} />
                            </button>
                            <button onClick={() => { setSelectedUser(row); setModalType('delete'); setIsModalOpen(true); }} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg" title="Nonaktifkan / Hapus">
                                <Trash2Icon size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => handleRestore(row.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Pulihkan">
                                <RefreshCw size={16} />
                            </button>
                            <button onClick={() => { setSelectedUser(row); setModalType('delete'); setIsModalOpen(true); }} className="p-2 text-rose-700 hover:bg-rose-100 rounded-lg" title="Hapus Permanen">
                                <XCircle size={16} />
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ], [dataStatus]);

    return (
        <SuperAdminLayout page='Kelola Pengguna (Users)'>
            <div className='relative space-y-6'>
                <div className="flex gap-4 border-b border-slate-200 pb-2 mb-4">
                    <button
                        onClick={() => { setDataStatus('active'); setPage(1); }}
                        className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${dataStatus === 'active' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400'}`}
                    >
                        User Aktif
                    </button>
                    <button
                        onClick={() => { setDataStatus('trashed'); setPage(1); }}
                        className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${dataStatus === 'trashed' ? 'border-rose-500 text-rose-600' : 'border-transparent text-slate-400'}`}
                    >
                        Tempat Sampah
                    </button>
                </div>

                <FilterComponent
                    search={search}
                    setSearch={setSearch}
                    dateRangeText="" setDateRangeText={() => { }}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    setPage={setPage}
                    handleReset={() => setSearch("")}
                    setIsModalOpenForm={() => { }} // Tidak ada tombol tambah user baru lewat admin crud ini
                    hiddenAdd={true}
                />

                <div className="mt-6">
                    <DataTable<UserType>
                        data={usersList}
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
                {isModalOpen && selectedUser && (
                    modalType === 'delete' ? (
                        <ModalDelete
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            deleteData={selectedUser}
                            handleDelete={onDelete}
                            isLoading={isLoading}
                        />
                    ) : (
                        <ModalCrud
                            isOpen={isModalOpen}
                            title={modalType === 'edit' ? 'Edit User & Status' : `Reset Password: ${selectedUser.name}`}
                            onClose={handleCloseModal}
                        >
                            {modalType === 'edit' ? (
                                <UpdateUserForm
                                    handleFormSubmit={handleUpdateUser}
                                    data={selectedUser}
                                    loading={isLoading}
                                    setLoading={setIsLoading}
                                    onCancel={handleCloseModal}
                                />
                            ) : (
                                <ResetPasswordForm
                                    handleResetSubmit={handleResetPassword}
                                    data={selectedUser}
                                    loading={isLoading}
                                    setLoading={setIsLoading}
                                    onCancel={handleCloseModal}
                                />
                            )}
                        </ModalCrud>
                    )
                )}

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

export default UsersComponent