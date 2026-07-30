'use client'

import React, { useState, useEffect, useRef, useCallback, Dispatch, SetStateAction } from 'react';
import { Palette, Home, Utensils, Cpu, Sparkles, Pipette, HeartPulse, Shirt, Coffee, GraduationCap, Upload, CircleCheckBigIcon, Circle, Sun, Moon, SunMoon, Trash2, Check, X, CheckCircleIcon } from 'lucide-react';
import Cropper, { Area } from 'react-easy-crop';

import { AlertType } from '@/types/Alert';
import { Post } from '@/utils/Post';
import { CatalogHeaderType } from '@/types/Admin/Catalog/Header';
import { formatImage } from '@/utils/formatImage';

import HeaderConfig from '@/Components/Catalog/Header';
import Alert from '@/Components/Alert';
import Loading from '@/Components/Loading';

// (Konstanta BUSINESS_THEMES dan listHeader tetap sama seperti aslinya, saya persingkat di sini agar fokus ke komponen)
const BUSINESS_THEMES = [
    { id: 'property', name: 'Properti (Minimalis)', description: 'Kesan bersih, luas, dan kokoh.', hex: '#94A3B8', icon: <Home size={18} />, textColor: '#1E293B' },
    { id: 'fnb', name: 'F&B (Energi)', description: 'Menggugah selera dan hangat.', hex: '#F59E0B', icon: <Utensils size={18} />, textColor: '#FFFFFF' },
    { id: 'tech', name: 'Tech (Modern)', description: 'Inovatif dan futuristik.', hex: '#3B82F6', icon: <Cpu size={18} />, textColor: '#FFFFFF' },
    { id: 'luxury', name: 'Luxury (Premium)', description: 'Eksklusif dan elegan.', hex: '#111827', icon: <Sparkles size={18} />, textColor: '#F3F4F6' },
    { id: 'medical', name: 'Kesehatan (Trust)', description: 'Steril, tenang, dan terpercaya.', hex: '#0D9488', icon: <HeartPulse size={18} />, textColor: '#FFFFFF' },
    { id: 'fashion', name: 'Fashion (Trendy)', description: 'Ekspresif dan penuh gaya.', hex: '#DB2777', icon: <Shirt size={18} />, textColor: '#FFFFFF' },
    { id: 'coffee', name: 'Coffee (Cozy)', description: 'Nyaman, hangat, dan santai.', hex: '#78350F', icon: <Coffee size={18} />, textColor: '#FFFFFF' },
    { id: 'education', name: 'Pendidikan (Edu)', description: 'Fokus, cerdas, dan profesional.', hex: '#4F46E5', icon: <GraduationCap size={18} />, textColor: '#FFFFFF' }
];

const listHeader = Array.from({ length: 15 }, (_, i) => ({ id: i + 1, name: `Header ${i + 1}` }));

type Props = {
    themeDark: boolean;
    setThemeDark: Dispatch<SetStateAction<boolean>>;
    headerData: CatalogHeaderType | null;
    getCalog: () => void;
};

