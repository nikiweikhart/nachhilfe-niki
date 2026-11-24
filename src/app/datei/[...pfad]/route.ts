import { readFile } from "node:fs/promises";
import path from "node:path";
import { aktuellerNutzer } from "@/lib/auth";

// Originalaufgaben (Pool, Unterlagen) liegen in /private und sind nur angemeldet abrufbar.
const BASIS = path.join(process.cwd(), "private");
const TYPEN: Record<string, string> = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".pdf": "application/pdf" };

export async function GET(_: Request, { params }: { params: Promise<{ pfad: string[] }> }) {
  if (!(await aktuellerNutzer())) return new Response("Nicht angemeldet", { status: 401 });
  const { pfad } = await params;
  const ziel = path.resolve(BASIS, ...pfad);
  if (!ziel.startsWith(BASIS + path.sep)) return new Response("Nicht gefunden", { status: 404 });
  const typ = TYPEN[path.extname(ziel).toLowerCase()];
  if (!typ) return new Response("Nicht gefunden", { status: 404 });
  try {
    const daten = await readFile(ziel);
    return new Response(new Uint8Array(daten), { headers: { "content-type": typ, "cache-control": "private, max-age=3600", "x-content-type-options": "nosniff" } });
  } catch {
    return new Response("Nicht gefunden", { status: 404 });
  }
}
