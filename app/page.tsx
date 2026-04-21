'use client';

import { useState } from 'react';
import Scoreboard from './components/Scoreboard';
import SimpleMap from './components/SimpleMap';

const REALMS = [
  { name: 'Devas', color: 'oklch(62% 0.18 280)', bg: 'oklch(62% 0.18 280 / 0.15)' },
  { name: 'Asuras', color: 'oklch(62% 0.18 200)', bg: 'oklch(62% 0.18 200 / 0.15)' },
  { name: 'Humans', color: 'oklch(62% 0.18 140)', bg: 'oklch(62% 0.18 140 / 0.15)' },
  { name: 'Animals', color: 'oklch(62% 0.18 85)', bg: 'oklch(62% 0.18 85  / 0.15)' },
  { name: 'Pretas', color: 'oklch(62% 0.18 35)', bg: 'oklch(62% 0.18 35  / 0.15)' },
  { name: 'Narakas', color: 'oklch(62% 0.18 320)', bg: 'oklch(62% 0.18 320 / 0.15)' },
] as const;

const realmMap = Object.fromEntries(REALMS.map((r, i) => [r.name, i]));

const TEAMS = [
  { name: 'Bodhisattvas', merit: 99, wisdom: 100, realm: 'Devas' },
  { name: 'Siddhas', merit: 95, wisdom: 97, realm: 'Devas' },
  { name: 'Devas', merit: 92, wisdom: 88, realm: 'Devas' },
  { name: 'Vidyadharas', merit: 88, wisdom: 79, realm: 'Humans' },
  { name: 'Ashura', merit: 84, wisdom: 71, realm: 'Asuras' },
  { name: 'Gandharvas', merit: 80, wisdom: 82, realm: 'Asuras' },
  { name: 'Narakas', merit: 77, wisdom: 90, realm: 'Narakas' },
  { name: 'Apsaras', merit: 76, wisdom: 85, realm: 'Humans' },
  { name: 'Manavas', merit: 70, wisdom: 76, realm: 'Humans' },
  { name: 'Nagas', merit: 73, wisdom: 69, realm: 'Animals' },
  { name: 'Sravakas', merit: 67, wisdom: 72, realm: 'Pretas' },
  { name: 'Pretas', merit: 65, wisdom: 58, realm: 'Pretas' },
  { name: 'Kinnaras', merit: 61, wisdom: 74, realm: 'Animals' },
  { name: 'Tiryaks', merit: 55, wisdom: 63, realm: 'Animals' },
  { name: 'Yakshas', merit: 48, wisdom: 51, realm: 'Pretas' },
  { name: 'Rakshasas', merit: 42, wisdom: 37, realm: 'Narakas' },
] as const;

export default function Home() {
  const [activeGlowIdx, setActiveGlowIdx] = useState<number | null>(null);

  const sortedByRealm = [...TEAMS].sort((a, b) => {
    const ai = realmMap[a.realm] ?? 99;
    const bi = realmMap[b.realm] ?? 99;
    if (ai !== bi) return ai - bi;
    return a.name.localeCompare(b.name);
  });

  function handleRowClick(realmName: string) {
    const idx = realmMap[realmName];
    if (idx === undefined) return;
    setActiveGlowIdx((prev) => (prev === idx ? null : idx));
  }

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
        sortedTeams={sortedByRealm}
        onRowClick={handleRowClick}
      />
      <SimpleMap realms={REALMS} activeGlowIdx={activeGlowIdx} />
    </div>
  );
}
