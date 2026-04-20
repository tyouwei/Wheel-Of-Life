'use client';

import { useState, useRef, useEffect } from 'react';

const REALMS = [
  { name: 'Devas',   color: 'oklch(62% 0.18 280)', bg: 'oklch(62% 0.18 280 / 0.15)' },
  { name: 'Asuras',  color: 'oklch(62% 0.18 200)', bg: 'oklch(62% 0.18 200 / 0.15)' },
  { name: 'Humans',  color: 'oklch(62% 0.18 140)', bg: 'oklch(62% 0.18 140 / 0.15)' },
  { name: 'Animals', color: 'oklch(62% 0.18 85)',  bg: 'oklch(62% 0.18 85  / 0.15)' },
  { name: 'Pretas',  color: 'oklch(62% 0.18 35)',  bg: 'oklch(62% 0.18 35  / 0.15)' },
  { name: 'Narakas', color: 'oklch(62% 0.18 320)', bg: 'oklch(62% 0.18 320 / 0.15)' },
] as const;

const realmMap = Object.fromEntries(REALMS.map((r, i) => [r.name, i]));

const TEAMS = [
  { name: 'Bodhisattvas', merit: 99, wisdom: 100, realm: 'Devas'   },
  { name: 'Siddhas',      merit: 95, wisdom: 97,  realm: 'Devas'   },
  { name: 'Devas',        merit: 92, wisdom: 88,  realm: 'Devas'   },
  { name: 'Vidyadharas',  merit: 88, wisdom: 79,  realm: 'Humans'  },
  { name: 'Ashura',       merit: 84, wisdom: 71,  realm: 'Asuras'  },
  { name: 'Gandharvas',   merit: 80, wisdom: 82,  realm: 'Asuras'  },
  { name: 'Narakas',      merit: 77, wisdom: 90,  realm: 'Narakas' },
  { name: 'Apsaras',      merit: 76, wisdom: 85,  realm: 'Humans'  },
  { name: 'Manavas',      merit: 70, wisdom: 76,  realm: 'Humans'  },
  { name: 'Nagas',        merit: 73, wisdom: 69,  realm: 'Animals' },
  { name: 'Sravakas',     merit: 67, wisdom: 72,  realm: 'Pretas'  },
  { name: 'Pretas',       merit: 65, wisdom: 58,  realm: 'Pretas'  },
  { name: 'Kinnaras',     merit: 61, wisdom: 74,  realm: 'Animals' },
  { name: 'Tiryaks',      merit: 55, wisdom: 63,  realm: 'Animals' },
  { name: 'Yakshas',      merit: 48, wisdom: 51,  realm: 'Pretas'  },
  { name: 'Rakshasas',    merit: 42, wisdom: 37,  realm: 'Narakas' },
] as const;

type SortCol = 'name' | 'realm' | 'merit' | 'wisdom';
type SortDir = 'asc' | 'desc';

// Hexagon geometry
const CX = 300, CY = 300, R = 240;
const verts = Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI / 180) * (60 * i - 90);
  return [CX + R * Math.cos(a), CY + R * Math.sin(a)] as [number, number];
});

