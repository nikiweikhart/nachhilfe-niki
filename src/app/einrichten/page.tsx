import { redirect } from "next/navigation";
import { adminExistiert } from "@/lib/db";
import { EinrichtenForm } from "@/components/Formulare";

export const dynamic = "force-dynamic";

export default async function Einrichten() {
  if (await adminExistiert()) redirect("/anmelden");
  return (
    <div className="login">
      <span className="dot">∫</span>
      <h1>Einrichten</h1>
      <p className="sub">Einmalig: Leg dein eigenes Konto an. Den Einrichtungs-Code bekommst du von Claude.</p>
      <EinrichtenForm />
    </div>
  );
}
