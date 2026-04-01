import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  if (pathname.startsWith("/super")) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    if (!user.isSuperAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    if (user.isSuperAdmin) {
      return NextResponse.redirect(new URL("/super/dashboard", req.url));
    }

    if (!user.eventId) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.next();
  }

  if (pathname === "/admin/login" && user) {
    const dest = user.isSuperAdmin ? "/super/dashboard" : "/admin/dashboard";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/super/:path*"],
};
