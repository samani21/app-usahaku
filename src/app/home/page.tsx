"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Menu, X, CheckCircle2, TrendingUp, ArrowRight,
    Facebook, Twitter, Instagram, Rocket, Sparkles,
    PlayCircle, Building, Store, Receipt,
    ShieldCheck, Users, Info, Loader2,
    ShoppingBag, MapPin, Smartphone, Fingerprint
} from 'lucide-react';

import { Get } from '@/utils/Get';
import { Icon } from '@iconify/react';
import LandingSkeleton from './Components/LandingSkeleton';
import { LandingData } from './Components/type';
import HeaderSection from './Components/HeaderSection';
import HeroSection from './Components/HeroSection';
import FeatrueSection from './Components/FeatrueSection';
import PriceSection from './Components/PriceSection';
import CtaSection from './Components/CtaSection';
import FooterSection from './Components/FooterSection';

export default function LandingPage() {
    const router = useRouter();


    // State UI & UX
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

    const [toastMessage, setToastMessage] = useState<string | null>(null); // Pengganti alert()

    // State Data Fetching
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [pageData, setPageData] = useState<LandingData>({});

    // SOP Antisipasi Error (Edge Cases): AbortController
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });

        const fetchLandingData = async () => {
            // Batalkan request sebelumnya jika komponen di-render ulang cepat
            if (abortControllerRef.current) abortControllerRef.current.abort();
            abortControllerRef.current = new AbortController();

            try {
                // Asumsikan helper Get mendukung signal
                const result = await Get<{ success: boolean; data: LandingData }>('landing-page', {
                    signal: abortControllerRef.current.signal
                });

                if (result?.success && result.data) {
                    setPageData(result.data);
                }
            } catch (error: any) {
                if (error.name === 'AbortError') return;
                console.error("Gagal memuat data:", error);
                // Biarkan pageData kosong, UI sudah terlindungi dengan operator Optional Chaining (?.)
            } finally {
                // SOP Performa: Hapus artificial delay (setTimeout 800ms) agar secepat kilat
                setIsPageLoading(false);
            }
        };

        fetchLandingData();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, []);

    // HANDLERS
    const handleNavigation = async (path: string) => {
        if (loadingAction) return;
        try {
            setLoadingAction(path);
            setIsMobileMenuOpen(false);
            await router.push(path);
        } catch (error) {
            setToastMessage('Koneksi tidak stabil. Silakan coba lagi.');
        } finally {
            setLoadingAction(null);
        }
    };



    // RENDER: TAMPILKAN SKELETON JIKA LOADING
    if (isPageLoading) {
        return <LandingSkeleton />;
    }


    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 selection:bg-[#10B981]/30 selection:text-slate-900 overflow-x-hidden relative">
            {/* Custom Toast menggantikan Alert() yang buruk untuk UX */}
            {toastMessage && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl animate-in slide-in-from-top-4 flex items-center gap-2">
                    <Info size={18} className="text-[#10B981]" />
                    <span className="text-sm font-medium">{toastMessage}</span>
                    <button onClick={() => setToastMessage(null)} className="ml-4 text-slate-400 hover:text-white"><X size={16} /></button>
                </div>
            )}


            {/* 1. HEADER SECTION */}
            <HeaderSection
                scrolled={scrolled}
                handleNavigation={handleNavigation}
                footer={pageData?.footer}
                loadingAction={loadingAction}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                isMobileMenuOpen={isMobileMenuOpen} />
            {/* 2. HERO SECTION */}
            <HeroSection
                hero={pageData?.hero}
                handleNavigation={handleNavigation}
                loadingAction={loadingAction} />
            {/* 3. FEATURE SECTION */}
            <FeatrueSection
                feature={pageData?.feature}
                footer={pageData?.footer} />

            {/* 4. PRICE SECTION */}
            <PriceSection
                pricing={pageData?.pricing}
                handleNavigation={handleNavigation}
                loadingAction={loadingAction} />

            {/* 5. CTA E-COMMERCE SECTION (DATA DINAMIS) */}
            <CtaSection
                ecom={pageData?.ecommerce}
                handleNavigation={handleNavigation}
                loadingAction={loadingAction} />

            {/* 6. FOOTER SECTION (DATA DINAMIS) */}
            <FooterSection
                footer={pageData?.footer}
                handleNavigation={handleNavigation}
                loadingAction={loadingAction}
                setLoadingAction={setLoadingAction}
                setToastMessage={setToastMessage} />
        </div>
    );
}