import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { brauchtAdmin, fuerId } from "@/lib/auth";
import { notizVon, nutzerById, pinsVon, standVon } from "@/lib/db";
import { THEMEN, aufgabe } from "@/content";
import { LABEL } from "@/lib/fortschritt";
import { UnterthemaListe } from "@/components/UnterthemaListe";
import { Kopieren, NotizFeld, WaehleBeimOeffnen } from "@/components/Klein";
import { LoeschenKnopf } from "@/components/Formulare";
import { loesen, passwortZuruecksetzen } from "@/app/aktionen";

export default async function SchuelerDetail({ params }: { params: Promise<{ id: string }> }) {
  await brauchtAdmin();
  const { id } = await params;
  const s = await nutzerById(id);
  if (!s || s.rolle !== "schueler") notFound();
  const [stand, pins, notiz, fuer] = await Promise.all([standVon(id), pinsVon(id), notizVon(id), fuerId()]);
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const link = s.einladung ? `${proto}://${host}/einladung/${s.einladung}` : null;

  return (
    <>
      <WaehleBeimOeffnen id={s.id} aktuell={fuer} />
      <Link className="back" href="/niki/schueler">‹ Schüler</Link>
      <div>
        <h1>{s.name}</h1>
        <p className="sub">{[s.klasse, `dabei seit ${new Date(s.erstellt).toLocaleDateString("de-AT")}`].filter(Boolean).join(" · ")}</p>
      </div>

      {link && (
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <h2>Einladungslink</h2>
          <p className="sub">Schick {s.name} diesen Link, zum Beispiel per WhatsApp. Beim Öffnen legt {s.name} das Passwort fest. Danach gilt der Link nicht mehr.</p>
          <Kopieren text={link} />
        </div>
      )}

      {THEMEN.map((t) => (
        <div className="card" key={t.id}>
          <h2>{t.symbol} {t.name}</h2>
          <UnterthemaListe thema={t} stand={stand} />
          <p className="note" style={{ marginTop: 8 }}>Punkt: grau = nicht begonnen, blau = dran, grün = sitzt, orange = etwas nochmal üben.</p>
        </div>
      ))}

      <div className="card">
        <h2>Angepinnt für {s.name}</h2>
        <p className="sub">Steht bei {s.name} ganz oben. Neues schickst du in der Bibliothek.</p>
        <div className="list" style={{ marginTop: 6 }}>
          {pins.map((pid) => {
            const a = aufgabe(pid);
            if (!a) return null;
            const st = stand[pid] ?? "offen";
            return (
              <div className="item" key={pid}>
                <span className="grow"><span><span className="t">{a.typ}</span><span className="d"> · {a.stufe}</span></span></span>
                <span className={`pill p-${st}`}>{LABEL[st]}</span>
                <form action={loesen.bind(null, s.id, pid)}><button className="linkbtn">Lösen</button></form>
              </div>
            );
          })}
          {!pins.length && <p className="note">Noch nichts geschickt.</p>}
        </div>
      </div>

      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h2>Notiz</h2>
        <NotizFeld id={s.id} text={notiz} />
      </div>

      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <h2>Zugang</h2>
        <p className="sub">{s.passwort_hash ? `${s.name} hat ein Passwort festgelegt.` : "Wartet auf das erste Öffnen des Links."}</p>
        <div className="row">
          {s.passwort_hash && (
            <form action={passwortZuruecksetzen.bind(null, s.id)}><button className="btn ghost">Passwort zurücksetzen</button></form>
          )}
          <LoeschenKnopf id={s.id} name={s.name} />
        </div>
        {s.passwort_hash && <p className="note">Zurücksetzen macht einen neuen Einladungslink. Das alte Passwort gilt dann nicht mehr.</p>}
      </div>
    </>
  );
}
