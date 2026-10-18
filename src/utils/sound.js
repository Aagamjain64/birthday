const buffers = new Map();

export function playConfiguredSound(path, enabled) {
  if (!enabled || !path) return;

  const existing = buffers.get(path);
  if (existing === false) {
    playFallback(path);
    return;
  }

  const audio = new Audio(path);
  audio.volume = 0.45;
  audio.play().catch(() => {
    buffers.set(path, false);
    playFallback(path);
  });
}

function playFallback(path) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (path.includes("pop")) {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.18);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (path.includes("success") || path.includes("celebration")) {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523, now);
      osc.frequency.setValueAtTime(659, now + 0.12);
      osc.frequency.setValueAtTime(784, now + 0.24);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.46);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(330, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.36);
    }
  } catch {
    /* ignore */
  }
}
