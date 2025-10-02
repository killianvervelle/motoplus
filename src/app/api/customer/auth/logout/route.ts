import { NextResponse } from "next/server";

function makeLogoutResponse() {
  const shopId = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID!;
  const logoutUrl = `https://${shopId}.myshopify.com/account/logout?return_to=https://www.shopmotoplus.ch/`;

  const res = NextResponse.redirect(logoutUrl, 302);

  // clear cookies
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

  return res;
}

export async function GET() {
  return makeLogoutResponse();
}

export async function POST() {
  return makeLogoutResponse();
}