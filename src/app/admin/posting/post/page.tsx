"use client"
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import {
    Search,
    Store,
    ShoppingBag,
    Plus,
    Calendar,
    ThumbsUp,
    Zap,
    FileText,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Heart,
    MessageCircle
} from 'lucide-react';
import MainLayout from '@/Components/Layout/MainLayout';
import CreateOrUpdatePostView from './Components/CreateOrUpdatePostView';
import Loading from '@/Components/Loading';
import { Get } from '@/utils/Get';
import { Delete } from '@/utils/Delete';
import { PostsType } from './Components/type';
import { formatImage } from '@/utils/formatImage';
import { Meta } from '@/types/Public';
import ModalDelete from '@/Components/CRUD/ModalDelete';
import Alert from '@/Components/Alert';
import { AlertType } from '@/types/Alert';
import { Icon } from '@iconify/react';

const PostListView = () => {
    // --- STATE DATA & UI ---
    const [loading, setLoading] = useState<boolean>(true);
    const [posts, setPosts] = useState<PostsType[]>([]);
    const [openAddPost, setOpenAddPost] = useState<boolean>(false);
    const [editPost, setEditPost] = useState<PostsType | null>(null);

    // --- STATE FILTER & SEARCH ---
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'semua' | 'promo' | 'informasi'>('semua');

    // --- STATE PAGINATION ---
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [meta, setMeta] = useState<Meta>({ last_page: 1, limit: 10, page: 1, total: 0 });

    // --- STATE MODAL & ALERT ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteData, setDeleteData] = useState<PostsType | null>(null);
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    // --- REF UNTUK RACE CONDITION PREVENTION ---
    const fetchIdRef = useRef(0);

    // ==========================================
    // EFFECTS & HELPERS
    // ==========================================

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    // 1. Debounce Search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 800);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // 2. Reset Page ke 1 jika filter berubah
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, activeTab]);

    // 3. Query String Builder
    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (debouncedSearch.trim()) {
            params.append("search", debouncedSearch);
        }

        if (activeTab === 'promo') params.append("is_promo", "1");
        if (activeTab === 'informasi') params.append("is_promo", "0");

        return `?${params.toString()}`;
    }, [page, limit, debouncedSearch, activeTab]);

    // 4. Fetch Data API (Dilengkapi Anti Race-Condition)
    const getPosts = useCallback(async () => {
        // Increment Fetch ID untuk menandai request terbaru
        const currentFetchId = ++fetchIdRef.current;

        setLoading(true);
        try {
            const res = await Get<{ success: boolean, data: PostsType[], meta: Meta }>(`client/posts${queryString}`);

            // Fallback: Jika ada request baru yang masuk saat ini sedang berjalan, abaikan hasil ini
            if (currentFetchId !== fetchIdRef.current) return;

            if (res?.success) {
                setPosts(res?.data || []);
                if (res?.meta) setMeta(res.meta);
            }
        } catch (e: any) {
            if (currentFetchId !== fetchIdRef.current) return;
            console.error("Gagal mengambil data posts:", e);
            setShowAlert({ type: 'error', message: 'Gagal memuat data, periksa koneksi Anda.', isOpen: true });
        } finally {
            if (currentFetchId === fetchIdRef.current) {
                setLoading(false);
            }
        }
    }, [queryString]);

    useEffect(() => {
        getPosts();
    }, [getPosts]);

    // ==========================================
    // ACTION HANDLERS
    // ==========================================

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setDeleteData(null), 300);
    };

    const onDelete = async (id: number | null) => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await Delete(`client/posts/${id}`);
            if (res) {
                getPosts();
                handleCloseModal();
                setShowAlert({ type: 'success', message: 'Postingan berhasil dihapus', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal menghapus data: ' + err.message, isOpen: true });
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // RENDER
    // ==========================================
    if (openAddPost) {
        return <CreateOrUpdatePostView onClose={() => { setOpenAddPost(false); setEditPost(null); getPosts(); }} editPost={editPost} />
    }

    return (
        <MainLayout>
            <div className="w-full animate-in fade-in duration-300 pb-12">

                {/* --- HEADER UTAMA & TOMBOL AKSI --- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Postingan Anda</h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Kelola promosi, pengumuman, dan katalog produk yang tampil di aplikasi pelanggan.</p>
                    </div>
                    <button onClick={() => setOpenAddPost(true)} className="flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-lg shadow-emerald-500/25 transition-all active:scale-95 hover:-translate-y-0.5 shrink-0">
                        <Plus size={16} strokeWidth={3} />
                        Buat Postingan Baru
                    </button>
                </div>

                {/* --- KARTU MINI STATISTIK (METRICS) - REFACTORED KE 2 KOLOM --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">Total Konten</p>
                            <h3 className="text-xl font-black text-slate-800 mt-0.5">{meta.total} Post</h3>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <Zap size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">Promo Sedang Aktif</p>
                            <h3 className="text-xl font-black text-slate-800 mt-0.5">{posts.filter(p => p.is_promo).length} di Halaman ini</h3>
                        </div>
                    </div>
                </div>

                {/* --- FILTER & SEARCH BAR BAR --- */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm mb-6">
                    {/* Tabs Kapsul */}
                    <div className="flex bg-slate-50 p-1.5 rounded-full w-full md:w-fit overflow-x-auto custom-scrollbar">
                        <button
                            onClick={() => setActiveTab('semua')}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'semua' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => setActiveTab('promo')}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'promo' ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <Zap size={12} /> Hanya Promo
                        </button>
                        <button
                            onClick={() => setActiveTab('informasi')}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeTab === 'informasi' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            Bukan Promo
                        </button>
                    </div>

                    {/* Kolom Pencarian */}
                    <div className="relative w-full md:w-80">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari kata kunci di caption..."
                            className="w-full text-xs font-bold text-slate-800 pl-11 pr-4 py-3 bg-slate-50 border border-transparent focus:border-slate-200 focus:bg-white rounded-full outline-none transition-all"
                        />
                    </div>
                </div>

                {/* --- FEED GRID / DAFTAR POSTINGAN --- */}
                {loading ? (
                    <div className="min-h-[40vh] flex items-center justify-center">
                        <Loading />
                    </div>
                ) : posts.length > 0 ? (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {posts.map((post) => {
                                const date = new Date(post.created_at);
                                const formattedDate = date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
                                return (
                                    <div key={post.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-slate-200 hover:shadow-md transition-all duration-300">

                                        {/* Bagian Atas: Info Toko */}
                                        <div>
                                            <div className="flex items-center justify-between p-5">
                                                <div className="flex items-center gap-3">
                                                    <img src={formatImage(post.business?.logo_url)} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-100 bg-slate-50" />
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-900 leading-none">{post.business?.name || 'Toko Anda'}</h4>
                                                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 font-bold">
                                                            <Calendar size={12} />
                                                            <span>{formattedDate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bagian Tengah: Caption Teks */}
                                            <div className="px-5 pb-3">
                                                <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                                                    {post.caption}
                                                </p>
                                            </div>

                                            {/* Gambar Konten Utama */}
                                            {post.media && (
                                                <div className="px-3">
                                                    <div className="w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden relative">
                                                        {post?.media_type === 'video' ? (
                                                            <video
                                                                src={formatImage(post?.media)}
                                                                controls
                                                                playsInline
                                                                className="w-full h-full object-cover rounded-3xl bg-slate-900"
                                                            />
                                                        ) : (
                                                            <img src={formatImage(post.media)} alt="Post content" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        )}

                                                        {post.is_promo && (
                                                            <div className="absolute top-3 left-3 bg-rose-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md">
                                                                Active Promo
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Produk Terkait (Jika Ada) */}
                                            {post.products && post.products.length > 0 && (
                                                <div className="p-4 mt-2">
                                                    <div className="flex items-center gap-1.5 mb-2.5 px-1">
                                                        <ShoppingBag size={12} className="text-emerald-500" />
                                                        <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">Tautan Produk ({post.products.length})</span>
                                                    </div>
                                                    <div className="flex gap-2.5 overflow-x-auto custom-scrollbar pb-1 px-1">
                                                        {post.products.map((prod) => {
                                                            return (
                                                                <div key={prod.id} className="min-w-[140px] max-w-[140px] bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex-shrink-0 relative group">
                                                                    {prod.promo_value && (
                                                                        <div className="absolute top-2 left-2 z-10 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                                                                            Promo
                                                                        </div>
                                                                    )}
                                                                    <div className="w-full p-1.5">
                                                                        <div className="w-full aspect-[4/3] bg-slate-100 relative rounded-xl overflow-hidden">
                                                                            {prod?.image.startsWith('usahaku') ? (
                                                                                <img src={formatImage(prod.image)} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                            ) : (
                                                                                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                                                                    <Icon icon={prod?.image || 'mynaui:image'} className="w-8 h-8 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="px-2.5 pb-3 pt-1">
                                                                        <h5 className="text-[12px] font-black text-slate-800 line-clamp-2 leading-tight min-h-[34px]">
                                                                            {prod.name}
                                                                        </h5>
                                                                        <div className="mt-1.5">
                                                                            {prod.promo_value && (
                                                                                <p className="text-[9px] font-bold text-slate-400 line-through decoration-rose-500/50 mb-0.5">
                                                                                    {formatRupiah(prod.price)}
                                                                                </p>
                                                                            )}
                                                                            <p className="text-[13px] font-black text-emerald-600">
                                                                                {formatRupiah(prod.final_price)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Bagian Bawah: Statistik & Tombol Aksi */}
                                        <div className="border-t border-slate-50 p-4 bg-slate-50/30 flex items-center justify-between rounded-b-[2rem]">
                                            <div className="flex items-center gap-3 text-slate-400 font-bold text-xs">
                                                <span className="flex items-center gap-1"><Heart size={14} /> {post.likes || 0}</span>
                                                <span className="flex items-center gap-1"><MessageCircle size={13} /> {post.comments || 0}</span>
                                            </div>

                                            {/* Tombol Hapus & Edit */}
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => {
                                                    setEditPost(post)
                                                    setOpenAddPost(true)
                                                }} className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 font-bold text-xs rounded-full transition-all flex items-center gap-1 active:scale-95">
                                                    <Edit3 size={12} /> <span className="hidden sm:inline">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setDeleteData(post);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="px-3.5 py-1.5 bg-white border border-transparent hover:bg-rose-50 text-rose-500 font-bold text-xs rounded-full transition-all flex items-center gap-1 active:scale-95"
                                                >
                                                    <Trash2 size={12} /> Hapus
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                )
                            })}
                        </div>

                        {/* --- PAGINATION CONTROL --- */}
                        {meta.last_page > 1 && (
                            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm mt-8">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    <ChevronLeft size={16} /> Sebelumnya
                                </button>

                                <span className="text-sm font-bold text-slate-700">
                                    Halaman {meta.page} <span className="text-slate-400 font-medium">dari {meta.last_page}</span>
                                </span>

                                <button
                                    onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                    disabled={page === meta.last_page}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    Selanjutnya <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // Tampilan Jika Kosong
                    <div className="text-center py-20 bg-white border border-slate-100 rounded-[2rem] shadow-sm mt-4">
                        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText size={28} />
                        </div>
                        <h4 className="text-sm font-black text-slate-700">Postingan Tidak Ditemukan</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto font-medium">Coba ubah kata kunci pencarian Anda atau ganti kategori filter yang Anda gunakan.</p>
                    </div>
                )}
            </div>

            {/* --- MULTIPLE MODAL HANDLER --- */}
            {deleteData && (
                <ModalDelete
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    deleteData={deleteData}
                    handleDelete={onDelete}
                />
            )}

            {showAlert?.isOpen && (
                <Alert
                    type={showAlert.type}
                    message={showAlert.message}
                    onClose={() => setShowAlert(null)}
                />
            )}
        </MainLayout>
    );
};

export default PostListView;