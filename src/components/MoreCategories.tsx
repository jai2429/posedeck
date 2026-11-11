"use client";
import { useState, type ReactNode } from "react";

/** The home page shows four groups. This reveals the rest. */
export function MoreCategories({ children, count }: { children: ReactNode; count: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div id="more-groups" className="tiles tiles--more" hidden={!open}>
        {children}
      </div>
      <div className="more">
        <button type="button" className="btn btn--line" aria-expanded={open} aria-controls="more-groups" onClick={() => setOpen(!open)}>
          {open ? "Show fewer" : `More (${count} other groups)`}
        </button>
      </div>
    </>
  );
}
