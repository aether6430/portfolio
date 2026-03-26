"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINEAGE = [
  {
    word: "avenire",
    lang: "Latin",
    meaning: "to come to pass",
    note: "Classical root. The verb from which futures were named.",
  },
  {
    word: "avenir",
    lang: "French",
    meaning: "the future; what is yet to come",
    note: "Still in use. The forward-facing shadow of the Latin root.",
  },
  {
    word: "avenoir",
    lang: "Invented",
    meaning: "the desire to see your memories from the outside",
    note: "From The Dictionary of Obscure Sorrows. The word that started everything.",
  },
  {
    word: "Avenire",
    lang: "English / brand",
    meaning: "what is yet to come — yours, specifically",
    note: "Found in the gap between languages. Neither here nor there, which is exactly where it belongs.",
  },
];

const ORBIT_WORDS = [
  { word: "reverie", angle: 30 },
  { word: "aether", angle: 90 },
  { word: "avenoir", angle: 150 },
  { word: "avenir", angle: 210 },
  { word: "adventure", angle: 270 },
  { word: "advent", angle: 330 },
];

export function WordLineage() {
  const [step, setStep] = useState(0);
  const current = LINEAGE[step];

  return (
    <div className="my-8 rounded-xl border border-app-border/60 bg-app-surface-2 p-6">
      <p className="mb-4 text-xs uppercase tracking-widest text-app-text-subtle">
        Etymology — trace the lineage
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Step-through lineage */}
        <div>
          <div className="mb-4 flex gap-1.5">
            {LINEAGE.map((_, i) => (
              <button key={i} onClick={() => setStep(i)}
                className={`h-1 flex-1 rounded-full transition-all duration-200 ${
                  i <= step ? "bg-app-heading" : "bg-app-border"
                }`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
              className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-app-text-muted">
                {current.lang}
              </p>
              <p className="font-mono text-2xl text-app-heading italic">{current.word}</p>
              <p className="text-sm text-app-text-muted">"{current.meaning}"</p>
              <p className="text-xs text-app-text-subtle/70 leading-relaxed">{current.note}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex justify-between">
            <button onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="text-xs text-app-text-muted disabled:opacity-30 hover:text-app-heading transition-colors">
              ← prev
            </button>
            <button onClick={() => setStep(s => Math.min(LINEAGE.length - 1, s + 1))}
              disabled={step === LINEAGE.length - 1}
              className="text-xs text-app-text-muted disabled:opacity-30 hover:text-app-heading transition-colors">
              next →
            </button>
          </div>
        </div>

        {/* Orbit diagram */}
        <svg viewBox="0 0 200 200" className="w-full">
          {/* Orbit ring */}
          <circle cx="100" cy="100" r="72" fill="none" stroke="var(--color-app-border)" strokeWidth="0.8" strokeDasharray="3 4" />
          {/* Center */}
          <circle cx="100" cy="100" r="22" fill="var(--color-app-surface-2)" stroke="var(--color-brand)" strokeWidth="1.2" />
          <text x="100" y="97" textAnchor="middle" fill="var(--color-brand)" fontSize="8" fontFamily="monospace">Avenire</text>
          <text x="100" y="107" textAnchor="middle" fill="var(--color-app-text-subtle)" fontSize="6" fontFamily="monospace">brand</text>
          {/* Satellites */}
          {ORBIT_WORDS.map(({ word, angle }) => {
            const rad = (angle * Math.PI) / 180;
            const x = 100 + 72 * Math.cos(rad);
            const y = 100 + 72 * Math.sin(rad);
            const isHighlighted = LINEAGE[step].word === word;
            return (
              <g key={word}>
                <line x1="100" y1="100" x2={x} y2={y}
                  stroke={isHighlighted ? "var(--color-brand)" : "var(--color-app-border-strong)"}
                  strokeWidth={isHighlighted ? "0.8" : "0.4"} />
                <circle cx={x} cy={y} r="16"
                  fill={isHighlighted ? "color-mix(in srgb, var(--color-brand) 13%, transparent)" : "var(--color-app-bg)"}
                  stroke={isHighlighted ? "var(--color-brand)" : "var(--color-app-border-strong)"}
                  strokeWidth={isHighlighted ? "1" : "0.6"} />
                <text x={x} y={y + 4} textAnchor="middle"
                  fill={isHighlighted ? "var(--color-brand)" : "var(--color-app-text-muted)"}
                  fontSize="6.5" fontFamily="monospace">
                  {word}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
