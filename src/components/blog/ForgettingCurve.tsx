"use client";
import { useEffect, useRef, useState } from "react";

function retentionAt(daysSince: number, stability: number): number {
  // Ebbinghaus-style: R = e^(-t/S)
  return Math.exp(-daysSince / stability);
}

export function ForgettingCurve() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stability, setStability] = useState(3);
  const DAYS = 30;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const PAD = { top: 16, right: 16, bottom: 32, left: 40 };
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;

    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(148,163,184,0.12)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = PAD.top + (plotH * i) / 4;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(PAD.left + plotW, y);
      ctx.stroke();
      ctx.fillStyle = "#64748b";
      ctx.font = "10px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${100 - i * 25}%`, PAD.left - 4, y + 4);
    }

    // Axes labels
    ctx.fillStyle = "#64748b";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    for (const d of [0, 7, 14, 21, 30]) {
      const x = PAD.left + (d / DAYS) * plotW;
      ctx.fillText(`${d}d`, x, H - 6);
    }

    // Forgetting without SR — low stability
    const drawCurve = (stab: number, color: string, dash: number[]) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash(dash);
      ctx.beginPath();
      for (let px = 0; px <= plotW; px++) {
        const day = (px / plotW) * DAYS;
        const r = retentionAt(day, stab);
        const y = PAD.top + plotH * (1 - r);
        if (px === 0) ctx.moveTo(PAD.left + px, y);
        else ctx.lineTo(PAD.left + px, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // Passive review curve (fixed low stability)
    drawCurve(1.5, "rgba(239,68,68,0.6)", [4, 3]);

    // FSRS-style: multiple reviews boost stability
    // Simulate 3 reviews at days 1, 4, 12
    const reviews = [1, 4, 12];
    let currentStab = stability;
    let lastReviewDay = 0;

    ctx.strokeStyle = "#abc4ff";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let inPath = false;
    for (let px = 0; px <= plotW; px++) {
      const day = (px / plotW) * DAYS;
      // Apply review boosts
      for (const rd of reviews) {
        if (day >= rd && lastReviewDay < rd) {
          currentStab = currentStab * 1.8;
          lastReviewDay = rd;
        }
      }
      const daysSinceLastReview = day - lastReviewDay;
      const r = retentionAt(daysSinceLastReview, currentStab);
      const y = PAD.top + plotH * (1 - r);
      if (!inPath) { ctx.moveTo(PAD.left + px, y); inPath = true; }
      else ctx.lineTo(PAD.left + px, y);
    }
    ctx.stroke();

    // Review markers
    ctx.fillStyle = "#abc4ff";
    for (const rd of reviews) {
      const x = PAD.left + (rd / DAYS) * plotW;
      ctx.beginPath();
      ctx.arc(x, PAD.top + 8, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Legend
    ctx.font = "9px monospace";
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = "rgba(239,68,68,0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(PAD.left, H - 14); ctx.lineTo(PAD.left + 16, H - 14); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(239,68,68,0.7)";
    ctx.fillText("passive review", PAD.left + 48, H - 11);
    ctx.strokeStyle = "#abc4ff";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(PAD.left + 100, H - 14); ctx.lineTo(PAD.left + 116, H - 14); ctx.stroke();
    ctx.fillStyle = "#abc4ff";
    ctx.fillText("spaced repetition (FSRS)", PAD.left + 176, H - 11);

  }, [stability]);

  return (
    <div className="my-8 rounded-xl border border-app-border/60 bg-app-surface-2 p-6">
      <p className="mb-1 text-xs uppercase tracking-widest text-app-text-subtle">
        The Forgetting Curve
      </p>
      <p className="mb-4 text-sm text-app-text-muted">
        Memory retention over 30 days. The blue dots mark spaced review sessions
        — each review multiplies the stability factor, flattening the decay.
      </p>
      <canvas ref={canvasRef} width={560} height={200} className="w-full" />
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-app-text-muted">Initial stability</span>
          <span className="font-mono text-app-heading">{stability} days</span>
        </div>
        <input type="range" min={1} max={10} value={stability}
          onChange={(e) => setStability(Number(e.target.value))}
          className="w-full accent-app-heading" />
        <p className="mt-1 text-xs text-app-text-subtle/60">
          Stability = how long before 90% retention drops below 50%. Drag to
          see how initial learning strength affects the curve.
        </p>
      </div>
    </div>
  );
}
