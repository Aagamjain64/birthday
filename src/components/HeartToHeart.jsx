import { motion } from "framer-motion";
import { birthdayConfig } from "../data/birthdayConfig.js";

export default function HeartToHeart({ onContinue }) {
  const copy = birthdayConfig.heart;
  return (
    <section className="screen scrollable heart-screen">
      <h1 className="display">{copy.heading}</h1>
      <div className="sunrise-copy">
        {copy.paragraphs.map((p, i) => (
          <motion.p
            key={p}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ delay: 0.05, duration: 0.6 }}
          >
            {p}
          </motion.p>
        ))}
      </div>
      <div className="heart-cards">
        {copy.cards.map((card, i) => (
          <motion.article
            key={card.title}
            className="heart-card glass-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.1 }}
          >
            <h3>{card.title}</h3>
            <p>{card.message}</p>
          </motion.article>
        ))}
      </div>
      <p className="lede" style={{ color: "#3b2618" }}>
        {copy.finalLine}
      </p>
      <button type="button" className="glow-btn" onClick={onContinue}>
        {copy.continueLabel}
      </button>
    </section>
  );
}
