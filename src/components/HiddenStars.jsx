import { Sparkle } from "lucide-react";
import { useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig.js";
import { AnimatePresence, motion } from "framer-motion";

const POSITIONS = [
  { top: "18%", left: "8%" },
  { top: "28%", right: "12%" },
  { bottom: "22%", left: "14%" },
  { top: "62%", right: "18%" },
];

export default function HiddenStars() {
  const [note, setNote] = useState("");

  return (
    <>
      {birthdayConfig.hiddenMessages.map((message, i) => (
        <button
          key={message}
          type="button"
          className="hidden-star"
          style={POSITIONS[i]}
          aria-label="A hidden little wish"
          onClick={() => {
            setNote(message);
            window.setTimeout(() => setNote(""), 2400);
          }}
        >
          <Sparkle size={16} />
        </button>
      ))}
      <AnimatePresence>
        {note ? (
          <motion.div
            className="hidden-toast"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {note}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
