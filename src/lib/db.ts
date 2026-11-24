import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** Supabase mit Service-Role-Key. Nur auf dem Server benutzen. */
export function db(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY fehlt");
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

export type Rolle = "admin" | "schueler";
export type Nutzer = {
  id: string;
  name: string;
  rolle: Rolle;
  klasse: string | null;
  passwort_hash: string | null;
  einladung: string | null;
  sitzung_version: number;
  erstellt: string;
};
export type Status = "offen" | "gemacht" | "sitzt" | "nochmal";
export const STATUS: Status[] = ["offen", "gemacht", "sitzt", "nochmal"];

function check<T>(r: { data: T; error: { message: string } | null }): T {
  if (r.error) throw new Error(r.error.message);
  return r.data;
}

export async function nutzerById(id: string): Promise<Nutzer | null> {
  return check(await db().from("nutzer").select("*").eq("id", id).maybeSingle()) as Nutzer | null;
}
export async function nutzerByName(name: string): Promise<Nutzer | null> {
  return check(await db().from("nutzer").select("*").eq("name_klein", name.trim().toLowerCase()).maybeSingle()) as Nutzer | null;
}
export async function nutzerByEinladung(token: string): Promise<Nutzer | null> {
  return check(await db().from("nutzer").select("*").eq("einladung", token).maybeSingle()) as Nutzer | null;
}
export async function adminExistiert(): Promise<boolean> {
  const r = await db().from("nutzer").select("id", { count: "exact", head: true }).eq("rolle", "admin");
  if (r.error) throw new Error(r.error.message);
  return (r.count ?? 0) > 0;
}
export async function schuelerListe(): Promise<Nutzer[]> {
  return check(await db().from("nutzer").select("*").eq("rolle", "schueler").order("name")) as Nutzer[];
}

export async function standVon(nutzerId: string): Promise<Record<string, Status>> {
  const rows = check(await db().from("stand").select("aufgabe_id,status").eq("nutzer_id", nutzerId)) as { aufgabe_id: string; status: Status }[];
  return Object.fromEntries(rows.map((r) => [r.aufgabe_id, r.status]));
}
export async function setzeStand(nutzerId: string, aufgabeId: string, status: Status) {
  check(await db().from("stand").upsert({ nutzer_id: nutzerId, aufgabe_id: aufgabeId, status, geaendert: new Date().toISOString() }));
}

export async function pinsVon(nutzerId: string): Promise<string[]> {
  const rows = check(await db().from("pins").select("aufgabe_id").eq("nutzer_id", nutzerId).order("erstellt")) as { aufgabe_id: string }[];
  return rows.map((r) => r.aufgabe_id);
}
export async function pinne(nutzerId: string, ids: string[]) {
  if (!ids.length) return;
  check(await db().from("pins").upsert(ids.map((aufgabe_id) => ({ nutzer_id: nutzerId, aufgabe_id })), { ignoreDuplicates: true }));
}
export async function entpinne(nutzerId: string, aufgabeId: string) {
  check(await db().from("pins").delete().eq("nutzer_id", nutzerId).eq("aufgabe_id", aufgabeId));
}

export async function notizVon(nutzerId: string): Promise<string> {
  const r = check(await db().from("notizen").select("text").eq("nutzer_id", nutzerId).maybeSingle()) as { text: string } | null;
  return r?.text ?? "";
}
export async function setzeNotiz(nutzerId: string, text: string) {
  check(await db().from("notizen").upsert({ nutzer_id: nutzerId, text, geaendert: new Date().toISOString() }));
}

export async function hakenVon(nutzerId: string, utId: string): Promise<number[]> {
  const rows = check(await db().from("leitfaden_haken").select("punkt").eq("nutzer_id", nutzerId).eq("unterthema_id", utId)) as { punkt: number }[];
  return rows.map((r) => r.punkt);
}
export async function setzeHaken(nutzerId: string, utId: string, punkt: number, an: boolean) {
  if (an) check(await db().from("leitfaden_haken").upsert({ nutzer_id: nutzerId, unterthema_id: utId, punkt }));
  else check(await db().from("leitfaden_haken").delete().eq("nutzer_id", nutzerId).eq("unterthema_id", utId).eq("punkt", punkt));
}
export async function loescheHaken(nutzerId: string, utId: string) {
  check(await db().from("leitfaden_haken").delete().eq("nutzer_id", nutzerId).eq("unterthema_id", utId));
}
