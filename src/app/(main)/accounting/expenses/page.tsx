"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Edit, Trash2Icon, Receipt } from "lucide-react";

import { OutletsType } from "@/types/Admin/OutletType";
import { Meta } from "@/types/Public";
import { AlertType } from "@/types/Alert";
import { Column } from "@/types/Admin/CRUD";

import { Delete } from "@/utils/Delete";
import { Get } from "@/utils/Get";
import { Post } from "@/utils/Post";

import GlassCard from "@/Components/Layout/GlassCard";
import FilterComponent from "@/Components/CRUD/FilterComponent";
import DataTable from "@/Components/CRUD/DataTable";
import ModalDelete from "@/Components/CRUD/ModalDelete";
import ModalCrud from "@/Components/CRUD/ModalCrud";
import Alert from "@/Components/Alert";
import { ExpensesType } from "./Components/type";
import ExpenseFormModalContent from "./Components/ExpenseFormModalContent";
import MainLayout from "@/Components/Layout/MainLayout";


interface ExpenseResponse {
    data: ExpensesType[];
}

export default function ExpenseActive() {
    // --- FILTER & PAGINATION STATE ---
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [dateRangeText, setDateRangeText] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectOutlet, setSelectOutlet] = useState<string>('Semua');
    const [meta, setMeta] = useState<Meta>({ last_page: 1, limit: 10, page: 1, total: 0 });

    // --- DATA & UI STATE ---
    const [expenses, setExpenses] = useState<ExpensesType[]>([]);
    const [outlets, setOutlets] = useState<OutletsType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<ExpensesType | null>(null);
    const [deleteData, setDeleteData] = useState<ExpensesType | null>(null);

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
    }, [debouncedSearch, dateRangeText, itemsPerPage, selectOutlet]);

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

        // Ambil ID outlet berdasarkan nama yang dipilih
        if (selectOutlet !== 'Semua') {
            const selectedOpt = outlets.find(o => o.name === selectOutlet);
            if (selectedOpt) params.append("outlet_id", String(selectedOpt.id));
        }

        return `?${params.toString()}`;
    }, [parsedDate, page, debouncedSearch, itemsPerPage, selectOutlet, outlets]);

    // ==========================================
    // API ACTIONS
    // ==========================================
    const fetchOutlets = useCallback(async () => {
        try {
            const res = await Get<{ success: boolean; data: OutletsType[] }>('client/outlet');
            if (res?.success) setOutlets(res.data);
        } catch (err) {
            console.error("Gagal load outlet");
        }
    }, []);

    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await Get<{ success: boolean; data: ExpensesType[]; meta: Meta }>(`client/expenses${queryString}`);
            if (res?.success) {
                setExpenses(res.data);
                setMeta(res.meta);
            }
        } catch (err: any) {
            setError(err?.message || "Gagal mengambil data");
        } finally {
            setLoading(false);
        }
    }, [queryString]);

    useEffect(() => {
        fetchOutlets();
    }, [fetchOutlets]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const handleFormSubmit = async (formData: FormData, id: number | null) => {
        setLoading(true);
        try {
            const endpoint = id ? `client/expenses/${id}` : 'client/expenses';
            const res = await Post(endpoint, formData);

            if (res) {
                fetchExpenses();
                handleCloseModal();
                setShowAlert({ type: 'success', message: id ? 'Data pengeluaran berhasil diubah' : 'Pengeluaran baru berhasil dicatat', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal proses data: ' + err.message, isOpen: true });
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (id: number | null) => {
        setLoading(true);
        try {
            const res = await Delete(`client/expenses/${id}`);
            if (res) {
                fetchExpenses();
                handleCloseModal();
                setShowAlert({ type: 'success', message: 'Data pengeluaran berhasil dihapus', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal hapus data: ' + err.message, isOpen: true });
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
        setSelectOutlet("Semua");
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setDataUpdate(null);
            setDeleteData(null);
        }, 300);
    };

    const handleEdit = useCallback((row: ExpensesType) => {
        setDataUpdate(row);
        setIsModalOpen(true);
    }, []);

    const handleDelete = useCallback((row: ExpensesType) => {
        setDeleteData(row);
        setIsModalOpen(true);
    }, []);

    // ==========================================
    // TABLE COLUMNS CONFIG (Desktop)
    // ==========================================
    const columns: Column<ExpensesType>[] = useMemo(() => [
        {
            key: "expense_date",
            label: "Tanggal",
            width: "120px",
            render: (row) => <span className="font-semibold text-slate-700">{row.expense_date}</span>
        },
        {
            key: "category",
            label: "Kategori & Cabang",
            render: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{row.category}</span>
                    <span className="text-xs text-slate-500 mt-0.5">{row.outlet?.name || "Pusat / Semua Cabang"}</span>
                </div>
            )
        },
        {
            key: "notes",
            label: "Catatan",
            render: (row) => <span className="text-sm text-slate-600 line-clamp-2">{row.notes || "-"}</span>
        },
        {
            key: "amount",
            label: "Nominal (Rp)",
            align: "right",
            width: "150px",
            render: (row) => <span className="font-bold text-rose-600">Rp {row.amount.toLocaleString("id-ID")}</span>,
        },
        {
            key: "actions",
            label: "Aksi",
            align: "center",
            width: "100px",
            render: (row) => (
                <div className="flex justify-center gap-2">
                    <button onClick={() => handleEdit(row)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(row)} className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus">
                        <Trash2Icon size={18} />
                    </button>
                </div>
            ),
        },
    ], [handleEdit, handleDelete]);

    return (
        <MainLayout page="Buku Pengeluaran">
            <div className="space-y-6">
                {/* COMPONENT FILTER */}
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

                {/* KATEGORI OUTLET FILTER (Pill Button) */}
                <GlassCard className="p-3 w-full">
                    <div className="flex items-center gap-2 overflow-x-auto text-slate-600 [&::-webkit-scrollbar]:hidden">
                        <button
                            onClick={() => setSelectOutlet("Semua")}
                            className={`ml-2 whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-in-out flex-shrink-0 ${selectOutlet === 'Semua'
                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30 scale-105'
                                : 'bg-transparent hover:bg-rose-50 hover:text-rose-700'
                                }`}
                        >
                            Semua Outlet
                        </button>

                        {outlets?.map((o, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectOutlet(o?.name)}
                                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-in-out flex-shrink-0 ${selectOutlet === o?.name
                                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30 scale-105'
                                    : 'bg-transparent hover:bg-rose-50 hover:text-rose-700 border border-transparent hover:border-rose-100'
                                    }`}
                            >
                                {o?.name}
                            </button>
                        ))}
                    </div>
                </GlassCard>

                <div className="mt-6">
                    {/* 1. TAMPILAN MOBILE (CARDS) */}
                    <div className="block md:hidden space-y-4">
                        {loading ? (
                            <div className="text-center py-6 text-slate-500 font-semibold animate-pulse">Memuat data...</div>
                        ) : expenses.length === 0 ? (
                            <div className="text-center py-6 text-slate-500 font-semibold">Tidak ada catatan pengeluaran</div>
                        ) : (
                            expenses.map((row) => (
                                <GlassCard key={row.id} className="p-4 flex flex-col gap-3 border-l-4 border-l-rose-500">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-rose-50 rounded-lg text-rose-500">
                                                <Receipt size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-sm">{row.category}</h3>
                                                <p className="text-[11px] text-slate-500">{row.expense_date}</p>
                                            </div>
                                        </div>
                                        <span className="font-black text-rose-600 text-sm">Rp {row.amount.toLocaleString("id-ID")}</span>
                                    </div>

                                    {row.notes && (
                                        <div className="bg-slate-50 p-2 rounded-lg text-xs text-slate-600 border border-slate-100">
                                            {row.notes}
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-1">
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                                            {row.outlet?.name || "Pusat"}
                                        </span>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEdit(row)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(row)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus">
                                                <Trash2Icon size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))
                        )}
                    </div>

                    {/* 2. TAMPILAN DESKTOP (TABLE) */}
                    <div className="hidden md:block">
                        <DataTable
                            data={expenses}
                            columns={columns}
                            page={page}
                            itemsPerPage={itemsPerPage}
                            total={meta.total}
                            onPageChange={setPage}
                            loading={loading}
                            error={error}
                        />
                    </div>
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
                        title={dataUpdate ? "Edit Pengeluaran" : "Catat Pengeluaran Baru"}
                        onClose={handleCloseModal}
                    >
                        <ExpenseFormModalContent
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            onSubmit={handleFormSubmit}
                            dataUpdate={dataUpdate}
                            outlets={outlets}
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
        </MainLayout>
    );
}