import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Holding page. Until this moment every page of the site answers with a short "back on" note,
 * and then the proxy steps aside by itself. The answer is 503 with Retry-After, which tells search
 * engines the pause is temporary, so no page drops out of the index.
 *
 * To look at the real site meanwhile, open any address with ?preview=1; a cookie remembers it.
 */
const BACK_AT = "2026-11-20T00:00:00+02:00";
const BACK_ON = "November 20";
const MAIL = "info@nikolaev.agency";
const PREVIEW_COOKIE = "site-preview";

export const config = {
  // Admin, API routes, framework files, the sitemap and everything with a file extension stay reachable.
  matcher: ["/((?!api|admin|_next|robots\\.txt|sitemap\\.xml|.*\\..*).*)"],
};

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>nikolaev.agency | Back on ${BACK_ON}</title>
<link rel="icon" href="/icon-light.svg" type="image/svg+xml" media="(prefers-color-scheme: light)">
<link rel="icon" href="/icon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)">
<style>
@font-face{font-family:Caslon;src:url(/maintenance/caslon.woff2) format("woff2");font-display:swap}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:#0a0a0a;color:#f3f1ea}
body{min-height:100vh;display:flex;flex-direction:column;justify-content:space-between;padding:28px clamp(20px,5vw,72px) 32px;font-family:ui-monospace,"SF Mono",Menlo,monospace;-webkit-font-smoothing:antialiased}
.brand{font-size:18px;line-height:1}
.brand small{display:block;margin-top:6px;font-size:10px;color:#9a978f}
h1{max-width:13ch;margin:0;font:400 clamp(46px,9.6vw,148px)/.96 Caslon,"Times New Roman",serif}
.note{margin:28px 0 0;font-size:clamp(14px,1.4vw,18px);color:#9a978f}
.note a{color:#f3f1ea;text-decoration:underline;text-underline-offset:5px;text-decoration-thickness:1px;transition:opacity .2s}
.note a:hover{opacity:.6}
.foot{font-size:11px;color:#6f6c66}
</style>
</head>
<body>
<div class="brand">nikolaev.agency<small>by Oleg Nikolaev</small></div>
<main>
<h1>While you play GTA&nbsp;VI, we&rsquo;re polishing the site.</h1>
<p class="note">Back on ${BACK_ON}. Write to us: <a href="mailto:${MAIL}">${MAIL}</a></p>
</main>
<div class="foot">Back on ${BACK_ON}</div>
</body>
</html>`;

export function proxy(request: NextRequest) {
  const until = Date.parse(BACK_AT);
  if (Date.now() >= until) return NextResponse.next();

  const url = request.nextUrl;
  if (url.searchParams.get("preview") === "1") {
    const clean = url.clone();
    clean.searchParams.delete("preview");
    const response = NextResponse.redirect(clean);
    response.cookies.set(PREVIEW_COOKIE, "1", { path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
    return response;
  }
  if (request.cookies.get(PREVIEW_COOKIE)?.value === "1") return NextResponse.next();

  return new NextResponse(page, {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Retry-After": String(Math.max(3600, Math.ceil((until - Date.now()) / 1000))),
      "Cache-Control": "no-store",
    },
  });
}
