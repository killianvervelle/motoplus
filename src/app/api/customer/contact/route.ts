import { NextResponse } from "next/server";
import FormData from "form-data";
import Mailgun from "mailgun.js";
import { signUpFormSchema } from "./schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    if (!json) {
      return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    }

    if (!json.subject && typeof json.name === "string") {
      json.subject = json.name;
    }

    const parsed = signUpFormSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid input", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, subject, message } = parsed.data;

    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN || !process.env.CONTACT_TO) {
      return NextResponse.json(
        { ok: false, error: "Missing MAILGUN_* or CONTACT_* env vars" },
        { status: 500 }
      );
    }

    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY,
      // If you’re using EU region:
      url: process.env.MAILGUN_REGION === "eu" ? "https://api.eu.mailgun.net" : "https://api.mailgun.net",
    });

    const subjectLine = subject ?? `New contact from ${firstName}`;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");

    try {
      const data = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: process.env.CONTACT_FROM,
        to: [process.env.CONTACT_TO],
        "h:Reply-To": email,
        subject: subjectLine,
        text: `From: ${fullName} <${email}>\n\n${message}`,
        html: `<p><strong>From:</strong> ${fullName} &lt;${email}&gt;</p><p>${message.replace(/\n/g, "<br/>")}</p>`,
      });

      console.log("[contact] Mailgun response:", data);

      return NextResponse.json({ ok: true, id: data.id });
    } catch (e: any) {
      console.error("[contact] Mailgun send error:", e);
      return NextResponse.json(
        { ok: false, error: "mailgun_error", details: e?.message || e },
        { status: 502 }
      );
    }
  } catch (err: any) {
    const details = err?.response?.body ?? err?.message ?? "Server error";
    return NextResponse.json({ ok: false, error: details }, { status: 500 });
  }
}