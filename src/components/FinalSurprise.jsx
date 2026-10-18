import { motion } from "framer-motion";
import { useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig.js";
import { playConfiguredSound } from "../utils/sound.js";
import ConfettiBurst from "./ConfettiBurst.jsx";

export default function FinalSurprise({ onContinue, sfxOn, onOpened }) {
  const [open, setOpen] = useState(false);
  const copy = birthdayConfig.surprise;

  return (
    <section className="screen scrollable">
      <ConfettiBurst active={open} />
      <h1 className="display">{copy.heading}</h1>
      <p className="lede">{copy.subtitle}</p>
      <button
        type="button"
        className={`gift${open ? " open" : ""}`}
        aria-label="Open the final gift"
        onClick={() => {
          if (open) return;
          setOpen(true);
          onOpened?.();
          playConfiguredSound(birthdayConfig.sounds.celebration, sfxOn);
        }}
      >
        <div className="gift-box">
          <div className="gift-lid" />
          <div className="gift-ribbon" />
        </div>
      </button>
      {open ? (
        <motion.div className="final-message glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {copy.message}
          <p className="signature">
            With lots of good wishes,
            <br />
            {birthdayConfig.signature} ❤️
          </p>
          <div className="nav-row">
            <button type="button" className="glow-btn" onClick={onContinue}>
              {copy.continueLabel}
            </button>
          </div>
        </motion.div>
      ) : (
        <p className="sub">Tap the gift when you are ready.</p>
      )}
    </section>
  );
}
