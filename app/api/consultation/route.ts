import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "mail.smtp2go.com",
  port: Number(process.env.SMTP_PORT || 25),
  secure: false,
  // Nodemailer's defaults (~2 min) would leave a visitor staring at "Sending…"
  // far too long if the relay is ever slow or unreachable.
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 15_000,
});

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitByIp = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitByIp.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitByIp.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count += 1;
  return false;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const company = String(body.company ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const interest = String(body.interest ?? "").trim();
  const message = String(body.message ?? "").trim();
  const honeypot = String(body.website ?? "").trim();

  // Bot caught the honeypot field — pretend success so it doesn't learn to skip it.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid name and email." },
      { status: 400 }
    );
  }
  if (
    name.length > 200 ||
    email.length > 200 ||
    company.length > 200 ||
    phone.length > 50 ||
    message.length > 5000
  ) {
    return NextResponse.json(
      { error: "One or more fields are too long." },
      { status: 400 }
    );
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@haley365.com",
      to: process.env.CONSULT_TO_EMAIL || "contact@haley365.com",
      replyTo: email,
      subject: `Consultation request — ${company || name}`,
      text: `Name: ${name}\nWork email: ${email}\nCompany: ${company}\nPhone: ${phone}\nInterested in: ${interest}\n\n${message}`,
    });
  } catch (err) {
    console.error("Failed to send consultation email", err);
    return NextResponse.json(
      { error: "Something went wrong sending your request. Please email us directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
