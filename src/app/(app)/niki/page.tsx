import Link from "next/link";
import { brauchtAdmin } from "@/lib/auth";
import { pinsVon, schuelerListe, standVon } from "@/lib/db";
import { THEMEN, aufgabe, unterthema, themaVonAufgabe } from "@/content";
import { LABEL } from "@/lib/fortschritt";
import { UnterthemaListe } from "@/components/UnterthemaListe";

export default async function NikiStart() {
  const ich = await brauchtAdmin();
  const schueler = await schuelerListe();
  const daten = await Promise.all(
    schueler.map(async (s) => ({ s, stand: await standVon(s.id), pins: await pinsVon(s.id) })),
  );

  return (
    <>
      <div>
        <h1>Hallo {ich.name}</h1>
        <p className="sub">{schueler.length ? `${schueler.length} ${schueler.length === 1 ? "Schüler" : "Schüler"} bei dir` : "Noch keine Schüler angelegt"}</p>
      </div>

      {!schueler.length && (
        <div className="card">
          <h2>Leg los</h2>
          <p className="sub">Füg unter „Schüler“ deinen ersten Schüler hinzu. Du bekommst einen Link, den du per WhatsApp schickst.</p>
          <div style={{ marginTop: 12 }}><Link className="btn" href="/niki/schueler">Schüler hinzufügen</Link></div>
        </div>
      )}

      {daten.map(({ s, stand, pins }) => {
        const offen = pins.filter((id) => (stand[id] ?? "offen") !== "sitzt");
        const nochmal = Object.entries(stand).filter(([, v]) => v === "nochmal").map(([k]) => k).filter((id) => aufgabe(id));
        return (
          <div key={s.id} className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="row between">
              <div>
                <h2>{s.name}</h2>
                <p className="sub">{[s.klasse, s.passwort_hash ? null : "hat den Link noch nicht geöffnet"].filter(Boolean).join(" · ")}</p>
              </div>
              <Link href={`/niki/schueler/${s.id}`}>Öffnen ›</Link>
            </div>
            {THEMEN.map((t) => <UnterthemaListe key={t.id} thema={t} stand={stand} nurBereit />)}
            <div className="grid2">
              <div>
                <h3>Hat offen</h3>
                <p className="note">{offen.length ? `${offen.length} von dir geschickt` : "Nichts Offenes"}</p>
                <div className="list">
                  {offen.slice(0, 5).map((id) => {
                    const a = aufgabe(id)!;
                    const st = stand[id] ?? "offen";
                    return <div className="item" key={id}><span className="grow"><span><span className="t">{a.typ}</span><span className="d"> · {a.stufe}</span></span></span><span className={`pill p-${st}`}>{LABEL[st]}</span></div>;
                  })}
                </div>
              </div>
              <div>
                <h3>Nochmal üben</h3>
                <p className="note">{nochmal.length ? "Hat gewackelt" : "Nichts"}</p>
                <div className="list">
                  {nochmal.slice(0, 5).map((id) => {
                    const a = aufgabe(id)!;
                    const t = themaVonAufgabe(id)!;
                    return <div className="item" key={id}><span className="grow"><span><span className="t">{a.typ}</span><span className="d"> · {unterthema(t.id, a.unterthema)?.name}</span></span></span></div>;
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
