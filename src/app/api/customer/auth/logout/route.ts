import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const c = await cookies();
  c.delete("token");
  // Optionally also call Shopify logout endpoint, but clearing local session is enough for your app
  return NextResponse.json({ ok: true });
}