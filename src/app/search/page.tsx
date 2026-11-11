import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, searchPoses } from "@/core";
import { PoseCard } from "@/components/PoseCard";
import { SearchBox } from "@/components/SearchBox";

export const metadata: Metadata = { title: "Search poses", robots: { index: false } };

const IDEAS = ["shy", "grandparents", "jump", "sitting", "wedding", "birthday", "brother sister", "selfie"];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw ?? "").trim().slice(0, 80);
  const results = q ? searchPoses(q) : [];
  return (
    <div className="wrap">
      <div className="pagehead">
        <h1>Search</h1>
        <SearchBox defaultValue={q} autoFocus={!q} />
      </div>
      {q && results.length > 0 && (
        <>
          <p className="count">{results.length} {results.length === 1 ? "pose" : "poses"} for “{q}”</p>
          <div className="grid">{results.map((p) => <PoseCard key={p.slug} pose={p} showWho />)}</div>
        </>
      )}
      {q && results.length === 0 && (
        <div className="empty">
          <h2>No poses match “{q}”</h2>
          <p>Try who is in the photo, such as “couple” or “kids”, or a mood like “shy” or “playful”.</p>
        </div>
      )}
      {(!q || results.length === 0) && (
        <>
          <h2 className="sub">Popular searches</h2>
          <div className="chips">
            {IDEAS.map((i) => <Link key={i} href={`/search?q=${encodeURIComponent(i)}`} className="chip">{i}</Link>)}
          </div>
          <h2 className="sub">Browse by group</h2>
          <div className="chips">
            {CATEGORIES.map((c) => <Link key={c.who} href={`/c/${c.who}`} className="chip">{c.label}</Link>)}
          </div>
        </>
      )}
    </div>
  );
}
