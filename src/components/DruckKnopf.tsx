"use client";

export function DruckKnopf() {
  return <button className="btn" onClick={() => window.print()}>Drucken oder als PDF sichern</button>;
}

export function ZurueckKnopf() {
  return <button className="linkbtn" onClick={() => history.back()}>‹ Zurück</button>;
}
