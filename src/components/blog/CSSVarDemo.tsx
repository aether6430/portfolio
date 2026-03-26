"use client";
import { useState } from "react";

const THEMES = {
  dark:  { bg: "#0f172a", surface: "#1e293b", border: "#334155", text: "#e2e8f0", accent: "#abc4ff" },
  light: { bg: "#f8fafc", surface: "#ffffff", border: "#e2e8f0", text: "#0f172a", accent: "#4f46e5" },
  sepia: { bg: "#fdf6e3", surface: "#eee8d5", border: "#d3c8a0", text: "#3d3323", accent: "#cb4b16" },
};

export function CSSVarDemo() {
  const [theme, setTheme] = useState<keyof typeof THEMES>("dark");
  const t = THEMES[theme];

  return (
    <div className="my-8 rounded-xl border border-app-border/60 bg-app-surface-2 p-6">
      <p className="mb-1 text-xs uppercase tracking-widest text-app-text-subtle">
        CSS Variable Inheritance — live demo
      </p>
      <p className="mb-4 text-sm text-app-text-muted">
        The same SVG code references only CSS variables. Switch themes and watch
        the diagram adapt — no code changes, no re-render.
      </p>

      <div className="mb-4 flex gap-2">
        {(Object.keys(THEMES) as (keyof typeof THEMES)[]).map((k) => (
          <button
            key={k}
            onClick={() => setTheme(k)}
            className={`rounded-md border px-3 py-1.5 text-sm transition-all duration-150 ${
              theme === k
                ? "border-app-heading bg-app-heading text-app-bg"
                : "border-app-border bg-app-surface text-app-heading hover:border-app-heading/50"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <div
        className="rounded-lg p-6 transition-colors duration-300"
        style={{ backgroundColor: t.bg }}
      >
        <svg viewBox="0 0 300 120" className="w-full">
          {/* nodes */}
          {[
            { x: 20, y: 40, label: "Query", w: 60 },
            { x: 120, y: 40, label: "Embed", w: 60 },
            { x: 220, y: 40, label: "Retrieve", w: 70 },
          ].map((n) => (
            <g key={n.label}>
              <rect x={n.x} y={n.y} width={n.w} height={32} rx="5"
                fill={t.surface} stroke={t.border} strokeWidth="1" />
              <text x={n.x + n.w / 2} y={n.y + 20} textAnchor="middle"
                fill={t.text} fontSize="11" fontFamily="monospace">
                {n.label}
              </text>
            </g>
          ))}
          {/* arrows */}
          <defs>
            <marker id="ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={t.border} />
            </marker>
          </defs>
          <line x1="80" y1="56" x2="120" y2="56" stroke={t.border} strokeWidth="1.2" markerEnd="url(#ah)" />
          <line x1="180" y1="56" x2="220" y2="56" stroke={t.border} strokeWidth="1.2" markerEnd="url(#ah)" />
          {/* accent dot */}
          <circle cx="150" cy="100" r="8" fill={t.accent} />
          <text x="162" y="104" fill={t.text} fontSize="9" fontFamily="monospace">semantic match</text>
        </svg>
      </div>

      <p className="mt-3 text-xs text-app-text-subtle/60">
        In scribe, generated code never hardcodes a color value. Dark mode,
        light mode, and custom themes all resolve through the same token system.
      </p>
    </div>
  );
}
