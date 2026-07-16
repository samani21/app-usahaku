import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost";

export function middleware(req: NextRequest) {
    const host = req.headers.get("host") || "";
    const hostname = host.split(":")[0];
    const url = req.nextUrl.clone();

    // 1. Abaikan Localhost atau IP (Biar aman saat testing lokal biasa)
    const isIpAddress = /^[0-9.]+$/.test(hostname);
    if (isIpAddress || hostname === "localhost") {
        return NextResponse.next();
    }

    // 2. Logika Root Domain -> Main Store
    // Biarkan domain utama (store-usahaku.com) berjalan normal
    if (hostname === ROOT_DOMAIN) {
        return NextResponse.next();
    }

    // 3. Logika Subdomain -> Tenant
    // Menangkap subdomain (misal: namatoko.store-usahaku.com)
    if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
        const tenant = hostname.replace(`.${ROOT_DOMAIN}`, "");

        // Opsional tapi penting: Jangan jadikan "www" sebagai nama tenant
        if (tenant === "www") {
            return NextResponse.next();
        }

        // Langsung rewrite URL ke folder /[tenant]
        // Contoh: namatoko.store-usahaku.com -> aplikasi merender /[tenant]/page.tsx
        url.pathname = `/${tenant}${req.nextUrl.pathname}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    // Abaikan file statis dan internal Next.js agar middleware tidak kerja dua kali
    matcher: ["/((?!_next|favicon.ico|api|images|public).*)"],
};