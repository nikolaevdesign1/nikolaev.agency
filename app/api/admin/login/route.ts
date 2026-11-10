import { NextResponse } from "next/server";
import { COOKIE, adminConfigured, makeSession, passwordMatches } from "@/lib/content/auth";

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ error: "ADMIN_PASSWORD is not set." }, { status: 503 });
  }
  let password = "";
  try {
    password = String(((await request.json()) as { password?: unknown }).password ?? "");
  } catch {
    /* empty body */
  }
  // small delay slows down guessing
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (!passwordMatches(password)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  const session = makeSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, session.value, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: session.maxAge,
  });
  return res;
}
