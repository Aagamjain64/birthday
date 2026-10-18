import { useEffect, useState } from "react";

export function useIsTouch() {
  const [touch, setTouch] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(hover: none), (pointer: coarse)").matches
      : false,
  );

  useEffect(() => {
    const media = window.matchMedia("(hover: none), (pointer: coarse)");
    const onChange = () => setTouch(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return touch;
}
