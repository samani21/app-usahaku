import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "usahaku.store";

export function middleware(req: NextRequest) {
    const host = req.headers.get("host") || "";
    const hostname = host.split(":")[0];
    const url = req.nextUrl.clone();

    const isLocal = hostname.endsWith(".localhost") || hostname === "localhost";
    const baseDomain = isLocal ? "localhost" : ROOT_DOMAIN;

    // Jika diakses lewat super-admin.usahaku.store, arahkan ke folder /super-admin
    if (hostname === `super-admin.${baseDomain}` || hostname === "super-admin.localhost") {
        url.pathname = `/super-admin${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    // Jika diakses lewat app.usahaku.store, jalankan folder (main)
    if (hostname === `app.${baseDomain}` || hostname === "app.localhost") {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api|images|public|sitemap.xml|robots.txt).*)"],
};