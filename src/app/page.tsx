import Link from "next/link";
import { CATEGORIES, MOODS, POSES, poseBySlug } from "@/core";
import { CategoryTile } from "@/components/CategoryTile";
import { MoreCategories } from "@/components/MoreCategories";
import { PoseArt } from "@/components/PoseArt";
import { SearchBox } from "@/components/SearchBox";
import { SurpriseButton } from "@/components/SurpriseButton";
import { AdSlot } from "@/components/AdSlot";

const DECK = ["friends-jump-shot", "the-twirl", "hand-on-hip"];

export default function Home() {
  const featured = CATEGORIES.filter((c) => c.featured);
  const rest = CATEGORIES.filter((c) => !c.featured);
  return (
    <>
      <section className="hero">
        <div className="hero__text">
          <h1>Never do the same pose twice.</h1>
          <p>
            {POSES.length} photo poses for one person, two people or the whole family. Pick one, follow three steps, take the picture.
          </p>
          <SearchBox />
          <div className="hero__alt">
            <SurpriseButton slugs={POSES.map((p) => p.slug)} />
          </div>
        </div>
        <div className="deck" aria-hidden="true">
          {DECK.map((slug, i) => (
            <div key={slug} className={`deck__card deck__card--${i}`}>
              <PoseArt pose={poseBySlug(slug)!} />
            </div>
          ))}
        </div>
      </section>

      <section className="wrap" aria-labelledby="who">
        <h2 id="who">Who is in the photo?</h2>
        <div className="tiles">
          {featured.map((c) => <CategoryTile key={c.who} cat={c} />)}
        </div>
        <MoreCategories count={rest.length}>
          {rest.map((c) => <CategoryTile key={c.who} cat={c} />)}
        </MoreCategories>
      </section>

      <AdSlot slot="home-mid" />

      <section className="wrap" aria-labelledby="mood">
        <h2 id="mood">Or start with a mood</h2>
        <div className="chips">
          {MOODS.map((m) => (
            <Link key={m.mood} href={`/search?q=${m.mood}`} className="chip">{m.label}</Link>
          ))}
        </div>
      </section>
    </>
  );
}
