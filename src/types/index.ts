// types/index.ts (Buat file baru untuk menyimpan tipe data)
export interface User {
    id: number;
    name: string;
    email: string;
    // tambahkan field lain sesuai kebutuhan
}

export interface Business {
    id: number;
    name: string;
    logo_url?: string;
    plan: 'trial' | 'premium';
    subscription_status: 'active' | 'expired' | 'canceled';
    verified_status: boolean | number;
}