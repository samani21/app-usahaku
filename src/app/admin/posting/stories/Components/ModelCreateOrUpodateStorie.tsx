import { CheckCircle2, ImageIcon, Loader2, Type, UploadCloud, Video, X } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react'

type Props = {
    onClose: () => void;
    handleSubmit: (e: any) => void;
    navMenu: (type: 'image' | 'video' | 'text') => void;
    mediaType: 'image' | 'video' | 'text';
    file: File | null;
    fileInputRef: any;
    previewUrl: string;
    handleFileChange: (e: any) => void;
    setBgColor: Dispatch<SetStateAction<string>>;
    bgColor: string;
    caption: string;
    setCaption: Dispatch<SetStateAction<string>>;
    isSubmitting: boolean
}

const ModelCreateOrUpodateStorie = ({ onClose, handleSubmit, navMenu, mediaType, file, fileInputRef, previewUrl, handleFileChange, setBgColor, bgColor, caption, setCaption, isSubmitting }: Props) => {
    const presetColors = ['#10b981', '#3b82f6', '#f43f5e', '#8b5cf6', '#f59e0b', '#0f172a'];
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 overflow-hidden">
                {/* Header Modal */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
                    <h3 className="font-black text-slate-800 text-lg sm:text-xl">Buat Story Baru</h3>
                    <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all active:scale-95">
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Konten Scrollable */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    <form id="storyForm" onSubmit={handleSubmit} className="space-y-6">
                        {/* Segmented Control Tipe Media */}
                        <div className="flex p-1 bg-slate-50 rounded-full border border-slate-100">
                            {(['image', 'video', 'text'] as const).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => navMenu(type)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-bold capitalize transition-all duration-300 ${mediaType === type ? 'bg-white text-emerald-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {type === 'image' && <ImageIcon size={14} />}
                                    {type === 'video' && <Video size={14} />}
                                    {type === 'text' && <Type size={14} />}
                                    {type === 'image' ? 'Gambar' : type === 'video' ? 'Video' : 'Teks'}
                                </button>
                            ))}
                        </div>

                        {/* Area Input File (Khusus Image / Video) */}
                        {mediaType !== 'text' && (
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-500 pl-2">Media File</label>
                                <div
                                    onClick={() => {
                                        if (!file || mediaType === 'image') {
                                            fileInputRef.current?.click();
                                        }
                                    }}
                                    className={`w-full aspect-video sm:aspect-[4/3] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden group ${file ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-emerald-300 cursor-pointer'}`}
                                >
                                    {previewUrl ? (
                                        mediaType === 'image' ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="relative w-full h-full">
                                                <video
                                                    src={`${previewUrl}#t=0.001`}
                                                    className="w-full h-full object-cover rounded-2xl bg-black"
                                                    controls
                                                    preload="metadata"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        fileInputRef.current?.click();
                                                    }}
                                                    className="absolute top-2 right-2 p-2 bg-slate-900/70 hover:bg-rose-500 text-white rounded-full backdrop-blur-sm transition-colors shadow-sm"
                                                    title="Ganti Video"
                                                >
                                                    <UploadCloud size={16} />
                                                </button>
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-center p-6 flex flex-col items-center cursor-pointer w-full h-full justify-center">
                                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-emerald-500 group-hover:-translate-y-1 transition-transform">
                                                <UploadCloud size={24} />
                                            </div>
                                            <p className="text-sm font-bold text-slate-700">Pilih atau letakkan file di sini</p>
                                            <p className="text-[11px] font-medium text-slate-400 mt-1">Maksimal 10MB ({mediaType === 'image' ? 'JPG, PNG' : 'MP4'})</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept={mediaType === 'image' ? 'image/jpeg, image/png, image/jpg' : 'video/mp4, video/webm'}
                                    className="hidden"
                                />
                            </div>
                        )}

                        {/* Area Input Warna (Khusus Text) */}
                        {mediaType === 'text' && (
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-500 pl-2">Warna Latar</label>
                                <div className="flex flex-wrap gap-3 pl-1">
                                    {presetColors.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setBgColor(color)}
                                            className={`w-10 h-10 rounded-full border-[3px] transition-all active:scale-90 flex items-center justify-center ${bgColor === color ? 'border-slate-800 shadow-md scale-110' : 'border-white shadow-sm hover:scale-105'}`}
                                            style={{ backgroundColor: color }}
                                        >
                                            {bgColor === color && <CheckCircle2 size={16} className="text-white drop-shadow-md" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Caption Area */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-500 pl-2">
                                {mediaType === 'text' ? 'Tulis Cerita Anda' : 'Keterangan (Opsional)'}
                            </label>
                            <textarea
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                rows={mediaType === 'text' ? 5 : 3}
                                placeholder={mediaType === 'text' ? "Ketik sesuatu yang menarik..." : "Tambahkan deskripsi singkat..."}
                                className={`w-full bg-white border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all ${mediaType === 'text' ? 'text-xl sm:text-2xl font-black text-white p-6 rounded-3xl text-center placeholder:text-white/60' : 'text-sm font-bold text-slate-800 p-4 rounded-2xl focus:border-emerald-500'}`}
                                style={mediaType === 'text' ? { backgroundColor: bgColor, borderColor: bgColor } : {}}
                                required={mediaType === 'text'}
                            />
                            <div className="flex justify-between items-center px-2">
                                <p className="text-[10px] font-bold text-slate-400">Terlihat oleh pelanggan selama 24 jam</p>
                                <p className={`text-[10px] font-bold ${caption.length > 255 ? 'text-rose-500' : 'text-slate-400'}`}>
                                    {caption.length}/255
                                </p>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Modal */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                    <button
                        type="submit"
                        form="storyForm"
                        disabled={isSubmitting || (mediaType !== 'text' && !file) || caption.length > 255}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-lg disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed disabled:border disabled:border-slate-200 bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
                    >
                        {isSubmitting ? (
                            <><Loader2 size={16} className="animate-spin" /> Mengunggah...</>
                        ) : (
                            <>Unggah Story</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModelCreateOrUpodateStorie