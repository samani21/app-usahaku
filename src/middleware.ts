import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "usahaku.store";

export function middleware(req: NextRequest) {
    const host = req.headers.get("host") || "";
    const hostname = host.split(":")[0];
    const url = req.nextUrl.clone();

    // Deteksi environment lokal (.localhost atau localhost) vs Production
    const isLocal = hostname.endsWith(".localhost") || hostname === "localhost";
    const baseDomain = isLocal ? "localhost" : ROOT_DOMAIN;

    // 1. BLOKIR KETAT: Jika ada yang mencoba akses path /super-admin via domain utama atau app subdomain
    if (url.pathname.startsWith("/super-admin")) {
        // Jika diakses selain dari subdomain super-admin, tolak (Forbidden / 404)
        if (hostname !== `super-admin.${baseDomain}` && hostname !== "super-admin.localhost") {
            return new NextResponse("Forbidden", { status: 403 });
        }
    }

    // Ekstrak subdomain / tenant
    let subdomain = "";
    if (hostname.endsWith(`.${baseDomain}`)) {
        subdomain = hostname.replace(`.${baseDomain}`, "");
    } else if (isLocal && hostname !== "localhost") {
        subdomain = hostname.replace(".localhost", "");
    }

    // 2. KONDISI: super-admin.usahaku.store
    if (subdomain === "super-admin") {
        // Rewrite ke folder /super-admin
        url.pathname = `/super-admin${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    // 3. KONDISI: app.usahaku.store atau root domain (usahaku.store / www)
    // Sesuai struktur foldermu, folder (main) menggunakan route group, 
    // sehingga URL aslinya langsung diakses tanpa prefix tambahan.
    if (subdomain === "app" || hostname === baseDomain || hostname === `www.${baseDomain}` || hostname === "localhost") {
        return NextResponse.next();
    }

    // 4. KONDISI: Subdomain Tenant Toko Klien Lain (misal: namatoko.usahaku.store)
    if (subdomain && subdomain !== "www") {
        // Arahkan ke folder dynamic tenant kamu (misal: /sites/[tenant] atau /store/[tenant])
        url.pathname = `/sites/${subdomain}${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api|images|public|sitemap.xml|robots.txt).*)"],
};