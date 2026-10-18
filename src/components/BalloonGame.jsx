import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig.js";
import ConfettiBurst from "./ConfettiBurst.jsx";
import { playConfiguredSound } from "../utils/sound.js";

function BalloonSvg({ color, id, word }) {
  const grad = `balloon-grad-${id}`;
  return (
    <svg viewBox="0 0 80 140">
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="35%" stopColor={color} />
          <stop offset="100%" stopColor="#6b3d7a" />
        </linearGradient>
      </defs>
      <ellipse cx="40" cy="38" rx="26" ry="34" fill={`url(#${grad})`} />
      <ellipse cx="30" cy="26" rx="7" ry="12" fill="rgba(255,255,255,0.4)" />
      <text x="40" y="44" textAnchor="middle" fill="#2a1834" fontSize={word.length > 4 ? "7.5" : "10"} fontFamily="Outfit, sans-serif">
        {word}
      </text>
      <path d="M40 72 l-4 8 h8z" fill={color} />
      <path d="M40 80 C 30 100, 50 110, 40 130" fill="none" stroke="rgba(255,255,255,0.55)" />
    </svg>
  );
}

export default function BalloonGame({ onContinue, sfxOn, resetToken }) {
  const items = birthdayConfig.balloons.items;
  const [popped, setPopped] = useState([]);
  const copy = birthdayConfig.balloons;
  const done = popped.length === items.length;

  const positions = useMemo(
    () => [
      { left: "8%", top: "18%" },
      { left: "58%", top: "8%" },
      { left: "18%", top: "52%" },
      { left: "62%", top: "48%" },
    ],
    [],
  );

  const pop = (id) => {
    if (popped.includes(id)) return;
    playConfiguredSound(birthdayConfig.sounds.pop, sfxOn);
    setPopped((p) => [...p, id]);
  };

  const sentence = items.filter((item) => popped.includes(item.id)).map((item) => item.label);

  return (
    <section className="screen">
      <ConfettiBurst active={done} key={`${resetToken}-${done}`} />
      <h1 className="display">{copy.heading}</h1>
      <p className="sub">{copy.instruction}</p>
      <div className="word-strip" aria-live="polite">
        {items.map((item) => (
          <span key={item.id} className={popped.includes(item.id) ? "on" : ""}>
            {item.label}
          </span>
        ))}
      </div>
      <div className="balloon-stage">
        {items.map((item, i) =>
          popped.includes(item.id) ? null : (
            <button
              key={item.id}
              type="button"
              className="balloon float"
              style={{ ...positions[i], animationDelay: `${i * 0.4}s` }}
              onClick={() => pop(item.id)}
              aria-label={`Pop the ${item.label} balloon`}
            >
              <BalloonSvg color={item.color} id={item.id} word={item.label} />
            </button>
          ),
        )}
      </div>
      {sentence.length ? (
        <motion.p className="balloon-sentence" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {sentence.join(" ")}
        </motion.p>
      ) : null}
      {done ? (
        <>
          <h2 style={{ marginTop: "0.6rem" }}>{copy.complete}</h2>
          <button type="button" className="glow-btn" onClick={onContinue}>
            {copy.continueLabel}
          </button>
        </>
      ) : null}
    </section>
  );
}
