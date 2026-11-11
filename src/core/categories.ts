import type { Who, Mood } from "./poses";

export interface Theme { bg: string; floor: string; a: string; b: string; prop: string; ink: string }

export interface Category {
  who: Who;
  label: string;
  line: string;
  cover: string;
  featured: boolean;
  theme: Theme;
}

const CREAM = "#FFF6E9";
const INK = "#17122B";

export const CATEGORIES: Category[] = [
  { who: "solo", label: "Solo", line: "Just you, from camera-shy to full confidence", cover: "hand-on-hip", featured: true,
    theme: { bg: "#3D5AFE", floor: "#2E48DC", a: CREAM, b: INK, prop: "#1C2B9C", ink: CREAM } },
  { who: "couples", label: "Couples", line: "New love, long love and everything between", cover: "the-twirl", featured: true,
    theme: { bg: "#FF4F9A", floor: "#E63A84", a: CREAM, b: INK, prop: "#8C1D50", ink: INK } },
  { who: "family", label: "Family", line: "Everyone in one frame, nobody looking bored", cover: "one-two-three-swing", featured: true,
    theme: { bg: "#FF7A1A", floor: "#E8650A", a: CREAM, b: INK, prop: "#8A3A00", ink: INK } },
  { who: "siblings", label: "Siblings", line: "Brothers and sisters, rivalry included", cover: "sibling-back-to-back", featured: true,
    theme: { bg: "#8E5BFF", floor: "#7743EE", a: CREAM, b: INK, prop: "#40219A", ink: CREAM } },
  { who: "friends", label: "Friends", line: "Group shots that are not just a line of people", cover: "friends-jump-shot", featured: false,
    theme: { bg: "#C8F031", floor: "#B0D71F", a: INK, b: "#5B2BE0", prop: "#6E8A00", ink: INK } },
  { who: "seniors", label: "Older couples", line: "Gentle poses for grandparents and anniversaries", cover: "seated-and-standing", featured: false,
    theme: { bg: "#12B5A0", floor: "#0E9F8C", a: CREAM, b: INK, prop: "#075E53", ink: INK } },
  { who: "kids", label: "Kids", line: "Poses that work with children who will not stand still", cover: "kid-star-jump", featured: false,
    theme: { bg: "#FFD23F", floor: "#F2BF1F", a: INK, b: "#E8346F", prop: "#9A7400", ink: INK } },
  { who: "parent-child", label: "Parent and child", line: "One grown-up, one little one", cover: "shoulder-ride", featured: false,
    theme: { bg: "#F2413A", floor: "#D9322C", a: CREAM, b: INK, prop: "#7E1512", ink: CREAM } },
];

export const categoryOf = (who: Who): Category => CATEGORIES.find((c) => c.who === who)!;

export const MOODS: { mood: Mood; label: string }[] = [
  { mood: "shy", label: "Shy" },
  { mood: "confident", label: "Confident" },
  { mood: "playful", label: "Playful" },
  { mood: "romantic", label: "Romantic" },
  { mood: "candid", label: "Candid" },
  { mood: "classic", label: "Classic" },
];

export const LEVELS = { 1: "Easy", 2: "Takes a try or two", 3: "Needs good timing" } as const;
