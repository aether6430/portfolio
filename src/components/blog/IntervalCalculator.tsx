"use client";

import { useState, useMemo } from "react";

const DECAY = -0.5;
const FACTOR = 19 / 81;

function optimalInterval(stability: number, target: number): number {
  return (stability / FACTOR) * (Math.pow(target, 1 / DECAY) - 1);
}

function formatInterval(days: number): string {
  if (days < 1) return `${Math.round(days * 24)} hours`;
  if (days < 14) return `${Math.round(days)} days`;
  if (days < 60) return `${(days / 7).toFixed(1)} weeks`;
  if (days < 365) return `${(days / 30).toFixed(1)} months`;
  return `${(days / 365).toFixed(1)} years`;
}

function simulateReviews(initialS: number, n: number, target: number): { review: number; stability: number; interval: number; totalDays: number }[] {
  const rows = [];
  let s = initialS;
  let totalDays = 0;
  for (let i = 1; i <= n; i++) {
    const interval = optimalInterval(s, target);
    totalDays += interval;
    const r = target;
    const sNew = s * (Math.exp(0.9) * (11 - 5) * Math.pow(s, -0.14) * (Math.exp(0.2 * (1 - r)) - 1) + 1);
    rows.push({ review: i, stability: parseFloat(s.toFixed(2)), interval: parseFloat(interval.toFixed(1)), totalDays: parseFloat(totalDays.toFixed(1)) });
    s = Math.min(sNew, 365 * 5);
  }
  return rows;
}

const INITIAL_S_BY_RATING: Record<string, number> = {
  again: 0.4,
  hard: 1.3,
  good: 3.1,
  easy: 7.9,
};

export function IntervalCalculator() {
  const [firstRating, setFirstRating] = useState<"again" | "hard" | "good" | "easy">("good");
  const [target, setTarget] = useState(0.9);
  const [numReviews, setNumReviews] = useState(8);

  const rows = useMemo(() => {
    return simulateReviews(INITIAL_S_BY_RATING[firstRating], numReviews, target);
  }, [firstRating, target, numReviews]);

  const ratingColors: Record<string, string> = {
    again: "#ef4444",
    hard: "#f97316",
    good: "#22c55e",
    easy: "var(--color-app-accent)",
  };

  return (
    <div className="my-8 rounded-xl border border-app-border bg-app-surface-2 p-6 font-mono text-sm">
      <p className="mb-4 text-xs uppercase tracking-widest text-app-text-subtle">
        Interactive — Interval Growth Calculator
      </p>

      <div className="flex gap-6 flex-wrap mb-5 items-end">
        <div>
          <div className="text-xs uppercase tracking-widest text-app-text-subtle mb-2">
            First Rating
          </div>
          <div className="flex gap-1.5">
            {(["again", "hard", "good", "easy"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setFirstRating(r)}
                className={`px-3 py-1.5 text-xs tracking-wider capitalize transition-all duration-150 cursor-pointer font-mono rounded ${
                  firstRating === r
                    ? "text-white border-none"
                    : "bg-transparent text-app-text-subtle border border-app-border hover:bg-app-surface-hover"
                }`}
                style={{
                  background: firstRating === r ? ratingColors[r] : undefined,
                  borderColor: firstRating === r ? ratingColors[r] : undefined,
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-1 flex-1 min-w-[160px]">
          <span className="text-xs uppercase tracking-widest text-app-text-subtle">
            Target Retention — {Math.round(target * 100)}%
          </span>
          <input type="range" min={0.7} max={0.99} step={0.01} value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="accent-red-500" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-widest text-app-text-subtle">
            Reviews to simulate
          </span>
          <input type="number" min={3} max={15} value={numReviews}
            onChange={(e) => setNumReviews(Math.max(3, Math.min(15, Number(e.target.value))))}
            className="w-16 px-2 py-1 font-mono text-xs border border-app-border bg-app-surface rounded" />
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              {["Review #", "Stability (days)", "Interval", "Cumulative"].map((h) => (
                <th key={h} className="text-left p-2 border-b-2 border-app-heading font-semibold text-app-text-subtle uppercase tracking-widest text-[10px]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "transparent" : "bg-app-surface/50"}>
                <td className="p-2 border-b border-app-border">
                  <span style={{ color: ratingColors[firstRating] }} className="font-semibold">#{row.review}</span>
                </td>
                <td className="p-2 border-b border-app-border">
                  {row.stability}d
                </td>
                <td className="p-2 border-b border-app-border font-semibold text-app-heading">
                  {formatInterval(row.interval)}
                </td>
                <td className="p-2 border-b border-app-border text-app-text-subtle">
                  {formatInterval(row.totalDays)} total
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-app-text-muted mt-3 leading-relaxed">
        Notice how a card first rated <strong className="text-app-heading">Easy</strong> vs <strong className="text-app-heading">Hard</strong> diverges dramatically after just a few reviews. This is the algorithm naturally calibrating to the card's intrinsic difficulty.
      </p>
    </div>
  );
}
