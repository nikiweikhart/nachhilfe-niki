"use client";

import { useActionState, useState } from "react";
import { anmeldenAktion, einladungAktion, einrichtenAktion, schuelerAnlegen, schuelerLoeschen, type Meldung } from "@/app/aktionen";

function Fehler({ m }: { m: Meldung }) {
  return m?.fehler ? <p className="fehler" role="alert">{m.fehler}</p> : null;
}

export function AnmeldeForm() {
  const [m, act, laeuft] = useActionState(anmeldenAktion, null);
  const [name, setName] = useState("");
  return (
    <form action={act} className="form">
      <input name="name" placeholder="Vorname" autoComplete="username" required aria-label="Vorname" value={name} onChange={(e) => setName(e.target.value)} />
      <input name="passwort" type="password" placeholder="Passwort" autoComplete="current-password" required aria-label="Passwort" />
      <Fehler m={m} />
      <button className="btn" style={{ padding: 12 }} disabled={laeuft}>{laeuft ? "Einen Moment …" : "Anmelden"}</button>
    </form>
  );
}

export function EinladungForm({ token }: { token: string }) {
  const [m, act, laeuft] = useActionState(einladungAktion, null);
  return (
    <form action={act} className="form">
      <input type="hidden" name="token" value={token} />
      <input name="passwort" type="password" placeholder="Passwort (mind. 6 Zeichen)" autoComplete="new-password" required aria-label="Passwort" />
      <input name="passwort2" type="password" placeholder="Passwort wiederholen" autoComplete="new-password" required aria-label="Passwort wiederholen" />
      <Fehler m={m} />
      <button className="btn" style={{ padding: 12 }} disabled={laeuft}>{laeuft ? "Einen Moment …" : "Los geht's"}</button>
    </form>
  );
}

export function EinrichtenForm() {
  const [m, act, laeuft] = useActionState(einrichtenAktion, null);
  return (
    <form action={act} className="form">
      <input name="code" placeholder="Einrichtungs-Code" required aria-label="Einrichtungs-Code" autoComplete="off" />
      <input name="name" placeholder="Dein Vorname" defaultValue="Niki" required aria-label="Vorname" autoComplete="username" />
      <input name="passwort" type="password" placeholder="Passwort (mind. 6 Zeichen)" required aria-label="Passwort" autoComplete="new-password" />
      <Fehler m={m} />
      <button className="btn" style={{ padding: 12 }} disabled={laeuft}>Einrichten</button>
    </form>
  );
}

export function SchuelerNeuForm() {
  const [m, act, laeuft] = useActionState(schuelerAnlegen, null);
  return (
    <form action={act} className="form">
      <div className="row" style={{ alignItems: "stretch" }}>
        <input name="name" placeholder="Vorname" required aria-label="Vorname" style={{ flex: 2, minWidth: 140 }} />
        <input name="klasse" placeholder="Klasse, z. B. 8. Klasse" aria-label="Klasse" style={{ flex: 1, minWidth: 120 }} />
        <button className="btn" disabled={laeuft}>Hinzufügen</button>
      </div>
      <Fehler m={m} />
    </form>
  );
}

export function LoeschenKnopf({ id, name }: { id: string; name: string }) {
  const [sicher, setSicher] = useState(false);
  if (!sicher) return <button className="btn danger" onClick={() => setSicher(true)}>{name} entfernen</button>;
  return (
    <div className="row">
      <span className="note">Stand, Notiz und Zugang von {name} werden gelöscht.</span>
      <button className="btn danger" onClick={() => schuelerLoeschen(id)}>Ja, entfernen</button>
      <button className="linkbtn" onClick={() => setSicher(false)}>Abbrechen</button>
    </div>
  );
}
