// middleware.js
import { NextResponse } from "next/server";
import { getCookie } from "cookies-next";

export function middleware(req) {
  // Mendapatkan token dari cookies
  const token = getCookie("token", { req });

  // Mendapatkan URL yang diminta
  const { pathname } = req.nextUrl;

  // Cek apakah URL termasuk dalam halaman yang dibatasi
  const protectedRoutes = ["/dashboard", "/profile", "/cart", "/my-transactions"];

  // Jika tidak ada token dan URL termasuk dalam halaman yang dibatasi
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Arahkan pengguna ke halaman login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Jika ada token atau URL tidak dibatasi, lanjutkan permintaan
  return NextResponse.next();
}

// Tentukan middleware hanya untuk halaman tertentu
export const config = {
  matcher: [
    "/dashboard",
    "/profile",
    "/cart",
    "/my-transactions",
    "/dashboard/:path*",
    "/profile/:path*",
    "/cart/:path*",
    "/my-transactions/:path*",
  ], // Menerapkan middleware ke semua rute di bawah /dashboard, /profile, /cart, dan /transactions
};
