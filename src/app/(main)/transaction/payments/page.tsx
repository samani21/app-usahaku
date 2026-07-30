"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Meta } from '@/types/Public'
import { Get } from '@/utils/Get'
import { Column } from '@/types/Admin/CRUD'
import { AlertType } from '@/types/Alert'
import { OrderType } from '@/types/Admin/Catalog/Order'
import DataTable from '@/Components/CRUD/DataTable'
import FilterComponent from '@/Components/CRUD/FilterComponent'
import MainLayout from '@/Components/Layout/MainLayout'
import { formatImage } from '@/utils/formatImage'

type Props = {}

interface dataType {
    summary: {
        count: number;
        pending: number;
        processing: number;
        completed: number;
        paid: number;
        unpaid: number;
        expired: number;
        cancelled: number;
    }
    data: OrderType[];
    meta: Meta;
}

const PaymentComponent = (props: Props) => {
    const [search, setSearch] = useState("");
    const [dateRangeText, setDateRangeText] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('');
    const [meta, setMeta] = useState<Meta>({
        last_page: 1,
        limit: 10,
        page: 1,
        total: 0,
    });
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null)

    const [payemnts, setPayments] = useState<OrderType[]>([]);

    // --- STATE UNTUK MODAL BUKTI PEMBAYARAN ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

    // --- EFEK KUNCI SCROLL BACKGROUND ---
    useEffect(() => {
        if (isModalOpen) {
            // Kunci body agar tidak bisa discroll
            document.body.style.overflow = 'hidden';
        } else {
            // Lepas kunci saat modal ditutup
            document.body.style.overflow = 'unset';
        }

        // Cleanup: Pastikan scroll dikembalikan jika user tiba-tiba pindah halaman
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);
    // ------------------------------------

    useEffect(() => {
        setTimeout(() => {
            setShowAlert({
                isOpen: false,
                message: '',
                type: 'success'
            });
        }, 3000)
    }, [showAlert])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 800);

        return () => clearTimeout(handler);
    }, [search]);

    const parsedDate = useMemo(() => {
        if (!dateRangeText.includes(" - ")) return { start_date: "", end_date: "" };

        const monthMap: Record<string, string> = {
            Jan: "01", Feb: "02", Mar: "03", Apr: "04", Mei: "05", Jun: "06",
            Jul: "07", Agt: "08", Agu: "08", Sep: "09", Okt: "10", Nov: "11", Des: "12",
        };

        const formatDate = (dateStr: string) => {
            const [day, month, year] = dateStr.trim().split(" ");
            const formattedMonth = monthMap[month] || "01";
            return `${year}-${formattedMonth}-${day.padStart(2, "0")}`;
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

    const fetchBanks = useCallback(async () => {
        try {
            setLoading(true)
            const res = await Get<{ success: Boolean, data: dataType }>(`client/orders${queryString}`);

            if (res?.success) {
                setPayments(res.data?.data);
                setMeta(res.data?.meta);
                setLoading(false)
            }
        } catch (err: any) {
            // Anti-Error Spam saat Cancel Request
            if (err.isCanceled || err.name === 'AbortError' || err.message === 'canceled') return;

            setError(err?.message)
            setLoading(false)
        }
        setLoading(false)
    }, [queryString]);

    useEffect(() => {
        fetchBanks();
    }, [fetchBanks, page]);

    const handleResetFilter = () => {
        setSearch("");
        setDateRangeText("");
    };

    const columns: Column<OrderType>[] = useMemo(
        () => [
            {
                key: "customer_name",
                label: "Nama Pelanggan",
                render: (row) => row?.customer_name || row?.user?.name || '-'
            },
            {
                key: "phone_number",
                label: "Nomor Handphone",
                render: (row) => row?.phone_number || row?.user?.whatsapp || '-'
            },
            {
                key: "payment_method",
                label: "Jenis Pembayaran",
            },
            {
                key: "grand_total",
                label: "Total Pembayaran",
                render: (row) => `Rp ${Number(row.grand_total).toLocaleString("id-ID")}`,
            },
            {
                key: "payment_proof",
                label: "Bukti Pembayaran",
                render: (row) => {
                    if (!row?.payment_proof) {
                        return <span className="text-xs text-slate-400 italic">Tidak ada bukti</span>;
                    }

                    return (
                        <button
                            onClick={() => {
                                setSelectedOrder(row);
                                setIsModalOpen(true);
                            }}
                            className="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
                        >
                            Lihat Bukti
                        </button>
                    );
                },
            },
            {
                key: "payment_status",
                label: "Status Pembayaran",
            },
        ],
        []
    );

    return (
        <MainLayout page='Transaksi Pesanan'>
            <div className='relative'>
                <FilterComponent
                    search={search}
                    setSearch={setSearch}
                    dateRangeText={dateRangeText}
                    setDateRangeText={setDateRangeText}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    setPage={setPage}
                    handleReset={handleResetFilter}
                    setIsModalOpenForm={() => { }}
                    hiddenAdd={true}
                />

                <div className="mt-6">
                    <DataTable<OrderType>
                        data={payemnts}
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

                {/* --- MODAL BUKTI PEMBAYARAN --- */}
                {isModalOpen && selectedOrder && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                            {/* Header Modal */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                <h3 className="font-bold text-slate-800 text-lg">Bukti Pembayaran</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-colors p-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>

                            {/* Konten Modal */}
                            <div className="p-6 flex flex-col items-center gap-5">
                                {/* Gambar Bukti */}
                                <div className="w-full bg-slate-50 rounded-2xl p-2 border border-slate-100 flex items-center justify-center min-h-[250px]">
                                    <img
                                        src={formatImage(selectedOrder.payment_proof)}
                                        alt="Bukti Transfer"
                                        className="max-w-full max-h-[350px] object-contain rounded-xl shadow-sm"
                                    />
                                </div>

                                {/* Info Tanggal Approve */}
                                <div className="w-full bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                                    <p className="text-xs text-slate-500 font-medium mb-1">Disetujui Pada (Approve At):</p>
                                    <p className="text-sm font-bold text-slate-700">
                                        {selectedOrder.approve_at
                                            ? new Date(selectedOrder.approve_at).toLocaleString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                timeZoneName: 'short' // Ini yang bikin otomatis muncul WIB/WITA/WIT
                                            })
                                            : <span className="text-amber-500 italic">Belum disetujui / Menunggu</span>
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* ------------------------------ */}

            </div>
        </MainLayout>
    )
}

export default PaymentComponent