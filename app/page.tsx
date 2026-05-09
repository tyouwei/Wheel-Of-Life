'use client';

import { useEffect, useState } from 'react';
import Scoreboard from './components/Scoreboard';
import SimpleMap from './components/SimpleMap';
import type { Team } from './models/model';

const REALMS = [
  // Hex index order maps to positions: top-right, bottom-right, bottom, bottom-left, top-left, top.
  { name: 'Asuras', color: 'oklch(62% 0.18 200)', bg: 'oklch(62% 0.18 200 / 0.15)' },
  { name: 'Pretas', color: 'oklch(62% 0.18 35)', bg: 'oklch(62% 0.18 35  / 0.15)' },
  { name: 'Narakas', color: 'oklch(62% 0.18 320)', bg: 'oklch(62% 0.18 320 / 0.15)' },
  { name: 'Animals', color: 'oklch(62% 0.18 85)', bg: 'oklch(62% 0.18 85  / 0.15)' },
  { name: 'Humans', color: 'oklch(62% 0.18 140)', bg: 'oklch(62% 0.18 140 / 0.15)' },
  { name: 'Devas', color: 'oklch(62% 0.18 280)', bg: 'oklch(62% 0.18 280 / 0.15)' },
] as const;

const realmMap = Object.fromEntries(REALMS.map((r, i) => [r.name, i]));

export default function Home() {
  const [activeGlowIdx, setActiveGlowIdx] = useState<number | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    //Get Teams
    const fetchTeams = () =>
      fetch('http://localhost:8000/team')
        .then((res) => res.json())
        .then((data: Team[]) => setTeams(data))
        .catch(console.error);

    fetchTeams();
    const interval = setInterval(fetchTeams, 1000);

    const fetchActiveTeam = () =>
      fetch('http://localhost:8000/team/active')
        .then((res) => res.json())
        .then((data: Team) => setActiveGlowIdx(realmMap[data.realm] ?? null))
        .catch(console.error);

    fetchActiveTeam();
    const activeInterval = setInterval(fetchActiveTeam, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(activeInterval);
    };
  }, []);

  const sortedByMerit = [...teams].sort((a, b) => {
    if (a.merit !== b.merit) return b.merit - a.merit;
    return a.name.localeCompare(b.name);
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        minHeight: '100vh',
        overflow: 'hidden',
        fontFamily: 'var(--font-space-grotesk), Space Grotesk, sans-serif',
      }}
    >
      <Scoreboard
        realms={REALMS}
        realmMap={realmMap}
        sortedTeams={sortedByMerit}
      />
      <SimpleMap realms={REALMS} activeGlowIdx={activeGlowIdx} />
    </div>
  );
}
