import { NextRequest, NextResponse } from "next/server";


const protectedRoutes = ["/dashboard"];
console.log(process.env.BACKEND_URI)
const GET_USER_URL = `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/getUser`;
const REFRESH_TOKEN_URL = `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/auth/refresh-token`;

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  
  const isProtected = protectedRoutes.includes(pathname);

  if (accessToken) {
    const userRes = await fetch(GET_USER_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (userRes.ok) {
      if (pathname === "/login" || pathname === "/register") {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }
  }

  if (refreshToken) {
    const refreshRes = await fetch(REFRESH_TOKEN_URL, {
      method: "GET",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      console.log(refreshData);

      if (pathname === "/login" || pathname === "/register") {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }

      return NextResponse.next();
    }
  }

  if (isProtected) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard"],
};
