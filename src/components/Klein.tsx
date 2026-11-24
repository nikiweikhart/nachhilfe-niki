"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { fuerWaehlen, hakenLoeschen, hakenSetzen, notizSpeichern } from "@/app/aktionen";

export type NavEintrag = { href: string; label: string; match: string[] };

export function Navigation({ eintraege, themen }: { eintraege: NavEintrag[]; themen?: { href: string; label: string }[] }) {
  const p = usePathname();
  const an = (e: NavEintrag) => e.match.some((m) => (m.endsWith("$") ? p === m.slice(0, -1) : p === m || p.startsWith(m + "/")));
  return (
    <>
      <nav className="side" aria-label="Navigation">
        {eintraege.map((e) => (
          <Link key={e.href} href={e.href} className={an(e) ? "on" : ""}>{e.label}</Link>
        ))}
        {themen && themen.length > 0 && <div className="lbl">Themen</div>}
        {themen?.map((t) => (
          <Link key={t.href} href={t.href} className={p.startsWith(t.href) ? "on" : ""}>{t.label}</Link>
        ))}
      </nav>
      <nav className="tabbar" aria-label="Navigation">
        {eintraege.map((e) => (
          <Link key={e.href} href={e.href} className={an(e) ? "on" : ""}>{e.label}</Link>
        ))}
      </nav>
    </>
  );
}

export function FuerWahl({ schueler, aktuell }: { schueler: { id: string; name: string }[]; aktuell: string | null }) {
  const [, start] = useTransition();
  const router = useRouter();
  if (!schueler.length) return null;
  return (
    <label className="fuer">
      <span>Für</span>
      <select
        value={aktuell ?? ""}
        onChange={(e) => start(async () => { await fuerWaehlen(e.target.value); router.refresh(); })}
        aria-label="Schüler wählen"
      >
        {!aktuell && <option value="">wählen</option>}
        {schueler.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
    </label>
  );
}

export function Leitfaden({ phasen, haken, schuelerId, utId }: { phasen: { phase: string; punkte: string[] }[]; haken: number[]; schuelerId?: string; utId: string }) {
  const [an, setAn] = useState<number[]>(haken);
  const [, start] = useTransition();
  let k = 0;
  function toggle(i: number, v: boolean) {
    setAn((s) => (v ? [...s, i] : s.filter((x) => x !== i)));
    if (schuelerId) start(() => hakenSetzen(schuelerId, utId, i, v));
  }
  return (
    <div className="card">
      {phasen.map((p) => (
        <div key={p.phase}>
          <div className="phase">{p.phase}</div>
          {p.punkte.map((h) => {
            const i = k++;
            const d = an.includes(i);
            return (
              <label key={i} className={`check ${d ? "done" : ""}`}>
                <input type="checkbox" checked={d} onChange={(e) => toggle(i, e.target.checked)} />
                <span dangerouslySetInnerHTML={{ __html: h }} />
              </label>
            );
          })}
        </div>
      ))}
      {an.length > 0 && (
        <div className="row" style={{ marginTop: 12 }}>
          <button className="linkbtn" onClick={() => { setAn([]); if (schuelerId) start(() => hakenLoeschen(schuelerId, utId)); }}>Häkchen zurücksetzen</button>
        </div>
      )}
      {!schuelerId && <p className="note" style={{ marginTop: 10 }}>Häkchen werden pro Schüler gespeichert. Oben einen Schüler wählen.</p>}
    </div>
  );
}

export function NotizFeld({ id, text }: { id: string; text: string }) {
  const [wert, setWert] = useState(text);
  const [gespeichert, setGespeichert] = useState(true);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (t.current) clearTimeout(t.current); }, []);
  return (
    <>
      <textarea
        className="notiz"
        aria-label="Notiz"
        value={wert}
        placeholder="Was habt ihr gemacht, wo hakt es, was kommt bei der Schularbeit?"
        onChange={(e) => {
          setWert(e.target.value);
          setGespeichert(false);
          if (t.current) clearTimeout(t.current);
          const v = e.target.value;
          t.current = setTimeout(async () => { await notizSpeichern(id, v); setGespeichert(true); }, 700);
        }}
      />
      <p className="note">{gespeichert ? "Gespeichert" : "Speichert …"}</p>
    </>
  );
}

export function Kopieren({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="copy">
      <input ref={ref} readOnly value={text} aria-label="Einladungslink" onFocus={(e) => e.target.select()} />
      <button
        className="btn ghost"
        onClick={() => {
          navigator.clipboard?.writeText(text).then(
            () => { setOk(true); setTimeout(() => setOk(false), 1800); },
            () => ref.current?.select(),
          );
        }}
      >
        {ok ? "Kopiert" : "Kopieren"}
      </button>
    </div>
  );
}

/** Wer die Seite eines Schülers öffnet, arbeitet danach für diesen Schüler (Auswahl oben). */
export function WaehleBeimOeffnen({ id, aktuell }: { id: string; aktuell: string | null }) {
  const router = useRouter();
  useEffect(() => {
    if (id !== aktuell) fuerWaehlen(id).then(() => router.refresh());
  }, [id, aktuell, router]);
  return null;
}
