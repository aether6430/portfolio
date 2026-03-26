"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRINCIPLES = [
  {
    id: "flat",
    label: "Flat over rich",
    rule: "No gradients, shadows, or textures.",
    why: "Gradients flicker as SVG nodes stream in. Flat fills appear instantly and correctly — simplicity is a technical requirement that happens to be a design virtue.",
    wrong: (
      <svg viewBox="0 0 120 60" className="w-full">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <rect x="10" y="10" width="45" height="40" rx="6" fill="url(#g1)"
          style={{ filter: "drop-shadow(2px 4px 6px #0008)" }} />
        <rect x="65" y="10" width="45" height="40" rx="6" fill="url(#g1)"
          style={{ filter: "drop-shadow(2px 4px 6px #0008)" }} />
      </svg>
    ),
    right: (
      <svg viewBox="0 0 120 60" className="w-full">
        <rect x="10" y="10" width="45" height="40" rx="4"
          fill="var(--color-app-surface-2)" stroke="var(--color-app-border)" strokeWidth="1" />
        <rect x="65" y="10" width="45" height="40" rx="4"
          fill="var(--color-app-surface-2)" stroke="var(--color-app-border)" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: "color",
    label: "Color encodes meaning",
    rule: "Color = category, not sequence.",
    why: "Assigning colors in order (first node gets blue, second gets amber) makes color decoration. Color should signal: inputs are one hue, processes another, outputs a third.",
    wrong: (
      <svg viewBox="0 0 160 60" className="w-full">
        {[...Array(4)].map((_, i) => (
          <g key={i}>
            <circle cx={20 + i * 38} cy="30" r="14" fill={["#3b82f6", "#f59e0b", "#ef4444", "#10b981"][i]} />
            <text x={20 + i * 38} y="35" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{["A", "B", "C", "D"][i]}</text>
          </g>
        ))}
      </svg>
    ),
    right: (
      <svg viewBox="0 0 160 60" className="w-full">
        {/* inputs */}
        {[...Array(2)].map((_, i) => (
          <g key={i}>
            <circle cx={20 + i * 38} cy="30" r="14" fill="#abc4ff" />
            <text x={20 + i * 38} y="35" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="bold">{["A", "B"][i]}</text>
          </g>
        ))}
        {/* process */}
        <circle cx="96" cy="30" r="14" fill="#94a3b8" />
        <text x="96" y="35" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="bold">P</text>
        {/* output */}
        <circle cx="134" cy="30" r="14" fill="#6ee7b7" />
        <text x="134" y="35" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="bold">O</text>
        {/* legend */}
        <text x="4" y="57" fill="#64748b" fontSize="7">input</text>
        <text x="78" y="57" fill="#64748b" fontSize="7">process</text>
        <text x="118" y="57" fill="#64748b" fontSize="7">output</text>
      </svg>
    ),
  },
  {
    id: "narrate",
    label: "Don't narrate yourself",
    rule: "No prose inside the visual. Text belongs in the text stream.",
    why: "A visual that explains itself is doing the text's job badly. The visual exists to show what prose can't. If they're repeating each other, one is redundant.",
    wrong: (
      <svg viewBox="0 0 160 70" className="w-full">
        <rect x="5" y="5" width="150" height="60" rx="4" fill="var(--color-app-surface-2)" stroke="var(--color-app-border)" strokeWidth="1" />
        <text x="10" y="22" fill="#94a3b8" fontSize="7" fontWeight="bold">Figure 1: Conservation of Momentum</text>
        <text x="10" y="34" fill="#64748b" fontSize="6">This diagram shows how momentum is conserved</text>
        <text x="10" y="44" fill="#64748b" fontSize="6">in an elastic collision between two objects.</text>
        <rect x="10" y="50" width="28" height="12" rx="2" fill="#abc4ff" />
        <rect x="122" y="50" width="28" height="12" rx="2" fill="#6ee7b7" />
      </svg>
    ),
    right: (
      <svg viewBox="0 0 160 70" className="w-full">
        <rect x="5" y="15" width="40" height="40" rx="4" fill="#abc4ff" />
        <text x="25" y="39" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="bold">A</text>
        <defs>
          <marker id="arr2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
          </marker>
        </defs>
        <line x1="45" y1="35" x2="75" y2="35" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arr2)" />
        <line x1="115" y1="35" x2="85" y2="35" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arr2)" />
        <rect x="115" y="15" width="40" height="40" rx="4" fill="#6ee7b7" />
        <text x="135" y="39" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="bold">B</text>
      </svg>
    ),
  },
];

export function DesignPrinciplesToggle() {
  const [active, setActive] = useState<string>("flat");
  const current = PRINCIPLES.find((p) => p.id === active)!;

  return (
    <div className="my-8 rounded-xl border border-app-border/60 bg-app-surface-2 p-6">
      <p className="mb-4 text-xs uppercase tracking-widest text-app-text-subtle">
        Three design rules — select one
      </p>
      <div className="mb-6 flex flex-wrap gap-2">
        {PRINCIPLES.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className={`rounded-md border px-3 py-1.5 text-sm transition-all duration-150 ${
              active === p.id
                ? "border-app-heading bg-app-heading text-app-bg"
                : "border-app-border bg-app-surface text-app-heading hover:border-app-heading/50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="space-y-4"
        >
          <p className="font-mono text-sm text-app-heading">{current.rule}</p>
          <p className="text-sm text-app-text-muted">{current.why}</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-xs text-red-400/80">✗ wrong</p>
              <div className="rounded-md border border-red-500/20 bg-app-surface p-3">
                {current.wrong}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs text-green-400/80">✓ right</p>
              <div className="rounded-md border border-green-500/20 bg-app-surface p-3">
                {current.right}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
