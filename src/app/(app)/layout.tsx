import Link from "next/link";
import { brauchtNutzer, fuerId } from "@/lib/auth";
import { schuelerListe } from "@/lib/db";
import { THEMEN } from "@/content";
import { FuerWahl, Navigation } from "@/components/Klein";
import { abmeldenAktion } from "../aktionen";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const n = await brauchtNutzer();
  const istNiki = n.rolle === "admin";
  const schueler = istNiki ? await schuelerListe() : [];
  const fuer = istNiki ? await fuerId() : null;
  const fuerGueltig = schueler.some((s) => s.id === fuer) ? fuer : null;

  const eintraege = istNiki
    ? [
        { href: "/niki", label: "Übersicht", match: ["/niki$"] },
        { href: "/niki/schueler", label: "Schüler", match: ["/niki/schueler"] },
        { href: `/bibliothek/${THEMEN[0].id}`, label: "Bibliothek", match: ["/bibliothek"] },
      ]
    : [
        { href: "/lernen", label: "Für dich", match: ["/lernen"] },
        { href: `/bibliothek/${THEMEN[0].id}`, label: "Alle Aufgaben", match: ["/bibliothek"] },
      ];

  return (
    <>
      <header className="top">
        <div className="top-in">
          <Link href="/" className="brand"><span className="dot">∫</span><span className="name">Nachhilfe Niki</span></Link>
          <span className="spacer" />
          {istNiki && <FuerWahl schueler={schueler.map((s) => ({ id: s.id, name: s.name }))} aktuell={fuerGueltig} />}
          <form action={abmeldenAktion}><button className="linkbtn" type="submit">Abmelden</button></form>
        </div>
      </header>
      <div className="wrap">
        <Navigation eintraege={eintraege} themen={istNiki ? THEMEN.map((t) => ({ href: `/bibliothek/${t.id}`, label: `${t.symbol} ${t.name}` })) : undefined} />
        <main className="main">{children}</main>
      </div>
    </>
  );
}
