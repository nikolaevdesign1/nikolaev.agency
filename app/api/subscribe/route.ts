import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: string };
    email = (body.email ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 422 });
  }

  // Storage isn't wired up yet: connect a mailing list or a table here.
  console.log("New subscriber", email);
  return NextResponse.json({ ok: true });
}
