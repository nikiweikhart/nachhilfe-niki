# Stand

## 2026-11-24: erste Version
- Anmeldung mit Name + Passwort. Niki legt Schüler an (nur Vorname), schickt Einladungslink, Schüler setzt Passwort selbst. Zurücksetzen = neuer Link, alte Sitzungen ungültig.
- Erstes Konto über `/einrichten` mit `SETUP_CODE`.
- Niki: Übersicht (Stand pro Schüler, offen, nochmal üben), Schülerseite (Einladungslink, Ampel pro Unterthema, Angepinntes, Notiz, Zugang), Bibliothek mit Leitfaden (Häkchen pro Schüler) und Aufgaben (auswählen → schicken / Arbeitsblatt). Oben „Für: …“ wählt den Schüler.
- Schüler: „Von Niki für dich“ (angepinnt), Fortschritt, alle Aufgaben durchklickbar.
- Aufgabenarten: ankreuzen (1 richtig), mehrfach (z. B. 2 aus 5), Zahl, aufdecken, Original (Bild).
- Stand pro Aufgabe: offen / gemacht / sitzt / nochmal üben. Richtige Selbstkontrolle → gemacht, falsche → nochmal.
- Arbeitsblatt `/blatt?ids=…`: A4, 3 Aufgaben pro Seite mit Platz zum Rechnen, Drucken/PDF über den Browser. Kein Lösungsblatt (Niki hat Lösungen in der App).
- Inhalt bisher: Integralrechnung, Unterthemen 0 (Ableiten) und 1 (Stammfunktion) mit Beispielaufgaben. Unterthemen sind ein Vorschlag, werden an die Pakete der Lehrerin angepasst.
- Getestet lokal mit Playwright gegen einen Test-Datenbank-Ersatz: Einrichten, Schüler anlegen, Einladung, Schicken, Selbstkontrolle, Falsch-Passwort, Rechte (Schüler kommt nicht auf Niki-Seiten), Passwort-Reset.

## Offen
- Supabase-Projekt + Vercel einrichten, online stellen.
- Unterlagen der Lehrerin sichten, Unterthemen anpassen, Pool-Aufgaben als Original einbinden.
- Buchaufgaben (Mathematik verstehen 8) einbauen, sobald Niki sie schickt.
