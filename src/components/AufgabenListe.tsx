"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AufgabeKarte, type KartenDaten } from "./AufgabeKarte";
import type { Status } from "@/lib/db";
import { schicken } from "@/app/aktionen";

export type Gruppe = { titel: string; karten: KartenDaten[] };

export function AufgabenListe({
  gruppen,
  stand,
  istNiki,
  schueler,
}: {
  gruppen: Gruppe[];
  stand: Record<string, Status>;
  istNiki: boolean;
  schueler?: { id: string; name: string } | null;
}) {
  const [auswahl, setAuswahl] = useState<string[]>([]);
  const [meldung, setMeldung] = useState<string | null>(null);
  const [laeuft, start] = useTransition();
  const router = useRouter();

  const toggle = (id: string) => setAuswahl((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  function senden() {
    if (!schueler) return;
    const n = auswahl.length;
    start(async () => {
      await schicken(schueler.id, auswahl);
      setAuswahl([]);
      setMeldung(`${n} ${n === 1 ? "Aufgabe" : "Aufgaben"} an ${schueler.name} geschickt`);
      setTimeout(() => setMeldung(null), 2500);
    });
  }

  return (
    <>
      {gruppen.map((g) => (
        <section key={g.titel} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="stufe">{g.titel}</div>
          {g.karten.map((k) => (
            <AufgabeKarte
              key={k.id}
              a={k}
              status={stand[k.id] ?? "offen"}
              istNiki={istNiki}
              schuelerId={schueler?.id}
              auswahl={auswahl.includes(k.id)}
              onAuswahl={istNiki ? () => toggle(k.id) : undefined}
              loesungOffen={istNiki}
            />
          ))}
        </section>
      ))}
      {istNiki && auswahl.length > 0 && (
        <div className="dock">
          <div className="in">
            <span>{auswahl.length} ausgewählt</span>
            <button className="btn ghost" onClick={() => router.push(`/blatt?ids=${auswahl.join(",")}`)}>Arbeitsblatt</button>
            {schueler ? (
              <button className="btn" onClick={senden} disabled={laeuft}>An {schueler.name} schicken</button>
            ) : (
              <span className="note" style={{ color: "inherit" }}>Oben einen Schüler wählen zum Schicken</span>
            )}
          </div>
        </div>
      )}
      {meldung && (
        <div className="dock" role="status"><div className="in" style={{ padding: "10px 16px" }}>{meldung}</div></div>
      )}
    </>
  );
}
