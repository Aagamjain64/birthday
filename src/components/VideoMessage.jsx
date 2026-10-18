import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig.js";
import { useAssetReady } from "../hooks/useAssetReady.js";

export default function VideoMessage({ onContinue, active }) {
  const videoRef = useRef(null);
  const { ready, missing, loading } = useAssetReady(birthdayConfig.videoPath);
  const [ended, setEnded] = useState(false);
  const copy = birthdayConfig.video;

  useEffect(() => {
    if (!active && videoRef.current) {
      videoRef.current.pause();
    }
  }, [active]);

  return (
    <section className="screen">
      <p className="lede">{copy.beforeLine}</p>
      <p className="sub">{copy.beforeSub}</p>
      <div className="video-card">
        <div className="video-frame">
          {loading ? <div className="placeholder">Loading a quiet little moment...</div> : null}
          {missing ? (
            <div className="placeholder">
              <Play />
              <strong>{copy.missingTitle}</strong>
              <p>{copy.missingBody}</p>
            </div>
          ) : null}
          {ready ? (
            <video
              ref={videoRef}
              src={birthdayConfig.videoPath}
              controls
              playsInline
              preload="metadata"
              onEnded={() => setEnded(true)}
            />
          ) : null}
        </div>
      </div>
      {(ended || missing) && (
        <>
          <p className="lede" style={{ marginTop: "1.1rem" }}>
            {copy.afterLine}
          </p>
          <p className="sub">{copy.afterSub}</p>
        </>
      )}
      <div className="nav-row">
        <button type="button" className="glow-btn" onClick={onContinue}>
          {copy.continueLabel}
        </button>
      </div>
    </section>
  );
}
