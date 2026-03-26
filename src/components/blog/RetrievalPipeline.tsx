"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PIPELINE_STEPS = [
  {
    id: "query",
    label: "Student query",
    detail: "\"why does the photoelectric effect disprove the wave model?\"",
    note: "Short, informal, conceptual. A text-only index will miss chunks that use different vocabulary.",
    color: "var(--color-brand)",
  },
  {
    id: "expand",
    label: "Query expansion",
    detail: "LLM generates 3–5 rephrasing variants",
    note: "\"quantum of light\", \"photon energy threshold\", \"wave-particle duality\" — now we search with the full semantic surface.",
    color: "var(--color-brand)",
  },
  {
    id: "vector",
    label: "Vector search (pgvector)",
    detail: "Top-K candidates by cosine similarity",
    note: "Fast approximate nearest-neighbor search across all chunks — text, PDF pages, video keyframes — in the same embedding space.",
    color: "#6ee7b7",
  },
  {
    id: "bm25",
    label: "BM25 (hybrid)",
    detail: "Lexical match runs in parallel",
    note: "Catches exact-match cases that vector search misses: specific identifiers, course codes, terminology the embedding model compressed away.",
    color: "#fcd34d",
  },
  {
    id: "rerank",
    label: "Rerank (Cohere)",
    detail: "Cross-encoder scores query ↔ each candidate together",
    note: "The bi-encoder embedding gives you fast candidates. The reranker gives you precision — it sees query and chunk simultaneously, not as independent vectors.",
    color: "#f9a8d4",
  },
  {
    id: "assemble",
    label: "Context assembly",
    detail: "Add source metadata, surrounding chunks, ordering",
    note: "A theorem without its proof is often less useful. Source and page number anchor the student to the right material.",
    color: "#d8b4fe",
  },
  {
    id: "llm",
    label: "LLM injection",
    detail: "Retrieved context → Apollo prompt",
    note: "Apollo responds grounded in the student's own materials. Not a generic explanation — their professor's explanation, their notation.",
    color: "var(--color-brand)",
  },
];

export function RetrievalPipeline() {
  const [active, setActive] = useState(0);
  const current = PIPELINE_STEPS[active];

  return (
    <div className="my-8 rounded-xl border border-app-border/60 bg-app-surface-2 p-6">
      <p className="mb-4 text-xs uppercase tracking-widest text-app-text-subtle">
        Retrieval pipeline — step through
      </p>

      {/* Horizontal step strip */}
      <div className="mb-6 flex flex-wrap gap-1.5">
        {PIPELINE_STEPS.map((s, i) => (
          <button key={s.id} onClick={() => setActive(i)}
            className={`rounded border px-2 py-1 text-xs transition-all duration-150 font-mono ${
              i === active
                ? "border-app-heading bg-app-heading text-app-bg"
                : i < active
                ? "border-app-border/60 bg-app-border/10 text-app-text-muted"
                : "border-app-border bg-app-surface text-app-text-muted/60"
            }`}>
            {i + 1}. {s.label}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-0.5 w-full rounded-full bg-app-border">
        <motion.div className="h-full rounded-full bg-app-heading"
          animate={{ width: `${((active + 1) / PIPELINE_STEPS.length) * 100}%` }}
          transition={{ duration: 0.25 }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: current.color }} />
            <span className="font-mono text-sm font-semibold text-app-heading">{current.label}</span>
          </div>
          <p className="font-mono text-xs text-app-text-muted border border-app-border/40 rounded px-3 py-2 bg-app-surface/60">
            {current.detail}
          </p>
          <p className="text-sm text-app-text-muted">{current.note}</p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex justify-between">
        <button onClick={() => setActive(s => Math.max(0, s - 1))}
          disabled={active === 0}
          className="text-xs text-app-text-muted disabled:opacity-30 hover:text-app-heading transition-colors">
          ← prev
        </button>
        <span className="text-xs text-app-text-muted">{active + 1} / {PIPELINE_STEPS.length}</span>
        <button onClick={() => setActive(s => Math.min(PIPELINE_STEPS.length - 1, s + 1))}
          disabled={active === PIPELINE_STEPS.length - 1}
          className="text-xs text-app-text-muted disabled:opacity-30 hover:text-app-heading transition-colors">
          next →
        </button>
      </div>
    </div>
  );
}
