-- Eigene Rolle für die App: darf nur die nh_-Tabellen benutzen, sonst nichts im Projekt.
-- Passwort wird beim Einrichten gesetzt (nicht im Repo).
create role nachhilfe_app login password '<<PASSWORT>>';
grant usage on schema public to nachhilfe_app;
grant select, insert, update, delete on nh_nutzer, nh_stand, nh_pins, nh_notizen, nh_leitfaden_haken to nachhilfe_app;
-- RLS bleibt an; nur diese Rolle bekommt Zugriff auf ihre eigenen Tabellen.
create policy nh_app on nh_nutzer for all to nachhilfe_app using (true) with check (true);
create policy nh_app on nh_stand for all to nachhilfe_app using (true) with check (true);
create policy nh_app on nh_pins for all to nachhilfe_app using (true) with check (true);
create policy nh_app on nh_notizen for all to nachhilfe_app using (true) with check (true);
create policy nh_app on nh_leitfaden_haken for all to nachhilfe_app using (true) with check (true);
