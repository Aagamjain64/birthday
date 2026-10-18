import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig.js";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import CrackersBurst from "./CrackersBurst.jsx";

export default function CountdownScreen({ onEnter }) {
  const reduced = usePrefersReducedMotion();
  const [count, setCount] = useState(1);
  const [blast, setBlast] = useState(false);
  const onEnterRef = useRef(onEnter);
  const copy = birthdayConfig.countdown;
  onEnterRef.current = onEnter;

  useEffect(() => {
    if (reduced) {
      setCount(0);
      setBlast(true);
      const skip = window.setTimeout(() => onEnterRef.current(), 400);
      return () => window.clearTimeout(skip);
    }

    const tick = window.setTimeout(() => {
      setCount(0);
      setBlast(true);
    }, 1000);
    const go = window.setTimeout(() => onEnterRef.current(), 2600);
    return () => {
      window.clearTimeout(tick);
      window.clearTimeout(go);
    };
  }, [reduced]);

  return (
    <section className="screen">
      <CrackersBurst active={blast} />
      <p className="kicker">A little universe</p>
      <motion.h1 className="display" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        {copy.heading}
      </motion.h1>
      <p className="lede">{copy.subtitle}</p>
      <p className="sub">{copy.line}</p>
      <div className="one-count" aria-live="polite">
        <strong>{count}</strong>
        <span>second</span>
      </div>
      {blast ? <p className="sub">Crackers in the sky...</p> : null}
    </section>
  );
}
