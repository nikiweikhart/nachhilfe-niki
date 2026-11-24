import { redirect } from "next/navigation";
import { aktuellerNutzer } from "@/lib/auth";
import { adminExistiert } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Start() {
  const n = await aktuellerNutzer();
  if (n) redirect(n.rolle === "admin" ? "/niki" : "/lernen");
  if (!(await adminExistiert())) redirect("/einrichten");
  redirect("/anmelden");
}
