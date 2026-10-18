import { useEffect, useMemo, useState } from "react";
import { getBirthdayTimestamp } from "../utils/time";

function split(diff) {
  const total = Math.max(0, Math.floor(diff / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    isComplete: diff <= 0,
  };
}

export function useCountdown(config) {
  const targetMs = useMemo(
    () => getBirthdayTimestamp(config),
    [config.birthdayDate, config.birthdayTime, config.timeZone],
  );

  const [value, setValue] = useState(() => split(targetMs - Date.now()));

  useEffect(() => {
    const tick = () => setValue(split(targetMs - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  return { ...value, targetMs };
}
