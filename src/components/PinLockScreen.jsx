import { AnimatePresence, motion } from "framer-motion";
import { Delete, Lock, Check } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig.js";
import { playConfiguredSound } from "../utils/sound.js";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "back", "0", "ok"];

export default function PinLockScreen({ onUnlock, sfxOn }) {
  const [digits, setDigits] = useState([]);
  const [status, setStatus] = useState("");
  const [ok, setOk] = useState(false);
  const [shake, setShake] = useState(false);
  const busy = useRef(false);
  const copy = birthdayConfig.pin;

  const submit = useCallback(
    (value) => {
      if (busy.current || value.length < 4) return;
      busy.current = true;
      if (value === birthdayConfig.secretPin) {
        setOk(true);
        setStatus(copy.success);
        playConfiguredSound(birthdayConfig.sounds.success, sfxOn);
        window.setTimeout(() => onUnlock(), 1100);
      } else {
        setShake(true);
        setStatus(copy.error);
        window.setTimeout(() => {
          setDigits([]);
          setShake(false);
          busy.current = false;
        }, 520);
      }
    },
    [copy.error, copy.success, onUnlock, sfxOn],
  );

  const push = useCallback(
    (key) => {
      if (ok || busy.current) return;
      if (key === "back") {
        setDigits((d) => d.slice(0, -1));
        return;
      }
      if (key === "ok") {
        submit(digits.join(""));
        return;
      }
      setDigits((d) => {
        if (d.length >= 4) return d;
        return [...d, key];
      });
    },
    [digits, ok, submit],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        push(e.key);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        push("back");
      } else if (e.key === "Enter") {
        e.preventDefault();
        push("ok");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [push]);

  return (
    <section className="screen">
      <div className={`pin-card glass-card${shake ? " shake" : ""}`}>
        <Lock className="float" color="#e6c98a" />
        <h1 className="display" style={{ fontSize: "2.1rem", marginTop: "0.6rem" }}>
          {copy.heading}
        </h1>
        <p className="lede">{copy.subtitle}</p>
        <p className="sub">{copy.instruction}</p>
        <div className="pin-dots" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`pin-dot${digits[i] ? " filled" : ""}${ok ? " star" : ""}`}
            />
          ))}
        </div>
        <div className="keypad">
          {KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className="key"
              disabled={key === "ok" && digits.length < 4}
              aria-label={key === "back" ? "Backspace" : key === "ok" ? "Confirm PIN" : `Digit ${key}`}
              onClick={() => push(key)}
            >
              {key === "back" ? <Delete size={18} /> : key === "ok" ? <Check size={18} /> : key}
            </button>
          ))}
        </div>
        <p className={`pin-status${ok ? " ok" : ""}`} role="status">
          {status}
        </p>
      </div>
      <AnimatePresence>
        {ok ? (
          <motion.div
            className="enter-burst"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
