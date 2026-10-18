import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const THEMES = {
  countdown: {
    colors: ["#07061a", "#141238", "#3a1d4e"],
    stars: 1,
    moon: true,
    clouds: true,
    fireflies: true,
    hearts: false,
    shoot: false,
    gold: false,
    paper: false,
  },
  pin: {
    colors: ["#090816", "#1b1540", "#4a2360"],
    stars: 1.1,
    moon: false,
    clouds: false,
    fireflies: true,
    hearts: false,
    shoot: false,
    gold: false,
    paper: false,
  },
  cake: {
    colors: ["#140c18", "#3a1d28", "#6a3a28"],
    stars: 0.5,
    moon: false,
    clouds: false,
    fireflies: false,
    hearts: false,
    shoot: false,
    gold: true,
    paper: false,
  },
  video: {
    colors: ["#08070f", "#161224", "#2a1b32"],
    stars: 0.4,
    moon: false,
    clouds: false,
    fireflies: false,
    hearts: false,
    shoot: false,
    gold: false,
    paper: false,
  },
  balloons: {
    colors: ["#1a1030", "#3d2458", "#5a3060"],
    stars: 0.3,
    moon: false,
    clouds: false,
    fireflies: true,
    hearts: false,
    shoot: false,
    gold: false,
    paper: false,
  },
  gallery: {
    colors: ["#2a2140", "#4a3560", "#6d4a6e"],
    stars: 0.3,
    moon: false,
    clouds: false,
    fireflies: true,
    hearts: false,
    shoot: false,
    gold: false,
    paper: false,
  },
  letter: {
    colors: ["#f3e6d8", "#efd3c8", "#e8c3bc"],
    stars: 0,
    moon: false,
    clouds: false,
    fireflies: false,
    hearts: true,
    shoot: false,
    gold: false,
    paper: true,
  },
  heart: {
    colors: ["#f4c9a3", "#e08a62", "#7a3b48"],
    stars: 0,
    moon: false,
    clouds: true,
    fireflies: false,
    hearts: false,
    shoot: false,
    gold: true,
    paper: false,
  },
  surprise: {
    colors: ["#050614", "#10163a", "#24184a"],
    stars: 1.3,
    moon: true,
    clouds: true,
    fireflies: true,
    hearts: false,
    shoot: true,
    gold: false,
    paper: false,
  },
  closing: {
    colors: ["#100c24", "#2a1848", "#4a2860"],
    stars: 0.8,
    moon: false,
    clouds: false,
    fireflies: true,
    hearts: false,
    shoot: false,
    gold: true,
    paper: false,
  },
};

