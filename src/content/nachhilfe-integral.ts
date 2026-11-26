import type { Aufgabe } from "./types";

// Nikis eigene Nachhilfe-Blätter (Integralrechnung), als Bild. „loesungBilder“ sieht nur Niki.
// Quelle: Project Files nachhilfe-hanna/Stunde2-*.pdf. IDs nie ändern.
const b = (n: number[]) => n.map((i) => `nachhilfe/stunde2/blatt-${i}.jpg`);
const l = (n: number[]) => n.map((i) => `nachhilfe/stunde2/loesung-${i}.jpg`);

export const nachhilfeIntegral: Aufgabe[] = [
  { id: "int-n-2-1", unterthema: "int-7", typ: "Formelsammlung", stufe: "Einstieg", quelle: "Nachhilfe", art: "original",
    frage: "Formelsammlung Integralrechnung", loesung: "", bilder: b([1, 2]) },
  { id: "int-n-2-2", unterthema: "int-1", typ: "Nachhilfe-Blatt", stufe: "Übung", quelle: "Nachhilfe", art: "original",
    frage: "Aufwärmen: Stammfunktionen und bestimmtes Integral", loesung: "", bilder: b([3, 4]), loesungBilder: l([1, 2]) },
  { id: "int-n-2-3", unterthema: "int-7", typ: "Nachhilfe-Blatt", stufe: "Einstieg", quelle: "Nachhilfe", art: "original",
    frage: "Welche Regel ist das? Integrationsregeln erkennen", loesung: "", bilder: b([5]), loesungBilder: l([3]) },
  { id: "int-n-2-4", unterthema: "int-7", typ: "Nachhilfe-Blatt", stufe: "Übung", quelle: "Nachhilfe", art: "original",
    frage: "Regeln anwenden", loesung: "", bilder: b([6, 7]), loesungBilder: l([4, 5]) },
  { id: "int-n-2-5", unterthema: "int-7", typ: "Nachhilfe-Blatt", stufe: "Matura-Niveau", quelle: "Nachhilfe", art: "original",
    frage: "Regeln für Fortgeschrittene: f(k·x), Bedingungen, andere Variablen", loesung: "", bilder: b([8, 9, 10]), loesungBilder: l([6, 7, 8]) },
  { id: "int-n-2-6", unterthema: "int-4", typ: "Nachhilfe-Blatt", stufe: "Übung", quelle: "Nachhilfe", art: "original",
    frage: "Flächeninhalt oder Integral? Minus-Flächen", loesung: "", bilder: b([11, 12]), loesungBilder: l([9, 10]) },
];
