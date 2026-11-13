import { NextResponse } from "next/server";
import { ATTACHMENT_MAX_BYTES, sendContactMail } from "@/lib/mail";
import { site } from "@/lib/data/site";

type ContactPayload = {
  name?: string;
  email?: string;
  reason?: string;
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
        reason: form.get("reason")?.toString(),
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

  if (message.length > 1000 || name.length > 200 || email.length > 320) {
    return NextResponse.json({ error: "The message is too long." }, { status: 422 });
  }
  if (attachment && attachment.size > ATTACHMENT_MAX_BYTES) {
    return NextResponse.json({ error: "The file is larger than 10 MB." }, { status: 413 });
  }

  try {
    await sendContactMail({
      name,
      email,
      reason: body.reason,
      message,
      attachment: attachment
        ? { filename: attachment.name, content: Buffer.from(await attachment.arrayBuffer()) }
        : undefined,
    });
  } catch (error) {
    console.error("Contact message was not delivered", error);
    return NextResponse.json(
      { error: `We could not send the message. Please write to ${site.email}.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
