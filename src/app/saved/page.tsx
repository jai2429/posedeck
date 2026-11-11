import type { Metadata } from "next";
import { SavedList } from "./SavedList";

export const metadata: Metadata = { title: "Saved poses", robots: { index: false } };

export default function SavedPage() {
  return (
    <div className="wrap">
      <div className="pagehead">
        <h1>Saved poses</h1>
        <p>Your shortlist for the next shoot. It is kept on this device.</p>
      </div>
      <SavedList />
    </div>
  );
}
