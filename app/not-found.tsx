import type { Metadata } from "next";
import { StatusPage } from "@/components/status-page";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="This page is not here."
      text="The link may be old or mistyped. The work, the studio and the notes are one click away."
    />
  );
}
