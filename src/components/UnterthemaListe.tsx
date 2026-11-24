import Link from "next/link";
import type { Thema } from "@/content/types";
import type { Status } from "@/lib/db";
import { fortschritt, lampe } from "@/lib/fortschritt";

export function Balken({ s, g, n, gesamt }: { s: number; g: number; n: number; gesamt: number }) {
  const p = (x: number) => `${gesamt ? (x / gesamt) * 100 : 0}%`;
  return (
    <div className="bar" aria-label={`${s} von ${gesamt} sitzen`}>
      <i className="s" style={{ width: p(s) }} />
      <i className="g" style={{ width: p(g) }} />
      <i className="n" style={{ width: p(n) }} />
    </div>
  );
}

export function UnterthemaListe({ thema, stand, nurBereit, nummern }: { thema: Thema; stand: Record<string, Status>; nurBereit?: boolean; nummern?: boolean }) {
  const uts = nurBereit ? thema.unterthemen.filter((u) => u.bereit) : thema.unterthemen;
  return (
    <div className="list">
      {uts.map((u, i) => {
        const f = fortschritt(thema, u, stand);
        const inhalt = (
          <>
            <span className="lamp" style={{ background: lampe(u, f) }} />
            <span className="grow">
              <span>
                <span className="t">{nummern ? `${i}. ` : ""}{u.name}</span>
                <span className="d"> · {u.kurz}</span>
              </span>
              {u.bereit && <Balken s={f.sitzt} g={f.gemacht} n={f.nochmal} gesamt={f.gesamt} />}
            </span>
            {u.bereit ? <span className="chev">›</span> : <span className="tag">kommt bald</span>}
          </>
        );
        return u.bereit ? (
          <Link key={u.id} className="item" href={`/bibliothek/${thema.id}/${u.id}`}>{inhalt}</Link>
        ) : (
          <div key={u.id} className="item off">{inhalt}</div>
        );
      })}
    </div>
  );
}
