import Link from "next/link";
import { poseBySlug, posesFor, type Category } from "@/core";
import { PoseArt } from "./PoseArt";

export function CategoryTile({ cat }: { cat: Category }) {
  const cover = poseBySlug(cat.cover)!;
  return (
    <Link href={`/c/${cat.who}`} className="tile" style={{ background: cat.theme.bg, color: cat.theme.ink }}>
      <PoseArt pose={cover} className="tile__art" />
      <span className="tile__text">
        <span className="tile__label">{cat.label}</span>
        <span className="tile__count">{posesFor(cat.who).length} poses</span>
      </span>
    </Link>
  );
}
