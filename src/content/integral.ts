import type { Thema } from "./types";
import { unterrichtIntegral } from "./unterricht-integral";
import { nachhilfeIntegral } from "./nachhilfe-integral";

const R = String.raw;

// Unterthemen sind ein erster Vorschlag. Sobald die Unterlagen der Lehrerin gesichtet sind,
// werden sie an ihre Pakete angepasst. IDs nie ändern, nur neue anhängen.
export const integral: Thema = {
  id: "integral",
  name: "Integralrechnung",
  symbol: "∫",
  stufe: "8. Klasse",
  unterthemen: [
    {
      id: "int-0",
      name: "Ableiten auffrischen",
      kurz: "Grundlage fürs Integrieren",
      grundkompetenz: "AN 3.3",
      bereit: true,
      leitfaden: [
        {
          phase: "Kurz",
          punkte: [
            R`Potenzregel: \((x^n)' = n\cdot x^{n-1}\)`,
            "Faktor bleibt stehen, Summe gliedweise, Zahl allein fällt weg",
            "Zwei, drei Aufgaben rechnen lassen. Sitzt es, gleich weiter zum Integrieren",
          ],
        },
      ],
    },
    {
      id: "int-1",
      name: "Stammfunktion & unbestimmtes Integral",
      kurz: "Ableiten rückwärts, + C, Rechenregeln",
      grundkompetenz: "AN 4.1",
      bereit: true,
      leitfaden: [
        {
          phase: "Einstieg",
          punkte: [
            "Ableitung = Steigung. Potenzregel wiederholen: Hochzahl nach vorne, minus 1",
            "Frage stellen: „Was muss ich ableiten, damit 2x rauskommt?“",
            "Integrieren = Ableiten rückwärts. Begriff Stammfunktion einführen",
          ],
        },
        {
          phase: "Erklären",
          punkte: [
            R`Warum + C: \(x^2\), \(x^2+1\), \(x^2-5\) haben dieselbe Ableitung`,
            R`In GeoGebra zeigen: \(f(x)=x^2+c\) mit Schieberegler, alle gleich steil, nur verschoben`,
            "Potenzregel rückwärts: Hochzahl plus 1, durch die neue Hochzahl teilen",
            "Probe immer durch Ableiten, so ist sie nie unsicher",
            R`Faktor bleibt, Summe gliedweise, Zahl allein: \(\int 5\,dx = 5x\)`,
            R`Brüche und Wurzeln umschreiben: \(\tfrac{1}{x^2}=x^{-2}\), \(\sqrt{x}=x^{1/2}\)`,
          ],
        },
        {
          phase: "Üben",
          punkte: [
            "Einstieg-Aufgaben gemeinsam, dann Übung allein rechnen lassen, nur zuschauen",
            "Wenn es schnell geht: eine Aufgabe auf Matura-Niveau zeigen",
          ],
        },
        {
          phase: "Abschluss",
          punkte: [
            "„Was nimmst du heute mit?“ in einem Satz sagen lassen",
            "Hausübung auswählen und schicken",
            "Fotos von Buchaufgaben und Schularbeitsstoff erbitten",
          ],
        },
      ],
      typischeFehler: R`ableiten statt integrieren · + C vergessen · durch die alte Hochzahl teilen · bei \(\int 5\,dx\) das x vergessen · \(\int \tfrac1x\,dx\) mit der Potenzregel versuchen (ist \(\ln|x|\))`,
    },
    {
      id: "int-7",
      name: "Integrationsregeln",
      kurz: "Potenz-, Faktor-, Summenregel, Exponential- und Winkelfunktionen",
      grundkompetenz: "AN 4.2",
      bereit: true,
      leitfaden: [
        { phase: "Erklären", punkte: [
          R`Potenzregel: \(\int x^n\,dx=\frac{x^{n+1}}{n+1}+C\) für \(n\neq-1\)`,
          R`Sonderfall \(\int \frac1x\,dx=\ln|x|+C\)`,
          R`\(\int e^x\,dx=e^x+C\), \(\int \sin x\,dx=-\cos x+C\), \(\int \cos x\,dx=\sin x+C\)`,
          "Konstanter Faktor bleibt, Summen gliedweise",
          "Formelsammlung zeigen: wo die Regeln stehen",
        ]},
        { phase: "Üben", punkte: ["Stundenblatt gemeinsam, Poolaufgaben AN 4.2 allein", "Probe immer durch Ableiten"] },
      ],
    },
    {
      id: "int-8",
      name: "Graphisch integrieren",
      kurz: "Vom Graphen von f auf den Graphen der Stammfunktion schließen",
      grundkompetenz: "AN 3.3",
      bereit: true,
      leitfaden: [
        { phase: "Erklären", punkte: [
          "f ist die Steigung von F: wo f > 0, steigt F; wo f < 0, fällt F",
          "Nullstelle von f mit Vorzeichenwechsel = Extremstelle von F",
          "Extremstelle von f = Wendestelle von F",
          "In GeoGebra: Integral(f) zeichnen lassen und vergleichen",
        ]},
        { phase: "Üben", punkte: ["Graphen-Zuordnungen aus dem Stundenblatt", "Typische Matura-Frage: Aussagen über F aus dem Graphen von f"] },
      ],
    },
    {
      id: "int-3",
      name: "Fläche unter dem Graphen, Ober- und Untersumme",
      kurz: "Fläche mit Rechtecken annähern",
      grundkompetenz: "AN 4.1",
      bereit: true,
      leitfaden: [
        { phase: "Erklären", punkte: [
          "Fläche mit Rechtecken annähern: Untersumme ≤ Fläche ≤ Obersumme",
          "Mehr Rechtecke → genauer; Grenzwert = bestimmtes Integral",
          "Bei monoton steigender Funktion: links = Untersumme, rechts = Obersumme",
        ]},
        { phase: "Üben", punkte: ["Untersumme mit 4 Rechtecken händisch", "Poolaufgaben AN 4.1"] },
      ],
    },
    {
      id: "int-2",
      name: "Bestimmtes Integral & Hauptsatz",
      kurz: "F(b) − F(a) und was es bedeutet",
      grundkompetenz: "AN 4.2",
      bereit: true,
      leitfaden: [
        { phase: "Erklären", punkte: [
          R`Hauptsatz: \(\int_a^b f(x)\,dx = F(b)-F(a)\)`,
          "Bestimmtes Integral ≠ Fläche, wenn f unter der x-Achse liegt (Fläche zählt dann negativ)",
          "In GeoGebra: Integral(f, a, b)",
        ]},
        { phase: "Üben", punkte: ["Stundenblatt, dann Poolaufgaben AN 4.1/4.2"] },
      ],
    },
    {
      id: "int-4",
      name: "Flächen berechnen",
      kurz: "unter der Kurve, zwischen zwei Kurven",
      grundkompetenz: "AN 4.3",
      bereit: true,
      leitfaden: [
        { phase: "Erklären", punkte: [
          "Immer zuerst skizzieren (GeoGebra): wo liegt die Fläche, wo sind Nullstellen?",
          "Teile unter der x-Achse getrennt berechnen und Betrag nehmen",
          R`Zwischen zwei Kurven: \(\int_a^b (oben - unten)\,dx\), Grenzen = Schnittpunkte`,
        ]},
        { phase: "Üben", punkte: ["Stundenblatt Fläche zwischen zwei Graphen", "Poolaufgaben AN 4.3 (Flächen)"] },
      ],
    },
    {
      id: "int-5",
      name: "Anwendungen",
      kurz: "Weg, Wassermenge, Kosten, Arbeit",
      grundkompetenz: "AN 4.3",
      bereit: true,
      leitfaden: [
        { phase: "Erklären", punkte: [
          "Integral einer Änderungsrate = Gesamtänderung (Geschwindigkeit → Weg, Zufluss → Wassermenge, Grenzkosten → Kosten)",
          "Einheiten mitdenken: m/s mal s = m",
          R`Physik: Arbeit \(W=\int F(s)\,ds\)`,
          "In Worten deuten üben: „Was bedeutet das Integral im Kontext?“",
        ]},
        { phase: "Üben", punkte: ["Poolaufgaben Anwendungen 1 und 2", "Physik: Arbeit"] },
      ],
    },
    {
      id: "int-6",
      name: "Matura-Mix",
      kurz: "Kompetenzcheck und gemischte Poolaufgaben",
      grundkompetenz: "AN 3–AN 4.3",
      bereit: true,
      leitfaden: [
        { phase: "Ablauf", punkte: [
          "Unter Zeitdruck rechnen lassen wie bei der Matura",
          "Danach Fehler sortieren: welches Unterthema wackelt? Dort nochmal üben",
        ]},
      ],
    },
  ],
  aufgaben: [
    ...nachhilfeIntegral,
    ...unterrichtIntegral,
    {
      id: "int-0-01", unterthema: "int-0", typ: "Potenzregel", stufe: "Einstieg", quelle: "selbst gemacht",
      art: "ankreuzen", frage: R`Was ist die Ableitung von \(f(x)=x^3\)?`,
      optionen: [R`\(3x^2\)`, R`\(x^2\)`, R`\(3x^3\)`, R`\(\tfrac{x^4}{4}\)`], richtig: [0],
      loesung: R`Hochzahl 3 nach vorne, Hochzahl minus 1: \(f'(x)=3x^2\).`,
    },
    {
      id: "int-0-02", unterthema: "int-0", typ: "Summen und Faktoren", stufe: "Übung", quelle: "selbst gemacht",
      art: "aufdecken", frage: R`Bilde die Ableitung von \(f(x)=4x^3-2x^2+7x-5\).`,
      loesung: R`\(f'(x)=12x^2-4x+7\). Die \(-5\) fällt weg.`, platz: "klein",
    },
    {
      id: "int-1-01", unterthema: "int-1", typ: "Ableiten rückwärts denken", stufe: "Einstieg", quelle: "selbst gemacht",
      art: "ankreuzen", frage: R`Welche Funktion hat die Ableitung \(2x\)?`,
      optionen: [R`\(x^2\)`, R`\(2\)`, R`\(2x^2\)`, R`\(x\)`], richtig: [0],
      loesung: R`\((x^2)'=2x\). Also ist \(x^2\) eine Stammfunktion von \(2x\).`,
    },
    {
      id: "int-1-02", unterthema: "int-1", typ: "Ableiten rückwärts denken", stufe: "Einstieg", quelle: "selbst gemacht",
      art: "ankreuzen", frage: R`Welche Funktion hat die Ableitung \(3x^2\)?`,
      optionen: [R`\(x^3\)`, R`\(6x\)`, R`\(3x^3\)`, R`\(x^2\)`], richtig: [0],
      loesung: R`\((x^3)'=3x^2\).`,
    },
    {
      id: "int-1-03", unterthema: "int-1", typ: "Warum + C?", stufe: "Einstieg", quelle: "selbst gemacht",
      art: "mehrfach", frage: R`Welche Funktionen haben alle die Ableitung \(2x\)? Kreuze alle richtigen an.`,
      optionen: [R`\(x^2\)`, R`\(x^2+1\)`, R`\(x^2-5\)`, R`\(2x^2\)`], richtig: [0, 1, 2],
      loesung: R`Eine Zahl fällt beim Ableiten weg. Deshalb schreibt man \(x^2+C\).`,
      geogebra: "f(x)=x^2+c eingeben, Schieberegler für c anlegen und bewegen",
    },
    {
      id: "int-1-04", unterthema: "int-1", typ: "Potenzregel rückwärts", stufe: "Übung", quelle: "selbst gemacht",
      art: "aufdecken", frage: R`Berechne \(\int x^4\,dx\).`,
      loesung: R`\(\int x^4\,dx=\frac{x^5}{5}+C\). Probe: \(\left(\frac{x^5}{5}\right)'=x^4\)`, platz: "klein",
    },
    {
      id: "int-1-05", unterthema: "int-1", typ: "Rechenregeln", stufe: "Übung", quelle: "selbst gemacht",
      art: "aufdecken", frage: R`Berechne \(\int (6x^2-4x+5)\,dx\).`,
      loesung: R`\(2x^3-2x^2+5x+C\). Gliedweise: \(6\cdot\frac{x^3}{3}\), \(4\cdot\frac{x^2}{2}\), \(5x\).`, platz: "mittel",
    },
    {
      id: "int-1-06", unterthema: "int-1", typ: "Umschreiben", stufe: "Übung", quelle: "selbst gemacht",
      art: "aufdecken", frage: R`Berechne \(\int \frac{1}{x^2}\,dx\).`,
      loesung: R`\(\frac1{x^2}=x^{-2}\), also \(\frac{x^{-1}}{-1}+C=-\frac1x+C\).`, platz: "mittel",
    },
    {
      id: "int-1-07", unterthema: "int-1", typ: "Stammfunktion durch einen Punkt", stufe: "Übung", quelle: "selbst gemacht",
      art: "zahl", label: "C =", frage: R`\(F(x)=x^2+C\) ist eine Stammfunktion von \(f(x)=2x\). Es gilt \(F(1)=5\). Wie groß ist \(C\)?`,
      richtig: 4, loesung: R`\(1^2+C=5\), also \(C=4\).`, platz: "klein",
    },
    {
      id: "int-1-08", unterthema: "int-1", typ: "Stammfunktion erkennen (Typ 1)", stufe: "Matura-Niveau", quelle: "selbst gemacht im Matura-Stil",
      art: "mehrfach", frage: R`Gegeben ist \(f(x)=3x^2+2\). Kreuze die beiden Funktionen an, die Stammfunktionen von \(f\) sind.`,
      optionen: [R`\(F_1(x)=x^3+2x\)`, R`\(F_2(x)=6x\)`, R`\(F_3(x)=x^3+2x+7\)`, R`\(F_4(x)=3x^3+2x\)`, R`\(F_5(x)=x^3+2\)`], richtig: [0, 2],
      loesung: R`Ableiten zur Probe: \(F_1'=F_3'=3x^2+2\). \(F_5'=3x^2\), da fehlt die 2.`,
      geogebra: "Ableitung(F_1) eingeben und mit f vergleichen",
    },
  ],
};
