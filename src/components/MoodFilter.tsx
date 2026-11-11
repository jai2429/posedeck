"use client";
import { useState } from "react";
import { MOODS, type Mood, type Pose } from "@/core";

/** Mood chips above a grid. Cards are server-rendered and passed in by slug. */
export function MoodFilter({ poses, cards }: { poses: Pick<Pose, "slug" | "moods">[]; cards: Record<string, React.ReactNode> }) {
  const [mood, setMood] = useState<Mood | null>(null);
  const available = MOODS.filter((m) => poses.some((p) => p.moods.includes(m.mood)));
  const shown = poses.filter((p) => !mood || p.moods.includes(mood));
  return (
    <>
      <div className="chips" role="group" aria-label="Filter by mood">
        <button type="button" className="chip" aria-pressed={mood === null} onClick={() => setMood(null)}>All</button>
        {available.map((m) => (
          <button key={m.mood} type="button" className="chip" aria-pressed={mood === m.mood} onClick={() => setMood(mood === m.mood ? null : m.mood)}>
            {m.label}
          </button>
        ))}
      </div>
      <p className="count" aria-live="polite">{shown.length} {shown.length === 1 ? "pose" : "poses"}</p>
      <div className="grid">{shown.map((p) => <div key={p.slug}>{cards[p.slug]}</div>)}</div>
    </>
  );
}
