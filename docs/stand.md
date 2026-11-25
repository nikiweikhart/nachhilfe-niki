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

## 2026-11-25: Prüfung vor der ersten Stunde
- E2E lokal grün (Einrichten, Schülerin einladen, schicken, Autocheck, falsches Passwort, Rechte, Lösungsbilder 404 für Schüler, Passwort-Reset).
- Live: Sicherheits-Header da, /niki ohne Login → Anmelden. Alle 176 Bilder im Build der /datei-Route.
- Supabase: RLS an allen nh_-Tabellen, Policies nur für nachhilfe_app, anon/authenticated ohne Rechte, Rolle ohne Rechte auf fremde Tabellen.
- Schülerin „Hana“ (8. Klasse) direkt angelegt, Einladungslink an Niki gegeben. Nikis Admin-Konto fehlt noch (/einrichten mit SETUP_CODE).

## Offen (nächste Schritte)
1. Niki richtet sein Konto ein und prüft ein Stundenblatt live.
2. Einzelne Pool-Aufgaben (151 mit Lösungen) als Original einbinden.
3. Buchaufgaben, sobald Niki sie schickt.
4. Optional: Anmelde-Sperre nach vielen Fehlversuchen (derzeit nur 0,6 s Verzögerung).
