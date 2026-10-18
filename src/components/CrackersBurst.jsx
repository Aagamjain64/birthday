import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";

export default function CrackersBurst({ active }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!active || reduced) return undefined;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const colors = ["#ff4d6d", "#ffd166", "#c9b6ff", "#7cf0ff", "#fff", "#ff8fab"];
    const bursts = [];
    const sparks = [];

    const boom = (x, y) => {
      const n = window.innerWidth < 700 ? 42 : 70;
      for (let i = 0; i < n; i += 1) {
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.2;
        const speed = 2.2 + Math.random() * 5.4;
        sparks.push({
          x,
          y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          life: 0,
          max: 50 + Math.random() * 28,
          size: 2 + Math.random() * 2.4,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    [0.18, 0.5, 0.82].forEach((px, i) => {
      bursts.push({ t: 8 + i * 10, x: w * px, y: h * (0.28 + (i % 2) * 0.12) });
    });
    [0.32, 0.68].forEach((px, i) => {
      bursts.push({ t: 36 + i * 12, x: w * px, y: h * 0.42 });
    });

    let frame = 0;
    let raf = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(7, 6, 26, 0.16)";
      ctx.fillRect(0, 0, w, h);
      bursts.forEach((b) => {
        if (b.t === frame) boom(b.x, b.y);
      });
      sparks.forEach((s) => {
        s.vy += 0.045;
        s.x += s.vx;
        s.y += s.vy;
        s.life += 1;
        const alpha = Math.max(0, 1 - s.life / s.max);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      frame += 1;
      if (frame < 110) raf = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, w, h);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [active, reduced]);

  return <canvas ref={ref} className="confetti-layer crackers-layer" aria-hidden="true" />;
}
