"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
 
type Step = { id: string; label: string; description: string };
type Gap = { after: string; label: string; description: string };
 
export function PipelineFlow({
  steps,
  gaps,
}: {
  steps: Step[];
  gaps: Gap[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const activeStep = steps.find((s) => s.id === active);
  const activeGap = gaps.find((g) => g.label === active);
  const activeInfo = activeStep?.description ?? activeGap?.description ?? null;
 
  return (
    <div className="my-8 rounded-xl border border-app-border bg-app-surface-2/50 p-6 font-mono text-sm">
      <p className="mb-4 text-xs uppercase tracking-widest text-app-text-subtle">
        Ingestion pipeline — click a node
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, i) => {
          const gapHere = gaps.find((g) => g.after === step.id);
          return (
            <div key={step.id} className="flex items-center gap-2">
              {/* Step node */}
              <button
                onClick={() => setActive(active === step.id ? null : step.id)}
                className={`rounded-md border px-3 py-1.5 transition-all duration-150 ${
                  active === step.id
                    ? "border-app-heading bg-app-heading text-app-bg"
                    : "border-app-border bg-app-surface-2 text-app-heading hover:border-app-heading/50"
                }`}
              >
                {step.label}
              </button>
 
              {/* Arrow */}
              {i < steps.length - 1 && (
                <span className="text-app-text-subtle">→</span>
              )}
 
              {/* Gap badge */}
              {gapHere && (
                <button
                  onClick={() =>
                    setActive(
                      active === gapHere.label ? null : gapHere.label
                    )
                  }
                  className={`rounded-full border px-2 py-0.5 text-xs transition-all duration-150 ${
                    active === gapHere.label
                      ? "border-app-accent bg-app-accent/20 text-app-accent-soft"
                      : "border-app-accent/40 text-app-accent-soft/70 hover:border-app-accent/70"
                  }`}
                >
                  {gapHere.label}
                </button>
              )}
            </div>
          );
        })}
      </div>
 
      <AnimatePresence mode="wait">
        {activeInfo && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="mt-4 rounded-md border border-app-border/50 bg-app-surface-2/60 px-4 py-3 text-sm text-app-text-muted"
          >
            <span className="font-semibold text-app-heading">
              {active}:{" "}
            </span>
            {activeInfo}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

