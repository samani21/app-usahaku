import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Align = "left" | "center" | "right";

interface Column<T> {
    key: keyof T | string;
    label: string;
    width?: string;
    align?: Align;
    render?: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    page?: number;
    itemsPerPage?: number;
    total?: number;
    onPageChange?: (page: number) => void;
    loading?: boolean;
    error?: string;
    rowKey?: (row: T, index: number) => React.Key;
    emptyMessage?: string;
}

const alignClass: Record<Align, string> = {
    left: "text-left justify-start",
    center: "text-center justify-center",
    right: "text-right justify-end",
};

const SkeletonCell = () => (
    <div className="h-4 bg-slate-200/70 rounded-full animate-pulse w-3/4" />
);

// FUNGSI BARU: Logic Pagination Pintar (Ellipsis)
const getPaginationGroup = (currentPage: number, lastPage: number) => {
    if (lastPage <= 7) return Array.from({ length: lastPage }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', lastPage - 1, lastPage];
    if (currentPage >= lastPage - 2) return [1, 2, '...', lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage];
};

export default function DataTable<T>({
    data,
    columns,
    page = 1,
    itemsPerPage = 10,
    total,
    onPageChange,
    loading = false,
    error,
    rowKey,
    emptyMessage = "Tidak ada data",
}: DataTableProps<T>) {
    const isPaginated = total !== undefined && onPageChange;
    const totalPages = isPaginated
        ? Math.ceil((total ?? 0) / itemsPerPage)
        : 1;

    const from = (page - 1) * itemsPerPage + 1;
    const to = isPaginated
        ? Math.min(page * itemsPerPage, total!)
        : data.length;

    return (
        // Mengubah wrapper agar di mobile tidak ada border kotak besar, pindah ke masing-masing card
        <div className="md:bg-white md:rounded-3xl md:border md:border-slate-100 md:shadow-sm md:shadow-emerald-500/5 overflow-hidden animate-in fade-in duration-300">
            <div className="overflow-x-auto">
                {/* table diubah jadi flex column di mobile */}
                <table className="w-full text-left border-collapse flex flex-col md:table gap-4 md:gap-0">
                    {/* Thead disembunyikan di Mobile */}
                    <thead className="hidden md:table-header-group">
                        <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider select-none">
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className={`px-6 py-5 cursor-default transition-colors ${col.align ? alignClass[col.align].split(' ')[0] : 'text-left'}`}
                                    style={{ width: col.width }}
                                >
                                    <div className={`flex items-center gap-1 ${col.align ? alignClass[col.align].split(' ')[1] : 'justify-start'}`}>
                                        {col.label}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {/* Tbody jadi flex column dengan gap di mobile */}
                    <tbody className="flex flex-col md:table-row-group gap-4 md:gap-0 md:divide-y md:divide-slate-100 text-sm font-medium text-slate-600">
                        {error ? (
                            <tr className="block md:table-row">
                                <td colSpan={columns.length} className="px-6 py-16 text-center text-rose-500 bg-rose-50/30 rounded-2xl md:rounded-none">
                                    {error}
                                </td>
                            </tr>
                        ) : loading ? (
                            [...Array(itemsPerPage)].map((_, i) => (
                                // tr diubah jadi card style di mobile
                                <tr key={i} className="flex flex-col md:table-row bg-white border border-slate-100 md:border-0 rounded-2xl md:rounded-none p-4 md:p-0 shadow-sm md:shadow-none">
                                    {columns.map((col, j) => (
                                        // td diubah jadi flex row (Label : Skeleton) di mobile
                                        <td key={j} className="flex justify-between items-center md:table-cell px-1 py-3 md:px-6 md:py-5 border-b border-slate-50 md:border-0 last:border-0">
                                            <span className="md:hidden text-xs font-bold text-slate-400">{col.label}</span>
                                            <SkeletonCell />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr className="block md:table-row">
                                <td colSpan={columns?.length} className="px-6 py-16 text-center text-slate-400 bg-white rounded-2xl md:rounded-none border border-slate-100 md:border-0">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                // tr diubah jadi card style di mobile
                                <tr
                                    key={rowKey ? rowKey(row, index) : index}
                                    className="flex flex-col md:table-row bg-white border border-slate-100 md:border-0 rounded-2xl md:rounded-none p-4 md:p-0 hover:bg-emerald-50/30 transition-colors duration-200 group shadow-sm md:shadow-none"
                                >
                                    {columns.map((col, id) => (
                                        // td diubah jadi flex row (Label : Konten) di mobile
                                        <td
                                            key={id}
                                            className={`flex items-center justify-between md:table-cell px-2 py-3 md:px-6 md:py-4 border-b border-slate-100 md:border-0 last:border-0 ${col.align ? alignClass[col.align].split(' ')[0] : 'text-left'}`}
                                        >
                                            {/* Label kolom (Hanya muncul di Mobile) */}
                                            <span className="md:hidden text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                {col.label}
                                            </span>

                                            {/* Konten (Di mobile otomatis rata kanan) */}
                                            <div className={`flex items-center gap-3 ${col.align ? alignClass[col.align].split(' ')[1] : 'justify-start'} text-right md:text-left`}>
                                                <div className="text-slate-700 group-hover:text-emerald-700 transition-colors text-right md:text-left w-full">
                                                    {col.render
                                                        ? col.render(row, index)
                                                        : (row as any)[col.key]}
                                                </div>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="bg-white md:bg-transparent px-6 py-5 border-t border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-4 rounded-b-3xl mt-4 md:mt-0">
                {/* Total Indicator */}
                <span className="text-sm font-medium text-slate-400 text-center lg:text-left">
                    Menampilkan <span className="font-bold text-slate-700">{from}</span> hingga{' '}
                    <span className="font-bold text-slate-700">{to}</span>{' '}
                    dari <span className="font-bold text-slate-700">{total}</span> data
                </span>

                {/* Pagination Controls */}
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    <button
                        disabled={page === 1}
                        onClick={() => onPageChange?.(Math.max(1, page - 1))}
                        className="p-2 h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-slate-200 transition-all active:scale-95 shadow-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Menerapkan Logic Pagination Pintar */}
                    {getPaginationGroup(page, totalPages).map((item, index) => (
                        item === '...' ? (
                            <span key={`dots-${index}`} className="w-9 h-9 flex items-center justify-center text-xs font-bold text-slate-400">
                                ...
                            </span>
                        ) : (
                            <button
                                key={`page-${item}`}
                                onClick={() => onPageChange?.(Number(item))}
                                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center ${page === item
                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 border border-emerald-500'
                                    : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-sm'
                                    }`}
                            >
                                {item}
                            </button>
                        )
                    ))}

                    <button
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
                        className="p-2 h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-slate-200 transition-all active:scale-95 shadow-sm"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}