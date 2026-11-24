import Link from "next/link";
import { brauchtAdmin } from "@/lib/auth";
import { aufgabe, themaVonAufgabe, unterthema } from "@/content";
import type { Aufgabe } from "@/content/types";
import { M } from "@/components/M";
import { DruckKnopf, ZurueckKnopf } from "@/components/DruckKnopf";

export const dynamic = "force-dynamic";

const PRO_SEITE = 3;

export default async function Blatt({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  await brauchtAdmin();
  const { ids = "" } = await searchParams;
  const aufgaben = ids.split(",").map((id) => aufgabe(id)).filter((a): a is Aufgabe => !!a);
  if (!aufgaben.length) return <div className="login"><h1>Keine Aufgaben gewählt</h1><Link href="/niki">Zurück</Link></div>;

  const t = themaVonAufgabe(aufgaben[0].id)!;
  const uts = [...new Set(aufgaben.map((a) => a.unterthema))];
  const titel = uts.length === 1 ? unterthema(t.id, uts[0])?.name ?? t.name : t.name;

  // Originalaufgaben (Pool, Lehrerin) bekommen eine eigene Seite, ohne zusätzlichen Platz.
  const seiten: Aufgabe[][] = [];
  let akt: Aufgabe[] = [];
  for (const a of aufgaben) {
    if (a.art === "original") {
      if (akt.length) seiten.push(akt);
      seiten.push([a]);
      akt = [];
      continue;
    }
    akt.push(a);
    if (akt.length === PRO_SEITE) { seiten.push(akt); akt = []; }
  }
  if (akt.length) seiten.push(akt);

  let nr = 0;
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", paddingBottom: 24 }}>
      <div className="blatt-leiste">
        <ZurueckKnopf />
        <span className="note">{aufgaben.length} Aufgaben · {seiten.length} {seiten.length === 1 ? "Seite" : "Seiten"}</span>
        <DruckKnopf />
      </div>
      {seiten.map((seite, si) => (
        <section className="seite" key={si}>
          <div className="kopf"><span>Mathe-Nachhilfe · {t.stufe}</span><span>Name: ________________</span></div>
          {si === 0 && <div className="titel">{titel}</div>}
          {seite.map((a) => {
            nr++;
            return (
              <div key={a.id} style={{ display: "flex", flexDirection: "column" }}>
                <div className="aufg">
                  <b>{nr}</b>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {a.frage && <M t={a.frage} />}
                    {(a.art === "ankreuzen" || a.art === "mehrfach") && (
                      <div className="opts-p">{a.optionen.map((o, i) => <div key={i}>☐ <M t={o} /></div>)}</div>
                    )}
                    {a.art === "original" && a.bilder.map((b) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={b} src={`/datei/${b}`} alt="Originalaufgabe" />
                    ))}
                  </div>
                </div>
                {a.art !== "original" && a.art !== "ankreuzen" && a.art !== "mehrfach" && <div className={`platz-${a.platz ?? "mittel"}`} />}
              </div>
            );
          })}
          <div className="fuss"><span>Nachhilfe Niki</span><span>Seite {si + 1}</span></div>
        </section>
      ))}
    </div>
  );
}
