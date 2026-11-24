# Nachhilfe Niki

Mathe-Nachhilfe-Tool: Niki hat pro Schüler und Thema Leitfaden, Aufgaben und Stand parat, schickt Aufgaben, druckt Arbeitsblätter. Schüler sehen oben, was Niki geschickt hat, und haken ab.

**Stack:** Next.js 15 (App Router) · Supabase (nur Postgres, Zugriff ausschließlich vom Server) · Vercel · KaTeX für Formeln.

## Einrichten
1. Supabase-Projekt anlegen, im SQL-Editor `supabase/schema.sql` ausführen.
2. Umgebungsvariablen (lokal `.env.local`, auf Vercel unter Settings → Environment Variables):
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (Supabase → Project Settings → API)
   - `SESSION_SECRET` (zufällig, mind. 32 Zeichen)
   - `SETUP_CODE` (einmaliger Code für `/einrichten`, danach egal)
3. `npm install && npm run dev`, dann `/einrichten` öffnen und Nikis Konto anlegen.

## Inhalte
Liegen als Dateien in `src/content/` (ein Thema pro Datei). Aufgaben-IDs nie ändern, der Fortschritt hängt daran. Originalaufgaben (Aufgabenpool, Unterricht) als Bild in `private/` ablegen und mit `art: "original"` einbinden. Sie werden nur angemeldet ausgeliefert.
