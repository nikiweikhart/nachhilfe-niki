import { notFound } from "next/navigation";
import { thema as findeThema } from "@/content";
import { kontext } from "@/lib/kontext";
import { standVon } from "@/lib/db";
import { UnterthemaListe } from "@/components/UnterthemaListe";

export default async function ThemaSeite({ params }: { params: Promise<{ thema: string }> }) {
  const { thema: id } = await params;
  const t = findeThema(id);
  if (!t) notFound();
  const { istNiki, schueler } = await kontext();
  const stand = schueler ? await standVon(schueler.id) : {};
  return (
    <>
      <div>
        <h1>{t.symbol} {t.name}</h1>
        <p className="sub">{t.stufe} · von leicht nach schwer{istNiki && schueler ? ` · Stand von ${schueler.name}` : ""}</p>
      </div>
      <div className="card">
        <UnterthemaListe thema={t} stand={stand} nummern />
      </div>
      {istNiki && <p className="note">Aufgebaut nach den Stundenblättern aus dem Unterricht (08.09.–18.11.). Lösungen der Blätter siehst nur du.</p>}
    </>
  );
}
