import type { Aufgabe } from "@/content/types";
import type { KartenDaten } from "@/components/AufgabeKarte";
import { mathHtml } from "./math";

export function karte(a: Aufgabe, istNiki = false): KartenDaten {
  const basis = {
    id: a.id, typ: a.typ, stufe: a.stufe, quelle: a.quelle, art: a.art,
    frage: mathHtml(a.frage), loesung: mathHtml(a.loesung), geogebra: a.geogebra,
  };
  switch (a.art) {
    case "ankreuzen":
    case "mehrfach":
      return { ...basis, optionen: a.optionen.map(mathHtml), richtig: a.richtig };
    case "zahl":
      return { ...basis, richtig: a.richtig, label: a.label ? mathHtml(a.label) : undefined, einheit: a.einheit };
    case "original":
      return { ...basis, bilder: a.bilder, loesungBilder: istNiki ? a.loesungBilder : undefined };
    default:
      return basis;
  }
}
