/**
 * Framework-free figure geometry. Nothing in src/core imports React or the DOM,
 * so the same code can drive react-native-svg in a native app later.
 */
export type Limb = [upper: number, lower: number];

/** Angles are degrees: 0 points down, 90 screen-right, -90 screen-left, 180 up. */
export interface Stance {
  lean?: number;
  head?: number;
  aL: Limb;
  aR: Limb;
  lL: Limb;
  lR: Limb;
  /** foot direction per leg: -1 left, 1 right */
  feet?: [number, number];
  seat?: "chair" | "stool";
  /** shorten the thighs (0-1) when they point at the camera */
  thigh?: number;
  /** draw the arms behind the body */
  armsBehind?: boolean;
}

export type Hair = "none" | "bun" | "long" | "bob" | "cap";

export interface FigureSpec {
  stance: string;
  x: number;
  /** size relative to an adult (1). Children are about 0.6 */
  s?: number;
  flip?: boolean;
  /** raise the figure off the ground, in adult units */
  lift?: number;
  tone?: "a" | "b";
  hair?: Hair;
  dress?: boolean;
  kid?: boolean;
  cane?: boolean;
  phone?: boolean;
}

export type Shape =
  | { k: "line"; x1: number; y1: number; x2: number; y2: number; w: number; tone: string; outline?: boolean }
  | { k: "circle"; cx: number; cy: number; r: number; tone: string; outline?: boolean }
  | { k: "poly"; pts: [number, number][]; w: number; tone: string; outline?: boolean }
  | { k: "rect"; x: number; y: number; w: number; h: number; r: number; tone: string };

const D = Math.PI / 180;
const dir = (a: number): [number, number] => [Math.sin(a * D), Math.cos(a * D)];

const DIM = { torso: 60, neck: 5, head: 15, upperArm: 33, foreArm: 31, thigh: 44, shin: 44, sw: 17, hw: 9, foot: 11 };

