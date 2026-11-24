import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { nutzerById, type Nutzer } from "./db";

const COOKIE = "nn_sitzung";
const FUER = "nn_fuer"; // welchen Schüler Niki gerade ansieht
const TAGE = 60;

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET fehlt oder ist zu kurz (mind. 32 Zeichen)");
  return s;
}
function sign(v: string) {
  return createHmac("sha256", secret()).update(v).digest("base64url");
}

export function neuesToken(): string {
  return randomBytes(18).toString("base64url");
}
export async function hashPasswort(pw: string) {
  return bcrypt.hash(pw, 11);
}
export async function pruefePasswort(pw: string, hash: string | null) {
  if (!hash) return false;
  return bcrypt.compare(pw, hash);
}

export async function anmelden(n: Nutzer) {
  const exp = Date.now() + TAGE * 864e5;
  const v = `${n.id}.${n.sitzung_version}.${exp}`;
  (await cookies()).set(COOKIE, `${v}.${sign(v)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TAGE * 86400,
  });
}
export async function abmelden() {
  const c = await cookies();
  c.delete(COOKIE);
  c.delete(FUER);
}

export async function aktuellerNutzer(): Promise<Nutzer | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const teile = raw.split(".");
  if (teile.length !== 4) return null;
  const [id, ver, exp, sig] = teile;
  const v = `${id}.${ver}.${exp}`;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(v));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Date.now() > Number(exp)) return null;
  const n = await nutzerById(id);
  if (!n || String(n.sitzung_version) !== ver) return null;
  return n;
}

export async function brauchtNutzer(): Promise<Nutzer> {
  const n = await aktuellerNutzer();
  if (!n) redirect("/anmelden");
  return n;
}
export async function brauchtAdmin(): Promise<Nutzer> {
  const n = await brauchtNutzer();
  if (n.rolle !== "admin") redirect("/lernen");
  return n;
}

/** Für welchen Schüler zeigt Niki gerade Stand und Häkchen an? */
export async function fuerId(): Promise<string | null> {
  return (await cookies()).get(FUER)?.value ?? null;
}
export async function setzeFuer(id: string) {
  (await cookies()).set(FUER, id, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 365 * 86400, secure: process.env.NODE_ENV === "production" });
}
