import Link from "next/link";
import { redirect } from "next/navigation";
import { brauchtNutzer } from "@/lib/auth";
import { pinsVon, standVon } from "@/lib/db";
import { THEMEN, aufgabe } from "@/content";
import { karte } from "@/lib/karten";
import { AufgabenListe } from "@/components/AufgabenListe";
import { UnterthemaListe } from "@/components/UnterthemaListe";

export default async function Lernen() {
  const ich = await brauchtNutzer();
  if (ich.rolle === "admin") redirect("/niki");
  const [stand, pins] = await Promise.all([standVon(ich.id), pinsVon(ich.id)]);
  const karten = pins.map((id) => aufgabe(id)).filter((a) => !!a).map((a) => karte(a!, false));
  const offen = pins.filter((id) => (stand[id] ?? "offen") !== "sitzt").length;

  return (
    <>
      <div>
        <h1>Hallo {ich.name}</h1>
        <p className="sub">Rechne auf Papier oder mit GeoGebra und hake danach ab, wie es gelaufen ist.</p>
      </div>
      <div className="card">
        <div className="row between">
          <h2>Von Niki für dich</h2>
          <span className="note">{karten.length ? `${offen} offen` : ""}</span>
        </div>
        {!karten.length && <p className="sub">Gerade nichts. Niki schickt dir hier Aufgaben, wenn ihr was ausmacht.</p>}
      </div>
      {karten.length > 0 && <AufgabenListe gruppen={[{ titel: "Angepinnt", karten }]} stand={stand} istNiki={false} />}
      {THEMEN.map((t) => (
        <div className="card" key={t.id}>
          <div className="row between">
            <h2>{t.symbol} {t.name}</h2>
            <Link href={`/bibliothek/${t.id}`}>Alle Aufgaben ›</Link>
          </div>
          <UnterthemaListe thema={t} stand={stand} nurBereit />
        </div>
      ))}
    </>
  );
}