export function buildFigure(spec: FigureSpec, stance: Stance): { shapes: Shape[]; props: Shape[] } {
  const s = spec.s ?? 1;
  const tone = spec.tone ?? "a";
  const m = spec.flip ? -1 : 1;
  const st = stance;
  const lean = st.lean ?? 0;
  const headR = DIM.head * (spec.kid ? 1.22 : 1);
  const limbW = spec.kid ? 13.5 : 12.5;
  const armW = spec.kid ? 12 : 10.5;

  // local coordinates, hip at origin
  const N: [number, number] = [Math.sin(lean * D) * DIM.torso, -Math.cos(lean * D) * DIM.torso];
  const px = Math.cos(lean * D), py = Math.sin(lean * D);
  const SL: [number, number] = [N[0] - DIM.sw * px, N[1] - DIM.sw * py + 4];
  const SR: [number, number] = [N[0] + DIM.sw * px, N[1] + DIM.sw * py + 4];
  const HL: [number, number] = [-DIM.hw, 0];
  const HR: [number, number] = [DIM.hw, 0];
  const ha = lean + (st.head ?? 0);
  const HC: [number, number] = [N[0] + Math.sin(ha * D) * (DIM.neck + headR), N[1] - Math.cos(ha * D) * (DIM.neck + headR)];

  const seg = (p: [number, number], a: number, len: number): [number, number] => {
    const [dx, dy] = dir(a);
    return [p[0] + dx * len, p[1] + dy * len];
  };
  const EL = seg(SL, st.aL[0], DIM.upperArm), WL = seg(EL, st.aL[1], DIM.foreArm);
  const ER = seg(SR, st.aR[0], DIM.upperArm), WR = seg(ER, st.aR[1], DIM.foreArm);
  const thigh = DIM.thigh * (st.thigh ?? 1);
  const KL = seg(HL, st.lL[0], thigh), AL = seg(KL, st.lL[1], DIM.shin);
  const KR = seg(HR, st.lR[0], thigh), AR = seg(KR, st.lR[1], DIM.shin);
  const feet = st.feet ?? [-1, 1];
  const FL: [number, number] = [AL[0] + feet[0] * DIM.foot, AL[1] + 1];
  const FR: [number, number] = [AR[0] + feet[1] * DIM.foot, AR[1] + 1];

  // lowest point decides where the ground is
  const half = limbW / 2;
  const low = Math.max(AL[1] + half, AR[1] + half, KL[1] + half, KR[1] + half, st.seat ? -999 : half + 3);
  const lift = spec.lift ?? 0;
  const T = (p: [number, number]): [number, number] => [spec.x + m * p[0] * s, (p[1] - low) * s - lift];

  const shapes: Shape[] = [];
  const line = (a: [number, number], b: [number, number], w: number, outline = false) => {
    const A = T(a), B = T(b);
    shapes.push({ k: "line", x1: A[0], y1: A[1], x2: B[0], y2: B[1], w: w * s, tone, outline });
  };

  // hair that sits behind the head
  const hc = T(HC);
  if (spec.hair === "long") {
    const a = T([HC[0] - headR - 1, HC[1] - 2]);
    shapes.push({ k: "rect", x: Math.min(a[0], a[0] + m * (headR * 2 + 2) * s), y: a[1], w: (headR * 2 + 2) * s, h: (headR + 20) * s, r: 9 * s, tone });
  }
  // legs
  line(HL, KL, limbW); line(KL, AL, limbW); line(AL, FL, limbW * 0.8);
  line(HR, KR, limbW); line(KR, AR, limbW); line(AR, FR, limbW * 0.8);
  if (st.armsBehind) {
    line(SL, EL, armW, true); line(EL, WL, armW, true);
  line(SR, ER, armW, true); line(ER, WR, armW, true);
  }
  // torso
  if (spec.dress) {
    const flare = 30;
    shapes.push({ k: "poly", pts: [T(SL), T(SR), T([flare, 38]), T([-flare, 38])], w: 11 * s, tone, outline: true });
  } else {
    shapes.push({ k: "poly", pts: [T(SL), T(SR), T(HR), T(HL)], w: 12 * s, tone, outline: true });
  }
  // head
  shapes.push({ k: "circle", cx: hc[0], cy: hc[1], r: headR * s, tone, outline: true });
  if (spec.hair === "bun") {
    const b = T([HC[0] + Math.sin(ha * D) * (headR + 4), HC[1] - Math.cos(ha * D) * (headR + 4)]);
    shapes.push({ k: "circle", cx: b[0], cy: b[1], r: 7.5 * s, tone });
  }
  if (spec.hair === "bob") {
    const a = T([HC[0] - headR - 3, HC[1] - 3]);
    shapes.push({ k: "rect", x: Math.min(a[0], a[0] + m * (headR * 2 + 6) * s), y: a[1], w: (headR * 2 + 6) * s, h: (headR + 6) * s, r: 7 * s, tone });
  }
  if (spec.hair === "cap") {
    const a = T([HC[0] - headR, HC[1] - headR * 0.45]);
    const b = T([HC[0] + headR + 11, HC[1] - headR * 0.45]);
    shapes.push({ k: "line", x1: a[0], y1: a[1], x2: b[0], y2: b[1], w: 6 * s, tone });
  }
  // arms go on top, outlined so they read against the body
  if (!st.armsBehind) {
    line(SL, EL, armW, true); line(EL, WL, armW, true);
  line(SR, ER, armW, true); line(ER, WR, armW, true);
  }

  const props: Shape[] = [];
  if (st.seat) {
    const seatY = half + 1;
    const a = T([-26, seatY + 4]);
    const w = 52 * s;
    props.push({ k: "rect", x: Math.min(a[0], a[0] + m * 52 * s), y: a[1], w, h: 9 * s, r: 3 * s, tone: "prop" });
    const legH = (low - seatY - 4) * s;
    for (const lx of [-22, 20]) {
      const p = T([lx, seatY + 8]);
      props.push({ k: "rect", x: p[0] - 3 * s, y: p[1], w: 6 * s, h: Math.max(legH - 4 * s, 4), r: 2 * s, tone: "prop" });
    }
    if (st.seat === "chair") {
      const p = T([-24, -48]);
      props.push({ k: "rect", x: p[0] - 3.5 * s, y: p[1], w: 7 * s, h: (48 + seatY + 6) * s, r: 3 * s, tone: "prop" });
    }
  }
  if (spec.cane) {
    const h = T(WR);
    props.push({ k: "line", x1: h[0], y1: h[1], x2: h[0] + m * 5 * s, y2: -lift, w: 5 * s, tone: "prop" });
    props.push({ k: "line", x1: h[0] - m * 9 * s, y1: h[1] - 2 * s, x2: h[0] + m * 3 * s, y2: h[1] - 2 * s, w: 5 * s, tone: "prop" });
  }
  if (spec.phone) {
    const h = T(WR);
    props.push({ k: "rect", x: h[0] - 7 * s, y: h[1] - 22 * s, w: 14 * s, h: 24 * s, r: 3 * s, tone: "prop" });
  }
  return { shapes, props };
}

