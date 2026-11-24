# Nachhilfe Niki

Mathe-Nachhilfe-Tool: Niki hat pro Schüler und Thema Leitfaden, Aufgaben und Stand parat, schickt Aufgaben, druckt Arbeitsblätter. Schüler sehen oben, was Niki geschickt hat, und haken ab.

**Stack:** Next.js 15 (App Router) · Postgres bei Supabase (Tabellen `nh_*` im Apply-AI-Projekt, eigene Rolle `nachhilfe_app` ohne Zugriff auf andere Tabellen, nur vom Server) · Vercel · KaTeX für Formeln.

## Einrichten
1. `supabase/schema.sql` im Supabase-Projekt ausführen, dazu die Rolle `nachhilfe_app` (siehe `supabase/rolle.sql`).
2. Umgebungsvariablen (lokal `.env.local`, auf Vercel unter Settings → Environment Variables):
   - `DATABASE_URL` (Pooler, Transaction-Modus, Benutzer `nachhilfe_app.<projekt-ref>`)
   - `SESSION_SECRET` (zufällig, mind. 32 Zeichen)
   - `SETUP_CODE` (einmaliger Code für `/einrichten`, danach egal)
3. `npm install && npm run dev`, dann `/einrichten` öffnen und Nikis Konto anlegen.

## Inhalte
Liegen als Dateien in `src/content/` (ein Thema pro Datei). Aufgaben-IDs nie ändern, der Fortschritt hängt daran. Originalaufgaben (Aufgabenpool, Unterricht) als Bild in `private/` ablegen und mit `art: "original"` einbinden. Sie werden nur angemeldet ausgeliefert.
