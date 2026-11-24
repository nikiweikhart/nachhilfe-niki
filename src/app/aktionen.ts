"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { nutzerAnlegen, nutzerZugang, schuelerEntfernen, nutzerById, nutzerByName, nutzerByEinladung, adminExistiert, setzeStand, pinne, entpinne, setzeNotiz, setzeHaken, loescheHaken, STATUS, type Status } from "@/lib/db";
import { anmelden, abmelden, aktuellerNutzer, brauchtAdmin, hashPasswort, pruefePasswort, neuesToken, setzeFuer } from "@/lib/auth";
import { aufgabe } from "@/content";

export type Meldung = { fehler?: string; ok?: string } | null;

const warte = (ms: number) => new Promise((r) => setTimeout(r, ms));

function sauber(name: unknown): string {
  return String(name ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
}
function passwortOk(pw: string): string | null {
  if (pw.length < 6) return "Das Passwort braucht mindestens 6 Zeichen.";
  if (pw.length > 100) return "Das Passwort ist zu lang.";
  return null;
}

/* ---------- Anmelden ---------- */
export async function anmeldenAktion(_: Meldung, fd: FormData): Promise<Meldung> {
  const name = sauber(fd.get("name"));
  const pw = String(fd.get("passwort") ?? "");
  const n = name ? await nutzerByName(name) : null;
  const ok = n ? await pruefePasswort(pw, n.passwort_hash) : false;
  if (!n || !ok) {
    await warte(600);
    return { fehler: "Name oder Passwort stimmt nicht. Frag Niki, wenn du dein Passwort vergessen hast." };
  }
  await anmelden(n);
  redirect(n.rolle === "admin" ? "/niki" : "/lernen");
}

export async function abmeldenAktion() {
  await abmelden();
  redirect("/anmelden");
}

/** Allererste Einrichtung: legt Nikis Konto an, nur solange es noch keinen Admin gibt. */
export async function einrichtenAktion(_: Meldung, fd: FormData): Promise<Meldung> {
  if (await adminExistiert()) return { fehler: "Ist schon eingerichtet. Bitte normal anmelden." };
  const code = String(fd.get("code") ?? "");
  if (!process.env.SETUP_CODE || code !== process.env.SETUP_CODE) return { fehler: "Der Einrichtungs-Code stimmt nicht." };
  const name = sauber(fd.get("name"));
  const pw = String(fd.get("passwort") ?? "");
  if (!name) return { fehler: "Bitte einen Namen eingeben." };
  const p = passwortOk(pw);
  if (p) return { fehler: p };
  const n = await nutzerAnlegen({ name, rolle: "admin", passwort_hash: await hashPasswort(pw) });
  await anmelden(n);
  redirect("/niki");
}

/** Schüler öffnet Einladungslink und legt sein Passwort fest. */
export async function einladungAktion(_: Meldung, fd: FormData): Promise<Meldung> {
  const token = String(fd.get("token") ?? "");
  const pw = String(fd.get("passwort") ?? "");
  const pw2 = String(fd.get("passwort2") ?? "");
  const n = token ? await nutzerByEinladung(token) : null;
  if (!n) return { fehler: "Dieser Link gilt nicht mehr. Frag Niki nach einem neuen." };
  const p = passwortOk(pw);
  if (p) return { fehler: p };
  if (pw !== pw2) return { fehler: "Die beiden Passwörter sind nicht gleich." };
  const neu = await nutzerZugang(n.id, { passwort_hash: await hashPasswort(pw), einladung: null });
  await anmelden(neu);
  redirect(n.rolle === "admin" ? "/niki" : "/lernen");
}

/* ---------- Niki: Schüler verwalten ---------- */
export async function schuelerAnlegen(_: Meldung, fd: FormData): Promise<Meldung> {
  await brauchtAdmin();
  const name = sauber(fd.get("name"));
  const klasse = sauber(fd.get("klasse")) || null;
  if (!name) return { fehler: "Bitte einen Vornamen eingeben." };
  if (await nutzerByName(name)) return { fehler: `„${name}“ gibt es schon. Häng zum Beispiel den Anfangsbuchstaben vom Nachnamen an.` };
  const n = await nutzerAnlegen({ name, klasse, rolle: "schueler", einladung: neuesToken() });
  await setzeFuer(n.id);
  revalidatePath("/niki", "layout");
  redirect(`/niki/schueler/${n.id}`);
}

export async function passwortZuruecksetzen(id: string) {
  await brauchtAdmin();
  const n = await nutzerById(id);
  if (!n || n.rolle !== "schueler") return;
  await nutzerZugang(id, { passwort_hash: null, einladung: neuesToken() });
  revalidatePath(`/niki/schueler/${id}`);
}

export async function schuelerLoeschen(id: string) {
  await brauchtAdmin();
  await schuelerEntfernen(id);
  revalidatePath("/niki", "layout");
  redirect("/niki/schueler");
}

export async function fuerWaehlen(id: string) {
  await brauchtAdmin();
  await setzeFuer(id);
  revalidatePath("/", "layout");
}

export async function notizSpeichern(id: string, text: string) {
  await brauchtAdmin();
  await setzeNotiz(id, text.slice(0, 5000));
}

/* ---------- Aufgaben ---------- */
/** Schüler setzt seinen eigenen Stand. Niki setzt den Stand des gewählten Schülers. */
export async function standSetzen(aufgabeId: string, status: Status, schuelerId?: string) {
  const n = await aktuellerNutzer();
  if (!n || !aufgabe(aufgabeId) || !STATUS.includes(status)) return;
  const ziel = n.rolle === "admin" ? schuelerId : n.id;
  if (!ziel) return;
  await setzeStand(ziel, aufgabeId, status);
  revalidatePath("/", "layout");
}

export async function schicken(schuelerId: string, ids: string[]) {
  await brauchtAdmin();
  await pinne(schuelerId, ids.filter((id) => aufgabe(id)));
  revalidatePath("/", "layout");
}
export async function loesen(schuelerId: string, aufgabeId: string) {
  await brauchtAdmin();
  await entpinne(schuelerId, aufgabeId);
  revalidatePath("/", "layout");
}

export async function hakenSetzen(schuelerId: string, utId: string, punkt: number, an: boolean) {
  await brauchtAdmin();
  await setzeHaken(schuelerId, utId, punkt, an);
}
export async function hakenLoeschen(schuelerId: string, utId: string) {
  await brauchtAdmin();
  await loescheHaken(schuelerId, utId);
  revalidatePath("/", "layout");
}
