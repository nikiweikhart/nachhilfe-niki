import "server-only";
import postgres from "postgres";

// Direkte Postgres-Verbindung (Supabase-Pooler) mit eigener Datenbank-Rolle,
// die nur die nh_-Tabellen sehen darf. So bleibt die App von anderen Daten im Projekt getrennt.
let sql: postgres.Sql | null = null;

export function db(): postgres.Sql {
  if (sql) return sql;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL fehlt");
  sql = postgres(url, { prepare: false, max: 3, idle_timeout: 20, ssl: url.includes("localhost") ? false : "require" });
  return sql;
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

const N = "id, name, rolle, klasse, passwort_hash, einladung, sitzung_version, erstellt";

async function eins(q: Promise<postgres.RowList<postgres.Row[]>>): Promise<Nutzer | null> {
  const r = await q;
  return (r[0] as Nutzer | undefined) ?? null;
}

/* ---------- Nutzer ---------- */
export const nutzerById = (id: string) =>
  /^[0-9a-f-]{36}$/i.test(id) ? eins(db()`select ${db().unsafe(N)} from nh_nutzer where id = ${id}`) : Promise.resolve(null);
export const nutzerByName = (name: string) => eins(db()`select ${db().unsafe(N)} from nh_nutzer where name_klein = ${name.trim().toLowerCase()}`);
export const nutzerByEinladung = (token: string) => eins(db()`select ${db().unsafe(N)} from nh_nutzer where einladung = ${token}`);

export async function adminExistiert(): Promise<boolean> {
  const r = await db()`select 1 from nh_nutzer where rolle = 'admin' limit 1`;
  return r.length > 0;
}
export async function schuelerListe(): Promise<Nutzer[]> {
  return (await db()`select ${db().unsafe(N)} from nh_nutzer where rolle = 'schueler' order by name`) as unknown as Nutzer[];
}
export async function nutzerAnlegen(d: { name: string; rolle: Rolle; klasse?: string | null; passwort_hash?: string | null; einladung?: string | null }): Promise<Nutzer> {
  const r = await db()`
    insert into nh_nutzer (name, rolle, klasse, passwort_hash, einladung)
    values (${d.name}, ${d.rolle}, ${d.klasse ?? null}, ${d.passwort_hash ?? null}, ${d.einladung ?? null})
    returning ${db().unsafe(N)}`;
  return r[0] as unknown as Nutzer;
}
export async function nutzerZugang(id: string, d: { passwort_hash: string | null; einladung: string | null }): Promise<Nutzer> {
  const r = await db()`
    update nh_nutzer set passwort_hash = ${d.passwort_hash}, einladung = ${d.einladung}, sitzung_version = sitzung_version + 1
    where id = ${id} returning ${db().unsafe(N)}`;
  return r[0] as unknown as Nutzer;
}
export async function schuelerEntfernen(id: string) {
  await db()`delete from nh_nutzer where id = ${id} and rolle = 'schueler'`;
}

/* ---------- Stand ---------- */
export async function standVon(nutzerId: string): Promise<Record<string, Status>> {
  const rows = await db()`select aufgabe_id, status from nh_stand where nutzer_id = ${nutzerId}`;
  return Object.fromEntries(rows.map((r) => [r.aufgabe_id as string, r.status as Status]));
}
export async function setzeStand(nutzerId: string, aufgabeId: string, status: Status) {
  await db()`
    insert into nh_stand (nutzer_id, aufgabe_id, status) values (${nutzerId}, ${aufgabeId}, ${status})
    on conflict (nutzer_id, aufgabe_id) do update set status = excluded.status, geaendert = now()`;
}

/* ---------- Pins ---------- */
export async function pinsVon(nutzerId: string): Promise<string[]> {
  const rows = await db()`select aufgabe_id from nh_pins where nutzer_id = ${nutzerId} order by erstellt, aufgabe_id`;
  return rows.map((r) => r.aufgabe_id as string);
}
export async function pinne(nutzerId: string, ids: string[]) {
  for (const id of ids) {
    await db()`insert into nh_pins (nutzer_id, aufgabe_id) values (${nutzerId}, ${id}) on conflict do nothing`;
  }
}
export async function entpinne(nutzerId: string, aufgabeId: string) {
  await db()`delete from nh_pins where nutzer_id = ${nutzerId} and aufgabe_id = ${aufgabeId}`;
}

/* ---------- Notizen ---------- */
export async function notizVon(nutzerId: string): Promise<string> {
  const r = await db()`select text from nh_notizen where nutzer_id = ${nutzerId}`;
  return (r[0]?.text as string) ?? "";
}
export async function setzeNotiz(nutzerId: string, text: string) {
  await db()`
    insert into nh_notizen (nutzer_id, text) values (${nutzerId}, ${text})
    on conflict (nutzer_id) do update set text = excluded.text, geaendert = now()`;
}

/* ---------- Leitfaden-Häkchen ---------- */
export async function hakenVon(nutzerId: string, utId: string): Promise<number[]> {
  const rows = await db()`select punkt from nh_leitfaden_haken where nutzer_id = ${nutzerId} and unterthema_id = ${utId}`;
  return rows.map((r) => r.punkt as number);
}
export async function setzeHaken(nutzerId: string, utId: string, punkt: number, an: boolean) {
  if (an) await db()`insert into nh_leitfaden_haken (nutzer_id, unterthema_id, punkt) values (${nutzerId}, ${utId}, ${punkt}) on conflict do nothing`;
  else await db()`delete from nh_leitfaden_haken where nutzer_id = ${nutzerId} and unterthema_id = ${utId} and punkt = ${punkt}`;
}
export async function loescheHaken(nutzerId: string, utId: string) {
  await db()`delete from nh_leitfaden_haken where nutzer_id = ${nutzerId} and unterthema_id = ${utId}`;
}
