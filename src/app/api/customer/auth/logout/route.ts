// app/api/customer/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const prod = process.env.NODE_ENV === "production";

async function buildLogoutRedirect() {
  const c = await cookies();
  const idToken = c.get("id_token")?.value || "";

  const shopDomain = process.env.NEXT_PUBLIC_CUSTOMER_ACCOUNT_DOMAIN!; 
  // Example: "91717009789.account.shopify.com"
  const discoveryUrl = `https://${shopDomain}/.well-known/openid-configuration`;

  const conf = await fetch(discoveryUrl, { cache: "no-store" }).then(r => r.json());

  const endSession = new URL(conf.end_session_endpoint);
  endSession.searchParams.set("id_token_hint", idToken);
  endSession.searchParams.set("post_logout_redirect_uri", "https://www.shopmotoplus.ch/login");
  return endSession.toString();
}

function clearCookies(res: NextResponse) {
  const base = {
    httpOnly: true,
    secure: prod,
    sameSite: "lax" as const,
    path: "/",
    domain: ".shopmotoplus.ch",
  };
  res.cookies.set("token", "", { ...base, maxAge: 0 });
  res.cookies.set("id_token", "", { ...base, maxAge: 0 });
  res.cookies.set("pkce_verifier", "", { path: "/", maxAge: 0 });
  res.cookies.set("oauth_state", "", { path: "/", maxAge: 0 });
  res.cookies.set("oauth_nonce", "", { path: "/", maxAge: 0 });
}

export async function GET() {
  const logoutUrl = await buildLogoutRedirect();
  const res = NextResponse.redirect(logoutUrl, 302);
  clearCookies(res);
  return res;
}

export async function POST() {
  return GET();
}