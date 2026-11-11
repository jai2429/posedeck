"use client";
import { useEffect } from "react";
import { site } from "@/site";

/**
 * A reserved advert position. Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT
 * is set, so the layout is ready for ads without showing empty boxes.
 */
export function AdSlot({ slot }: { slot: string }) {
  const client = site.ads.client;
  useEffect(() => {
    if (!client) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle ?? []).push({});
    } catch {
      /* ad blockers */
    }
  }, [client]);
  if (!client) return null;
  return (
    <aside className="ad" aria-label="Advertisement">
      <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
    </aside>
  );
}
