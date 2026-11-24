import "server-only";
import { brauchtNutzer, fuerId } from "./auth";
import { nutzerById, type Nutzer } from "./db";

/** Wer angemeldet ist und um welchen Schüler es gerade geht (bei Niki: Auswahl oben, bei Schülern: sie selbst). */
export async function kontext(): Promise<{ ich: Nutzer; istNiki: boolean; schueler: Nutzer | null }> {
  const ich = await brauchtNutzer();
  if (ich.rolle !== "admin") return { ich, istNiki: false, schueler: ich };
  const id = await fuerId();
  const s = id ? await nutzerById(id) : null;
  return { ich, istNiki: true, schueler: s && s.rolle === "schueler" ? s : null };
}
