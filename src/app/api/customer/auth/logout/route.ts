// app/api/customer/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const prod = process.env.NODE_ENV === "production";

async function buildLogoutRedirect() {
  const c = await cookies();
  const idToken = c.get("id_token")?.value || "";

  // 1) Discover OIDC endpoints
  // Use Shopify’s documented discovery URL. If your storefront domain serves the discovery, use that domain; otherwise use the issuer domain.
  const shopId = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID!;
  const discoveryUrl = `https://shopify.com/authentication/${shopId}/.well-known/openid-configuration`;
  const conf = await fetch(discoveryUrl, { cache: "no-store" }).then(r => r.json());

  // 2) Build end_session URL with the required params
  const endSession = new URL(conf.end_session_endpoint);
  endSession.searchParams.set("id_token_hint", idToken);
  endSession.searchParams.set("post_logout_redirect_uri", "https://www.shopmotoplus.ch/login");
  return endSession.toString();
}

function clearCookies(res: NextResponse) {
  res.cookies.set("token", "", {
  httpOnly: true,
  secure: prod,
  sameSite: "lax", // <- inferred as string (too wide)
  path: "/",
  maxAge: 0,
  domain: ".shopmotoplus.ch",
});
res.cookies.set("id_token", "", {
  httpOnly: true,
  secure: prod,
  sameSite: "lax", // <- inferred as string (too wide)
  path: "/",
  maxAge: 0,
  domain: ".shopmotoplus.ch",
});
}
 
export async function GET() {
  const logoutUrl = await buildLogoutRedirect();
  const res = NextResponse.redirect(logoutUrl, 302);
  clearCookies(res);
  return res;
}

export async function POST() {
  // For safety if someone still POSTs
  return GET();
}