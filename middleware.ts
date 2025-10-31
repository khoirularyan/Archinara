import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN ?? "dev-token";
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ?? "dev-secret";

// Role yang diizinkan untuk /pm/**
const PM_ALLOWED_ROLES = ["ADMIN", "MANAGER", "ARCHITECT"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 0) Biarkan request OPTIONS (preflight) lewat
  if (req.method === "OPTIONS") {
    return NextResponse.next();
  }

  // 1) Halaman publik PM yang tidak perlu autentikasi
  const publicPMPages = [
    "/pm",
    "/pm/login",
    "/pm/signup",
    "/pm/forgot-password",
    "/pm/reset-password",
  ];
  
  const isPublicPMPage = publicPMPages.some(page => pathname === page || pathname.startsWith(page + "/"));
  
  if (isPublicPMPage) {
    return NextResponse.next();
  }

  // 2) Cek NextAuth session (buat user yang login dari browser)
  const sessionToken = await getToken({
    req,
    secret: NEXTAUTH_SECRET,
  });

  // 3) Cek Bearer token (buat Postman / service lain)
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const hasValidBearer = bearerToken === DASHBOARD_TOKEN;

  // 4) Kalau Bearer token valid → izinkan (bypass role check)
  if (hasValidBearer) {
    return NextResponse.next();
  }

  // 5) Kalau tidak ada session → redirect ke login
  if (!sessionToken) {
    const loginUrl = new URL("/pm/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 6) Cek role untuk route /pm/**
  if (pathname.startsWith("/pm")) {
    const userRole = sessionToken.role as string;
    if (!PM_ALLOWED_ROLES.includes(userRole)) {
      // Role tidak cocok → redirect ke forbidden
      return NextResponse.redirect(new URL("/auth/forbidden", req.url));
    }
  }

  // 7) Route /work/** → semua user yang login boleh akses
  // (tidak perlu cek role tambahan)

  return NextResponse.next();
}

// Jalur yang dilindungi
export const config = {
  matcher: [
    "/pm/:path*", // semua halaman PM
    "/work/:path*", // semua halaman Work
  ],
};