export default function AnimatedBackground({ chapter, constellation }) {
  const canvasRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d", { alpha: false });
    const theme = THEMES[chapter] || THEMES.countdown;
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    const density = reduced ? 0.15 : mobile ? 0.45 : 1;

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    let t = 0;

    const stars = [];
    const fireflies = [];
    const clouds = [];
    const hearts = [];
    const sparks = [];
    const shooters = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const seed = () => {
      stars.length = 0;
      fireflies.length = 0;
      clouds.length = 0;
      hearts.length = 0;
      sparks.length = 0;
      shooters.length = 0;
      const starCount = Math.floor(140 * theme.stars * density);
      for (let i = 0; i < starCount; i += 1) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.4 + 0.3,
          tw: Math.random() * Math.PI * 2,
          s: 0.008 + Math.random() * 0.02,
        });
      }
      if (theme.fireflies) {
        const n = Math.floor(18 * density);
        for (let i = 0; i < n; i += 1) {
          fireflies.push({
            x: Math.random() * width,
            y: Math.random() * height,
            a: Math.random() * Math.PI * 2,
            v: 0.2 + Math.random() * 0.4,
          });
        }
      }
      if (theme.clouds) {
        for (let i = 0; i < 5; i += 1) {
          clouds.push({
            x: Math.random() * width,
            y: height * (theme.gold && chapter === "heart" ? 0.42 : 0.18) + i * 28,
            w: 180 + Math.random() * 220,
            h: 28 + Math.random() * 22,
            s: 0.08 + Math.random() * 0.12,
          });
        }
      }
      if (theme.hearts) {
        for (let i = 0; i < Math.floor(10 * density + 4); i += 1) {
          hearts.push({
            x: Math.random() * width,
            y: Math.random() * height,
            s: 4 + Math.random() * 7,
            v: 0.15 + Math.random() * 0.25,
          });
        }
      }
      if (theme.gold) {
        for (let i = 0; i < Math.floor(24 * density); i += 1) {
          sparks.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 1.8,
            tw: Math.random() * 6,
          });
        }
      }
    };

    const fillSky = () => {
      const g = ctx.createLinearGradient(0, 0, 0, height);
      g.addColorStop(0, theme.colors[0]);
      g.addColorStop(0.55, theme.colors[1]);
      g.addColorStop(1, theme.colors[2]);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    };

    const drawMoon = () => {
      const x = width * 0.78;
      const y = height * 0.18;
      const glow = ctx.createRadialGradient(x, y, 10, x, y, 90);
      glow.addColorStop(0, "rgba(246, 232, 190, 0.85)");
      glow.addColorStop(1, "rgba(246, 232, 190, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, 90, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f6e8c4";
      ctx.beginPath();
      ctx.arc(x, y, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = theme.colors[0];
      ctx.beginPath();
      ctx.arc(x + 10, y - 6, 22, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawHeartShape = (x, y, s) => {
      ctx.beginPath();
      ctx.moveTo(x, y + s * 0.3);
      ctx.bezierCurveTo(x, y, x - s, y, x - s, y + s * 0.35);
      ctx.bezierCurveTo(x - s, y + s * 0.75, x, y + s, x, y + s * 1.2);
      ctx.bezierCurveTo(x, y + s, x + s, y + s * 0.75, x + s, y + s * 0.35);
      ctx.bezierCurveTo(x + s, y, x, y, x, y + s * 0.3);
      ctx.fill();
    };

    const drawConstellation = () => {
      if (!constellation) return;
      const pts = [];
      const cx = width / 2;
      const cy = height * 0.38;
      for (let i = 0; i < 36; i += 1) {
        const a = (i / 36) * Math.PI * 2;
        const hx = 16 * Math.sin(a) ** 3;
        const hy =
          13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a);
        pts.push({ x: cx + hx * 8, y: cy - hy * 8 });
      }
      ctx.strokeStyle = "rgba(246, 226, 170, 0.55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      pts.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.stroke();
      pts.forEach((p) => {
        ctx.fillStyle = "rgba(255, 236, 200, 0.95)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const frame = () => {
      if (!running) return;
      t += reduced ? 0.2 : 1;
      fillSky();

      if (theme.paper) {
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        for (let i = 0; i < 40; i += 1) {
          ctx.fillRect((i * 47) % width, (i * 73) % height, 40, 1);
        }
      }

      if (theme.moon) drawMoon();

      stars.forEach((star) => {
        const tw = 0.4 + Math.abs(Math.sin(t * star.s + star.tw));
        ctx.fillStyle = `rgba(255,248,230,${tw})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      clouds.forEach((c) => {
        c.x += c.s;
        if (c.x - c.w > width) c.x = -c.w;
        ctx.fillStyle = chapter === "heart" ? "rgba(255,245,230,0.28)" : "rgba(200,210,255,0.08)";
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, c.w, c.h, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      fireflies.forEach((f) => {
        f.a += 0.01;
        f.x += Math.cos(f.a) * f.v;
        f.y += Math.sin(f.a * 0.8) * f.v;
        if (f.x < 0) f.x = width;
        if (f.x > width) f.x = 0;
        if (f.y < 0) f.y = height;
        if (f.y > height) f.y = 0;
        ctx.fillStyle = `rgba(210,255,170,${0.35 + Math.sin(t / 20 + f.a) * 0.35})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      hearts.forEach((h) => {
        h.y -= h.v;
        if (h.y < -20) h.y = height + 10;
        ctx.fillStyle = "rgba(214, 106, 126, 0.35)";
        drawHeartShape(h.x, h.y, h.s);
      });

      sparks.forEach((s) => {
        ctx.fillStyle = `rgba(246, 226, 170, ${0.3 + Math.sin(t / 18 + s.tw) * 0.4})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      if (theme.shoot && !reduced && t % 180 < 1 && shooters.length < 2) {
        shooters.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.4,
          l: 80 + Math.random() * 40,
          life: 0,
        });
      }
      shooters.forEach((sh, i) => {
        sh.life += 1;
        sh.x += 6;
        sh.y += 3;
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.l, sh.y - sh.l * 0.45);
        ctx.stroke();
        if (sh.life > 50) shooters.splice(i, 1);
      });

      drawConstellation();
      raf = requestAnimationFrame(frame);
    };

    const onVis = () => {
      running = document.visibilityState !== "hidden";
      if (running) frame();
    };

    resize();
    seed();
    frame();
    const onResize = () => {
      resize();
      seed();
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [chapter, constellation, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="sky-canvas"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
