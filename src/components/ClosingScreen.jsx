import { useState } from "react";
import { birthdayConfig } from "../data/birthdayConfig.js";
import { saveResponse } from "../utils/api.js";

export default function ClosingScreen({ onReplay }) {
  const copy = birthdayConfig.closing;
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);

  const send = async () => {
    const value = note.trim();
    if (!value || saving) return;
    setSaving(true);
    await saveResponse({ type: "feedback", value });
    setSent(true);
    setSaving(false);
  };

  return (
    <section className="screen">
      <p className="kicker">Until the next little memory</p>
      <h1 className="display">{copy.heading}</h1>
      <p className="lede">{copy.subtitle}</p>
      <p className="display" style={{ fontSize: "2.4rem" }}>
        Happy Birthday, {birthdayConfig.name}
      </p>
      <p className="sub">{copy.prompt}</p>
      {!sent ? (
        <form
          className="note-form"
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
        >
          <label className="sr-only" htmlFor="closing-note">
            {copy.prompt}
          </label>
          <textarea
            id="closing-note"
            rows={4}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={copy.prompt}
          />
          <div className="nav-row">
            <button type="submit" className="glow-btn" disabled={!note.trim() || saving}>
              {copy.sendLabel}
            </button>
            <button type="button" className="ghost-btn" onClick={onReplay}>
              {copy.replayLabel}
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="lede">{copy.sent}</p>
          <button type="button" className="glow-btn" onClick={onReplay}>
            {copy.replayLabel}
          </button>
        </>
      )}
    </section>
  );
}
