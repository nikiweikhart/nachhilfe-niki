// Inhalte liegen als Dateien im Repo (versioniert, Claude pflegt sie).
// In der Datenbank steht nur, was Schüler und Niki damit tun (Stand, Pins, Notizen).

export type Stufe = "Einstieg" | "Übung" | "Matura-Niveau";
export type Quelle =
  | "selbst gemacht"
  | "selbst gemacht im Matura-Stil"
  | "Matura-Aufgabenpool"
  | "Unterricht"
  | "Mathebuch";

/** Text mit Formeln: alles zwischen \( und \) wird als LaTeX gesetzt. */
export type MathText = string;

type Basis = {
  id: string; // global eindeutig, ändert sich nie (Fortschritt hängt daran)
  unterthema: string;
  typ: string; // Aufgabentyp: was die Aufgabe eigentlich verlangt
  stufe: Stufe;
  quelle: Quelle;
  frage: MathText;
  loesung: MathText;
  geogebra?: string; // optionaler Hinweis „So in GeoGebra“
  platz?: "klein" | "mittel" | "gross"; // Platz zum Rechnen auf dem Arbeitsblatt
};

export type Aufgabe =
  | (Basis & { art: "ankreuzen"; optionen: MathText[]; richtig: number[] }) // 1 richtig
  | (Basis & { art: "mehrfach"; optionen: MathText[]; richtig: number[] }) // mehrere richtig (z. B. 2 aus 5)
  | (Basis & { art: "zahl"; richtig: number; einheit?: string; label?: string })
  | (Basis & { art: "aufdecken" }) // auf Papier rechnen, Lösung aufdecken
  | (Basis & { art: "original"; bilder: string[] }); // Original-Aufgabe als Bild (Pool, Lehrerin), unverändert

export type LeitfadenPhase = { phase: string; punkte: MathText[] };

export type Unterthema = {
  id: string;
  name: string;
  kurz: string;
  grundkompetenz?: string;
  bereit: boolean;
  leitfaden: LeitfadenPhase[];
  typischeFehler?: MathText;
};

export type Thema = {
  id: string;
  name: string;
  symbol: string;
  stufe: string; // z. B. „8. Klasse“
  unterthemen: Unterthema[];
  aufgaben: Aufgabe[];
};
