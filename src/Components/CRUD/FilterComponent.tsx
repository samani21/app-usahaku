import { Calendar, Plus, Search, Undo2, ChevronDown } from 'lucide-react';
import React, { Dispatch, SetStateAction, useState } from 'react'
import DateRangeModal from './DateRangeModal';

type Props = {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>;
    dateRangeText: string;
    itemsPerPage: number;
    setItemsPerPage: Dispatch<SetStateAction<number>>;
    setPage: Dispatch<SetStateAction<number>>;
    handleReset: () => void;
    setDateRangeText: Dispatch<SetStateAction<string>>;
    setIsModalOpenForm: (value: boolean) => void;
    hiddenAdd?: boolean
}

const FilterComponent = ({
    search,
    setSearch,
    dateRangeText,
    itemsPerPage,
    setItemsPerPage,
    setPage,
    handleReset,
    setDateRangeText,
    setIsModalOpenForm,
    hiddenAdd
}: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4 w-full animate-in fade-in duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                    {/* --- Kolom Pencarian --- */}
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari nama, email, atau peran..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full text-sm font-semibold text-slate-800 pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:font-medium placeholder:text-slate-400"
                        />
                    </div>

                    {/* --- Kumpulan Filter & Aksi --- */}
                    <div className="flex flex-col md:flex-row items-center gap-3">

                        {/* Filter Rentang Tanggal */}
                        <div className="relative w-full md:w-56">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                                <Calendar size={18} />
                            </div>
                            <input
                                readOnly
                                onClick={() => setIsModalOpen(true)}
                                value={dateRangeText}
                                placeholder="Pilih rentang tanggal"
                                className="w-full cursor-pointer text-sm font-semibold text-slate-800 pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 hover:border-emerald-300 focus:border-emerald-500 focus:bg-white rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:font-medium placeholder:text-slate-400"
                            />
                        </div>

                        {/* Dropdown Jumlah Data */}
                        <div className="relative w-full md:w-32">
                            <select
                                value={itemsPerPage}
                                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPage(1) }}
                                className="w-full appearance-none cursor-pointer text-sm font-semibold text-slate-800 pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                            >
                                {[10, 25, 50, 100].map((num) => (
                                    <option key={num} value={num}>{num} Data</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                <ChevronDown size={16} />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* Tombol Reset */}
                            <button
                                onClick={handleReset}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95"
                            >
                                <Undo2 size={18} />
                                <span className="hidden md:inline">Reset</span>
                                <span className="md:hidden">Reset Filter</span>
                            </button>

                            {/* Tombol Tambah */}
                            {!hiddenAdd && (
                                <button
                                    onClick={() => setIsModalOpenForm(true)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
                                >
                                    <Plus size={20} />
                                    Tambah
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Rentang Tanggal */}
            <DateRangeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onApply={(dates) => {
                    if (dates.length === 2) {
                        const start = dates[0].toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                        const end = dates[1].toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                        setDateRangeText(`${start} - ${end}`)
                    } else if (dates.length === 1) {
                        const single = dates[0].toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                        setDateRangeText(single)
                    } else {
                        setDateRangeText('')
                    }
                }}
            />
        </>
    )
}

export default FilterComponent;