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
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm shadow-emerald-500/5 overflow-hidden animate-in fade-in duration-300">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
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
                    <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-600">
                        {error ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-16 text-center text-rose-500 bg-rose-50/30"
                                >
                                    {error}
                                </td>
                            </tr>
                        ) : loading ? (
                            [...Array(itemsPerPage)].map((_, i) => (
                                <tr key={i}>
                                    {columns.map((_, j) => (
                                        <td key={j} className="px-6 py-5">
                                            <SkeletonCell />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns?.length}
                                    className="px-6 py-16 text-center text-slate-400"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr
                                    key={rowKey ? rowKey(row, index) : index}
                                    className="hover:bg-emerald-50/30 transition-colors duration-200 group"
                                >
                                    {columns.map((col, id) => (
                                        <td
                                            key={id}
                                            className={`px-6 py-4 ${col.align ? alignClass[col.align].split(' ')[0] : 'text-left'}`}
                                        >
                                            <div className={`flex items-center gap-3 ${col.align ? alignClass[col.align].split(' ')[1] : 'justify-start'}`}>
                                                <div className="text-slate-700 group-hover:text-emerald-700 transition-colors">
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
            <div className="bg-white px-6 py-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Total Indicator */}
                <span className="text-sm font-medium text-slate-400">
                    Menampilkan <span className="font-bold text-slate-700">{from}</span> hingga{' '}
                    <span className="font-bold text-slate-700">{to}</span>{' '}
                    dari <span className="font-bold text-slate-700">{total}</span> data
                </span>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => onPageChange?.(Math.max(1, page - 1))}
                        className="p-2 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-slate-200 transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => onPageChange?.(Math.min(totalPages, i + 1))}
                                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center ${page === i + 1
                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 border border-emerald-500'
                                    : 'border border-transparent bg-transparent hover:bg-slate-100 text-slate-600'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
                        className="p-2 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-slate-200 transition-all active:scale-95"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}