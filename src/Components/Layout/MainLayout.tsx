"use client"
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import SidebarComponent from './SidebarComponent';
import Header from './Header';
import { getToken } from '@/utils/loclstorange';
import Loading from '../Loading';
import { Get } from '@/utils/Get';
import { useCorrectPath } from '@/utils/useCorrectPath';
import Cookies from 'js-cookie'
type Props = {
    children: React.ReactNode;
    page?: string;
}

const MainLayout = ({ children, page }: Props) => {
    const token = getToken();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [isMobileActionMenuOpen, setIsMobileActionMenuOpen] = useState<boolean>(false);
    const pathname = usePathname();
    const [loading, setLoading] = useState<boolean>(true);
    const segments = pathname.split("/").filter(Boolean);
    const lastOne = segments.slice(-1);
    const [user, setUser] = useState<any>();
    const [business, setBusiness] = useState<any>();
    const { getCorrectPath } = useCorrectPath();
    const breadcrumb = segments.map((seg, index) => {
        if (index === 0) return "Home";
        return seg.charAt(0).toUpperCase() + seg.slice(1);
    });
    const closeMobileActionMenu = () => setIsMobileActionMenuOpen(false);

    const handleNotificationClick = () => {
        closeMobileActionMenu();
    };

    const handleProfileClick = () => {
        closeMobileActionMenu();
    };

    useEffect(() => {
        const handleOutsideClick = (event: any) => {
            if (isMobileActionMenuOpen) {
                const mobileActionBtn = document.getElementById('mobile-action-btn');
                const menu = document.getElementById('mobile-action-menu');

                if (mobileActionBtn && menu) {
                    const isClickInsideButton = mobileActionBtn.contains(event.target);
                    const isClickInsideMenu = menu.contains(event.target);

                    if (!isClickInsideButton && !isClickInsideMenu) {
                        setIsMobileActionMenuOpen(false);
                    }
                }
            }
        };

        if (isMobileActionMenuOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isMobileActionMenuOpen]);

    useEffect(() => {
        if (!token) {
            router?.push(getCorrectPath('/auth/login'))
            return
        }
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileActionMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        setLoading(true)
        Cookies.remove('token');
        localStorage?.removeItem('user');
        router?.push(getCorrectPath('/auth/login'))
    }
    useEffect(() => {
        getProfile()
    }, [])

    const getProfile = async () => {
        setLoading(true)
        try {
            const res = await Get<any>('business/profile');
            if (res?.data) {
                setUser(res?.data?.user)
                setBusiness(res?.data?.business)
            }
        } catch (e: any) {
            Cookies.remove('token');
            router?.push(getCorrectPath('/auth/login'))
        } finally {
            setLoading(false)
        }
    }
    if (loading) {
        return <Loading />
    }
    return (
        <div className="min-h-screen bg-[#f0f9f6]  font-sans text-slate-800">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-emerald-950/20 backdrop-blur-sm z-60 lg:hidden transition-opacity duration-300"
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
                        handleNotificationClick={handleNotificationClick}
                        handleProfileClick={handleProfileClick}
                        title={pathname}
                        handleLogout={handleLogout}
                        user={user}
                        business={business}
                    />
                    <div className='overflow-auto no-scrollbar mt-18 lg:mt-20 px-4 lg:px-0'>
                        <div className='mt-4'>
                            <nav className="lg:hidden text-sm pb-4">
                                <ol className="flex items-center text-gray-600 mt-2">
                                    {breadcrumb.map((p, i) => (
                                        <li key={i} className="flex items-center">
                                            <a href="#" className={`${i === breadcrumb.length - 1 ? 'font-semibold text-emerald-600' : 'font-reguler text-[#6B7280]'}`}>{p}</a>
                                            {i < breadcrumb.length - 1 && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            )}
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-2">{page}</h1>
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default MainLayout