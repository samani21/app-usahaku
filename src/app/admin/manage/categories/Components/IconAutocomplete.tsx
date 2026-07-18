'use client'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { formatImage } from '@/utils/formatImage'

type Props = {
    value?: string
    onChange?: (val: string) => void
    prefix?: string;
    handleDelete: () => void;
}

export default function IconAutocomplete({
    value = '',
    onChange,
    prefix = '', // Dibuat string kosong default agar bisa cari semua, atau isi 'mdi' kalau mau dilimit
    handleDelete
}: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null)

    const [search, setSearch] = useState('')
    const [filtered, setFiltered] = useState<string[]>([])
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // 🔹 SEARCH via API
    useEffect(() => {
        const delay = setTimeout(async () => {
            if (!search.trim()) {
                setFiltered([])
                return
            }

            setLoading(true)

            try {
                // Tambahkan parameter limit biar dropdown gak ngelag & prefix jika ada
                const url = new URL('https://api.iconify.design/search')
                url.searchParams.set('query', search)
                url.searchParams.set('limit', '50')
                if (prefix) url.searchParams.set('prefix', prefix)

                const res = await fetch(url.toString())
                const data = await res.json()

                setFiltered(data.icons || [])
            } catch (err) {
                console.error("Gagal mengambil data icon:", err)
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(delay)
    }, [search, prefix])

    // 🔥 CLICK OUTSIDE HANDLER
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="flex flex-col gap-2">
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                    Pilih Icon
                </label>

                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onFocus={() => setOpen(true)}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setOpen(true)
                        }}
                        placeholder="Ketik nama icon (misal: home, user...)"
                        className="w-full px-4 py-3 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 bg-slate-50 hover:bg-white text-slate-800 transition-all duration-200 placeholder:text-slate-400 placeholder:font-medium"
                    />

                    {/* Indikator Loading di dalam Input */}
                    {loading && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>

                {/* State Jika Icon Sudah Terpilih */}
                {value && (
                    <div className='flex items-center justify-between p-3 mt-1 bg-emerald-50 border border-emerald-100 rounded-xl'>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-emerald-600">
                                {
                                    value?.startsWith('usahaku') ? <img src={formatImage(value)} /> :
                                        <Icon icon={value} width={20} />
                                }
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-widest">Icon Aktif</p>
                                <p className="text-sm font-bold text-slate-700 leading-none mt-0.5">{!value?.startsWith('usahaku') && value}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className='px-3 py-1.5 text-xs font-bold text-rose-500 hover:text-white hover:bg-rose-500 bg-white rounded-lg transition-all shadow-sm'
                            onClick={() => {
                                handleDelete()
                                setSearch('') // Reset search bar saat dihapus
                            }}
                        >
                            Hapus
                        </button>
                    </div>
                )}
            </div>

            {/* DROPDOWN */}
            {open && search.trim() && (
                <div className="absolute z-50 w-full bg-white border border-slate-100 rounded-xl mt-2 max-h-56 overflow-y-auto shadow-xl shadow-slate-200/50 custom-scrollbar">

                    {!loading && filtered.length === 0 && (
                        <div className="p-6 text-center">
                            <p className="text-sm font-bold text-slate-700">Icon tidak ditemukan</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">Coba gunakan kata kunci bahasa Inggris yang lain.</p>
                        </div>
                    )}

                    <div className="p-1.5">
                        {filtered.map((icon) => (
                            <button
                                key={icon}
                                type="button"
                                onClick={() => {
                                    onChange?.(icon)
                                    setSearch(icon)
                                    setOpen(false)
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors text-left group"
                            >
                                <div className="w-8 h-8 rounded-md bg-slate-100 group-hover:bg-white group-hover:shadow-sm flex items-center justify-center text-slate-600 group-hover:text-emerald-600 transition-all shrink-0">
                                    <Icon icon={icon} width={20} />
                                </div>
                                <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-800 truncate">{icon}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}