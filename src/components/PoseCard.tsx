import Link from "next/link";
import { categoryOf, type Pose } from "@/core";
import { site } from "@/site";
import { PoseArt } from "./PoseArt";
import { SaveButton } from "./SaveButton";

export function PoseCard({ pose, showWho = false }: { pose: Pose; showWho?: boolean }) {
  const cat = categoryOf(pose.who);
  return (
    <article className="card">
      <Link href={`/pose/${pose.slug}`} className="card__link">
        <PoseArt pose={pose} className="card__art" />
        <h3 className="card__title">{pose.title}</h3>
        <p className="card__meta">
          {showWho ? `${cat.label}, ` : ""}
          {pose.moods.join(" and ")}
        </p>
      </Link>
      {site.premium.enabled && pose.premium && <span className="card__pro">Pro</span>}
      <SaveButton slug={pose.slug} title={pose.title} />
    </article>
  );
}
