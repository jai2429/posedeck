"use client";
import { toggleSaved, useSaved } from "./saved";

export function SaveButton({ slug, title, variant = "icon" }: { slug: string; title: string; variant?: "icon" | "full" }) {
  const saved = useSaved().includes(slug);
  const label = saved ? `Remove ${title} from saved poses` : `Save ${title}`;
  return (
    <button
      type="button"
      className={variant === "icon" ? "save save--icon" : "btn btn--ghost"}
      aria-pressed={saved}
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved(slug);
      }}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      {variant === "full" && <span>{saved ? "Saved" : "Save pose"}</span>}
    </button>
  );
}
