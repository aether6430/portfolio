"use client";
import { useState } from "react";

const DENSE = [
  { x: 140, y: 90, label: "entropy", connected: [1, 2, 3, 4] },
  { x: 220, y: 55, label: "microstates", connected: [0, 2] },
  { x: 260, y: 130, label: "probability", connected: [0, 1, 4] },
  { x: 80, y: 140, label: "heat", connected: [0, 4] },
  { x: 190, y: 165, label: "2nd law", connected: [0, 2, 3] },
];

const SPARSE = [
  { x: 140, y: 90, label: "entropy", connected: [] },
  { x: 220, y: 55, label: "microstates", connected: [] },
  { x: 260, y: 130, label: "probability", connected: [] },
  { x: 80, y: 140, label: "heat", connected: [] },
  { x: 190, y: 165, label: "2nd law", connected: [] },
];

export function UnderstandingSpaceDemo() {
  const [mode, setMode] = useState<"dense" | "sparse">("dense");
  const nodes = mode === "dense" ? DENSE : SPARSE;

  return (
    <div className="my-8 rounded-xl border border-app-border/60 bg-app-surface-2 p-6">
      <p className="mb-1 text-xs uppercase tracking-widest text-app-text-subtle">
        Understanding as a vector space
      </p>
      <p className="mb-4 text-sm text-app-text-muted">
        When you understand something, related concepts cluster together — edges
        exist. When you've only memorized, nodes are isolated. Toggle between
        a student who understands thermodynamics and one who's crammed it.
      </p>
      <div className="mb-4 flex gap-2">
        {(["dense", "sparse"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={`rounded-md border px-3 py-1.5 text-sm transition-all duration-150 ${
              mode === m
                ? "border-app-heading bg-app-heading text-app-bg"
                : "border-app-border bg-app-surface text-app-heading hover:border-app-heading/50"
            }`}>
            {m === "dense" ? "understands" : "memorised"}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 340 220" className="w-full rounded-md border border-app-border bg-app-surface p-2">
        {/* Edges */}
        {nodes.flatMap((node, i) =>
          node.connected.filter((j) => j > i).map((j) => (
            <line key={`${i}-${j}`}
              x1={node.x} y1={node.y} x2={nodes[j].x} y2={nodes[j].y}
              stroke="var(--color-brand)" strokeWidth="1.2" opacity="0.5" />
          ))
        )}
        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={i}>
            <circle cx={node.x} cy={node.y} r={node.connected.length > 2 ? 22 : 16}
              fill={mode === "dense" ? "color-mix(in srgb, var(--color-brand) 13%, transparent)" : "var(--color-app-surface-2)"}
              stroke={mode === "dense" ? "var(--color-brand)" : "var(--color-app-border-strong)"}
              strokeWidth={mode === "dense" ? "1.2" : "1"} />
            <text x={node.x} y={node.y + 4} textAnchor="middle"
              fill={mode === "dense" ? "var(--color-brand)" : "var(--color-app-text-subtle)"}
              fontSize="9" fontFamily="monospace">
              {node.label}
            </text>
          </g>
        ))}
        <text x="170" y="210" textAnchor="middle" fill="var(--color-app-text-muted)" fontSize="8" fontFamily="monospace">
          {mode === "dense"
            ? "dense neighborhood → can navigate novel problems"
            : "isolated symbols → can recall, cannot apply"}
        </text>
      </svg>
    </div>
  );
}
