'use client';

import Row from './row';
import type { Realm, Team } from '../models/model';

type ScoreboardProps = {
  realms: readonly Realm[];
  realmMap: Record<string, number>;
  sortedTeams: readonly Team[];
  onRowClick: (realmName: string) => void;
};

const COLUMNS: ReadonlyArray<{
  key: 'name' | 'realm' | 'merit' | 'wisdom';
  label: string;
  align: 'left' | 'right';
  isLast?: boolean;
}> = [
  { key: 'name', label: 'Team', align: 'left' },
  { key: 'realm', label: 'Realm', align: 'left' },
  { key: 'merit', label: 'Merit', align: 'right' },
  { key: 'wisdom', label: 'Wisdom', align: 'right', isLast: true },
];

export default function Scoreboard({
  realms,
  realmMap,
  sortedTeams,
  onRowClick,
}: ScoreboardProps) {
  return (
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
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 10,
          marginBottom: 20,
        }}>
          <span style={{
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
          }}>
            Leaderboard
          </span>
        </div>

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
              {COLUMNS.map((col, ci) => {
                return (
                  <th
                    key={col.key}
                    style={{
                      padding: '11px 10px',
                      paddingLeft: ci === 0 ? 14 : 10,
                      paddingRight: col.isLast ? 14 : 10,
                      textAlign: col.align,
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      whiteSpace: 'nowrap',
                      background: 'oklch(15.5% 0.01 60)',
                    }}
                  >
                    {col.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, i) => {
              const realm = realms[realmMap[team.realm]];
              return (
                <Row
                  key={team.name}
                  team={team}
                  rank={i + 1}
                  index={i}
                  realm={realm}
                  isLast={i === sortedTeams.length - 1}
                  onRowClick={onRowClick}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
