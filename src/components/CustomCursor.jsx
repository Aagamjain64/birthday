import { useEffect, useState } from "react";
import { useIsTouch } from "../hooks/useIsTouch.js";

export default function CustomCursor() {
  const touch = useIsTouch();
  const [pos, setPos] = useState({ x: -40, y: -40 });

  useEffect(() => {
    if (touch) return undefined;
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [touch]);

  if (touch) return null;
  return <div className="cursor-glow" style={{ left: pos.x, top: pos.y }} aria-hidden="true" />;
}
