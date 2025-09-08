import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const firstName = String(form.get("firstName") || "");
    const lastName  = String(form.get("lastName")  || "");
    const email     = String(form.get("email")     || "");
    const subject   = String(form.get("name")      || "Contact form");
    const message   = String(form.get("message")   || "");

    const url = `${process.env.SHOPIFY_STORE_DOMAIN!.replace(/\/$/, "")}/contact`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        form_type: "contact",
        "contact[name]": `${firstName} ${lastName}`.trim() || "Visitor",
        "contact[email]": email,
        "contact[body]": `Subject: ${subject}\n\n${message}\n\nFrom: ${firstName} ${lastName} <${email}>`,
      }),
      cache: "no-store",
      redirect: "follow", 
    });

    const ok = res.ok || res.status === 302 || res.status === 303;
    if (!ok) {
      const preview = (await res.text()).slice(0, 500);
      return NextResponse.json({ ok: false, status: res.status, preview }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}