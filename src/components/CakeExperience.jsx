import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig.js";
import ConfettiBurst from "./ConfettiBurst.jsx";
import { playConfiguredSound } from "../utils/sound.js";

function CakeSvg({ cut }) {
  return (
    <svg className="cake-svg" viewBox="0 0 280 260" role="img" aria-label="Birthday cake for Bhoomi">
      <ellipse cx="140" cy="232" rx="88" ry="12" fill="rgba(0,0,0,0.28)" />
      <rect x="70" y="214" width="140" height="16" rx="8" fill="#c9a46a" />
      <rect x="86" y="222" width="108" height="10" rx="5" fill="#a67c42" />
      {!cut ? (
        <g className="cut-guide" pointerEvents="none">
          <line x1="140" y1="78" x2="140" y2="210" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeDasharray="6 7" />
        </g>
      ) : null}
      <g
        style={{
          transform: cut ? "translate(-18px, 6px) rotate(-6deg)" : undefined,
          transformOrigin: "120px 160px",
          transition: "transform 0.8s ease",
        }}
      >
        <path d="M78 168h84v36c0 10-18 18-42 18s-42-8-42-18z" fill="#f3d5c8" />
        <path d="M78 150h84v22H78z" fill="#e8b4c4" />
        <path d="M86 132h68v22H86z" fill="#f7efe3" />
        <path d="M86 118c10-10 22-16 34-16s24 6 34 16v14H86z" fill="#fff8f2" />
        <path d="M90 152c10 8 22 8 32 0 10 8 22 8 32 0" fill="none" stroke="#d9899c" strokeWidth="3" />
        <circle cx="102" cy="140" r="4" fill="#d46a8e" />
        <circle cx="136" cy="136" r="4" fill="#c9b6ff" />
        <circle cx="168" cy="142" r="4" fill="#e6c98a" />
      </g>
      <g
        style={{
          transform: cut ? "translate(22px, 8px) rotate(8deg)" : undefined,
          transformOrigin: "160px 160px",
          transition: "transform 0.8s ease",
        }}
      >
        <path d="M162 168h40v36c0 8-10 14-20 14s-20-6-20-14z" fill="#f0c9bc" />
        <path d="M162 150h40v22h-40z" fill="#e0a8ba" />
        <path d="M168 132h28v22h-28z" fill="#f3e6dc" />
      </g>
      {!cut ? (
        <g>
          {[108, 140, 172].map((x, i) => (
            <g key={x}>
              <rect x={x - 3} y="86" width="6" height="34" rx="2" fill="#f7efe3" />
              <ellipse className="flame" cx={x} cy="78" rx="6" ry="12" fill={i === 1 ? "#ffd36a" : "#ffb347"} />
            </g>
          ))}
          <g className="knife-hint">
            <rect x="0" y="0" width="64" height="7" rx="3" fill="#d9d4e8" />
            <polygon points="64,0 84,3.5 64,7" fill="#c9c4d8" />
          </g>
        </g>
      ) : null}
    </svg>
  );
}

export default function CakeExperience({ onContinue, sfxOn, resetToken }) {
  const [cut, setCut] = useState(false);
  const start = useRef(null);
  const copy = birthdayConfig.cake;

  useEffect(() => {
    setCut(false);
  }, [resetToken]);

  const cutCake = () => {
    if (cut) return;
    setCut(true);
    playConfiguredSound(birthdayConfig.sounds.celebration, sfxOn);
  };

  const onPointerDown = (event) => {
    if (cut) return;
    start.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerUp = (event) => {
    if (cut || !start.current) return;
    const dx = Math.abs(event.clientX - start.current.x);
    const dy = Math.abs(event.clientY - start.current.y);
    start.current = null;
    if (dx > 36 || dy > 48) cutCake();
  };

  return (
    <section className="screen">
      <ConfettiBurst active={cut} key={resetToken} />
      <p className="lede">{copy.intro}</p>
      <p className="sub">{copy.wish}</p>
      {!cut ? (
        <p className="cut-how">{copy.howTo}</p>
      ) : null}
      <div
        className="cake-scene"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          start.current = null;
        }}
        role="img"
        aria-label="Slide across the cake to cut it"
      >
        <CakeSvg cut={cut} />
      </div>
      {cut ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="display">{copy.heading}</h1>
          <p className="lede">{copy.message}</p>
          <p className="sub">{copy.today}</p>
          <button type="button" className="glow-btn" onClick={onContinue}>
            {copy.continueLabel}
          </button>
        </motion.div>
      ) : (
        <p className="sub">No button. Just swipe across the cake.</p>
      )}
    </section>
  );
}
