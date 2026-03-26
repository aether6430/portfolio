"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const WEEK_SCENARIOS = [
  { label: "demo week", jee: 20, build: 70, novel: 10 },
  { label: "mock week", jee: 65, build: 25, novel: 10 },
  { label: "normal week", jee: 40, build: 45, novel: 15 },
  { label: "ideal (fiction)", jee: 50, build: 50, novel: 0 },
];

const BAR_COLORS = {
  jee: "#6ee7b7",
  build: "var(--color-brand)",
  novel: "#f9a8d4",
};

export function TradeoffMatrix() {
  const [selected, setSelected] = useState(2);
  const s = WEEK_SCENARIOS[selected];

  return (
    <div className="my-8 rounded-xl border border-app-border/60 bg-app-surface-2 p-6">
      <p className="mb-1 text-xs uppercase tracking-widest text-app-text-subtle">
        The honest tradeoff
      </p>
      <p className="mb-4 text-sm text-app-text-muted">
        Not a superpower — just a set of real allocation decisions made week by
        week. Select a scenario to see where the hours go.
      </p>

      <div className="mb-5 flex flex-wrap gap-2">
        {WEEK_SCENARIOS.map((w, i) => (
          <button key={i} onClick={() => setSelected(i)}
            className={`rounded-md border px-3 py-1.5 text-sm transition-all duration-150 ${
              selected === i
                ? "border-app-heading bg-app-heading text-app-bg"
                : "border-app-border bg-app-surface text-app-heading hover:border-app-heading/50"
            }`}>
            {w.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {(["jee", "build", "novel"] as const).map((key) => {
          const val = s[key];
          const labels = { jee: "JEE prep", build: "Avenire", novel: "Novel / rest" };
          return (
            <div key={key}>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-app-text-muted">{labels[key]}</span>
                <span className="font-mono text-app-heading">{val}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-app-border">
                <motion.div className="h-full rounded-full"
                  style={{ backgroundColor: BAR_COLORS[key] }}
                  animate={{ width: `${val}%` }}
                  transition={{ duration: 0.35, ease: "easeOut" }} />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-app-text-subtle/70 leading-relaxed border-t border-app-border pt-4">
        {selected === 3
          ? "The ideal is a fiction. A 50/50 split means both are permanently under-resourced. The real version involves ugly weeks, real trade-offs, and making peace with the fact that the exam date doesn't move."
          : selected === 0
          ? "Demo weeks are real. JEE prep goes on the back burner and you feel it. The stress doesn't disappear — it just gets deferred."
          : selected === 1
          ? "Mock weeks are the inverse. Building stalls, which is also stressful, but the test score feedback is the most honest signal you have about where the understanding actually lives."
          : "The normal week is the fiction you tell yourself on Sunday. By Thursday it looks like a demo week or a mock week, never the balanced version."}
      </p>
    </div>
  );
}
