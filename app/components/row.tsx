'use client';

import type { RankColors, RowProps } from '../models/model';

const TOP_RANK_COLORS: Record<number, RankColors> = {
  1: { bg: 'var(--gold-dim)', hoverBg: 'oklch(78% 0.16 85 / 0.17)', rankBg: 'var(--gold)', rankColor: 'oklch(20% 0.08 80)', nameColor: 'var(--gold)' },
  2: { bg: 'var(--silver-dim)', hoverBg: 'oklch(75% 0.01 240 / 0.15)', rankBg: 'var(--silver)', rankColor: 'oklch(20% 0.005 240)', nameColor: 'var(--silver)' },
  3: { bg: 'var(--bronze-dim)', hoverBg: 'oklch(66% 0.12 55 / 0.15)', rankBg: 'var(--bronze)', rankColor: 'oklch(20% 0.06 55)', nameColor: 'var(--bronze)' },
};

export default function Row({ team, rank, index, realm, isLast, onRowClick }: RowProps) {
  const isTop = rank <= 3;
  const topColors = isTop ? TOP_RANK_COLORS[rank] : null;

  return (
    <tr
      onClick={() => onRowClick(team.realm)}
      style={{
        background: topColors?.bg,
        borderBottom: isLast ? 'none' : '1px solid oklch(20% 0.008 60)',
        cursor: 'pointer',
        animationName: 'fadeRow',
        animationDuration: '0.3s',
        animationTimingFunction: 'ease',
        animationFillMode: 'both',
        animationDelay: `${index * 16}ms`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLTableRowElement).style.background =
          topColors?.hoverBg ?? 'var(--row-hover)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLTableRowElement).style.background = topColors?.bg ?? '';
      }}
    >
      <td style={{ padding: '8px 10px', paddingLeft: 14, fontSize: 16, color: 'var(--text)' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isTop ? (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 18,
              height: 18,
              borderRadius: '50%',
              fontSize: 11,
              fontWeight: 700,
              marginRight: 7,
              flexShrink: 0,
              background: topColors?.rankBg,
              color: topColors?.rankColor,
            }}>
              {rank}
            </span>
          ) : (
            <span style={{
              display: 'inline-block',
              width: 18,
              marginRight: 7,
              textAlign: 'center',
              fontSize: 11,
              color: 'var(--muted)',
              fontWeight: 500,
            }}>
              {rank}
            </span>
          )}
          <span style={{ fontWeight: 500, color: topColors?.nameColor ?? 'var(--text)' }}>
            {team.name}
          </span>
        </div>
      </td>

      <td style={{ padding: '8px 10px', fontSize: 14 }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 13,
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

      <td style={{ padding: '8px 10px', fontSize: 16, textAlign: 'right' }}>
        <span style={{
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.02em',
          color: 'oklch(78% 0.1 140)',
        }}>
          {team.merit}
        </span>
      </td>

      <td style={{ padding: '8px 10px', paddingRight: 14, fontSize: 16, textAlign: 'right' }}>
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
}
