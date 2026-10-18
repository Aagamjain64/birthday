import { useEffect, useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig.js";
import { checkAsset } from "../utils/asset.js";
import PhotoLightbox from "./PhotoLightbox.jsx";

function Polaroid({ item, onOpen, rotate }) {
  return (
    <button type="button" className="polaroid float" style={{ transform: `rotate(${rotate}deg)` }} onClick={onOpen}>
      {item.ready && item.video ? (
        <video src={`${item.src}#t=0.1`} muted playsInline preload="metadata" />
      ) : item.ready ? (
        <img src={item.src} alt="" loading="lazy" />
      ) : (
        <div className="ph" />
      )}
      <span>{item.title}</span>
    </button>
  );
}

export default function MemoryGallery({ onContinue, active }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(null);
  const copy = birthdayConfig.gallery;

  useEffect(() => {
    let cancelled = false;
    const photos = birthdayConfig.photos.map((p) => ({ ...p, video: false }));
    const videos = (birthdayConfig.videos || []).map((v) => ({ ...v, video: true }));
    Promise.all(
      [...photos, ...videos].map(async (item) => ({
        ...item,
        ready: await checkAsset(item.src),
      })),
    ).then((list) => {
      if (!cancelled) setItems(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!active && open?.video) setOpen(null);
  }, [active, open]);

  return (
    <section className="screen wide scrollable">
      <h1 className="display">{copy.title}</h1>
      <p className="lede">{copy.subtitle}</p>
      <div className="gallery-grid">
        {items.map((item, i) => (
          <Polaroid
            key={`${item.id}-${item.video ? "v" : "p"}`}
            item={item}
            rotate={[-3, 2, -1, 3][i % 4]}
            onOpen={() => setOpen(item)}
          />
        ))}
      </div>
      <p className="lede">{copy.afterLine}</p>
      <p className="sub">{copy.afterSub}</p>
      <button type="button" className="glow-btn" onClick={onContinue}>
        {copy.continueLabel}
      </button>
      {open ? (
        <PhotoLightbox
          item={open}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </section>
  );
}
