import { NextResponse } from "next/server";

function clearCookies(res: NextResponse) {
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    domain: ".shopmotoplus.ch",
  });
  res.cookies.set("pkce_verifier", "", { path: "/", maxAge: 0 });
  res.cookies.set("oauth_state", "", { path: "/", maxAge: 0 });
  res.cookies.set("oauth_nonce", "", { path: "/", maxAge: 0 });
}

export async function GET() {
  const res = NextResponse.redirect("https://www.shopmotoplus.ch/login");
  clearCookies(res);
  return res;
}

export async function POST() {
  const res = NextResponse.redirect("https://www.shopmotoplus.ch/login");
  clearCookies(res);
  return res;
}