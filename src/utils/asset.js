export function checkAsset(src) {
  if (!src) return Promise.resolve(false);
  const isVideo = /\.(mp4|webm|ogg)(\?|$)/i.test(src);
  const isAudio = /\.(mp3|wav|ogg|m4a)(\?|$)/i.test(src);

  if (isVideo || isAudio) {
    return new Promise((resolve) => {
      const el = document.createElement(isVideo ? "video" : "audio");
      const done = (ok) => {
        el.onloadeddata = null;
        el.onerror = null;
        resolve(ok);
      };
      el.preload = "metadata";
      el.onloadeddata = () => done(true);
      el.onerror = () => done(false);
      el.src = src;
    });
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}
