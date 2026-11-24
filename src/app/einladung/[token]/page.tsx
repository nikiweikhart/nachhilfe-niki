import Link from "next/link";
import { nutzerByEinladung } from "@/lib/db";
import { EinladungForm } from "@/components/Formulare";

export const dynamic = "force-dynamic";

export default async function Einladung({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const n = await nutzerByEinladung(token);
  if (!n) {
    return (
      <div className="login">
        <span className="dot">∫</span>
        <h1>Link abgelaufen</h1>
        <p className="sub">Dieser Link wurde schon benutzt oder gilt nicht mehr. Frag Niki nach einem neuen.</p>
        <Link href="/anmelden">Zur Anmeldung</Link>
      </div>
    );
  }
  return (
    <div className="login">
      <span className="dot">∫</span>
      <h1>Willkommen, {n.name}</h1>
      <p className="sub">Leg einmal ein Passwort fest. Danach meldest du dich mit „{n.name}“ und diesem Passwort an.</p>
      <EinladungForm token={token} />
    </div>
  );
}
