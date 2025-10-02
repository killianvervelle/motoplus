import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateCodeVerifier, generateCodeChallenge, randomState, randomNonce } from "@/lib/oauth/pkce";

export async function GET() {
  const shopId = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID!;
  const clientId = process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_API_CLIENT_ID!;
  const redirectUri = process.env.SHOPIFY_REDIRECT_URI!;

  const verifier = generateCodeVerifier();
  const challenge = generateCodeChallenge(verifier);
  const state = randomState();
  const nonce = randomNonce();

  const c = await cookies();

  const maxAge = 60 * 60;

  c.set("pkce_verifier", verifier, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge });
  c.set("oauth_state", state, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge });
  c.set("oauth_nonce", nonce, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge });

  const authUrl = new URL(`https://shopify.com/authentication/${shopId}/oauth/authorize`);
  authUrl.searchParams.set("scope", "openid email customer-account-api:full");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("nonce", nonce);
  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  return NextResponse.redirect(authUrl.toString(), { status: 302 });
}