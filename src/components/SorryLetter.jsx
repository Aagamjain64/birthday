import { useState } from "react";
import { motion } from "framer-motion";
import { birthdayConfig } from "../data/birthdayConfig.js";
import { playConfiguredSound } from "../utils/sound.js";
import { saveResponse } from "../utils/api.js";

export default function SorryLetter({ onContinue, sfxOn }) {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState("");
  const [saving, setSaving] = useState(false);
  const copy = birthdayConfig.letter;

  const pick = async (value) => {
    if (saving) return;
    setChoice(value);
    setSaving(true);
    await saveResponse({ type: "letter_choice", value });
    setSaving(false);
  };

  return (
    <section className="screen scrollable letter-screen">
      <h1 className="display">{copy.heading}</h1>
      <p className="lede">{copy.subtitle}</p>
      <button
        type="button"
        className="envelope"
        aria-expanded={open}
        aria-label="Open the letter"
        onClick={() => {
          if (!open) playConfiguredSound(birthdayConfig.sounds.envelope, sfxOn);
          setOpen(true);
        }}
      >
        <div className="envelope-body">
          <div className={`flap${open ? " open" : ""}`} />
          {!open ? <div className="seal" /> : null}
        </div>
      </button>
      {open ? (
        <motion.article
          className="letter-sheet"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="script-title">For Bhoomi</p>
          {copy.body}
          <p style={{ marginTop: "1.2rem", fontStyle: "italic" }}>{copy.footer}</p>
        </motion.article>
      ) : null}
      {open ? (
        <div className="choice-stack">
          <p className="sub">{copy.choicePrompt}</p>
          {copy.choices.map((item) => (
            <button
              key={item}
              type="button"
              className={`choice-btn${choice === item ? " picked" : ""}`}
              onClick={() => pick(item)}
              disabled={saving || Boolean(choice)}
            >
              {item}
            </button>
          ))}
          {choice ? (
            <div className="nav-row">
              <button type="button" className="glow-btn" onClick={onContinue}>
                {copy.continueLabel}
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="sub">Tap the envelope when you are ready.</p>
      )}
    </section>
  );
}
