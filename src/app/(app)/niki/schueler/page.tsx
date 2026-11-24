import Link from "next/link";
import { brauchtAdmin } from "@/lib/auth";
import { schuelerListe } from "@/lib/db";
import { SchuelerNeuForm } from "@/components/Formulare";

export default async function SchuelerSeite() {
  await brauchtAdmin();
  const schueler = await schuelerListe();
  return (
    <>
      <div>
        <h1>Schüler</h1>
        <p className="sub">Wer bei dir Nachhilfe hat</p>
      </div>
      {schueler.length > 0 && (
        <div className="card list">
          {schueler.map((s) => (
            <Link key={s.id} href={`/niki/schueler/${s.id}`} className="item">
              <span className="lamp" style={{ background: s.passwort_hash ? "var(--ok)" : "var(--idle)" }} />
              <span className="grow">
                <span><span className="t">{s.name}</span>{s.klasse && <span className="d"> · {s.klasse}</span>}</span>
                {!s.passwort_hash && <span className="d">Einladung noch offen</span>}
              </span>
              <span className="chev">›</span>
            </Link>
          ))}
        </div>
      )}
      <div className="card">
        <h2>Schüler hinzufügen</h2>
        <p className="sub" style={{ marginBottom: 12 }}>Nur der Vorname. Danach bekommst du einen Link zum Weiterschicken. Beim ersten Öffnen legt der Schüler selbst sein Passwort fest.</p>
        <SchuelerNeuForm />
      </div>
    </>
  );
}
