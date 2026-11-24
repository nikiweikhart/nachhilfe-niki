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

## 2026-11-24: Datenbank
- Supabase-Gratis erlaubt nur 2 aktive Projekte (Apply AI + Sponsoring). Entscheidung Niki: Tabellen `nh_*` ins **Apply-AI-Projekt** (`ebafsuieuwoftdhrkbax`).
- App verbindet sich per Postgres (`DATABASE_URL`, Pooler) als Rolle `nachhilfe_app`. Die Rolle hat nur Rechte auf die `nh_`-Tabellen (geprüft: kein Zugriff auf `jobs`). RLS an, Policies nur für diese Rolle, `anon`/`authenticated` haben keine Rechte.
- Lokal getestet gegen echtes Postgres 16 mit derselben Rolle: alle Abläufe grün.

## 2026-11-24: online
- Vercel-Projekt `nachhilfe-niki` (Team niki-bd01), Adresse **https://nachhilfe-niki.vercel.app**, Funktionen in dub1 (nahe Supabase eu-west-1). Pushes auf `main` gehen automatisch live.
- Umgebungsvariablen in Vercel: `DATABASE_URL` (Pooler **aws-1**-eu-west-1; aws-0 kennt das Projekt nicht), `SESSION_SECRET`, `SETUP_CODE`.

## 2026-11-24: Stundenblätter aus dem Unterricht
- 21 Stundenblätter (08.09.–18.11.) eingetragen in `src/content/unterricht-integral.ts`, Bilder gehören nach `private/unterricht/<datum>/` (leer-N.jpg, loesungen-N.jpg; aus den PDFs im Second Brain unter `Claude outputs/nachhilfe/unterlagen-integral/`, 100 dpi, JPEG q75).
- Unterthemen neu geordnet wie im Unterricht (int-0, 1, 7, 8, 3, 2, 4, 5, 6). Lösungsbilder (Dateiname beginnt mit `loesung`) sieht nur Niki, Schüler bekommen 404.
- Arbeitsblatt druckt Originale je Bild auf eigener Seite.

## Offen (nächste Schritte, in dieser Reihenfolge)
1. ✓ Bilder hochgeladen (Freigabe von Niki 24.11., über PC).
2. E2E-Test `/tmp/claude-0/e2e2.js` anpassen: Auswahl per Aufgaben-ID (`#a-int-1-03 .sel-tick`) statt Position, dann lokal prüfen (Schüler: leer 200, Lösung 404; Niki: Lösung 200).
3. Auf Vercel prüfen, dass Bilder über `/datei/...` laden.
4. Einzelne Pool-Aufgaben (151 mit Lösungen) als Original einbinden, sobald der Ordner im Repo liegt.
- Buchaufgaben (Mathematik verstehen 8) einbauen, sobald Niki sie schickt.
