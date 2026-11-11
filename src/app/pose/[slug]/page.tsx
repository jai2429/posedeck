import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEVELS, POSES, categoryOf, poseBySlug, posesFor } from "@/core";
import { site } from "@/site";
import { PoseArt } from "@/components/PoseArt";
import { PoseCard } from "@/components/PoseCard";
import { SaveButton } from "@/components/SaveButton";
import { ShareButton } from "@/components/ShareButton";
import { AdSlot } from "@/components/AdSlot";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => POSES.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pose = poseBySlug(slug);
  if (!pose) return {};
  const cat = categoryOf(pose.who);
  return { title: `${pose.title}: ${cat.label.toLowerCase()} photo pose`, description: `${pose.blurb} ${pose.steps[0]}` };
}

export default async function PosePage({ params }: Props) {
  const { slug } = await params;
  const pose = poseBySlug(slug);
  if (!pose) notFound();
  const cat = categoryOf(pose.who);
  const siblings = posesFor(pose.who);
  const at = siblings.findIndex((p) => p.slug === pose.slug);
  const next = siblings[(at + 1) % siblings.length];
  const related = siblings.filter((p) => p.slug !== pose.slug && p.slug !== next.slug && p.moods.some((m) => pose.moods.includes(m))).slice(0, 4);
  const locked = site.premium.enabled && pose.premium;
  const people = pose.figures.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${pose.title} photo pose`,
    description: pose.blurb,
    step: pose.steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
  };

  return (
    <div className="wrap">
      <nav className="crumb" aria-label="Breadcrumb">
        <Link href={`/c/${cat.who}`}>All {cat.label.toLowerCase()} poses</Link>
      </nav>
      <article className="pose">
        <div className="pose__art" style={{ background: cat.theme.bg }}>
          <PoseArt pose={pose} />
        </div>
        <div className="pose__body">
          <h1>{pose.title}</h1>
          <p className="pose__blurb">{pose.blurb}</p>
          <dl className="facts">
            <div><dt>People</dt><dd>{people}</dd></div>
            <div><dt>Mood</dt><dd>{pose.moods.join(", ")}</dd></div>
            <div><dt>Difficulty</dt><dd>{LEVELS[pose.level]}</dd></div>
            {pose.needs && <div><dt>You need</dt><dd>{pose.needs}</dd></div>}
          </dl>
          {locked ? (
            <div className="locked">
              <h2>This is a Pro pose</h2>
              <p>The step-by-step guide for this pose is part of {site.name} Pro.</p>
            </div>
          ) : (
            <>
              <h2>How to do it</h2>
              <ol className="steps">
                {pose.steps.map((s) => <li key={s}>{s}</li>)}
              </ol>
              <div className="shot">
                <h2>If you are holding the camera</h2>
                <p>{pose.shot}</p>
              </div>
            </>
          )}
          <div className="actions">
            <SaveButton slug={pose.slug} title={pose.title} variant="full" />
            <ShareButton title={`${pose.title} | ${site.name}`} />
            <Link href={`/pose/${next.slug}`} className="btn btn--solid">Next pose</Link>
          </div>
        </div>
      </article>

      <AdSlot slot="pose-mid" />

      {related.length > 0 && (
        <section aria-labelledby="rel" className="related">
          <h2 id="rel">Try these next</h2>
          <div className="grid">{related.map((p) => <PoseCard key={p.slug} pose={p} />)}</div>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
