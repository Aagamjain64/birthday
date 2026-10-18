import { Volume2, Pause, Play } from "lucide-react";
import { useEffect, useRef } from "react";
import { birthdayConfig } from "../data/birthdayConfig.js";
import { useAssetReady } from "../hooks/useAssetReady.js";

export default function MusicPlayer({ playing, setPlaying, volume, setVolume, sfxOn, setSfxOn }) {
  const audioRef = useRef(null);
  const { ready, missing } = useAssetReady(birthdayConfig.musicPath);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = volume;
    if (playing && ready) {
      el.play().catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  }, [playing, ready, volume, setPlaying]);

  useEffect(() => {
    const el = audioRef.current;
    return () => {
      if (el) {
        el.pause();
      }
    };
  }, []);

  if (missing) {
    return (
      <div className="music-player glass-card" role="group" aria-label="Sound controls">
        <button
          type="button"
          className="ghost-btn"
          aria-pressed={sfxOn}
          onClick={() => setSfxOn((v) => !v)}
        >
          Soft sounds {sfxOn ? "on" : "off"}
        </button>
      </div>
    );
  }

  return (
    <div className="music-player glass-card" role="group" aria-label="Music player">
      <audio ref={audioRef} src={birthdayConfig.musicPath} loop preload="none" />
      <button
        type="button"
        className="ghost-btn"
        aria-label={playing ? "Pause music" : "Play music"}
        onClick={() => setPlaying((v) => !v)}
        disabled={!ready}
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <Volume2 size={14} aria-hidden="true" />
      <label className="sr-only" htmlFor="vol">
        Volume
      </label>
      <input
        id="vol"
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
      />
      <button type="button" className="ghost-btn" aria-pressed={sfxOn} onClick={() => setSfxOn((v) => !v)}>
        SFX {sfxOn ? "on" : "off"}
      </button>
      <span>{playing ? "Playing" : "Paused"}</span>
    </div>
  );
}
