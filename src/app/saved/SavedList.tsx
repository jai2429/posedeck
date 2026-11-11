"use client";
import Link from "next/link";
import { poseBySlug, type Pose } from "@/core";
import { PoseCard } from "@/components/PoseCard";
import { useSaved } from "@/components/saved";

export function SavedList() {
  const poses = useSaved().map(poseBySlug).filter((p): p is Pose => Boolean(p));
  if (!poses.length)
    return (
      <div className="empty">
        <h2>Nothing saved yet</h2>
        <p>Tap the bookmark on any pose to keep it here.</p>
        <Link href="/" className="btn btn--solid">Find a pose</Link>
      </div>
    );
  return <div className="grid">{poses.map((p) => <PoseCard key={p.slug} pose={p} showWho />)}</div>;
}
