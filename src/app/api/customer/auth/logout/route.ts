import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const prod = process.env.NODE_ENV === "production";

export async function GET() {
  const shopId = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID!;
  const c = await cookies();

  // Grab the ID token you saved during login
  const idToken = c.get("id_token")?.value;

  // If no id_token, just clear local cookies and redirect to login
  if (!idToken) {
    const res = NextResponse.redirect("https://www.shopmotoplus.ch/login", 302);
    clearCookies(res);
    return res;
  }

  // Build Shopify logout URL
  const logoutUrl = new URL(`https://shopify.com/authentication/${shopId}/logout`);
  logoutUrl.searchParams.set("id_token_hint", idToken);
  logoutUrl.searchParams.set("post_logout_redirect_uri", "https://www.shopmotoplus.ch/login");

  // Redirect to Shopify logout, and also clear local cookies
  const res = NextResponse.redirect(logoutUrl.toString(), 302);
  clearCookies(res);
  return res;
}

export async function POST() {
  // support POST logout too
  return GET();
}

function clearCookies(res: NextResponse) {
  // clear both access + id tokens
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: prod,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    domain: ".shopmotoplus.ch",
  });
  res.cookies.set("id_token", "", {
    httpOnly: true,
    secure: prod,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    domain: ".shopmotoplus.ch",
  });
  res.cookies.set("pkce_verifier", "", { path: "/", maxAge: 0 });
  res.cookies.set("oauth_state", "", { path: "/", maxAge: 0 });
  res.cookies.set("oauth_nonce", "", { path: "/", maxAge: 0 });
}