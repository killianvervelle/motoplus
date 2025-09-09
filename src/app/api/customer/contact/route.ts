import { NextResponse } from "next/server";
import * as sgMail from "@sendgrid/mail";
import { signUpFormSchema } from "../../../contact/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    if (!json) return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });

    if (!json.subject && typeof json.name === "string") json.subject = json.name;

    const parsed = signUpFormSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
    }

    const { firstName, lastName, email, subject, message } = parsed.data;

    if (!process.env.SENDGRID_API_KEY || !process.env.CONTACT_FROM || !process.env.CONTACT_TO) {
      return NextResponse.json({ ok: false, error: "Missing SENDGRID/CONTACT_* env vars" }, { status: 500 });
    }
    if (process.env.SENDGRID_REGION === "eu" && "setDataResidency" in sgMail) {
      (sgMail as any).setDataResidency("eu");
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

    const subjectLine = subject ?? `New contact from ${firstName}`;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const text = `From: ${fullName} <${email}>\n\n${message}`;
    const html = `<p><strong>From:</strong> ${fullName} &lt;${email}&gt;</p><p>${message.replace(/\n/g, "<br/>")}</p>`;

    const msg = {
      to: process.env.CONTACT_TO!,
      from: process.env.CONTACT_FROM!, 
      subject: subjectLine,
      replyTo: email,
      text,
      html,
    };

    const [resp] = await sgMail.send(msg);
    // 2xx is success
    if (resp.statusCode < 200 || resp.statusCode >= 300) {
      return NextResponse.json({ ok: false, error: "SendGrid error", status: resp.statusCode }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const details = err?.response?.body ?? err?.message ?? "Server error";
    return NextResponse.json({ ok: false, error: details }, { status: 500 });
  }
}