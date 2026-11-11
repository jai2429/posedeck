import sharp from "sharp";
import { buildScene, sceneToSvg } from "../src/core/figure";
import { STANCES } from "../src/core/stances";
import { POSES } from "../src/core/poses";
const who = process.argv[3];
const list = POSES.filter((p) => !who || who.split(",").includes(p.who) || who.split(",").includes(p.slug));
const cols = 6, cw = 200, ch = 250;
const rows = Math.ceil(list.length / cols);
let body = "";
list.forEach((p, i) => {
  const svg = sceneToSvg(buildScene(p.figures, STANCES, p.extras), { bg: "#FF4F9A", floor: "#E23A82", a: "#FFF6E9", b: "#17122B", prop: "#7A1F4B" }, cw);
  const inner = svg.replace(/^<svg[^>]*>/, "").replace("</svg>", "");
  body += `<g transform="translate(${(i % cols) * cw},${Math.floor(i / cols) * ch}) scale(0.625)">${inner}<text x="8" y="22" font-size="19" fill="#fff" font-family="sans-serif">${p.slug}</text></g>`;
});
const out = `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * cw}" height="${rows * ch}">${body}</svg>`;
sharp(Buffer.from(out)).png().toFile(process.argv[2] ?? "/tmp/sheet.png").then(() => console.log("ok", list.length));
