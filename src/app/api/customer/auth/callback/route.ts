import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return new NextResponse("Missing code or state", { status: 400 });
  }

  const c = await cookies();
  const savedState = c.get("oauth_state")?.value;
  const verifier = c.get("pkce_verifier")?.value;

  if (!savedState || state !== savedState) {
    return new NextResponse("Invalid state", { status: 400 });
  }
  if (!verifier) {
    return new NextResponse("Missing PKCE verifier", { status: 400 });
  }

  const shopId = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID!;
  const clientId = process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_API_CLIENT_ID!;
  const redirectUri = process.env.SHOPIFY_REDIRECT_URI!;
  const tokenEndpoint = `https://shopify.com/authentication/${shopId}/oauth/token`;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    redirect_uri: redirectUri,
    code,
    code_verifier: verifier,
  });

  const resp = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!resp.ok) {
    const text = await resp.text();
    return new NextResponse(`Token exchange failed: ${text}`, { status: 400 });
  }

  const tokens = await resp.json() as {
    access_token: string;
    id_token?: string;
    refresh_token?: string;
    expires_in?: number; // seconds
    token_type?: string;
  };

  // Clear one-time cookies
  c.delete("pkce_verifier");
  c.delete("oauth_state");
  c.delete("oauth_nonce");

  // Store the customer access token in an HttpOnly cookie (or your own session store)
  const maxAge = Math.max(60, (tokens.expires_in ?? 3600) - 60); // safety minus 60s
  c.set("token", tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });


  const redirectAfterLogin =
    process.env.NEXT_PUBLIC_POST_LOGIN_REDIRECT ??
    "https://printerlike-nonindustriously-amparo.ngrok-free.dev/";

  return NextResponse.redirect(redirectAfterLogin, { status: 302 });
}