import { X } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function PhotoLightbox({ item, onClose }) {
  useEffect(() => {
    document.body.classList.add("lightbox-open");
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("lightbox-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const isVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(item.src || "");

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.title}>
      <button type="button" className="ghost-btn close-x" onClick={onClose} aria-label="Close">
        <X />
      </button>
      <motion.div
        className="lightbox-frame"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {item.ready ? (
          isVideo ? (
            <video src={item.src} controls playsInline preload="metadata" />
          ) : (
            <img src={item.src} alt={item.title} />
          )
        ) : (
          <div className="ph" style={{ height: "240px", display: "grid", placeItems: "center" }}>
            A placeholder for this memory
          </div>
        )}
        <h2>{item.title}</h2>
        {item.date ? <p>{item.date}</p> : null}
        {item.caption ? <p>{item.caption}</p> : null}
        <p>{item.message}</p>
      </motion.div>
    </div>
  );
}