export interface SceneProp { kind: "wall" | "bench" | "heart" | "sun"; x: number; y?: number }

export interface Scene { shapes: Shape[]; view: { w: number; h: number; ground: number } }

/** Lays figures out on a 320x400 card, scaled to fit with the feet on the floor line. */
export function buildScene(
  figures: FigureSpec[],
  stances: Record<string, Stance>,
  extras: SceneProp[] = [],
): Scene {
  const W = 320, H = 400, ground = 338, padX = 30, top = 44;
  const raw: Shape[] = [];
  const back: Shape[] = [];
  for (const e of extras) {
    if (e.kind === "wall") back.push({ k: "rect", x: e.x - 9, y: -235, w: 18, h: 235, r: 0, tone: "prop" });
    if (e.kind === "bench") {
      back.push({ k: "rect", x: e.x - 80, y: -62, w: 160, h: 10, r: 3, tone: "prop" });
      back.push({ k: "rect", x: e.x - 70, y: -54, w: 7, h: 54, r: 2, tone: "prop" });
      back.push({ k: "rect", x: e.x + 63, y: -54, w: 7, h: 54, r: 2, tone: "prop" });
    }
    if (e.kind === "heart") {
      const y = e.y ?? -230;
      back.push({ k: "circle", cx: e.x - 7, cy: y, r: 8.5, tone: "prop" });
      back.push({ k: "circle", cx: e.x + 7, cy: y, r: 8.5, tone: "prop" });
      back.push({ k: "poly", pts: [[e.x - 14, y + 4], [e.x + 14, y + 4], [e.x, y + 20]], w: 2, tone: "prop" });
    }
  }
  for (const f of figures) {
    const st = stances[f.stance];
    if (!st) throw new Error(`Unknown stance: ${f.stance}`);
    const { shapes, props } = buildFigure(f, st);
    raw.push(...props, ...shapes);
  }
  const all = [...back, ...raw];
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity;
  const grow = (x: number, y: number, pad: number) => {
    x0 = Math.min(x0, x - pad); x1 = Math.max(x1, x + pad); y0 = Math.min(y0, y - pad);
  };
  for (const sh of all) {
    if (sh.k === "line") { grow(sh.x1, sh.y1, sh.w / 2); grow(sh.x2, sh.y2, sh.w / 2); }
    else if (sh.k === "circle") grow(sh.cx, sh.cy, sh.r);
    else if (sh.k === "poly") sh.pts.forEach(([x, y]) => grow(x, y, sh.w / 2));
    else { grow(sh.x, sh.y, 0); grow(sh.x + sh.w, sh.y + sh.h, 0); }
  }
  const tallest = Math.max(...figures.map((f) => f.s ?? 1));
  const k = Math.min(Math.min(1.8, 1.3 / tallest), (W - padX * 2) / (x1 - x0), (ground - top) / -y0);
  const cx = (x0 + x1) / 2;
  const mx = (x: number) => W / 2 + (x - cx) * k;
  const my = (y: number) => ground + y * k;
  const shapes = all.map((sh): Shape => {
    if (sh.k === "line") return { ...sh, x1: mx(sh.x1), y1: my(sh.y1), x2: mx(sh.x2), y2: my(sh.y2), w: sh.w * k };
    if (sh.k === "circle") return { ...sh, cx: mx(sh.cx), cy: my(sh.cy), r: sh.r * k };
    if (sh.k === "poly") return { ...sh, pts: sh.pts.map(([x, y]) => [mx(x), my(y)] as [number, number]), w: sh.w * k };
    return { ...sh, x: mx(sh.x), y: my(sh.y), w: sh.w * k, h: sh.h * k, r: sh.r * k };
  });
  return { shapes, view: { w: W, h: H, ground } };
}

