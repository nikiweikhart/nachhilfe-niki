# Nachhilfe Niki – Regeln für Claude

- Stand und Entscheidungen: `docs/stand.md` (zuerst lesen). Wiki-Seite im Second Brain: `Second Brain/Vision/wiki/themen/nachhilfe.md`.
- Inhalte in `src/content/*.ts`. Aufgaben-IDs nie ändern oder wiederverwenden.
- **Matura-Aufgaben und Aufgaben der Lehrerin nie umschreiben**, unverändert als Original (Bild) übernehmen. Name der Lehrerin nirgends im Tool.
- Alles bleibt hinter dem Login. Datenbank nur über `src/lib/db.ts` (Postgres-Rolle `nachhilfe_app`, sieht nur die `nh_`-Tabellen im Apply-AI-Supabase-Projekt, nur Server). Keine Schlüssel committen.
- Oberfläche: Apple-artig, einfach, selbsterklärend, gut auf Handy und Laptop.
- Fertig = committet + gepusht, `docs/stand.md` und Second-Brain-Wiki nachziehen.
