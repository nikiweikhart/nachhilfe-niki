import type { Thema, Unterthema } from "@/content/types";
import type { Status } from "./db";

export type Fortschritt = { sitzt: number; gemacht: number; nochmal: number; gesamt: number };

export function fortschritt(t: Thema, ut: Unterthema, stand: Record<string, Status>): Fortschritt {
  const a = t.aufgaben.filter((x) => x.unterthema === ut.id);
  const z = (k: Status) => a.filter((x) => (stand[x.id] ?? "offen") === k).length;
  return { sitzt: z("sitzt"), gemacht: z("gemacht"), nochmal: z("nochmal"), gesamt: a.length };
}

/** Farbe des Punkts: grau = nicht begonnen, blau = dran, grün = alles sitzt, orange = etwas nochmal üben */
export function lampe(ut: Unterthema, f: Fortschritt): string {
  if (!ut.bereit || !f.gesamt) return "var(--line)";
  if (f.nochmal) return "var(--warn)";
  if (f.sitzt === f.gesamt) return "var(--ok)";
  if (f.sitzt + f.gemacht > 0) return "var(--accent)";
  return "var(--idle)";
}

export const LABEL: Record<Status, string> = { offen: "offen", gemacht: "gemacht", sitzt: "sitzt", nochmal: "nochmal üben" };
