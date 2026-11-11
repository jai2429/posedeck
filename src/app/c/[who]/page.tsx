import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, posesFor } from "@/core";
import { PoseCard } from "@/components/PoseCard";
import { MoodFilter } from "@/components/MoodFilter";
import { SurpriseButton } from "@/components/SurpriseButton";
import { AdSlot } from "@/components/AdSlot";

type Props = { params: Promise<{ who: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => CATEGORIES.map((c) => ({ who: c.who }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { who } = await params;
  const cat = CATEGORIES.find((c) => c.who === who);
  if (!cat) return {};
  return { title: `${cat.label} photo poses`, description: `${cat.line}. ${posesFor(cat.who).length} illustrated poses with step-by-step tips.` };
}

export default async function CategoryPage({ params }: Props) {
  const { who } = await params;
  const cat = CATEGORIES.find((c) => c.who === who);
  if (!cat) notFound();
  const poses = posesFor(cat.who);
  const cards = Object.fromEntries(poses.map((p) => [p.slug, <PoseCard key={p.slug} pose={p} />]));
  return (
    <div className="wrap">
      <div className="pagehead">
        <span className="swatch" style={{ background: cat.theme.bg }} aria-hidden="true" />
        <h1>{cat.label}</h1>
        <p>{cat.line}.</p>
        <SurpriseButton slugs={poses.map((p) => p.slug)} label="Pick one for me" />
      </div>
      <MoodFilter poses={poses.map((p) => ({ slug: p.slug, moods: p.moods }))} cards={cards} />
      <AdSlot slot="category-end" />
    </div>
  );
}
