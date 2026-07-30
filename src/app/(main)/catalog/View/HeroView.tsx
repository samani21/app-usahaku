'use client'
import React, { useState, useEffect, useRef, useCallback, Dispatch, SetStateAction } from 'react';
import { Palette, Home, Utensils, Cpu, Sparkles, Pipette, HeartPulse, Shirt, Coffee, GraduationCap, Upload, CircleCheckBigIcon, Circle, Sun, Moon, Check, SunMoon, X, Trash2, CheckCircleIcon } from 'lucide-react';
import Cropper, { Area } from 'react-easy-crop';
import { AlertType } from '@/types/Alert';
import { Post } from '@/utils/Post';
import { HeroType } from '@/types/Admin/Catalog/Hero';
import HeroConfig from '@/Components/Catalog/Hero';
import Alert from '@/Components/Alert';
import Loading from '@/Components/Loading';
import { formatImage } from '@/utils/formatImage';
import { Delete } from '@/utils/Delete';

const BUSINESS_THEMES = [
    {
        id: 'property',
        name: 'Properti (Minimalis)',
        description: 'Kesan bersih, luas, dan kokoh.',
        hex: '#94A3B8', // Slate Gray / Cement
        icon: <Home size={18} />,
        textColor: '#1E293B'
    },
    {
        id: 'fnb',
        name: 'F&B (Energi)',
        description: 'Menggugah selera dan hangat.',
        hex: '#F59E0B', // Amber / Warm Orange
        icon: <Utensils size={18} />,
        textColor: '#FFFFFF'
    },
    {
        id: 'tech',
        name: 'Tech (Modern)',
        description: 'Inovatif dan futuristik.',
        hex: '#3B82F6', // Blue
        icon: <Cpu size={18} />,
        textColor: '#FFFFFF'
    },
    {
        id: 'luxury',
        name: 'Luxury (Premium)',
        description: 'Eksklusif dan elegan.',
        hex: '#111827', // Rich Black
        icon: <Sparkles size={18} />,
        textColor: '#F3F4F6'
    },
    {
        id: 'medical',
        name: 'Kesehatan (Trust)',
        description: 'Steril, tenang, dan terpercaya.',
        hex: '#0D9488', // Teal / Medical Green
        icon: <HeartPulse size={18} />,
        textColor: '#FFFFFF'
    },
    {
        id: 'fashion',
        name: 'Fashion (Trendy)',
        description: 'Ekspresif dan penuh gaya.',
        hex: '#DB2777', // Pink / Magenta
        icon: <Shirt size={18} />,
        textColor: '#FFFFFF'
    },
    {
        id: 'coffee',
        name: 'Coffee (Cozy)',
        description: 'Nyaman, hangat, dan santai.',
        hex: '#78350F', // Brown / Coffee
        icon: <Coffee size={18} />,
        textColor: '#FFFFFF'
    },
    {
        id: 'education',
        name: 'Pendidikan (Edu)',
        description: 'Fokus, cerdas, dan profesional.',
        hex: '#4F46E5', // Indigo / Education
        icon: <GraduationCap size={18} />,
        textColor: '#FFFFFF'
    }
];
const listHero = [
    { id: 1, name: "Classic Split" },
    { id: 2, name: "Modern Floating Card" },
    { id: 3, name: "Modern Floating Card" },
    { id: 4, name: "Rustic Coffee" },
    { id: 5, name: "Cyber Tech" },
    { id: 6, name: "Vibrant Foodie" },
    { id: 7, name: "Elegant Property" },
    { id: 8, name: "Classic Barber" },
    { id: 9, name: "Industrial Service" },
    { id: 10, name: "Soft Laundry" },
    { id: 11, name: "Playful Pet" },
    { id: 12, name: "Music Dynamic" },
    { id: 13, name: "Fine Tailor" },
    { id: 14, name: "Typo Hero" },
    { id: 15, name: "Library Grid" },
]

type Props = {
    heroData: HeroType | null;
    isDarkMode: boolean;
    setIsDarkMode: Dispatch<SetStateAction<boolean>>;
    getCalog: () => void;
}

