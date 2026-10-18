import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";

export default function ConfettiBurst({ active }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!active || reduced) return undefined;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const n = window.innerWidth < 700 ? 50 : 90;
    const bits = Array.from({ length: n }, () => ({
      x: w / 2,
      y: h / 3,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -10 - 2,
      g: 0.22 + Math.random() * 0.12,
      size: 4 + Math.random() * 5,
      color: ["#f4b8c9", "#c9b6ff", "#e6c98a", "#9fd6e8", "#fff"][Math.floor(Math.random() * 5)],
      life: 0,
    }));
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      bits.forEach((b) => {
        b.vy += b.g;
        b.x += b.vx;
        b.y += b.vy;
        b.life += 1;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.size, b.size * 0.6);
      });
      if (bits[0].life < 90) raf = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, w, h);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [active, reduced]);

  return <canvas ref={ref} className="confetti-layer" aria-hidden="true" />;
}
