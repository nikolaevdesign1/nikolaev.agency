/** Key shared with the cookie notice: "accepted" | "declined". */
export const CONSENT_KEY = "cookie-choice";

type Gtag = (...args: unknown[]) => void;

function gtag(): Gtag | undefined {
  return typeof window === "undefined" ? undefined : (window as unknown as { gtag?: Gtag }).gtag;
}

/** Sends a Google Analytics event. Does nothing when the tag has not loaded. */
export function track(event: string, params: Record<string, string | number | boolean> = {}) {
  gtag()?.("event", event, params);
}

/** Tells Google Analytics whether it may set cookies. Advertising storage always stays off. */
export function setAnalyticsConsent(granted: boolean) {
  gtag()?.("consent", "update", { analytics_storage: granted ? "granted" : "denied" });
}
