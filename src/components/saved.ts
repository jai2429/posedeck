"use client";
import { useSyncExternalStore } from "react";

const KEY = "posedeck:saved";
const listeners = new Set<() => void>();
let cache: string[] | null = null;
const EMPTY: string[] = [];

function read(): string[] {
  if (cache) return cache;
  try {
    cache = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
  } catch {
    cache = [];
  }
  return cache!;
}

export function toggleSaved(slug: string) {
  const now = read();
  cache = now.includes(slug) ? now.filter((s) => s !== slug) : [slug, ...now];
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* private mode: the list still works until the tab closes */
  }
  listeners.forEach((l) => l());
}

export function useSaved(): string[] {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => EMPTY,
  );
}
