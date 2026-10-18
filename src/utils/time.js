export function getBirthdayTimestamp({ birthdayDate, birthdayTime, timeZone }) {
  const [year, month, day] = birthdayDate.split("-").map(Number);
  const [hour, minute] = (birthdayTime || "00:00").split(":").map(Number);

  const asUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  const offset = timezoneOffsetMs(asUtc, timeZone);
  let guess = asUtc - offset;
  const offset2 = timezoneOffsetMs(guess, timeZone);
  return asUtc - offset2;
}

function timezoneOffsetMs(utcMs, timeZone) {
  const date = new Date(utcMs);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const value = (type) => Number(parts.find((part) => part.type === type)?.value || 0);
  const asLocal = Date.UTC(
    value("year"),
    value("month") - 1,
    value("day"),
    value("hour") % 24,
    value("minute"),
    value("second"),
  );
  return asLocal - utcMs;
}
