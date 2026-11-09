import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  budget?: string;
  message?: string;
};

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let body: ContactPayload;
  let attachment: File | null = null;

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      body = {
        name: form.get("name")?.toString(),
        email: form.get("email")?.toString(),
        message: form.get("message")?.toString(),
      };
      const file = form.get("attachment");
      if (file instanceof File && file.size > 0) attachment = file;
    } else {
      body = await request.json();
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 422 },
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 422 });
  }

  // Delivery isn't wired up yet — wire an email provider (e.g. Resend) here
  // and point it at hello@nikolaev.agency, or persist to a CRM/table instead.
  console.log("New contact inquiry", body, attachment ? { attachment: attachment.name } : {});

  return NextResponse.json({ ok: true });
}
