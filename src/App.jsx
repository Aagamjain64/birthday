import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import AnimatedBackground from "./components/AnimatedBackground.jsx";
import BalloonGame from "./components/BalloonGame.jsx";
import CakeExperience from "./components/CakeExperience.jsx";
import ChapterProgress from "./components/ChapterProgress.jsx";
import ClosingScreen from "./components/ClosingScreen.jsx";
import CountdownScreen from "./components/CountdownScreen.jsx";
import CustomCursor from "./components/CustomCursor.jsx";
import FinalSurprise from "./components/FinalSurprise.jsx";
import HeartToHeart from "./components/HeartToHeart.jsx";
import HiddenStars from "./components/HiddenStars.jsx";
import MemoryGallery from "./components/MemoryGallery.jsx";
import MusicPlayer from "./components/MusicPlayer.jsx";
import PinLockScreen from "./components/PinLockScreen.jsx";
import SorryLetter from "./components/SorryLetter.jsx";
import VideoMessage from "./components/VideoMessage.jsx";
import { birthdayConfig, CHAPTER_FLOW, LOCKED_CHAPTERS } from "./data/birthdayConfig.js";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion.js";

const UNLOCK_KEY = "bhoomi-universe-unlocked";

export default function App() {
  const reduced = usePrefersReducedMotion();
  const [chapter, setChapter] = useState("countdown");
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(UNLOCK_KEY) === "1");
  const [visited, setVisited] = useState(["countdown"]);
  const [musicOn, setMusicOn] = useState(birthdayConfig.sounds.musicEnabledByDefault);
  const [sfxOn, setSfxOn] = useState(birthdayConfig.sounds.enabledByDefault);
  const [volume, setVolume] = useState(0.35);
  const [journeyKey, setJourneyKey] = useState(0);
  const [constellation, setConstellation] = useState(false);

  const go = useCallback(
    (next) => {
      if (LOCKED_CHAPTERS.includes(next) && !unlocked) {
        setChapter("pin");
        setVisited((v) => (v.includes("pin") ? v : [...v, "pin"]));
        return;
      }
      setChapter(next);
      setVisited((v) => (v.includes(next) ? v : [...v, next]));
    },
    [unlocked],
  );

  const unlock = () => {
    setUnlocked(true);
    sessionStorage.setItem(UNLOCK_KEY, "1");
    setChapter("cake");
    setVisited((v) => (v.includes("cake") ? v : [...v, "cake"]));
  };

  const index = CHAPTER_FLOW.indexOf(chapter);
  const previous = useMemo(() => {
    if (index <= 0) return null;
    let prev = CHAPTER_FLOW[index - 1];
    if (prev === "pin" && unlocked) prev = "countdown";
    return prev;
  }, [index, unlocked]);

  const replay = () => {
    setMusicOn(false);
    setConstellation(false);
    if (birthdayConfig.replay.resetPin) {
      setUnlocked(false);
      sessionStorage.removeItem(UNLOCK_KEY);
    }
    setVisited(["countdown"]);
    setChapter("countdown");
    setJourneyKey((k) => k + 1);
  };

  const enterFromCountdown = useCallback(() => go(unlocked ? "cake" : "pin"), [go, unlocked]);

  return (
    <div className="app-shell" key={journeyKey}>
      <AnimatedBackground chapter={chapter} constellation={constellation} />
      <CustomCursor />
      {["countdown", "pin", "surprise", "closing"].includes(chapter) ? <HiddenStars /> : null}
      {previous ? (
        <button type="button" className="ghost-btn back-btn" onClick={() => go(previous)} aria-label="Go back">
          <ChevronLeft size={18} />
        </button>
      ) : null}
      <ChapterProgress chapter={chapter} visited={visited} onBackTo={go} />
      <AnimatePresence mode="wait">
        <motion.div
          key={chapter}
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.45 }}
        >
          {chapter === "countdown" && <CountdownScreen onEnter={enterFromCountdown} />}
          {chapter === "pin" && <PinLockScreen onUnlock={unlock} sfxOn={sfxOn} />}
          {chapter === "cake" && (
            <CakeExperience onContinue={() => go("video")} sfxOn={sfxOn} resetToken={journeyKey} />
          )}
          {chapter === "video" && <VideoMessage onContinue={() => go("balloons")} active={chapter === "video"} />}
          {chapter === "balloons" && (
            <BalloonGame onContinue={() => go("gallery")} sfxOn={sfxOn} resetToken={journeyKey} />
          )}
          {chapter === "gallery" && (
            <MemoryGallery onContinue={() => go("letter")} active={chapter === "gallery"} />
          )}
          {chapter === "letter" && <SorryLetter onContinue={() => go("heart")} sfxOn={sfxOn} />}
          {chapter === "heart" && <HeartToHeart onContinue={() => go("surprise")} />}
          {chapter === "surprise" && (
            <FinalSurprise
              onContinue={() => go("closing")}
              sfxOn={sfxOn}
              onOpened={() => setConstellation(true)}
            />
          )}
          {chapter === "closing" && <ClosingScreen onReplay={replay} />}
        </motion.div>
      </AnimatePresence>
      <MusicPlayer
        playing={musicOn}
        setPlaying={setMusicOn}
        volume={volume}
        setVolume={setVolume}
        sfxOn={sfxOn}
        setSfxOn={setSfxOn}
      />
    </div>
  );
}
