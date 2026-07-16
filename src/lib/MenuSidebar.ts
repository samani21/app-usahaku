import { Database, Gift, Globe, LayoutDashboard, Radio, ScrollText, Store } from "lucide-react";
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
        Icon: Globe,
        label: "katalog",
        href: '/catalog',
    },
];
