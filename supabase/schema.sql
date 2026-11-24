-- Nachhilfe Niki: Datenbank
-- Zugriff nur vom Server (Service-Role-Key). RLS ist an, ohne Policies:
-- der öffentliche anon-Key kann damit nichts lesen oder schreiben.

create table if not exists nutzer (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_klein text generated always as (lower(trim(name))) stored unique,
  rolle text not null check (rolle in ('admin', 'schueler')),
  klasse text,
  passwort_hash text,
  einladung text unique,           -- Token für Einladungs-/Reset-Link, null wenn eingelöst
  sitzung_version int not null default 1, -- erhöhen = alle Sitzungen abmelden
  erstellt timestamptz not null default now()
);

create table if not exists stand (
  nutzer_id uuid not null references nutzer(id) on delete cascade,
  aufgabe_id text not null,
  status text not null check (status in ('offen', 'gemacht', 'sitzt', 'nochmal')),
  geaendert timestamptz not null default now(),
  primary key (nutzer_id, aufgabe_id)
);

create table if not exists pins (
  nutzer_id uuid not null references nutzer(id) on delete cascade,
  aufgabe_id text not null,
  erstellt timestamptz not null default now(),
  primary key (nutzer_id, aufgabe_id)
);

create table if not exists notizen (
  nutzer_id uuid primary key references nutzer(id) on delete cascade,
  text text not null default '',
  geaendert timestamptz not null default now()
);

-- Häkchen im Leitfaden: pro Schüler und Unterthema
create table if not exists leitfaden_haken (
  nutzer_id uuid not null references nutzer(id) on delete cascade,
  unterthema_id text not null,
  punkt int not null,
  primary key (nutzer_id, unterthema_id, punkt)
);

alter table nutzer enable row level security;
alter table stand enable row level security;
alter table pins enable row level security;
alter table notizen enable row level security;
alter table leitfaden_haken enable row level security;