/** Plain SVG markup for a scene. Used by the icon/OG generators and handy for native. */
export function sceneToSvg(scene: Scene, c: { bg: string; floor: string; a: string; b: string; prop: string }, size = 320): string {
  const { w, h, ground } = scene.view;
  const col = (t: string) => (t === "a" ? c.a : t === "b" ? c.b : c.prop);
  const out: string[] = [];
  const o = 3.2;
  for (const sh of scene.shapes) {
    if (sh.k === "line") {
      if (sh.outline) out.push(`<line x1="${sh.x1.toFixed(1)}" y1="${sh.y1.toFixed(1)}" x2="${sh.x2.toFixed(1)}" y2="${sh.y2.toFixed(1)}" stroke="${c.bg}" stroke-width="${(sh.w + o * 2).toFixed(1)}" stroke-linecap="round"/>`);
      out.push(`<line x1="${sh.x1.toFixed(1)}" y1="${sh.y1.toFixed(1)}" x2="${sh.x2.toFixed(1)}" y2="${sh.y2.toFixed(1)}" stroke="${col(sh.tone)}" stroke-width="${sh.w.toFixed(1)}" stroke-linecap="round"/>`);
    } else if (sh.k === "circle") {
      if (sh.outline) out.push(`<circle cx="${sh.cx.toFixed(1)}" cy="${sh.cy.toFixed(1)}" r="${(sh.r + o).toFixed(1)}" fill="${c.bg}"/>`);
      out.push(`<circle cx="${sh.cx.toFixed(1)}" cy="${sh.cy.toFixed(1)}" r="${sh.r.toFixed(1)}" fill="${col(sh.tone)}"/>`);
    } else if (sh.k === "poly") {
      const pts = sh.pts.map((p) => p.map((n) => n.toFixed(1)).join(",")).join(" ");
      if (sh.outline) out.push(`<polygon points="${pts}" fill="${c.bg}" stroke="${c.bg}" stroke-width="${(sh.w + o * 2).toFixed(1)}" stroke-linejoin="round"/>`);
      out.push(`<polygon points="${pts}" fill="${col(sh.tone)}" stroke="${col(sh.tone)}" stroke-width="${sh.w.toFixed(1)}" stroke-linejoin="round"/>`);
    } else {
      out.push(`<rect x="${sh.x.toFixed(1)}" y="${sh.y.toFixed(1)}" width="${sh.w.toFixed(1)}" height="${sh.h.toFixed(1)}" rx="${sh.r.toFixed(1)}" fill="${col(sh.tone)}"/>`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${size}" height="${(size * h) / w}"><rect width="${w}" height="${h}" fill="${c.bg}"/><rect y="${ground}" width="${w}" height="${h - ground}" fill="${c.floor}"/>${out.join("")}</svg>`;
}