export default function HeaderView({ themeDark, setThemeDark, headerData, getCalog }: Props) {
    const [selectedColor, setSelectedColor] = useState<string>(BUSINESS_THEMES[0].hex);
    const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
    const [headerLayout, setHeaderLayout] = useState<number | null>(null);
    const [displayMode, setDisplayMode] = useState<string>('auto');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [frameType, setFrameType] = useState<string>("none");
    const [frameTheme, setFrameTheme] = useState<string>("dark");
    const [spanOne, setSpanOne] = useState<string>("NAMA");
    const [spanTwo, setSpanTwo] = useState<string>("");
    const [isDeleteLogo, setIsDeleteLogo] = useState<boolean>(false);

    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [showCropModal, setShowCropModal] = useState(false);

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logo, setLogo] = useState<string | null>(null);

    // Inisialisasi Data
    useEffect(() => {
        if (headerData) {
            setHeaderLayout(headerData.layout_header);
            setLogo(headerData.logo ? (formatImage(headerData.logo) ?? null) : null);
            setSpanOne(headerData.span_one || "NAMA");
            setSpanTwo(headerData.span_two || "");
            setSelectedColor(headerData.color || BUSINESS_THEMES[0].hex);
            setFrameType(headerData.type_frame || "none");
            setFrameTheme(headerData.color_frame || "dark");
            setDisplayMode(headerData.mode || 'auto');
            setThemeDark(headerData.mode === 'dark');
        }
    }, [headerData, setThemeDark]);

    // Crop Handler
    const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<{ file: File, url: string }> => {
        const image = new Image();
        image.src = imageSrc;
        await new Promise((resolve) => (image.onload = resolve));

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not create canvas context');

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
            0, 0, pixelCrop.width, pixelCrop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                const file = new File([blob], "logo_cropped.png", { type: "image/png" });
                const url = URL.createObjectURL(blob);
                resolve({ file, url });
            }, 'image/png');
        });
    };

    const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImageToCrop(reader.result as string);
            setShowCropModal(true);
        };
        // Reset input value agar user bisa upload file yang sama jika di-cancel
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSaveCrop = async () => {
        if (imageToCrop && croppedAreaPixels) {
            try {
                const { file, url } = await getCroppedImg(imageToCrop, croppedAreaPixels);
                setLogo(url);
                setLogoFile(file);
                setIsDeleteLogo(false); // Batalkan status hapus jika sebelumnya dihapus lalu upload baru
            } catch (error) {
                console.error("Gagal melakukan crop gambar:", error);
            } finally {
                setShowCropModal(false);
                setImageToCrop(null);
            }
        }
    };

    // Kalkulasi Kontras Warna
    const getContrastColor = useCallback((hex: string) => {
        if (!hex || hex.length < 7) return '#1e293b';
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? '#1e293b' : '#ffffff';
    }, []);

    const currentTextColor = getContrastColor(selectedColor);

    // CSS Variables Effect
    useEffect(() => {
        if (!selectedColor || selectedColor.length < 7) return;
        const root = document.documentElement;

        root.style.setProperty('--header-primary-color', selectedColor);
        root.style.setProperty('--header-secondary-color', currentTextColor);

        const r = parseInt(selectedColor.slice(1, 3), 16);
        const g = parseInt(selectedColor.slice(3, 5), 16);
        const b = parseInt(selectedColor.slice(5, 7), 16);
        root.style.setProperty('--header-primary-rgb', `${r}, ${g}, ${b}`);

        const tr = parseInt(currentTextColor.slice(1, 3), 16);
        const tg = parseInt(currentTextColor.slice(3, 5), 16);
        const tb = parseInt(currentTextColor.slice(5, 7), 16);
        root.style.setProperty('--header-secondary-rgb', `${tr}, ${tg}, ${tb}`);
    }, [selectedColor, currentTextColor]);

    // Submit Handler
    const handleSubmit = async () => {
        try {
            if (!headerLayout) {
                setShowAlert({ isOpen: true, type: 'error', message: "Harap pilih salah satu layout header." });
                return;
            }

            setLoading(true);
            const formData = new FormData();
            formData.append('layout_header', String(headerLayout));
            formData.append('color', selectedColor);
            formData.append('span_one', spanOne);
            formData.append('span_two', spanTwo);
            formData.append('type_frame', frameType);
            formData.append('color_frame', frameTheme);
            formData.append('mode', displayMode);

            if (logoFile) {
                formData.append('logo', logoFile);
            }
            if (isDeleteLogo) {
                formData.append('delete_image', '1');
            }

            const res = await Post('client/catalog/header', formData);
            if (res) {
                getCalog();
                setShowAlert({ isOpen: true, type: 'success', message: "Pengaturan header berhasil disimpan!" });
            }
        } catch (e: any) {
            setShowAlert({ isOpen: true, type: 'error', message: "Gagal menyimpan pengaturan header. Silakan coba lagi." });
        } finally {
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll ke atas agar notifikasi terlihat
        }
    };

    return (
        <div>
            {/* Modal Crop */}
            {showCropModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Sesuaikan Logo</h3>
                            <button onClick={() => setShowCropModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="relative h-80 w-full bg-slate-200">
                            {imageToCrop && (
                                <Cropper
                                    image={imageToCrop}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            )}
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-medium text-slate-700">Zoom</span>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1} max={3} step={0.1}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="flex-1 accent-emerald-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setShowCropModal(false)} className="flex-1 py-2 text-sm font-semibold bg-gray-100 text-slate-700 rounded-xl hover:bg-gray-200">
                                    Batal
                                </button>
                                <button onClick={handleSaveCrop} className="flex-1 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700">
                                    <Check size={16} /> Gunakan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="min-h-screen font-sans">
                <div className="space-y-6">
                    <div className="space-y-6 p-4 md:p-6 w-full max-w-7xl mx-auto font-sans">

                        {/* KATEGORI WARNA */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Pilih Tema Bisnis</label>
                            <div className="flex gap-3 max-h-[500px] overflow-x-auto pb-4 pt-1 px-1 no-scrollbar">
                                {BUSINESS_THEMES.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => {
                                            setSelectedColor(theme.hex);
                                            setActiveTab(theme.id);
                                        }}
                                        className={`min-w-[200px] flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 ease-in-out ${activeTab === theme.id
                                            ? 'border-emerald-500 bg-white shadow-md ring-1 ring-emerald-500'
                                            : 'border-slate-200 bg-white hover:bg-slate-50 hover:shadow-sm hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="p-2.5 rounded-xl text-white shrink-0 shadow-sm" style={{ backgroundColor: theme.hex }}>
                                            {theme.icon}
                                        </div>
                                        <div className="text-left flex-1 overflow-hidden">
                                            <div className="font-semibold text-slate-900 text-sm truncate">{theme.name}</div>
                                            <div className="text-xs text-slate-500 leading-tight truncate mt-0.5">{theme.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* CUSTOM SETTINGS CARD */}
                        <div className="p-5 md:p-7 bg-white rounded-3xl shadow-sm border border-slate-100 space-y-8">

                            {/* Input Nama & Warna Custom */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Warna Kustom</label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative shrink-0">
                                            <input
                                                type="color"
                                                value={selectedColor}
                                                onChange={(e) => {
                                                    setSelectedColor(e.target.value);
                                                    setActiveTab('custom');
                                                }}
                                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                            />
                                            <div className="h-12 w-12 rounded-xl shadow-inner border border-black/10 transition-transform hover:scale-105" style={{ backgroundColor: selectedColor }} />
                                        </div>
                                        <div className="flex-1 px-4 py-3 bg-slate-50 text-slate-700 rounded-xl border border-slate-200 font-mono text-sm tracking-wide shadow-sm">
                                            {selectedColor?.toUpperCase()}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Nama Usaha (2 Kata)</label>
                                    <div className="flex gap-3">
                                        <input
                                            value={spanOne}
                                            onChange={(e) => setSpanOne(e.target.value)}
                                            placeholder="Kata Pertama"
                                            className="w-1/2 px-4 py-2.5 text-sm text-slate-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                                        />
                                        <input
                                            value={spanTwo}
                                            onChange={(e) => setSpanTwo(e.target.value)}
                                            placeholder="Kata Kedua"
                                            className="w-1/2 px-4 py-2.5 text-sm text-slate-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Upload Logo */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Logo Usaha</label>
                                {logo && !isDeleteLogo ? (
                                    <div className="flex gap-3">
                                        <img src={logo} alt="Logo" className="w-12 h-12 rounded-lg border object-cover bg-slate-50" />
                                        <button
                                            onClick={() => setIsDeleteLogo(true)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-red-600 text-sm font-medium bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" /> Hapus Logo
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center justify-center gap-2 py-3 px-4 text-slate-700 text-sm font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 border-dashed rounded-xl transition-all w-full hover:border-slate-400"
                                    >
                                        <Upload className="w-4 h-4 text-slate-500" /> Upload Logo Baru
                                    </button>
                                )}
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleLogoUpload} />
                            </div>

                            <hr className="border-slate-100" />

                            {/* Toggles Display */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Bentuk Frame</label>
                                    <div className="flex bg-slate-100/80 p-1.5 rounded-xl">
                                        {['none', 'circle', 'square'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setFrameType(t)}
                                                className={`flex-1 text-xs px-3 py-2 rounded-lg transition-all font-semibold capitalize ${frameType === t ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                {t === 'none' ? 'Bebas' : t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Aksen Frame</label>
                                    <div className="flex bg-slate-100/80 p-1.5 rounded-xl">
                                        {['dark', 'light'].map(th => (
                                            <button
                                                key={th}
                                                onClick={() => setFrameTheme(th)}
                                                className={`flex-1 text-xs px-3 py-2 rounded-lg transition-all font-semibold capitalize ${frameTheme === th ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                {th}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Mode Tema</label>
                                    <div className="flex bg-slate-100/80 p-1.5 rounded-xl">
                                        {[
                                            { id: 'light', icon: <Sun size={14} />, label: 'Light' },
                                            { id: 'dark', icon: <Moon size={14} />, label: 'Dark' },
                                            { id: 'auto', icon: <SunMoon size={14} />, label: 'Auto' }
                                        ].map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => {
                                                    setDisplayMode(m.id);
                                                    setThemeDark(m.id === 'dark');
                                                }}
                                                className={`flex-1 flex items-center justify-center gap-1 text-xs px-2 py-2 rounded-lg transition-all font-semibold ${displayMode === m.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                {m.icon} {m.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleSubmit} className="w-full flex items-center justify-center gap-2 py-3.5 text-sm bg-slate-900 text-white font-semibold rounded-xl shadow-md hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-200">
                                <Check className="w-5 h-5" /> Simpan Perubahan Header
                            </button>
                        </div>

                        {/* LAYOUT SELECTOR & PREVIEW */}
                        <div className={`mt-6 p-4 rounded-3xl transition-colors duration-300 ${themeDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100 shadow-sm'}`}>
                            <label className={`text-xs font-bold uppercase tracking-wider ml-1 mb-3 block ${themeDark ? 'text-slate-400' : 'text-slate-500'}`}>Pilih Desain Layout</label>
                            <div className="flex overflow-x-auto w-full gap-3 pb-2 no-scrollbar">
                                {listHeader?.map((lh) => (
                                    <button
                                        key={lh.id}
                                        onClick={() => setHeaderLayout(lh.id)}
                                        className={`whitespace-nowrap text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2.5 transition-all border ${lh.id === headerLayout
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                                            : themeDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                            }`}
                                    >
                                        {lh.id === headerLayout ? <CheckCircleIcon className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4 opacity-50" />}
                                        <span>{lh.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* MENAMPILKAN HANYA LAYOUT YANG AKTIF (OPTIMASI RENDER) */}
                        <div className='relative pb-50 md:pb-8 space-y-4'>
                            {headerLayout && (
                                <div className='relative space-y-4 animate-fade-in'>
                                    <div className={`flex items-center gap-2 px-4 ${themeDark ? "text-white" : "text-slate-900"}`}>
                                        <CircleCheckBigIcon className="text-emerald-500" />
                                        <p className='font-semibold text-gray-600'>Preview: Header {headerLayout}</p>
                                    </div>
                                    <HeaderConfig
                                        layout={headerLayout}
                                        themeMode={themeDark ? "dark" : "light"}
                                        isBuild={true}
                                        logoImage={isDeleteLogo ? null : logo}
                                        frameType={frameType}
                                        frameTheme={frameTheme}
                                        toggleTheme={() => setThemeDark(!themeDark)}
                                        spanOne={spanOne}
                                        spanTwo={spanTwo}
                                        displayMode={displayMode}
                                        isConfigHeader={true}
                                        openScan={() => { }}
                                    />
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Global Alert Notification */}
            {showAlert?.isOpen && (
                <div className='fixed z-[1001] top-4 right-4 max-w-sm w-full shadow-2xl rounded-2xl overflow-hidden animate-slide-in-right'>
                    <Alert type={showAlert.type} message={showAlert.message} onClose={() => setShowAlert(null)} />
                </div>
            )}

            {loading && <Loading title='Menyimpan Konfigurasi...' />}
        </div>
    );
}