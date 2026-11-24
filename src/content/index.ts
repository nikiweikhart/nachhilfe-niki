import type { Aufgabe, Thema, Unterthema } from "./types";
import { integral } from "./integral";

export const THEMEN: Thema[] = [integral];

export function thema(id: string): Thema | undefined {
  return THEMEN.find((t) => t.id === id);
}

export function unterthema(themaId: string, utId: string): Unterthema | undefined {
  return thema(themaId)?.unterthemen.find((u) => u.id === utId);
}

export const ALLE_AUFGABEN: Aufgabe[] = THEMEN.flatMap((t) => t.aufgaben);

export function aufgabe(id: string): Aufgabe | undefined {
  return ALLE_AUFGABEN.find((a) => a.id === id);
}

export function themaVonAufgabe(id: string): Thema | undefined {
  return THEMEN.find((t) => t.aufgaben.some((a) => a.id === id));
}

export const STUFEN = ["Einstieg", "Übung", "Matura-Niveau"] as const;
