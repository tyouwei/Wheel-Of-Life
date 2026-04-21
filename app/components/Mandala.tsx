'use client';

const GOLD = 'oklch(72% 0.14 75)';
const ROSE = 'oklch(65% 0.12 50)';
const PRECISION = 6;

const q = (value: number) => Number(value.toFixed(PRECISION));

export function MandalaOuter() {
  const cx = 300;
  const cy = 300;
  const elements: React.ReactNode[] = [];

  ([230, 200, 165, 125, 80, 40] as number[]).forEach((r, i) => {
    elements.push(
      <circle
        key={`ring-${i}`}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={GOLD}
        strokeWidth={r > 150 ? 1.2 : 0.8}
        strokeDasharray={r > 150 ? '4 6' : '2 5'}
      />,
    );
  });

  for (let i = 0; i < 24; i++) {
    const a = (Math.PI * 2 * i) / 24;
    elements.push(
      <line
        key={`spoke-${i}`}
        x1={q(cx + 42 * Math.cos(a))}
        y1={q(cy + 42 * Math.sin(a))}
        x2={q(cx + 228 * Math.cos(a))}
        y2={q(cy + 228 * Math.sin(a))}
        stroke={GOLD}
        strokeWidth={0.6}
        opacity={0.7}
      />,
    );
  }

  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 * i) / 12;
    const bx = q(cx + 190 * Math.cos(a));
    const by = q(cy + 190 * Math.sin(a));
    const cp1x = q(cx + 215 * Math.cos(a - 0.28));
    const cp1y = q(cy + 215 * Math.sin(a - 0.28));
    const cp2x = q(cx + 215 * Math.cos(a + 0.28));
    const cp2y = q(cy + 215 * Math.sin(a + 0.28));
    const d = `M${cx},${cy} C${cp1x},${cp1y} ${q(bx - 8 * Math.sin(a))},${q(by + 8 * Math.cos(a))} ${bx},${by} C${q(bx + 8 * Math.sin(a))},${q(by - 8 * Math.cos(a))} ${cp2x},${cp2y} ${cx},${cy} Z`;
    elements.push(
      <path key={`outer-petal-${i}`} d={d} fill={GOLD} opacity={0.22} stroke={GOLD} strokeWidth={0.5} />,
    );
  }

  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 * i) / 8 + Math.PI / 8;
    const bx = q(cx + 110 * Math.cos(a));
    const by = q(cy + 110 * Math.sin(a));
    const cp1x = q(cx + 130 * Math.cos(a - 0.32));
    const cp1y = q(cy + 130 * Math.sin(a - 0.32));
    const cp2x = q(cx + 130 * Math.cos(a + 0.32));
    const cp2y = q(cy + 130 * Math.sin(a + 0.32));
    const d = `M${cx},${cy} C${cp1x},${cp1y} ${bx - 6 * Math.sin(a)},${by + 6 * Math.cos(a)} ${bx},${by} C${bx + 6 * Math.sin(a)},${by - 6 * Math.cos(a)} ${cp2x},${cp2y} ${cx},${cy} Z`;
    elements.push(
      <path key={`inner-petal-${i}`} d={d} fill={ROSE} opacity={0.25} stroke={ROSE} strokeWidth={0.5} />,
    );
  }

  for (let i = 0; i < 16; i++) {
    const a = (Math.PI * 2 * i) / 16;
    elements.push(
      <circle key={`dot-${i}`} cx={q(cx + 248 * Math.cos(a))} cy={q(cy + 248 * Math.sin(a))} r={3.5} fill={GOLD} opacity={0.5} />,
    );
  }

  elements.push(<circle key="hub-ring" cx={cx} cy={cy} r={18} fill="none" stroke={GOLD} strokeWidth={1.5} />);
  elements.push(<circle key="hub-fill" cx={cx} cy={cy} r={8} fill={GOLD} opacity={0.6} />);

  return <>{elements}</>;
}

export function MandalaInner() {
  const cx = 300;
  const cy = 300;
  const elements: React.ReactNode[] = [];

  for (let t = 0; t < 2; t++) {
    const offset = t * (Math.PI / 3);
    const pts = Array.from({ length: 3 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 3 + offset;
      return `${q(cx + 140 * Math.cos(a))},${q(cy + 140 * Math.sin(a))}`;
    }).join(' ');
    elements.push(<polygon key={`tri-${t}`} points={pts} fill="none" stroke={GOLD} strokeWidth={1} opacity={0.55} />);
  }

  for (let i = 0; i < 6; i++) {
    const a = (Math.PI * 2 * i) / 6;
    const bx = q(cx + 70 * Math.cos(a));
    const by = q(cy + 70 * Math.sin(a));
    const cp1x = q(cx + 85 * Math.cos(a - 0.4));
    const cp1y = q(cy + 85 * Math.sin(a - 0.4));
    const cp2x = q(cx + 85 * Math.cos(a + 0.4));
    const cp2y = q(cy + 85 * Math.sin(a + 0.4));
    const d = `M${cx},${cy} C${cp1x},${cp1y} ${bx},${by} ${bx},${by} C${bx},${by} ${cp2x},${cp2y} ${cx},${cy} Z`;
    elements.push(<path key={`lotus-${i}`} d={d} fill={GOLD} opacity={0.3} stroke={GOLD} strokeWidth={0.6} />);
  }

  ([155, 120, 85] as number[]).forEach((r, i) => {
    elements.push(<circle key={`inner-ring-${i}`} cx={cx} cy={cy} r={r} fill="none" stroke={GOLD} strokeWidth={0.7} strokeDasharray="3 7" />);
  });

  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * 2 * i) / 12;
    elements.push(<circle key={`idot-${i}`} cx={q(cx + 168 * Math.cos(a))} cy={q(cy + 168 * Math.sin(a))} r={2.5} fill={GOLD} opacity={0.45} />);
  }

  return <>{elements}</>;
}
