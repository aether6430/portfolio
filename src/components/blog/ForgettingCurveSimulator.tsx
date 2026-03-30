"use client";

import { useState, useMemo } from "react";

const DECAY = -0.5;
const FACTOR = 19 / 81;

function retrievability(t: number, stability: number): number {
  return Math.pow(1 + (FACTOR * t) / stability, 1 / DECAY);
}

function optimalInterval(stability: number, target: number): number {
  return (stability / FACTOR) * (Math.pow(target, 1 / DECAY) - 1);
}

const WIDTH = 520;
const HEIGHT = 220;
const PAD = { top: 16, right: 20, bottom: 36, left: 44 };

export function ForgettingCurveSimulator() {
  const [stability, setStability] = useState(5);
  const [targetRetention, setTargetRetention] = useState(0.9);
  const [reviews, setReviews] = useState<number[]>([]);

  const maxDays = Math.max(60, Math.ceil(optimalInterval(stability, 0.7) * 1.4));

  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;

  const toX = (t: number) => PAD.left + (t / maxDays) * innerW;
  const toY = (r: number) => PAD.top + (1 - r) * innerH;

  const curve = useMemo(() => {
    const allReviews = [...reviews].sort((a, b) => a - b);

    const segments: { startT: number; s: number }[] = [{ startT: 0, s: stability }];
    for (const rv of allReviews) {
      const seg = segments[segments.length - 1];
      const elapsed = rv - seg.startT;
      const r = retrievability(elapsed, seg.s);
      const newS = seg.s * (Math.exp(0.9) * (11 - 5) * Math.pow(seg.s, -0.14) * (Math.exp(0.2 * (1 - r)) - 1) + 1);
      segments.push({ startT: rv, s: Math.min(newS, 365) });
    }

    const allPoints: string[] = [];
    for (const seg of segments) {
      const endT = allReviews.find((r) => r > seg.startT) ?? maxDays;
      const steps = Math.max(40, Math.ceil(endT - seg.startT));
      for (let i = 0; i <= steps; i++) {
        const t = seg.startT + ((endT - seg.startT) * i) / steps;
        const elapsed = t - seg.startT;
        const r = Math.max(0, Math.min(1, retrievability(Math.max(0.001, elapsed), seg.s)));
        const x = toX(t).toFixed(1);
        const y = toY(r).toFixed(1);
        allPoints.push(i === 0 && seg.startT === 0 ? `M${x},${y}` : `L${x},${y}`);
      }
    }

    return allPoints.join(" ");
  }, [stability, reviews, maxDays]);

  const retentionLine = toY(targetRetention);
  const optInterval = optimalInterval(stability, targetRetention);

  const handleAddReview = () => {
    const nextDue = Math.round(optInterval);
    const last = reviews[reviews.length - 1] ?? 0;
    setReviews([...reviews, last + nextDue]);
  };

  const handleReset = () => setReviews([]);

  return (
    <div className="my-8 rounded-xl border border-app-border bg-app-surface-2 p-6 font-mono text-sm">
      <p className="mb-3 text-xs uppercase tracking-widest text-app-text-subtle">
        Interactive — Forgetting Curve Simulator
      </p>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full max-w-[520px] block overflow-visible"
      >
        {[0, 0.25, 0.5, 0.75, 1].map((r) => (
          <line
            key={r}
            x1={PAD.left} y1={toY(r)} x2={PAD.left + innerW} y2={toY(r)}
            stroke={r === 0 || r === 1 ? "var(--color-app-border-strong)" : "var(--color-app-border)"}
            strokeWidth={r === 0 || r === 1 ? 1.5 : 1}
            strokeDasharray={r === 0 || r === 1 ? "none" : "3,3"}
          />
        ))}
        {[0, 25, 50, 75, 100].map((pct) => (
          <text key={pct} x={PAD.left - 6} y={toY(pct / 100) + 4} textAnchor="end"
            fontSize={9} fill="var(--color-app-text-subtle)" fontFamily="var(--font-mono)">
            {pct}%
          </text>
        ))}

        {[0, Math.round(maxDays * 0.25), Math.round(maxDays * 0.5), Math.round(maxDays * 0.75), maxDays].map((d) => (
          <text key={d} x={toX(d)} y={HEIGHT - 6} textAnchor="middle"
            fontSize={9} fill="var(--color-app-text-subtle)" fontFamily="var(--font-mono)">
            {d}d
          </text>
        ))}

        <line
          x1={PAD.left} y1={retentionLine}
          x2={PAD.left + innerW} y2={retentionLine}
          stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5,3" opacity={0.7}
        />
        <text x={PAD.left + innerW - 4} y={retentionLine - 5} textAnchor="end"
          fontSize={8} fill="#ef4444" fontFamily="var(--font-mono)">
          {Math.round(targetRetention * 100)}% target
        </text>

        {reviews.length === 0 && optInterval < maxDays && (
          <>
            <line
              x1={toX(optInterval)} y1={PAD.top}
              x2={toX(optInterval)} y2={PAD.top + innerH}
              stroke="var(--color-app-accent)" strokeWidth={1.5} strokeDasharray="4,3" opacity={0.6}
            />
            <text x={toX(optInterval) + 4} y={PAD.top + 14} fontSize={8}
              fill="var(--color-app-accent)" fontFamily="var(--font-mono)">
              review at {Math.round(optInterval)}d
            </text>
          </>
        )}

        {reviews.map((rv, i) => (
          <g key={i}>
            <line x1={toX(rv)} y1={PAD.top} x2={toX(rv)} y2={PAD.top + innerH}
              stroke="#22c55e" strokeWidth={1.5} strokeDasharray="4,3" opacity={0.5} />
            <circle cx={toX(rv)} cy={toY(targetRetention)} r={4} fill="#22c55e" opacity={0.8} />
            <text x={toX(rv)} y={PAD.top + 10} textAnchor="middle" fontSize={7}
              fill="#22c55e" fontFamily="var(--font-mono)">↑{rv}d</text>
          </g>
        ))}

        <path d={curve} fill="none" stroke="var(--color-app-heading)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + innerH} stroke="var(--color-app-border-strong)" strokeWidth={1.5} />
        <line x1={PAD.left} y1={PAD.top + innerH} x2={PAD.left + innerW} y2={PAD.top + innerH} stroke="var(--color-app-border-strong)" strokeWidth={1.5} />
      </svg>

      <div className="grid grid-cols-2 gap-5 mt-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest text-app-text-subtle">
            Stability (S) — {stability} days
          </span>
          <input type="range" min={0.5} max={30} step={0.5} value={stability}
            onChange={(e) => { setStability(Number(e.target.value)); setReviews([]); }}
            className="w-full accent-app-heading" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest text-app-text-subtle">
            Target Retention — {Math.round(targetRetention * 100)}%
          </span>
          <input type="range" min={0.7} max={0.99} step={0.01} value={targetRetention}
            onChange={(e) => { setTargetRetention(Number(e.target.value)); setReviews([]); }}
            className="w-full accent-red-500" />
        </label>
      </div>

      <div className="flex gap-3 mt-4 flex-wrap">
        <button
          onClick={handleAddReview}
          className="px-4 py-2 text-xs uppercase tracking-widest bg-app-heading text-app-bg border-none rounded-md cursor-pointer font-mono hover:opacity-90 transition-opacity"
        >
          + Add Review
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-xs uppercase tracking-widest bg-transparent text-app-text-subtle border border-app-border rounded-md cursor-pointer font-mono hover:bg-app-surface-hover transition-colors"
        >
          Reset
        </button>
        <span className="text-xs text-app-text-subtle self-center">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""} · next due at {Math.round(optInterval)}d
        </span>
      </div>

      <p className="text-xs text-app-text-muted mt-3 leading-relaxed">
        Drag <strong className="text-app-heading">Stability</strong> to see how stronger memories decay slower. Press <strong className="text-app-heading">Add Review</strong> to simulate an on-time review — each one boosts stability and pushes the next interval out further.
      </p>
    </div>
  );
}
