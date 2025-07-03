import { NextRequest, NextResponse } from "next/server";

// Routes where authenticated users should NOT go (e.g. login, register)
const publicRoutes = ["/", "/login", "/register"];

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
    console.log(accessToken);
  const isPublic = publicRoutes.includes(req.nextUrl.pathname);

  // ✅ If user is logged in and tries to visit login/register → redirect to dashboard
  if (accessToken && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ✅ If user is NOT logged in and tries to access a protected page → redirect to login
  const protectedRoutes = ["/dashboard"];
  const isProtected = protectedRoutes.includes(req.nextUrl.pathname);

  if (!accessToken && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow request to proceed
  return NextResponse.next();
}

// Apply middleware to all routes or selectively
export const config = {
  matcher: ["/", "/login", "/register", "/dashboard"], // add more if needed
};
