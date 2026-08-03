"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { Dispatch, ReactElement, SetStateAction } from 'react'

type Props = {
    Icon: any;
    label: string;
    count?: number;
    isActive?: boolean;
    onClick?: () => void;
    children?: ReactElement<Element>;
    href?: string;
    child?: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
}

const SidebarItem = ({ Icon, label, isActive = false, onClick, count, children, href, child, setLoading }: Props) => {
    const route = useRouter();
    const activeClass = isActive ? 'sidebar-active' : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 font-medium';
    const iconColor = isActive ? 'text-white' : '';
    return (
        <div className="relative">
            {
                child ? <button
                    className={`letter-spacing sidebar-item flex items-center p-3 w-full rounded-lg font-semibold transition duration-150  ${activeClass}`}
                    onClick={onClick}
                >
                    <Icon className={`w-5 h-5 mr-3 ${iconColor}`} />
                    {label}
                    {count && (
                        <span className="ml-auto bg-emerald-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                            {count}
                        </span>
                    )}
                    {children}
                </button> :
                    <Link href={`/admin${href}`} onClick={() => setLoading(true)} prefetch
                        className={`letter-spacing sidebar-item flex items-center p-3 w-full rounded-lg font-semibold transition  duration-150 ${activeClass}`}
                    >
                        <Icon className={`w-5 h-5 mr-3 ${iconColor}`} />
                        {label}
                        {count && (
                            <span className="ml-auto bg-emerald-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                                {count}
                            </span>
                        )}
                        {children}
                    </Link>
            }
        </div>
    );
}

export default SidebarItem
