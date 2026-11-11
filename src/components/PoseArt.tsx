import { buildScene, STANCES, categoryOf, type Pose } from "@/core";

/** Draws a pose as an SVG illustration on its category backdrop. */
export function PoseArt({ pose, className }: { pose: Pose; className?: string }) {
  const c = categoryOf(pose.who).theme;
  const { shapes, view } = buildScene(pose.figures, STANCES, pose.extras);
  const col = (t: string) => (t === "a" ? c.a : t === "b" ? c.b : c.prop);
  const o = 3.2;
  const n = (v: number) => Math.round(v * 10) / 10;
  return (
    <svg className={className} viewBox={`0 0 ${view.w} ${view.h}`} role="img" aria-label={`Illustration of the pose: ${pose.title}`} preserveAspectRatio="xMidYMax slice">
      <rect width={view.w} height={view.h} fill={c.bg} />
      <rect y={view.ground} width={view.w} height={view.h - view.ground} fill={c.floor} />
      {shapes.map((sh, i) => {
        if (sh.k === "line")
          return (
            <g key={i} strokeLinecap="round">
              {sh.outline && <line x1={n(sh.x1)} y1={n(sh.y1)} x2={n(sh.x2)} y2={n(sh.y2)} stroke={c.bg} strokeWidth={n(sh.w + o * 2)} />}
              <line x1={n(sh.x1)} y1={n(sh.y1)} x2={n(sh.x2)} y2={n(sh.y2)} stroke={col(sh.tone)} strokeWidth={n(sh.w)} />
            </g>
          );
        if (sh.k === "circle")
          return (
            <g key={i}>
              {sh.outline && <circle cx={n(sh.cx)} cy={n(sh.cy)} r={n(sh.r + o)} fill={c.bg} />}
              <circle cx={n(sh.cx)} cy={n(sh.cy)} r={n(sh.r)} fill={col(sh.tone)} />
            </g>
          );
        if (sh.k === "poly") {
          const pts = sh.pts.map((p) => `${n(p[0])},${n(p[1])}`).join(" ");
          return (
            <g key={i} strokeLinejoin="round">
              {sh.outline && <polygon points={pts} fill={c.bg} stroke={c.bg} strokeWidth={n(sh.w + o * 2)} />}
              <polygon points={pts} fill={col(sh.tone)} stroke={col(sh.tone)} strokeWidth={n(sh.w)} />
            </g>
          );
        }
        return <rect key={i} x={n(sh.x)} y={n(sh.y)} width={n(sh.w)} height={n(sh.h)} rx={n(sh.r)} fill={col(sh.tone)} />;
      })}
    </svg>
  );
}
