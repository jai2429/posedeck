"use client";
import { useRouter } from "next/navigation";

export function SurpriseButton({ slugs, label = "Surprise me" }: { slugs: string[]; label?: string }) {
  const router = useRouter();
  return (
    <button type="button" className="btn btn--ghost" onClick={() => router.push(`/pose/${slugs[Math.floor(Math.random() * slugs.length)]}`)}>
      {label}
    </button>
  );
}
