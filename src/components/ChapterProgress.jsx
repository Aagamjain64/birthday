import { birthdayConfig } from "../data/birthdayConfig.js";

export default function ChapterProgress({ chapter, visited, onBackTo }) {
  if (chapter === "closing") return null;

  return (
    <nav className="chapter-progress" aria-label="Birthday chapters">
      {birthdayConfig.chapters.map((item) => {
        const current = item.id === chapter;
        const done = visited.includes(item.id) && !current;
        const canJump = done;
        return (
          <button
            key={item.id}
            type="button"
            className={`chapter-dot${current ? " current" : ""}${done ? " done" : ""}`}
            aria-label={item.label}
            aria-current={current ? "step" : undefined}
            title={item.label}
            disabled={!canJump && !current}
            onClick={() => {
              if (canJump) onBackTo(item.id);
            }}
          />
        );
      })}
    </nav>
  );
}
