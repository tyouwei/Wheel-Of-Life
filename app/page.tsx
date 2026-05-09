'use client';

import { useEffect } from 'react';
import Scoreboard from './components/Scoreboard';
import SimpleMap from './components/SimpleMap';
import type { Team } from './models/model';
import { useGameStore } from './store/useGameStore';

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
  const { setTeams, setActiveTeam } = useGameStore();

  useEffect(() => {
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
        .then((data: Team) => setActiveTeam(data))
        .catch(console.error);

    fetchActiveTeam();
    const activeInterval = setInterval(fetchActiveTeam, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(activeInterval);
    };
  }, []);

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
      <Scoreboard realms={REALMS} realmMap={realmMap} />
      <SimpleMap realms={REALMS} />
    </div>
  );
}
