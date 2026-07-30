"use client"
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Image as ImageIcon, Video, Type, Trash2, Clock, CheckCircle2, X, UploadCloud, Loader2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import MainLayout from '@/Components/Layout/MainLayout';
import { Post } from '@/utils/Post';
import { AlertType } from '@/types/Alert';
import Alert from '@/Components/Alert';
import { Get } from '@/utils/Get';
import { Delete } from '@/utils/Delete';
import { formatImage } from '@/utils/formatImage';
import ModelCreateOrUpodateStorie from './Components/ModelCreateOrUpodateStorie';

export interface Meta {
    last_page: number;
    limit: number;
    page: number;
    total: number;
}

type Story = {
    id: number;
    business_id: number;
    media_type: 'image' | 'video' | 'text';
    media_path: string | null;
    caption: string | null;
    background_color: string | null;
    expires_at: string;
    created_at: string;
};

const StoryManagementViews = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mediaType, setMediaType] = useState<'image' | 'video' | 'text'>('image');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [bgColor, setBgColor] = useState('#10b981');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- State untuk Modal Hapus ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [storyToDelete, setStoryToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const abortControllerRef = useRef<AbortController | null>(null);

    const loadStories = useCallback(async (pageNumber = 1) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        try {
            const res = await Get<{ success: boolean, data: any, meta: Meta }>(
                `client/stories?page=${pageNumber}`,
                { signal: controller.signal }
            );

            if (res.success) {
                setStories(res.data);
                setMeta(res.meta);
            }
        } catch (error: any) {
            if (error?.isCanceled || error?.name === 'AbortError' || error?.message === 'canceled') return;

            setShowAlert({
                type: 'error',
                message: 'Gagal memuat data story',
                isOpen: true
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (showAlert?.isOpen) {
            timeout = setTimeout(() => {
                setShowAlert(null);
            }, 5000);
        }
        return () => clearTimeout(timeout);
    }, [showAlert]);

    useEffect(() => {
        loadStories(page);
    }, [page, loadStories]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) {
                alert("Maksimal ukuran file 10MB");
                return;
            }
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('media_type', mediaType);
            if (caption) formData.append('caption', caption);

            if (mediaType === 'text') {
                formData.append('background_color', bgColor);
            } else if (file) {
                formData.append('file', file);
            } else {
                alert('Pilih file terlebih dahulu!');
                setIsSubmitting(false);
                return;
            }

            await Post('client/stories', formData);

            setIsModalOpen(false);
            setShowAlert({ type: 'success', message: 'Berhasil membuat story', isOpen: true });
            resetForm();
            setPage(1);
            loadStories(1);
        } catch (error) {
            setShowAlert({ type: 'error', message: 'Gagal membuat story', isOpen: true });
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Handler Baru Untuk Hapus ---
    const handleDeleteClick = (id: number) => {
        setStoryToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!storyToDelete) return;
        
        setIsDeleting(true);
        try {
            await Delete(`client/stories/${storyToDelete}`);

            if (stories.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                loadStories(page);
            }

            setShowAlert({ type: 'success', message: 'Story berhasil dihapus', isOpen: true });
            setIsDeleteModalOpen(false);
            setStoryToDelete(null);
        } catch (error) {
            setShowAlert({ type: 'error', message: 'Gagal menghapus story', isOpen: true });
        } finally {
            setIsDeleting(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setPreviewUrl(null);
        setCaption('');
        setMediaType('image');
        setBgColor('#10b981');
    };

    const isStoryActive = (expiresAt: string) => new Date(expiresAt) > new Date();

    return (
        <MainLayout>
            <div className="w-full space-y-6 animate-in fade-in duration-300">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Manajemen Story</h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Kelola cerita harian untuk pelanggan Anda (aktif 24 jam).</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-all duration-300 active:scale-95 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:-translate-y-1 whitespace-nowrap"
                    >
                        <Plus size={18} strokeWidth={2.5} /> Buat Story Baru
                    </button>
                </div>

                {/* Grid Arsip Story */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm min-h-[400px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Clock size={18} className="text-emerald-500" />
                            <h3 className="font-black text-slate-800 text-lg">Arsip Story</h3>
                        </div>
                        {meta && (
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                                Total: {meta.total} Story
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center min-h-[250px] text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
                            <p className="font-bold text-sm">Memuat Arsip...</p>
                        </div>
                    ) : stories.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center min-h-[250px] text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <ImageIcon size={28} className="text-slate-300" />
                            </div>
                            <h4 className="font-bold text-slate-700 mb-1">Belum Ada Story</h4>
                            <p className="text-xs text-slate-500">Story yang Anda buat akan muncul di sini.</p>
                        </div>
                    ) : (
                        <div className="flex-1">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                {stories.map((story) => {
                                    const active = isStoryActive(story.expires_at);
                                    return (
                                        <div key={story.id} className="group flex flex-col bg-slate-50 rounded-3xl p-3 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden">
                                            {/* Nested Radius: Area Visual */}
                                            <div
                                                className="w-full aspect-[9/16] rounded-2xl overflow-hidden bg-slate-200 relative mb-3 flex items-center justify-center shadow-inner"
                                                style={story.media_type === 'text' ? { backgroundColor: story.background_color || '#10b981' } : {}}
                                            >
                                                {story.media_type === 'text' ? (
                                                    <p className="text-white text-center font-black p-4 text-sm sm:text-base leading-snug drop-shadow-md break-words">
                                                        {story.caption}
                                                    </p>
                                                ) : story.media_type === 'image' ? (
                                                    <img src={formatImage(story.media_path ?? '')} alt="Story" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                                        <video
                                                            src={`${formatImage(story.media_path ?? '')}#t=0.001`}
                                                            className="w-full h-full object-cover rounded-2xl bg-black"
                                                            controls
                                                            preload="metadata"
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                    </div>
                                                )}

                                                {/* Badge Status */}
                                                <div className="absolute top-2 left-2 z-10">
                                                    {active ? (
                                                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[9px] font-extrabold uppercase tracking-widest text-emerald-600 shadow-sm">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 backdrop-blur-sm rounded-full text-[9px] font-extrabold uppercase tracking-widest text-white shadow-sm">
                                                            Arsip
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Detail Bawah */}
                                            <div className="flex-1 flex flex-col justify-between">
                                                <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-3 px-1 leading-relaxed">
                                                    {story.caption || 'Tanpa Keterangan'}
                                                </p>
                                                <button
                                                    onClick={() => handleDeleteClick(story.id)}
                                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white transition-colors active:scale-95"
                                                >
                                                    <Trash2 size={14} /> Hapus
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Pagination UI */}
                            {meta && meta.last_page > 1 && (
                                <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-slate-100">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-2 rounded-full bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-700">
                                            Halaman {page} dari {meta.last_page}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                        disabled={page === meta.last_page}
                                        className="p-2 rounded-full bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {isModalOpen && (
                    <ModelCreateOrUpodateStorie
                        onClose={() => { setIsModalOpen(false); resetForm(); }}
                        handleSubmit={(e) => handleSubmit(e)}
                        navMenu={(type) => {
                            setMediaType(type);
                            setFile(null);
                            setPreviewUrl(null);
                        }}
                        mediaType={mediaType}
                        bgColor={bgColor}
                        caption={caption}
                        file={file}
                        fileInputRef={fileInputRef}
                        handleFileChange={(e) => handleFileChange(e)}
                        isSubmitting={isSubmitting}
                        previewUrl={previewUrl ?? ''}
                        setBgColor={setBgColor}
                        setCaption={setCaption}
                    />
                )}

                {/* --- MODAL KONFIRMASI HAPUS --- */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6 text-center">
                                <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle size={32} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-2">Hapus Story?</h3>
                                <p className="text-sm text-slate-500 mb-6">
                                    Story ini akan dihapus secara permanen dari arsip. Tindakan ini tidak dapat dibatalkan.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsDeleteModalOpen(false);
                                            setStoryToDelete(null);
                                        }}
                                        disabled={isDeleting}
                                        className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={confirmDelete}
                                        disabled={isDeleting}
                                        className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-rose-500/20"
                                    >
                                        {isDeleting ? (
                                            <><Loader2 size={16} className="animate-spin" /> Menghapus...</>
                                        ) : (
                                            'Ya, Hapus'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* ---------------------------------- */}
            </div>
            
            {showAlert?.isOpen && (
                <Alert type={showAlert.type} message={showAlert.message} onClose={() => setShowAlert(null)} />
            )}
        </MainLayout>
    );
};

export default StoryManagementViews;