function HexSVG({ activeGlowIdx }: { activeGlowIdx: number | null }) {
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
      {REALMS.map((realm, i) => {
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
                animation: isGlowing
                  ? `sliceGlow 2.4s ease-in-out infinite`
                  : undefined,
                ['--glow-filter' as string]: `drop-shadow(0 0 14px ${realm.color}) brightness(1.28)`,
                transition: isGlowing ? undefined : 'opacity 0.4s, filter 0.4s',
                filter: isGlowing ? undefined : 'none',
              }}
            />
            <line
              x1={CX} y1={CY} x2={x1} y2={y1}
              stroke="oklch(30% 0.01 260)"
              strokeWidth={1}
            />
            <text
              x={lx} y={ly}
              style={{
                fontFamily: 'var(--font-space-grotesk), Space Grotesk, sans-serif',
                fontSize: 13,
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

      {/* Outer border */}
      <polygon
        points={verts.map(v => v.join(',')).join(' ')}
        fill="none"
        stroke="oklch(38% 0.04 260)"
        strokeWidth={1.5}
      />

      {/* Center dot */}
      <circle cx={CX} cy={CY} r={5} fill="oklch(55% 0.06 260)" />
    </svg>
  );
}

export default function BhavacakraLeaderboard() {
  const [sortCol, setSortCol] = useState<SortCol>('merit');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [activeGlowIdx, setActiveGlowIdx] = useState<number | null>(null);
  const [renderKey, setRenderKey] = useState(0);
  const prevSortRef = useRef({ col: sortCol, dir: sortDir });

  // Bump renderKey on sort change to re-trigger row animations
  useEffect(() => {
    if (
      prevSortRef.current.col !== sortCol ||
      prevSortRef.current.dir !== sortDir
    ) {
      setRenderKey(k => k + 1);
      prevSortRef.current = { col: sortCol, dir: sortDir };
    }
  }, [sortCol, sortDir]);

  const sorted = [...TEAMS].sort((a, b) => {
    if (sortCol === 'realm') {
      const ai = realmMap[a.realm] ?? 99;
      const bi = realmMap[b.realm] ?? 99;
      return sortDir === 'asc' ? ai - bi : bi - ai;
    }
    const av = a[sortCol];
    const bv = b[sortCol];
    if (typeof av === 'string' && typeof bv === 'string') {
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });

  function handleHeaderClick(col: SortCol) {
    if (sortCol === col) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortCol(col);
      setSortDir(col === 'name' || col === 'realm' ? 'asc' : 'desc');
    }
  }

  function handleRowClick(realmName: string) {
    const idx = realmMap[realmName];
    if (idx === undefined) return;
    setActiveGlowIdx(prev => prev === idx ? null : idx);
  }

  const sortLabels: Record<SortCol, string> = {
    merit: 'merit', wisdom: 'wisdom', name: 'team name', realm: 'realm',
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'stretch',
      minHeight: '100vh',
      overflow: 'hidden',
      fontFamily: 'var(--font-space-grotesk), Space Grotesk, sans-serif',
    }}>
      {/* Left panel */}
      <div style={{
        width: '33%',
        minWidth: 300,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        padding: '40px 22px',
        borderRight: '1px solid var(--border)',
        overflowY: 'auto',
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Table header */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 10,
            marginBottom: 20,
          }}>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}>
              Leaderboard
            </span>
            <span style={{
              fontSize: 10,
              color: 'oklch(35% 0.008 60)',
              letterSpacing: '0.08em',
            }}>
              sorted by {sortLabels[sortCol]}
            </span>
          </div>

          {/* Table */}
          <table style={{
            width: '100%',
            height: '100%',
            flex: 1,
            borderCollapse: 'collapse',
            background: 'var(--surface)',
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {(['name', 'realm', 'merit', 'wisdom'] as SortCol[]).map((col, ci) => {
                  const isActive = sortCol === col;
                  const isRight = ci === 2 || ci === 3;
                  const isLast = ci === 3;
                  return (
                    <th
                      key={col}
                      onClick={() => handleHeaderClick(col)}
                      style={{
                        padding: '11px 10px',
                        paddingLeft: ci === 0 ? 14 : 10,
                        paddingRight: isLast ? 14 : 10,
                        textAlign: isRight || isLast ? 'right' : 'left',
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: isActive ? 'var(--accent)' : 'var(--muted)',
                        cursor: 'pointer',
                        userSelect: 'none',
                        whiteSpace: 'nowrap',
                        background: 'oklch(15.5% 0.01 60)',
                        transition: 'color 0.15s',
                      }}
                    >
                      {col === 'name' ? 'Team' : col.charAt(0).toUpperCase() + col.slice(1)}
                      <span style={{
                        display: 'inline-block',
                        marginLeft: 4,
                        opacity: isActive ? 1 : 0,
                        fontSize: 9,
                        transition: 'opacity 0.15s, transform 0.2s',
                        transform: isActive && sortDir === 'desc' ? 'rotate(180deg)' : 'none',
                      }}>
                        ↑
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody key={renderKey}>
              {sorted.map((team, i) => {
                const rank = i + 1;
                const TOP = 3;
                const isTop = rank <= TOP;
                const rankColors = {
                  1: { bg: 'var(--gold-dim)', hoverBg: 'oklch(78% 0.16 85 / 0.17)', rankBg: 'var(--gold)', rankColor: 'oklch(20% 0.08 80)', nameColor: 'var(--gold)' },
                  2: { bg: 'var(--silver-dim)', hoverBg: 'oklch(75% 0.01 240 / 0.15)', rankBg: 'var(--silver)', rankColor: 'oklch(20% 0.005 240)', nameColor: 'var(--silver)' },
                  3: { bg: 'var(--bronze-dim)', hoverBg: 'oklch(66% 0.12 55 / 0.15)', rankBg: 'var(--bronze)', rankColor: 'oklch(20% 0.06 55)', nameColor: 'var(--bronze)' },
                } as Record<number, { bg: string; hoverBg: string; rankBg: string; rankColor: string; nameColor: string }>;

                const realm = REALMS[realmMap[team.realm]];

                return (
                  <tr
                    key={team.name}
                    onClick={() => handleRowClick(team.realm)}
                    style={{
                      background: isTop ? rankColors[rank].bg : undefined,
                      borderBottom: i < sorted.length - 1 ? '1px solid oklch(20% 0.008 60)' : 'none',
                      cursor: 'pointer',
                      animationDelay: `${i * 16}ms`,
                      animation: 'fadeRow 0.3s ease both',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLTableRowElement).style.background =
                        isTop ? rankColors[rank].hoverBg : 'var(--row-hover)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLTableRowElement).style.background =
                        isTop ? rankColors[rank].bg : '';
                    }}
                  >
                    {/* Team name */}
                    <td style={{ padding: '8px 10px', paddingLeft: 14, fontSize: 12, color: 'var(--text)' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {isTop ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            fontSize: 9,
                            fontWeight: 700,
                            marginRight: 7,
                            flexShrink: 0,
                            background: rankColors[rank].rankBg,
                            color: rankColors[rank].rankColor,
                          }}>
                            {rank}
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-block',
                            width: 18,
                            marginRight: 7,
                            textAlign: 'center',
                            fontSize: 9,
                            color: 'var(--muted)',
                            fontWeight: 500,
                          }}>
                            {rank}
                          </span>
                        )}
                        <span style={{
                          fontWeight: 500,
                          color: isTop ? rankColors[rank].nameColor : 'var(--text)',
                        }}>
                          {team.name}
                        </span>
                      </div>
                    </td>

                    {/* Realm badge */}
                    <td style={{ padding: '8px 10px', fontSize: 12 }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        padding: '3px 7px',
                        borderRadius: 20,
                        cursor: 'pointer',
                        border: `1px solid ${realm.color}33`,
                        color: realm.color,
                        background: realm.bg,
                      }}>
                        <span style={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          flexShrink: 0,
                          background: realm.color,
                        }} />
                        {team.realm}
                      </span>
                    </td>

                    {/* Merit */}
                    <td style={{ padding: '8px 10px', fontSize: 12, textAlign: 'right' }}>
                      <span style={{
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: '0.02em',
                        color: 'oklch(78% 0.1 140)',
                      }}>
                        {team.merit}
                      </span>
                    </td>

                    {/* Wisdom */}
                    <td style={{ padding: '8px 10px', paddingRight: 14, fontSize: 12, textAlign: 'right' }}>
                      <span style={{
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: '0.02em',
                        color: 'oklch(72% 0.12 280)',
                      }}>
                        {team.wisdom}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Radial background glow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, oklch(30% 0.05 260 / 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <HexSVG activeGlowIdx={activeGlowIdx} />
      </div>
    </div>
  );
}
