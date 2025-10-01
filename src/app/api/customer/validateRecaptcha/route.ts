import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { recaptchaResponse } = await req.json();
  if (!recaptchaResponse) return NextResponse.json({ success: false }, { status: 400 });

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY || "",
      response: recaptchaResponse,
    }),
    cache: "no-store",
  });
  const data = await res.json();
  console.log("🔎 reCAPTCHA verify response:", data);
  return NextResponse.json({ success: !!data.success }, { status: data.success ? 200 : 400 });
}