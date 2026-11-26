"use client";

import { useState, useTransition } from "react";
import type { Status } from "@/lib/db";
import { standSetzen } from "@/app/aktionen";

const LABEL: Record<Status, string> = { offen: "offen", gemacht: "gemacht", sitzt: "sitzt", nochmal: "nochmal üben" };
const ALLE: Status[] = ["offen", "gemacht", "sitzt", "nochmal"];

/** Aufgabe mit fertig gerendertem HTML (Formeln werden am Server gesetzt). */
export type KartenDaten = {
  id: string;
  typ: string;
  stufe: string;
  quelle: string;
  art: "ankreuzen" | "mehrfach" | "zahl" | "aufdecken" | "original";
  frage: string;
  loesung: string;
  optionen?: string[];
  richtig?: number[] | number;
  label?: string;
  einheit?: string;
  geogebra?: string;
  bilder?: string[];
  loesungBilder?: string[];
};

const H = ({ h }: { h: string }) => <span dangerouslySetInnerHTML={{ __html: h }} />;

export function AufgabeKarte({
  a,
  status,
  istNiki,
  schuelerId,
  auswahl,
  onAuswahl,
  loesungOffen,
}: {
  a: KartenDaten;
  status: Status;
  istNiki: boolean;
  schuelerId?: string;
  auswahl?: boolean;
  onAuswahl?: () => void;
  loesungOffen?: boolean;
}) {
  const [st, setSt] = useState<Status>(status);
  const [pick, setPick] = useState<number[]>([]);
  const [wert, setWert] = useState("");
  const [geprueft, setGeprueft] = useState<null | boolean>(null);
  const [, start] = useTransition();
  const kannSetzen = !istNiki || !!schuelerId;

  function setze(s: Status) {
    if (!kannSetzen) return;
    setSt(s);
    start(() => standSetzen(a.id, s, schuelerId));
  }

  function pruefen() {
    let ok = false;
    if (a.art === "zahl") {
      const v = parseFloat(wert.replace(",", "."));
      ok = Number.isFinite(v) && Math.abs(v - (a.richtig as number)) < 1e-6;
    } else {
      const r = a.richtig as number[];
      ok = pick.length === r.length && r.every((x) => pick.includes(x));
    }
    setGeprueft(ok);
    if (ok && (st === "offen" || st === "nochmal")) setze("gemacht");
    if (!ok) setze("nochmal");
  }

  function waehle(i: number) {
    setGeprueft(null);
    if (a.art === "ankreuzen") setPick([i]);
    else setPick((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  }

  const r = Array.isArray(a.richtig) ? a.richtig : [];

  return (
    <div className="card task" id={`a-${a.id}`}>
      <div className="row between">
        <div className="row" style={{ gap: 6 }}>
          {onAuswahl && (
            <button className={`sel-tick ${auswahl ? "on" : ""}`} onClick={onAuswahl} aria-pressed={!!auswahl} aria-label="Aufgabe auswählen">
              {auswahl ? "✓" : ""}
            </button>
          )}
          <span className="tag">{a.typ}</span>
          <span className="tag">{a.quelle}</span>
        </div>
        <span className={`pill p-${st}`}>{LABEL[st]}</span>
      </div>

      {a.art === "original" ? (
        <div className="original">
          {a.frage && <p className="q" style={{ margin: "0 0 10px", fontWeight: 600 }}><H h={a.frage} /></p>}
          {(a.bilder ?? []).map((b) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={b} src={`/datei/${b}`} alt="Originalaufgabe" loading="lazy" />
          ))}
        </div>
      ) : (
        <div className="q mathscroll"><H h={a.frage} /></div>
      )}

      {(a.art === "ankreuzen" || a.art === "mehrfach") && (
        <>
          <div className="opts">
            {a.optionen!.map((o, i) => {
              let cls = pick.includes(i) ? "sel" : "";
              if (geprueft !== null) cls = r.includes(i) ? (pick.includes(i) ? "right" : "wrong") : pick.includes(i) ? "wrong" : "";
              return (
                <button key={i} className={`opt ${a.art === "ankreuzen" ? "rund" : ""} ${cls}`} onClick={() => waehle(i)}>
                  <span className="box">{pick.includes(i) ? "✓" : ""}</span>
                  <span className="mathscroll"><H h={o} /></span>
                </button>
              );
            })}
          </div>
          <div className="row">
            <button className="btn ghost" onClick={pruefen} disabled={!pick.length}>Prüfen</button>
            {geprueft !== null && <Rueck ok={geprueft} />}
          </div>
        </>
      )}

      {a.art === "zahl" && (
        <div className="num">
          {a.label && <label htmlFor={`in-${a.id}`} className="note"><H h={a.label} /></label>}
          <input id={`in-${a.id}`} inputMode="decimal" value={wert} onChange={(e) => { setWert(e.target.value); setGeprueft(null); }} onKeyDown={(e) => e.key === "Enter" && wert && pruefen()} />
          {a.einheit && <span>{a.einheit}</span>}
          <button className="btn ghost" onClick={pruefen} disabled={!wert}>Prüfen</button>
          {geprueft !== null && <Rueck ok={geprueft} />}
        </div>
      )}

      {a.art === "aufdecken" && <p className="note">Auf Papier oder in GeoGebra rechnen, dann Lösung aufdecken und selbst abhaken.</p>}

      {a.geogebra && (
        <details className="sol">
          <summary>So in GeoGebra</summary>
          <div className="in ggb">{a.geogebra}</div>
        </details>
      )}
      {a.art === "original" ? (
        a.loesungBilder?.length ? (
          <details className="sol">
            <summary>Lösung aus dem Unterricht</summary>
            <div className="in original">
              {a.loesungBilder.map((b) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={b} src={`/datei/${b}`} alt="Lösung" loading="lazy" />
              ))}
            </div>
          </details>
        ) : null
      ) : (
        <details className="sol" open={loesungOffen}>
          <summary>Lösung</summary>
          <div className="in mathscroll"><H h={a.loesung} /></div>
        </details>
      )}

      {kannSetzen && (
        <div className="status" role="group" aria-label="Stand">
          {ALLE.map((k) => (
            <button key={k} className={`${k} ${st === k ? "on" : ""}`} onClick={() => setze(k)} aria-pressed={st === k}>{LABEL[k]}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function Rueck({ ok }: { ok: boolean }) {
  return ok ? <span className="fb ok">Richtig</span> : <span className="fb no">Noch nicht. Schau dir die Lösung an.</span>;
}
