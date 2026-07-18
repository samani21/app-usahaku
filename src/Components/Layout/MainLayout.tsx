"use client"
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react'
import SidebarComponent from './SidebarComponent';
import Header from './Header';
import { getToken } from '@/utils/loclstorange';
import Loading from '../Loading';
import { Get } from '@/utils/Get';
import { useCorrectPath } from '@/utils/useCorrectPath';
import Cookies from 'js-cookie'
import { User, Business } from '@/types'; // Import tipe data

type Props = {
    children: React.ReactNode;
    page?: string;
}

const MainLayout = ({ children, page }: Props) => {
    const token = getToken();
    const router = useRouter();
    const pathname = usePathname();
    const { getCorrectPath } = useCorrectPath();
    
    // State Management
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [isMobileActionMenuOpen, setIsMobileActionMenuOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);
    const [business, setBusiness] = useState<Business | null>(null);
    
    // Gunakan useRef untuk mendeteksi klik di luar elemen
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const mobileBtnRef = useRef<HTMLButtonElement>(null);

    const segments = pathname.split("/").filter(Boolean);
    const breadcrumb = segments.map((seg, index) => {
        if (index === 0) return "Home";
        return seg.charAt(0).toUpperCase() + seg.slice(1);
    });

    const closeMobileActionMenu = () => setIsMobileActionMenuOpen(false);

    // Deteksi klik di luar menu mobile
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                isMobileActionMenuOpen &&
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node) &&
                mobileBtnRef.current &&
                !mobileBtnRef.current.contains(event.target as Node)
            ) {
                setIsMobileActionMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isMobileActionMenuOpen]);

    // Handle Resize & Token Check
    useEffect(() => {
        if (!token) {
            router?.push(getCorrectPath('/auth/login'));
            return;
        }

        const handleResize = () => {
            if (window.innerWidth >= 768) setIsMobileActionMenuOpen(false);
        };
        
        window.addEventListener('resize', handleResize);
        getProfile();

        return () => window.removeEventListener('resize', handleResize);
    }, [token]);

    const getProfile = async () => {
        setLoading(true);
        try {
            // Sesuai request: menggunakan prefix client/
            const res = await Get<{ data: { user: User, business: Business } }>('client/business/profile');
            if (res?.data) {
                setUser(res.data.user);
                setBusiness(res.data.business);
            }
        } catch (e: any) {
            handleLogout(); // Langsung fallback logout jika gagal fetch profil
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setLoading(true);
        Cookies.remove('token');
        localStorage?.removeItem('user');
        router?.push(getCorrectPath('/auth/login'));
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-[#f0f9f6] font-sans text-slate-800">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-emerald-950/20 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="mx-auto flex flex-col lg:flex-row gap-6">
                <SidebarComponent
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    setLoading={setLoading}
                    user={user}
                    business={business}
                />
                <main className="relative h-screen flex-1 flex flex-col lg:pr-4 overflow-hidden">
                    <Header
                        setIsSidebarOpen={setIsSidebarOpen}
                        isSidebarOpen={isSidebarOpen}
                        setIsMobileActionMenuOpen={setIsMobileActionMenuOpen}
                        isMobileActionMenuOpen={isMobileActionMenuOpen}
                        closeMobileActionMenu={closeMobileActionMenu}
                        handleNotificationClick={closeMobileActionMenu}
                        handleProfileClick={closeMobileActionMenu}
                        title={pathname}
                        handleLogout={handleLogout}
                        user={user}
                        business={business}
                        mobileMenuRef={mobileMenuRef} // Passing ref ke header
                        mobileBtnRef={mobileBtnRef}
                    />
                    <div className='overflow-auto no-scrollbar mt-18 lg:mt-20 px-4 lg:px-0'>
                        <div className='mt-4'>
                            {/* Breadcrumb Content (Tetap sama seperti aslinya) */}
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-2">{page}</h1>
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default MainLayout;