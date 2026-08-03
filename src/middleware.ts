import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost";

export function middleware(req: NextRequest) {
    const host = req.headers.get("host") || "";
    const hostname = host.split(":")[0];
    const url = req.nextUrl.clone();

    // 1. Redirect (Mental) dari /super-admin/login ke /auth/login
    // Diletakkan paling atas agar berlaku di root domain maupun subdomain
    if (url.pathname.startsWith('/super-admin')) {
        url.pathname = "/auth/login";
        return NextResponse.redirect(url); // Gunakan redirect agar URL di browser ikut berubah
    }

    // 2. Abaikan IP Address (Biar aman saat testing lokal via IP network)
    const isIpAddress = /^[0-9.]+$/.test(hostname);
    if (isIpAddress) {
        return NextResponse.next();
    }

    // 3. Logika Root Domain -> Main Store
    // localhost murni atau store-usahaku.com berjalan normal
    if (hostname === "localhost" || hostname === ROOT_DOMAIN) {
        return NextResponse.next();
    }

    // 4. Logika Subdomain -> Tenant
    // Menangkap subdomain (misal: namatoko.store-usahaku.com ATAU super-admin.localhost)
    if (hostname.endsWith(`.${ROOT_DOMAIN}`) || hostname.endsWith(".localhost")) {
        // Deteksi apakah sedang di local atau production
        const isLocal = hostname.endsWith(".localhost");
        const baseDomain = isLocal ? "localhost" : ROOT_DOMAIN;

        // Ambil nama tenant (contoh: "super-admin" dari "super-admin.localhost")
        const tenant = hostname.replace(`.${baseDomain}`, "");

        // Jangan jadikan "www" sebagai nama tenant
        if (tenant === "www") {
            return NextResponse.next();
        }

        // Rewrite URL ke folder /[tenant]
        // Contoh: super-admin.localhost:3000 -> render /[tenant]/page.tsx (tenant = super-admin)
        url.pathname = `/${tenant}${req.nextUrl.pathname}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    // Abaikan file statis dan internal Next.js agar middleware tidak kerja dua kali
    matcher: ["/((?!_next|favicon.ico|api|images|public).*)"],
};