export default function HeroView({ heroData, isDarkMode, setIsDarkMode, getCalog }: Props) {
    const [selectedColor, setSelectedColor] = useState(BUSINESS_THEMES[0].hex);
    const [activeTab, setActiveTab] = useState<string | undefined>();
    const [heroLayout, setHeroLayout] = useState<number | null>();
    const [displayMode, setDisplayMode] = useState('auto');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [title, setTitle] = useState("Rekomendasi Hari Ini");
    const [headline, setHeadline] = useState("PRODUK TERBAIK KAMI");
    const [subHeadline, setSubHeadline] = useState("Kualitas premium dengan harga yang sangat terjangkau khusus untuk Anda.");
    const [ctaText, setCtaText] = useState("Pesan Sekarang");

    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [imageHero, setImageHero] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [isDeleteImage, setIsDeleteImage] = useState<boolean>(false);
    // FIX: Penamaan typo diperbaiki jadi disableButtonDelete
    const [disableButtonDelete, setDisableButtonDelete] = useState<boolean>(false)

    useEffect(() => {
        if (heroData) {
            setHeroLayout(heroData?.layout_hero);
            if (heroData?.color) {
                setSelectedColor(heroData?.color);
            }
            setImageHero(formatImage(heroData?.image) ?? null)
            if (heroData?.title) {
                setTitle(heroData?.title ?? '')
            }
            if (heroData?.headline) {
                setHeadline(heroData?.headline ?? '')
            }
            if (heroData?.sub_headline) {
                setSubHeadline(heroData?.sub_headline ?? '')
            }
            if (heroData?.cta) {
                setCtaText(heroData?.cta ?? '')
            }
            setDisplayMode(heroData?.mode ?? 'auto');
            setIsDarkMode(heroData?.mode == 'dark')
            setDisableButtonDelete(false); // Reset tombol delete
        } else {
            // FIX: RESET FORM KE DEFAULT JIKA DATA KOSONG (Misal habis di-delete)
            setHeroLayout(null);
            setSelectedColor(BUSINESS_THEMES[0].hex);
            setImageHero(null);
            setTitle("Rekomendasi Hari Ini");
            setHeadline("PRODUK TERBAIK KAMI");
            setSubHeadline("Kualitas premium dengan harga yang sangat terjangkau khusus untuk Anda.");
            setCtaText("Pesan Sekarang");
            setDisplayMode('auto');
            setIsDarkMode(false);
            setHeroFile(null);
            setIsDeleteImage(false);
        }
    }, [heroData]);

    // Fungsi untuk menghitung kontras teks secara otomatis
    const getContrastColor = (hex: string) => {
        if (!hex) return '#1e293b';
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? '#1e293b' : '#ffffff';
    };

    const currentTextColor = getContrastColor(selectedColor);

    // Efek samping untuk memperbarui CSS Variables di root secara dinamis
    useEffect(() => {
        // 1. Set Primary Color (Warna Background)
        document.documentElement.style.setProperty('--hero-primary-color', selectedColor);

        // 2. Set Secondary Color (Warna Teks/Kontras)
        document.documentElement.style.setProperty('--hero-secondary-color', currentTextColor);

        // 3. Set RGB values untuk kebutuhan transparansi
        const r = parseInt(selectedColor.slice(1, 3), 16);
        const g = parseInt(selectedColor.slice(3, 5), 16);
        const b = parseInt(selectedColor.slice(5, 7), 16);
        document.documentElement.style.setProperty('--hero-primary-rgb', `${r}, ${g}, ${b}`);

        const tr = parseInt(currentTextColor.slice(1, 3), 16);
        const tg = parseInt(currentTextColor.slice(3, 5), 16);
        const tb = parseInt(currentTextColor.slice(5, 7), 16);
        document.documentElement.style.setProperty('--hero-secondary-rgb', `${tr}, ${tg}, ${tb}`);
    }, [selectedColor, currentTextColor]);

    const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<{ file: File, url: string }> => {
        const image = new Image();
        image.src = imageSrc;
        await new Promise((resolve) => (image.onload = resolve));
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        ctx?.drawImage(
            image,
            pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
            0, 0, pixelCrop.width, pixelCrop.height
        );
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) return;
                const file = new File([blob], "hero_cropped.jpg", { type: "image/jpeg" });
                const url = URL.createObjectURL(blob);
                resolve({ file, url });
            }, 'image/jpeg', 0.9);
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImageToCrop(reader.result as string);
            setShowCropModal(true);
        };
    };

    const handleSaveCrop = async () => {
        if (imageToCrop && croppedAreaPixels) {
            const { file, url } = await getCroppedImg(imageToCrop, croppedAreaPixels);

            // Bersihkan URL gambar yang lama jika ada untuk mencegah memory leak
            if (imageHero && imageHero.startsWith('blob:')) {
                URL.revokeObjectURL(imageHero);
            }

            setImageHero(url);
            setHeroFile(file);
            setShowCropModal(false);
            setImageToCrop(null);

            // FIX: Pastikan status delete false karena user baru saja upload gambar baru!
            setIsDeleteImage(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Yakin ingin menghapus Hero Banner ini?')) return;

        setLoading(true)
        try {
            await Delete(`client/catalog/hero/${heroData?.id}`)
            setDisableButtonDelete(true)
            setShowAlert({
                isOpen: true,
                type: 'success',
                message: "Hero berhasil dihapus"
            })
            // FIX: Refresh data dari server agar useEffect mengosongkan form
            getCalog()
        } catch (e: any) {
            setShowAlert({
                isOpen: true,
                type: 'error',
                message: "Gagal menghapus hero"
            })
            setDisableButtonDelete(false); // Kembalikan ke false jika gagal
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (!heroLayout) {
                setLoading(false);
                setShowAlert({
                    isOpen: true,
                    type: 'error',
                    message: "Harap pilih salah satu banner dibawah"
                })
                return;
            }
            const formData = new FormData();
            formData.append('layout_hero', String(heroLayout))
            formData.append('color', selectedColor)
            formData.append('title', title)
            formData.append('headline', headline)
            formData.append('sub_headline', subHeadline)
            formData.append('cta', ctaText)
            if (heroFile) {
                formData.append('image', heroFile)
            }
            formData.append('mode', displayMode)
            if (isDeleteImage) {
                formData.append('delete_image', '1')
            }

            const res = await Post('client/catalog/hero', formData)
            if (res) {
                setLoading(false);
                getCalog()
                setShowAlert({
                    isOpen: true,
                    type: 'success',
                    message: "Pengaturan banner berhasil disimpan"
                })
            }

        } catch (e: any) {
            setLoading(false);
            setShowAlert({
                isOpen: true,
                type: 'error',
                message: "Pengaturan banner gagal disimpan"
            })
        }
    }

    return (
        <div>
            {showCropModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                            <div>
                                <h3 className="font-bold text-slate-800">Sesuaikan Gambar Hero</h3>
                                <p className="text-[10px] text-slate-500">Geser dan perbesar untuk menyesuaikan posisi terbaik</p>
                            </div>
                            <button onClick={() => setShowCropModal(false)} className="text-slate-400 hover:text-red-500">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="relative h-64 sm:h-96 w-full bg-slate-900">
                            <Cropper
                                image={imageToCrop!}
                                crop={crop}
                                zoom={zoom}
                                aspect={16 / 9} // Rasio landscape untuk Hero
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="p-6 bg-white space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Zoom</span>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCropModal(false)}
                                    className="flex-1 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                                >
                                    BATAL
                                </button>
                                <button
                                    onClick={handleSaveCrop}
                                    className="flex-1 py-3 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <Check size={18} /> TERAPKAN GAMBAR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className={`min-h-screen font-sans ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <div className="space-y-6">
                    <div className="space-y-6 p-4 md:p-6 w-full max-w-7xl mx-auto font-sans">
                        {/* --- KATEGORI WARNA PRESET --- */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                Pilih Kategori Warna
                            </label>
                            <div className="flex gap-3 max-h-[500px] overflow-x-auto pb-4 pt-1 px-1 no-scrollbar">
                                {BUSINESS_THEMES.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => {
                                            setSelectedColor(theme.hex);
                                            setActiveTab(theme.id);
                                        }}
                                        className={`min-w-[200px] flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 ease-in-out ${activeTab === theme.id
                                            ? 'border-emerald-500 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-emerald-500'
                                            : 'border-slate-200 bg-white hover:bg-slate-50 hover:shadow-sm hover:border-slate-300'
                                            }`}
                                    >
                                        <div
                                            className="p-2.5 rounded-xl text-white shrink-0 shadow-sm"
                                            style={{ backgroundColor: theme.hex }}
                                        >
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

                        {/* --- PENGATURAN KUSTOM HERO CARD --- */}
                        <div className="p-5 md:p-7 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 space-y-8">

                            {/* Custom Warna */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                    <Pipette size={18} className="text-emerald-500" />
                                    <span>Kustomisasi Warna Sendiri</span>
                                </div>
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
                                        <div
                                            className="h-12 w-12 rounded-xl shadow-inner border border-black/10 transition-transform hover:scale-105"
                                            style={{ backgroundColor: selectedColor }}
                                        />
                                    </div>
                                    <div className="flex-1 px-4 py-3 bg-slate-50 text-slate-700 rounded-xl border border-slate-200 font-mono text-sm tracking-wide shadow-sm">
                                        {selectedColor?.toUpperCase()}
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Form Teks Hero & Media (Grid 2 Kolom di layar besar) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                {/* Kolom Kiri: Teks */}
                                <div className="space-y-4">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Konten Teks Hero</label>
                                    <div className="space-y-3">
                                        <input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full px-4 py-2.5 text-sm text-slate-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                                            placeholder="Label Atas (Contoh: Fitur Baru)"
                                        />
                                        <input
                                            value={headline}
                                            onChange={(e) => setHeadline(e.target.value.toUpperCase())}
                                            className="w-full px-4 py-2.5 text-sm font-bold text-slate-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all uppercase"
                                            placeholder="HEADLINE UTAMA"
                                        />
                                        <textarea
                                            value={subHeadline}
                                            onChange={(e) => setSubHeadline(e.target.value)}
                                            className="w-full px-4 py-3 text-sm text-slate-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none h-24"
                                            placeholder="Sub-headline deskripsi singkat mengenai produk atau penawaran Anda..."
                                        />
                                        <input
                                            value={ctaText}
                                            onChange={(e) => setCtaText(e.target.value)}
                                            className="w-full px-4 py-2.5 text-sm text-slate-900 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                                            placeholder="Teks Tombol Aksi (Contoh: Beli Sekarang)"
                                        />
                                    </div>
                                </div>

                                {/* Kolom Kanan: Gambar & Tampilan */}
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Gambar Banner</label>
                                        {imageHero ? (
                                            <button
                                                onClick={() => {
                                                    setHeroFile(null);
                                                    setImageHero(null);
                                                    setIsDeleteImage(true);
                                                }}
                                                className="flex items-center justify-center gap-2 py-3 px-4 text-red-600 text-sm font-medium bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-all w-full"
                                            >
                                                <Trash2 className="w-4 h-4" /> Hapus Gambar Saat Ini
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex items-center justify-center gap-2 py-3 px-4 text-slate-700 text-sm font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 border-dashed rounded-xl transition-all w-full hover:border-slate-400"
                                            >
                                                <Upload className="w-4 h-4 text-slate-500" /> Upload Gambar Banner
                                            </button>
                                        )}
                                        <p className="text-[10px] text-slate-400 text-center px-2 leading-relaxed">
                                            Gunakan gambar dengan orientasi <span className="font-semibold text-slate-500">landscape (mendatar)</span> untuk hasil tampilan terbaik pada hero section.
                                        </p>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Mode Tema Aplikasi</label>
                                        <div className="grid grid-cols-3 gap-1 bg-slate-100/80 p-1.5 rounded-xl">
                                            <button
                                                onClick={() => {
                                                    setDisplayMode('light');
                                                    setIsDarkMode(false);
                                                }}
                                                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${displayMode === 'light'
                                                    ? 'bg-white text-amber-500 shadow-sm'
                                                    : 'text-slate-500 hover:bg-slate-200/50'
                                                    }`}
                                            >
                                                <Sun size={15} /> Light
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDisplayMode('dark');
                                                    setIsDarkMode(true);
                                                }}
                                                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${displayMode === 'dark'
                                                    ? 'bg-white text-emerald-600 shadow-sm'
                                                    : 'text-slate-500 hover:bg-slate-200/50'
                                                    }`}
                                            >
                                                <Moon size={15} /> Dark
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDisplayMode('auto');
                                                    setIsDarkMode(false);
                                                }}
                                                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${displayMode === 'auto'
                                                    ? 'bg-white text-slate-800 shadow-sm'
                                                    : 'text-slate-500 hover:bg-slate-200/50'
                                                    }`}
                                            >
                                                <SunMoon size={15} /> Auto
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* --- TOMBOL AKSI --- */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                {/* Tombol Hapus Seluruh Hero (Fitur Baru) */}
                                {
                                    heroData?.id && !disableButtonDelete &&
                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200"
                                    >
                                        <Trash2 className="w-4 h-4" /> Nonaktifkan/Hapus Hero
                                    </button>
                                }

                                <button
                                    onClick={handleSubmit}
                                    className="flex-[2] flex items-center justify-center gap-2 py-3.5 text-sm bg-emerald-600 text-white font-semibold rounded-xl shadow-md hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <Check className="w-5 h-5" /> Simpan Perubahan Hero
                                </button>
                            </div>
                        </div>

                        {/* --- HERO LAYOUT SELECTOR --- */}
                        <div className={`mt-6 p-4 rounded-3xl transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}`}>
                            <label className={`text-xs font-bold uppercase tracking-wider ml-1 mb-3 block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pilih Layout Header/Hero</label>
                            <div className="flex overflow-x-auto w-full gap-3 pb-2 no-scrollbar">
                                {listHero?.map((lh, i) => (
                                    <button
                                        key={lh?.id}
                                        onClick={() => setHeroLayout(lh?.id)}
                                        className={`whitespace-nowrap text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2.5 transition-all duration-200 border ${lh?.id === heroLayout
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                                            : isDarkMode
                                                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                                            }`}
                                    >
                                        {lh?.id === heroLayout ? (
                                            <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                            <Circle className="w-4 h-4 opacity-50" />
                                        )}
                                        <span>{lh?.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='relative pb-8 space-y-4 px-4'>
                        {
                            heroLayout &&
                            <>
                                <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-500 block">Yang anda pilih No.{heroLayout}</label>
                                <HeroConfig
                                    theme={heroLayout}
                                    isDarkMode={isDarkMode}
                                    headline={headline}
                                    subHeadline={subHeadline}
                                    ctaText={ctaText}
                                    imageHero={imageHero}
                                    title={title} />
                            </>
                        }
                        {
                            listHero?.map((lh, i) => (
                                <div className='relative space-y-4' key={i}>
                                    {
                                        heroLayout === lh?.id ?
                                            <div className={`flex items-center gap-2 cursor-pointer ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                                <CircleCheckBigIcon />
                                                <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-500 block">{lh?.id}. {lh?.name}</label>
                                            </div> :
                                            <div className={`flex items-center gap-2 cursor-pointer ${isDarkMode ? "text-white" : "text-slate-900"}`} onClick={() => setHeroLayout(lh?.id)}>
                                                <Circle />
                                                <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-500 block">{lh?.id}. {lh?.name}</label>
                                            </div>
                                    }
                                    <HeroConfig
                                        theme={lh?.id}
                                        isDarkMode={isDarkMode}
                                        headline={headline}
                                        subHeadline={subHeadline}
                                        ctaText={ctaText}
                                        imageHero={imageHero}
                                        title={title} />
                                </div>
                            ))
                        }

                    </div>

                </div>
            </div>
            {
                showAlert?.isOpen &&
                <Alert type={showAlert?.type} message={showAlert?.message} onClose={() => setShowAlert(null)} />
            }
            {loading && <Loading title='Sedang Proses' />}
        </div>
    );
}