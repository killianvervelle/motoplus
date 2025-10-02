import { NextResponse } from "next/server";


export async function POST() {
  const res = NextResponse.json({ success: true });
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

  const shopId = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID;

  res.headers.set(
    "Location",
    `https://${shopId}.myshopify.com/account/logout?return_to=https://www.shopmotoplus.ch/`
  );

  return res;
}