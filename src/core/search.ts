import { POSES, type Pose, type Who } from "./poses";
import { CATEGORIES } from "./categories";

/** Words people type that should lead to a category. */
const ALIASES: Record<string, Who> = {
  single: "solo", alone: "solo", myself: "solo", me: "solo", selfie: "solo", individual: "solo", one: "solo",
  couple: "couples", husband: "couples", wife: "couples", girlfriend: "couples", boyfriend: "couples", partner: "couples", love: "couples", wedding: "couples",
  families: "family", parents: "family", mom: "family", dad: "family", mum: "family",
  sibling: "siblings", brother: "siblings", sister: "siblings", brothers: "siblings", sisters: "siblings", cousin: "siblings", cousins: "siblings",
  friend: "friends", group: "friends", gang: "friends", squad: "friends", bestie: "friends", besties: "friends",
  old: "seniors", elderly: "seniors", senior: "seniors", aged: "seniors", grandparents: "seniors", grandma: "seniors", grandpa: "seniors", grandmother: "seniors", grandfather: "seniors",
  kid: "kids", child: "kids", children: "kids", toddler: "kids", baby: "parent-child", mother: "parent-child", father: "parent-child", son: "parent-child", daughter: "parent-child",
};
const STOP = new Set(["pose", "poses", "photo", "photos", "for", "with", "a", "an", "the", "and", "of", "in", "to", "my", "age", "ideas", "idea", "picture", "pictures", "pic", "pics"]);

function scoreToken(p: Pose, t: string): number {
  let s = 0;
  const cat = CATEGORIES.find((c) => c.who === p.who)!;
  if (ALIASES[t] === p.who) s += 5;
  if (cat.label.toLowerCase().includes(t) || p.who.includes(t)) s += 5;
  if (p.title.toLowerCase().includes(t)) s += 5;
  if (p.moods.some((m) => m.startsWith(t))) s += 4;
  if (p.keywords?.some((k) => k.includes(t))) s += 3;
  if (p.needs?.toLowerCase().includes(t)) s += 2;
  if (p.blurb.toLowerCase().includes(t)) s += 1;
  return s;
}

export function searchPoses(query: string): Pose[] {
  const tokens = query.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((t) => t.length > 1 && !STOP.has(t));
  if (!tokens.length) return [];
  const scored = POSES.map((p) => {
    const per = tokens.map((t) => scoreToken(p, t));
    return { p, total: per.reduce((a, b) => a + b, 0), all: per.every((n) => n > 0) };
  }).filter((r) => r.total > 0);
  const strict = scored.filter((r) => r.all);
  return (strict.length ? strict : scored).sort((a, b) => b.total - a.total).map((r) => r.p);
}

export const poseBySlug = (slug: string) => POSES.find((p) => p.slug === slug);
export const posesFor = (who: Who) => POSES.filter((p) => p.who === who);
