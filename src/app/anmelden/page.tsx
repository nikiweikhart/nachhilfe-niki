import { redirect } from "next/navigation";
import { aktuellerNutzer } from "@/lib/auth";
import { AnmeldeForm } from "@/components/Formulare";

export const dynamic = "force-dynamic";

export default async function Anmelden() {
  const n = await aktuellerNutzer();
  if (n) redirect(n.rolle === "admin" ? "/niki" : "/lernen");
  return (
    <div className="login">
      <span className="dot">∫</span>
      <h1>Nachhilfe Niki</h1>
      <p className="sub">Melde dich mit deinem Vornamen und Passwort an.</p>
      <AnmeldeForm />
    </div>
  );
}
