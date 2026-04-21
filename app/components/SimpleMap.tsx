'use client';

import type { MapRealm } from '../models/model';

type SimpleMapProps = {
  realms: readonly MapRealm[];
  activeGlowIdx: number | null;
};

const CX = 300;
const CY = 300;
const R = 240;

const verts = Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI / 180) * (60 * i - 90);
  return [CX + R * Math.cos(a), CY + R * Math.sin(a)] as [number, number];
});

function HexSVG({ realms, activeGlowIdx }: SimpleMapProps) {
  return (
    <svg
      id="hex-svg"
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: 'min(54vw, 70vh)',
        height: 'min(54vw, 70vh)',
        overflow: 'visible',
        pointerEvents: 'none',
        animation: 'hexIn 0.9s cubic-bezier(0.16,1,0.3,1) both',
      }}
    >
      {realms.map((realm, i) => {
        const [x1, y1] = verts[i];
        const [x2, y2] = verts[(i + 1) % 6];
        const lx = (CX + x1 + x2) / 3;
        const ly = (CY + y1 + y2) / 3;
        const isGlowing = activeGlowIdx === i;

        return (
          <g
            key={realm.name}
            className="hex-slice"
            style={{
              animation: `hexSliceIn 0.5s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.07}s both`,
            }}
          >
            <path
              d={`M${CX},${CY} L${x1},${y1} L${x2},${y2} Z`}
              fill={realm.color}
              style={{
                opacity: isGlowing ? undefined : 0.55,
                animation: isGlowing ? 'sliceGlow 2.4s ease-in-out infinite' : undefined,
                ['--glow-filter' as string]: `drop-shadow(0 0 14px ${realm.color}) brightness(1.28)`,
                transition: isGlowing ? undefined : 'opacity 0.4s, filter 0.4s',
                filter: isGlowing ? undefined : 'none',
              }}
            />
            <line
              x1={CX}
              y1={CY}
              x2={x1}
              y2={y1}
              stroke="oklch(30% 0.01 260)"
              strokeWidth={1}
            />
            <text
              x={lx}
              y={ly}
              style={{
                fontFamily: 'var(--font-space-grotesk), Space Grotesk, sans-serif',
                fontSize: 18,
                fontWeight: 600,
                fill: 'oklch(85% 0.005 60)',
                letterSpacing: '0.04em',
                textAnchor: 'middle',
                dominantBaseline: 'middle',
                opacity: 0.7,
              }}
            >
              {realm.name}
            </text>
          </g>
        );
      })}

      <polygon
        points={verts.map(v => v.join(',')).join(' ')}
        fill="none"
        stroke="oklch(38% 0.04 260)"
        strokeWidth={1.5}
      />
      <circle cx={CX} cy={CY} r={5} fill="oklch(55% 0.06 260)" />
    </svg>
  );
}

export default function SimpleMap({ realms, activeGlowIdx }: SimpleMapProps) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, oklch(30% 0.05 260 / 0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <HexSVG realms={realms} activeGlowIdx={activeGlowIdx} />
    </div>
  );
}
