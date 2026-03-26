"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
 
const BEFORE_CHUNKS = [
  { id: "c1", index: 0, text: "Gauss's law states that the total electric flux…", hash: "a1b2" },
  { id: "c2", index: 1, text: "For a spherical surface of radius r around charge Q…", hash: "c3d4" },
  { id: "c3", index: 2, text: "Applying the integral: ∮ E · dA = Q_enc / ε₀", hash: "e5f6" },
  { id: "c4", index: 3, text: "Therefore E = Q / (4πε₀r²) — the Coulomb result.", hash: "g7h8" },
];
 
const AFTER_CHUNKS = [
  { id: "c1", index: 0, text: "Gauss's law states that the total electric flux…", hash: "a1b2" },
  { id: "c2", index: 1, text: "For a spherical surface of radius r around charge Q…", hash: "c3d4" },
  // chunk 3 was edited
  { id: "c3new", index: 2, text: "Applying the integral: ∮ E · dA = Q_enc / ε₀  ← fixed sign", hash: "x9y0" },
  { id: "c4", index: 3, text: "Therefore E = Q / (4πε₀r²) — the Coulomb result.", hash: "g7h8" },
];
 
type ChunkStatus = "unchanged" | "dirty" | "deleted" | "new";
 
const STEPS = [
  {
    title: "Before: 4 chunks in DB",
    description: "The original note has 4 chunks, each with a stored content_hash.",
    before: BEFORE_CHUNKS.map((c) => ({ ...c, status: "unchanged" as ChunkStatus })),
    after: [],
  },
  {
    title: "Student edits chunk 3",
    description: "One sentence is corrected. The Tiptap doc saves immediately. Re-ingestion is debounced 3s.",
    before: BEFORE_CHUNKS.map((c) => ({
      ...c,
      status: (c.id === "c3" ? "dirty" : "unchanged") as ChunkStatus,
    })),
    after: [],
  },
  {
    title: "Diff: hash comparison",
    description: "Incoming hashes are compared against stored hashes. Chunks c1, c2, c4 match → no-op. c3 is new hash → INSERT.",
    before: BEFORE_CHUNKS.map((c) => ({
      ...c,
      status: (c.id === "c3" ? "deleted" : "unchanged") as ChunkStatus,
    })),
    after: AFTER_CHUNKS.map((c) => ({
      ...c,
      status: (c.id === "c3new" ? "new" : "unchanged") as ChunkStatus,
    })),
  },
  {
    title: "Result: 1 Cohere call",
    description: "Only the changed chunk re-embeds. 3 unchanged chunks are skipped. If Feature B cache hits, even that 1 call is free.",
    before: [],
    after: AFTER_CHUNKS.map((c) => ({
      ...c,
      status: (c.id === "c3new" ? "new" : "unchanged") as ChunkStatus,
    })),
  },
];
 
const statusStyles: Record<ChunkStatus, string> = {
  unchanged: "border-app-border bg-app-surface-2 text-app-text-muted",
  dirty: "border-yellow-500/60 bg-yellow-500/10 text-yellow-300",
  deleted: "border-red-500/60 bg-red-500/10 text-red-400 line-through opacity-60",
  new: "border-green-500/60 bg-green-500/10 text-green-400",
};
 
const statusLabel: Record<ChunkStatus, string> = {
  unchanged: "unchanged",
  dirty: "edited",
  deleted: "removed",
  new: "→ embed",
};
 
export function DiffVisualizer({
  description,
}: {
  description: string;
}) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
 
  const allChunks =
    current.after.length > 0 ? current.after : current.before;
 
  return (
    <div className="my-8 rounded-xl border border-app-border bg-app-surface-2/50 p-6">
      <p className="mb-1 text-xs uppercase tracking-widest text-app-text-subtle">
        Dirty Tracking — Step-through
      </p>
      <p className="mb-4 text-sm text-app-text-muted">{description}</p>
 
      {/* Step indicator */}
      <div className="mb-4 flex gap-2">
        {STEPS.map((_s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`h-1.5 flex-1 rounded-full transition-all duration-200 ${
              i === step ? "bg-app-heading" : "bg-app-border"
            }`}
          />
        ))}
      </div>
 
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.18 }}
        >
          <p className="mb-1 font-semibold text-app-heading">{current.title}</p>
          <p className="mb-4 text-sm text-app-text-muted">
            {current.description}
          </p>
 
          <div className="space-y-2">
            {allChunks.map((chunk) => (
              <div
                key={chunk.id}
                className={`flex items-start gap-3 rounded-md border px-3 py-2 text-sm transition-all duration-200 ${
                  statusStyles[chunk.status]
                }`}
              >
                <span className="mt-0.5 shrink-0 font-mono text-xs text-app-text-subtle/50">
                  [{chunk.index}]
                </span>
                <span className="flex-1 font-mono text-xs leading-relaxed">
                  {chunk.text.slice(0, 60)}…
                </span>
                <span className="shrink-0 font-mono text-xs text-app-text-subtle/70">
                  {chunk.hash}
                </span>
                <span className="shrink-0 text-xs text-app-text-subtle/80">
                  {statusLabel[chunk.status]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
 
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-xs text-app-text-muted disabled:opacity-30 hover:text-app-heading transition-colors"
        >
          ← prev
        </button>
        <span className="text-xs text-app-text-muted">
          {step + 1} / {STEPS.length}
        </span>
        <button
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          className="text-xs text-app-text-muted disabled:opacity-30 hover:text-app-heading transition-colors"
        >
          next →
        </button>
      </div>
    </div>
  );
}

