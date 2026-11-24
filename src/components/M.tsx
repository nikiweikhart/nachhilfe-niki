import { mathHtml } from "@/lib/math";

/** Text mit Formeln (\( … \)). Inhalte stammen aus den Repo-Dateien, nicht von Nutzern. */
export function M({ t, className }: { t: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: mathHtml(t) }} />;
}
