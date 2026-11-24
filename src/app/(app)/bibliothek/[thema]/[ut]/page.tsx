import Link from "next/link";
import { notFound } from "next/navigation";
import { STUFEN, thema as findeThema } from "@/content";
import { kontext } from "@/lib/kontext";
import { hakenVon, standVon } from "@/lib/db";
import { karte } from "@/lib/karten";
import { mathHtml } from "@/lib/math";
import { AufgabenListe } from "@/components/AufgabenListe";
import { Leitfaden } from "@/components/Klein";
import { M } from "@/components/M";

export default async function UnterthemaSeite({
  params,
  searchParams,
}: {
  params: Promise<{ thema: string; ut: string }>;
  searchParams: Promise<{ ansicht?: string }>;
}) {
  const { thema: tid, ut: uid } = await params;
  const { ansicht } = await searchParams;
  const t = findeThema(tid);
  const u = t?.unterthemen.find((x) => x.id === uid);
  if (!t || !u || !u.bereit) notFound();

  const { istNiki, schueler } = await kontext();
  const tab = istNiki && ansicht !== "aufgaben" ? "leitfaden" : "aufgaben";
  const basis = `/bibliothek/${t.id}/${u.id}`;

  const kopf = (
    <>
      <Link className="back" href={`/bibliothek/${t.id}`}>‹ {t.name}</Link>
      <div>
        <h1>{u.name}</h1>
        <p className="sub">{u.kurz}{u.grundkompetenz ? ` · Grundkompetenz ${u.grundkompetenz}` : ""}</p>
      </div>
      {istNiki && (
        <div className="tabs" role="tablist">
          <Link href={basis} className={tab === "leitfaden" ? "on" : ""}>Leitfaden</Link>
          <Link href={`${basis}?ansicht=aufgaben`} className={tab === "aufgaben" ? "on" : ""}>Aufgaben</Link>
        </div>
      )}
    </>
  );

  if (tab === "leitfaden") {
    const haken = schueler ? await hakenVon(schueler.id, u.id) : [];
    const phasen = u.leitfaden.map((p) => ({ phase: p.phase, punkte: p.punkte.map(mathHtml) }));
    return (
      <>
        {kopf}
        <Leitfaden key={schueler?.id ?? "keiner"} phasen={phasen} haken={haken} schuelerId={schueler?.id} utId={u.id} />
        {u.typischeFehler && (
          <div className="hint"><b>Typische Fehler:</b> <M t={u.typischeFehler} /></div>
        )}
      </>
    );
  }

  const stand = schueler ? await standVon(schueler.id) : {};
  const aufgaben = t.aufgaben.filter((a) => a.unterthema === u.id);
  const gruppen = STUFEN.map((s) => ({ titel: s, karten: aufgaben.filter((a) => a.stufe === s).map(karte) })).filter((g) => g.karten.length);

  return (
    <>
      {kopf}
      <AufgabenListe
        key={schueler?.id ?? "keiner"}
        gruppen={gruppen}
        stand={stand}
        istNiki={istNiki}
        schueler={istNiki && schueler ? { id: schueler.id, name: schueler.name } : null}
      />
      {istNiki && <p className="note">Aufgaben links oben antippen zum Auswählen, dann unten schicken oder als Arbeitsblatt drucken.</p>}
    </>
  );
}
