import { Database, Gift, Globe, HandCoins, Landmark, Layers, LayoutDashboard, Radio, ScrollText, Store, UserCircle } from "lucide-react";
import { ReactElement } from "react";

interface child {
    label: string;
    href: string
}

interface menuSide {
    Icon: any;
    label: string;
    count?: number;
    href: string;
    child?: child[];
    children?: ReactElement<Element>;
}


export const menuSidebar: menuSide[] = [
    {
        Icon: LayoutDashboard,
        label: "Dashboard",
        href: '/'
    },

    {
        Icon: Database,
        label: "Manage",
        href: '/manage',
        child: [
            {
                label: 'Info Toko',
                href: '/store'
            },
            {
                label: 'Karyawan',
                href: '/employee'
            },
            {
                label: 'Banks',
                href: '/banks'
            },
            {
                label: 'Outlet',
                href: '/outlets'
            },
            {
                label: 'Kategori',
                href: '/categories'
            },
            {
                label: 'Produk',
                href: '/products'
            },
            {
                label: 'Jasa',
                href: '/services'
            },
            {
                label: 'Stok',
                href: '/product-stock'
            },
            {
                label: 'Riwayat Promo',
                href: '/promo-histories'
            },
        ]
    },
    {
        Icon: ScrollText,
        label: "Transaksi",
        href: '/transaction',
        child: [
            {
                label: 'Orderan',
                href: '/orders'
            },
            {
                label: 'Pembayaran',
                href: '/payments'
            },
            // {
            //     label: 'Pembayaran',
            //     href: '/payment'
            // },
            // {
            //     label: 'Retur / Refund',
            //     href: '/refund'
            // },
            // {
            //     label: 'Riwayat Keuangan',
            //     href: '/history'
            // },
        ]
    },
    {
        Icon: Radio,
        label: "Postingan",
        href: '/posting',
        child: [
            {
                label: 'Story',
                href: '/stories'
            },
            {
                label: 'Posting',
                href: '/post'
            },
            // {
            //     label: 'Pembayaran',
            //     href: '/payment'
            // },
            // {
            //     label: 'Retur / Refund',
            //     href: '/refund'
            // },
            // {
            //     label: 'Riwayat Keuangan',
            //     href: '/history'
            // },
        ]
    },
    {
        Icon: Landmark,
        label: "Keuangan",
        href: '/accounting',
        child: [
            {
                label: 'Pengeluaran',
                href: '/expenses'
            },
            {
                label: 'Keuangan',
                href: '/finance'
            },
        ]
    },
    {
        Icon: Globe,
        label: "katalog",
        href: '/catalog',
    },
];
export const EmployeeMenuSidebar: menuSide[] = [
    {
        Icon: LayoutDashboard,
        label: "Dashboard",
        href: '/employee'
    },
    {
        Icon: ScrollText,
        label: 'Orderan',
        href: '/employee/orders'
    },
];
export const SuperAdminMenuSidebar: menuSide[] = [
    {
        Icon: LayoutDashboard,
        label: "Dashboard",
        href: '/'
    },
    {
        Icon: Database,
        label: "Master",
        href: '/master',
        child: [
            {
                label: 'Pembayaran',
                href: '/banks'
            },
            {
                label: 'Banner',
                href: '/banners'
            },
            {
                label: 'Kategori',
                href: '/categories'
            },
            {
                label: 'Kommisi',
                href: '/commision'
            },
            {
                label: 'Paket',
                href: '/packages'
            },
        ]
    },
    {
        Icon: Layers,
        label: "Landing Page",
        href: '/landing-page',
        child: [
            {
                label: 'Hero',
                href: '/hero'
            },
            {
                label: 'Feature',
                href: '/features'
            },
            {
                label: 'Harga',
                href: '/pricing'
            },
            {
                label: 'CTA',
                href: '/cta'
            },
            {
                label: 'Footer',
                href: '/footer'
            },
        ]
    },
    {
        Icon: UserCircle,
        label: "Pengguna",
        href: '/users',
        child: [
            {
                label: 'Pengguna',
                href: '/users'
            },
            {
                label: 'Client',
                href: '/client'
            },
            {
                label: 'Customer',
                href: '/customer'
            },
        ]
    },
    {
        Icon: HandCoins,
        label: "Afiliasi",
        href: '/Affiliate',
        child: [
            {
                label: 'Kommisi',
                href: '/commision'
            },
            {
                label: 'Penarikan',
                href: '/withdraw'
            },
        ]
    },
];
