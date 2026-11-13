import "server-only";

/** Monthly ceiling on what the chat model may cost, in dollars. The last five cents are kept in reserve. */
export const MONTHLY_CAP_USD = 1;
const STOP_AT_USD = MONTHLY_CAP_USD - 0.05;

const PATH = "chat/spend.json";
type Spend = { month: string; usd: number };

const thisMonth = () => new Date().toISOString().slice(0, 7);
let memory: Spend | null = null; // local development only

async function read(): Promise<Spend> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    // Without storage the total cannot be kept between requests, so only local runs may go on.
    if (process.env.NODE_ENV === "production") throw new Error("No storage for the spend counter.");
    return memory?.month === thisMonth() ? memory : { month: thisMonth(), usd: 0 };
  }
  const { list } = await import("@vercel/blob");
  const { blobs } = await list({ prefix: PATH, limit: 1 });
  const hit = blobs.find((blob) => blob.pathname === PATH);
  if (!hit) return { month: thisMonth(), usd: 0 };
  const res = await fetch(`${hit.url}?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("The spend counter could not be read.");
  const data = (await res.json()) as Spend;
  return data.month === thisMonth() ? data : { month: thisMonth(), usd: 0 };
}

/** True while this month's spending is below the ceiling. Any doubt counts as "no". */
export async function budgetAvailable(): Promise<boolean> {
  try {
    return (await read()).usd < STOP_AT_USD;
  } catch (error) {
    console.error("Chat budget check failed", error);
    return false;
  }
}

/** Adds the cost of one reply to this month's total. */
export async function addSpend(usd: number) {
  try {
    const current = await read();
    const next: Spend = { month: thisMonth(), usd: current.usd + usd };
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      memory = next;
      return;
    }
    const { put } = await import("@vercel/blob");
    await put(PATH, JSON.stringify(next), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 0,
    });
  } catch (error) {
    console.error("Chat spend was not recorded", error);
  }
}
