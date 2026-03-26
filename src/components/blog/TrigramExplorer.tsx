"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
 
function getTrigrams(text: string): string[] {
  const padded = `  ${text}  `;
  const trigrams = new Set<string>();
  for (let i = 0; i < padded.length - 2; i++) {
    trigrams.add(padded.slice(i, i + 3));
  }
  return Array.from(trigrams);
}
 
export function TrigramExplorer({
  defaultText,
  description,
}: {
  defaultText: string;
  description: string;
}) {
  const [text, setText] = useState(defaultText);
  const trigrams = useMemo(() => getTrigrams(text), [text]);
 
  return (
    <div className="my-8 rounded-xl border border-app-border bg-app-surface-2/50 p-6">
      <p className="mb-3 text-xs uppercase tracking-widest text-app-text-subtle">
        Trigram Explorer
      </p>
      <p className="mb-4 text-sm text-app-text-muted">{description}</p>
      <input
        className="w-full rounded-md border border-app-border bg-app-surface-2 px-3 py-2 font-mono text-sm text-app-heading placeholder:text-app-text-subtle focus:outline-none focus:ring-1 focus:ring-app-heading/30"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a formula or phrase…"
      />
      <div className="mt-4">
        <p className="mb-2 text-xs text-app-text-muted">
          {trigrams.length} trigrams generated:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {trigrams.map((tri, i) => (
            <motion.span
              key={`${tri}-${i}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.008, duration: 0.1 }}
              className="rounded border border-app-border bg-app-surface-2 px-1.5 py-0.5 font-mono text-xs text-app-text-muted"
            >
              {tri === "   " ? "·" : tri}
            </motion.span>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-app-text-subtle/60">
        PostgreSQL intersects trigram posting lists at query time — rows sharing
        all query trigrams are candidates, then confirmed on the full text.
      </p>
    </div>
  );
}
