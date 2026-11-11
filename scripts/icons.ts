/** Regenerates the app icons and social image in /public. Run: npm run icons */
import sharp from "sharp";
import { buildScene, sceneToSvg, STANCES, categoryOf, poseBySlug } from "../src/core";

const art = (slug: string, size: number) => {
  const p = poseBySlug(slug)!;
  return sceneToSvg(buildScene(p.figures, STANCES, p.extras), categoryOf(p.who).theme, size);
};
const inner = (svg: string) => svg.replace(/^<svg[^>]*>/, "").replace("</svg>", "");

async function main() {
  // square icon: crop the 320x400 card to its lower 320x320
  const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 60 320 320" width="512" height="512">${inner(art("the-jump", 320))}</svg>`;
  await sharp(Buffer.from(icon)).resize(512, 512).png().toFile("public/icon-512.png");
  await sharp(Buffer.from(icon)).resize(192, 192).png().toFile("public/icon-192.png");
  await sharp(Buffer.from(icon)).resize(180, 180).png().toFile("src/app/apple-icon.png");
  await sharp(Buffer.from(icon)).resize(64, 64).png().toFile("src/app/icon.png");
  const cards = ["hand-on-hip", "the-twirl", "one-two-three-swing", "sibling-back-to-back"]
    .map((s, i) => `<g transform="translate(${40 + i * 285},65)"><svg width="265" height="331" viewBox="0 0 320 400"><clipPath id="c${i}"><rect width="320" height="400" rx="28"/></clipPath><g clip-path="url(#c${i})">${inner(art(s, 320))}</g></svg></g>`)
    .join("");
  const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#17122B"/>${cards}<rect x="40" y="440" width="150" height="14" rx="7" fill="#C8F031"/><rect x="40" y="470" width="420" height="14" rx="7" fill="#FFF6E9"/></svg>`;
  await sharp(Buffer.from(og)).png().toFile("public/og.png");
  console.log("icons written");
}
main();
