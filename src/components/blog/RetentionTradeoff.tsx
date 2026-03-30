"use client";

import { useState, useMemo } from "react";

const DECAY = -0.5;
const FACTOR = 19 / 81;

function optimalInterval(stability: number, target: number): number {
  return (stability / FACTOR) * (Math.pow(target, 1 / DECAY) - 1);
}

function formatInterval(days: number): string {
  if (days < 14) return `${Math.round(days)} days`;
  if (days < 60) return `${(days / 7).toFixed(0)} weeks`;
  if (days < 365) return `${(days / 30).toFixed(1)} months`;
  return `${(days / 365).toFixed(1)} years`;
}

const RETENTION_PRESETS = [0.7, 0.75, 0.8, 0.85, 0.9, 0.92, 0.95, 0.97, 0.99];

export function RetentionTradeoff() {
  const [deckSize, setDeckSize] = useState(500);
  const [highlightRow, setHighlightRow] = useState(0.9);

  const rows = useMemo(() => {
    const avgS = 30;
    const baseInterval = optimalInterval(avgS, 0.9);
    return RETENTION_PRESETS.map((r) => {
      const interval = optimalInterval(avgS, r);
      const multiplier = interval / baseInterval;
      const dailyLoad = Math.round(deckSize / interval);
      return { retention: r, interval, multiplier, dailyLoad };
    });
  }, [deckSize]);

  const highlighted = rows.find(r => r.retention === highlightRow)!;

  return (
    <div className="my-8 rounded-xl border border-app-border bg-app-surface-2 p-6 font-mono text-sm">
      <p className="mb-4 text-xs uppercase tracking-widest text-app-text-subtle">
        Interactive — Retention vs. Load Tradeoff
      </p>

      <div className="flex gap-6 flex-wrap mb-5 items-end">
        <label className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <span className="text-xs uppercase tracking-widest text-app-text-subtle">
            Deck Size — {deckSize} cards
          </span>
          <input type="range" min={100} max={2000} step={50} value={deckSize}
            onChange={e => setDeckSize(Number(e.target.value))}
            className="accent-app-heading" />
        </label>
      </div>

      <div className="mb-5">
        {rows.map((row) => {
          const isSelected = row.retention === highlightRow;
          const barWidth = Math.min(100, (row.dailyLoad / (deckSize / 5)) * 100);
          return (
            <div
              key={row.retention}
              onClick={() => setHighlightRow(row.retention)}
              className="flex items-center gap-3 p-2 rounded cursor-pointer transition-colors duration-150 hover:bg-app-surface/50"
              style={{
                background: isSelected ? "var(--color-app-surface)" : "transparent",
                marginBottom: 2,
              }}
            >
              <span className={`text-xs min-w-[40px] text-right ${isSelected ? "font-bold text-app-heading" : "text-app-text-subtle"}`}>
                {Math.round(row.retention * 100)}%
              </span>
              <div className="flex-1 h-3 bg-app-border rounded overflow-hidden">
                <div className="h-full transition-all duration-300 ease-out"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: isSelected ? "var(--color-app-heading)" : "var(--color-app-border-strong)",
                  }}
                />
              </div>
              <span className={`text-xs min-w-[70px] ${isSelected ? "font-bold text-app-heading" : "text-app-text-subtle"}`}>
                ~{row.dailyLoad} cards/day
              </span>
            </div>
          );
        })}
      </div>

      {highlighted && (
        <div className="bg-app-surface border border-app-border rounded p-4 grid grid-cols-3 gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-app-text-subtle mb-1">Retention</div>
            <div className="text-2xl font-bold leading-tight text-app-heading">{Math.round(highlighted.retention * 100)}%</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-app-text-subtle mb-1">Avg Interval</div>
            <div className="text-base font-bold leading-tight text-app-heading">{formatInterval(highlighted.interval)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-app-text-subtle mb-1">Daily Load</div>
            <div className="text-base font-bold leading-tight text-app-heading">~{highlighted.dailyLoad} cards</div>
            <div className="text-[10px] text-app-text-subtle mt-1">{highlighted.multiplier.toFixed(1)}× the 90% baseline</div>
          </div>
        </div>
      )}

      <p className="text-xs text-app-text-muted mt-3 leading-relaxed">
        Click any row to inspect. Notice how going from 90% → 95% retention roughly <strong className="text-app-heading">doubles</strong> your daily review load. The 90% default is the sweet spot: strong memory, manageable workload.
      </p>
    </div>
  );
}
