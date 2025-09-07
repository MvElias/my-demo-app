import { useEffect, useRef, useState, useMemo, useCallback, type JSX } from "react";
import mainMusic from "./assets/media/audio/there-is-no-need-to-be-upset.mp3";
import pauseMusic from "./assets/media/audio/staring.mp3";
import introClip from "./assets/media/cuteseal.webm";   // sólo al reanudar
import clipA from "./assets/media/foquita.webm";

import "./styles/app.scss";

export default function App(): JSX.Element {
  // Refs
  const audioMainRef  = useRef<HTMLAudioElement | null>(null);
  const audioPauseRef = useRef<HTMLAudioElement | null>(null);
  const videoRef      = useRef<HTMLVideoElement | null>(null);
  const avatarRef     = useRef<HTMLDivElement | null>(null);
  const confettiRef   = useRef<HTMLDivElement | null>(null);

  // Carrusel (sin el intro)
  const carousel = useMemo(() => [clipA /*, más clips aquí */], []);

  // Estado
  const [isPlaying, setIsPlaying]                 = useState(false);   // música principal
  const [showPlayingBg, setShowPlayingBg]         = useState(true);    // fondo “playing” visual inicial
  const [playIntroOnResume, setPlayIntroOnResume] = useState(false);
  const [isIntroActive, setIsIntroActive]         = useState(false);
  const [idx, setIdx]                             = useState(0);
  const [currentSrc, setCurrentSrc]               = useState<string>(carousel[0]);

  const nextIdx = useCallback((i: number) => (i + 1) % carousel.length, [carousel.length]);

  // Init (sin autoplay)
  useEffect(() => {
    const aMain  = audioMainRef.current;
    const aPause = audioPauseRef.current;
    const v      = videoRef.current;

    if (aMain)  { aMain.preload = "metadata"; aMain.loop = true; }
    if (aPause) { aPause.preload = "metadata"; aPause.loop = true; aPause.volume = 1; }
    if (v)      { v.playsInline = true; v.preload = "metadata"; v.muted = true; v.loop = false; }

    setIsPlaying(false);
    setPlayIntroOnResume(false);
    setIsIntroActive(false);
    setIdx(0);
    setCurrentSrc(carousel[0]);
  }, [carousel]);

  // Si está sonando y NO es el intro, mantener el video corriendo en loop
  useEffect(() => {
    const v = videoRef.current;
    if (isPlaying && v && !isIntroActive) {
      v.loop = true;
      v.play().catch(() => {});
    }
  }, [currentSrc, isPlaying, isIntroActive]);

  // Helpers
  const playNextCarouselClip = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    setIsIntroActive(false);
    setCurrentSrc(carousel[idx]);
    setIdx(nextIdx(idx));
    v.loop = true;
    await v.play().catch(() => {});
  }, [carousel, idx, nextIdx]);

  const launchConfetti = useCallback((x: number, y: number, pieces = 48) => {
    const layer = confettiRef.current;
    if (!layer) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < pieces; i++) {
      const s = document.createElement("i");
      s.className = "confetti";
      s.style.setProperty("--x", `${x}px`);
      s.style.setProperty("--y", `${y}px`);
      s.style.setProperty("--dx", `${(Math.random() - 0.5) * 320}px`);
      s.style.setProperty("--dy", `${-(Math.random() * 420 + 120)}px`);
      s.style.setProperty("--h",  `${Math.floor(Math.random() * 360)}`);
      s.style.setProperty("--r",  `${Math.random() * 0.8 + 0.6}`);
      s.addEventListener("animationend", () => s.remove(), { once: true });
      frag.appendChild(s);
    }
    layer.appendChild(frag);
  }, []);

  // Handlers
  const onAvatarClick = useCallback(async (e: React.MouseEvent) => {
    launchConfetti(e.clientX, e.clientY);
    const aMain  = audioMainRef.current;
    const aPause = audioPauseRef.current;
    const v      = videoRef.current;
    if (!aMain || !v) return;

    // primer click: fondo ya no está “playing” por defecto
    setShowPlayingBg(false);

    try {
      if (!isPlaying) {
        if (aPause && !aPause.paused) aPause.pause();     // pausar música de pausa (sin reset)
        await aMain.play();
        setIsPlaying(true);

        if (playIntroOnResume) {
          setIsIntroActive(true);
          setCurrentSrc(introClip);
          v.loop = false;
          v.currentTime = 0;
          await v.play().catch(() => {});
          const onEnded = () => {
            v.removeEventListener("ended", onEnded);
            void playNextCarouselClip();
          };
          v.addEventListener("ended", onEnded, { once: true });
          setPlayIntroOnResume(false);
        } else {
          await playNextCarouselClip();
        }
      } else {
        await playNextCarouselClip(); // ya suena: solo avanzar clip
      }
    } catch (err) {
      console.error(err);
    }
  }, [isPlaying, playIntroOnResume, launchConfetti, playNextCarouselClip]);

  const onMainClick = useCallback((e: React.MouseEvent) => {
    const avatar = avatarRef.current;
    if (avatar && avatar.contains(e.target as Node)) return; // click dentro del avatar → ignorar

    const aMain  = audioMainRef.current;
    const aPause = audioPauseRef.current;
    const v      = videoRef.current;

    const alreadyPausedOnIntro = !isPlaying && currentSrc === introClip;

    aMain?.pause();
    v?.pause();

    setIsPlaying(false);
    setPlayIntroOnResume(true);
    setIsIntroActive(false);
    setCurrentSrc(introClip);
    setShowPlayingBg(false); // fondo de pausa

    if (aPause && !alreadyPausedOnIntro && aPause.paused) {
      aPause.play().catch(() => {});
    }
  }, [isPlaying, currentSrc]);

  const onAvatarKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      onAvatarClick({
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      } as unknown as React.MouseEvent);
    }
  }, [onAvatarClick]);

  // Layout
  const AVATAR = 160;

  return (
    <main
      className={`main ${isPlaying || showPlayingBg ? "playing" : ""}`}
      style={{ ["--avatar" as any]: `${AVATAR}px` }}
      onClick={onMainClick}
    >
      <div ref={confettiRef} className="confettiLayer" aria-hidden />

      <div
        ref={avatarRef}
        className="avatarWrap"
        onClick={onAvatarClick}
        onKeyDown={onAvatarKeyDown}
        role="button"
        tabIndex={0}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Cambiar al siguiente clip" : "Reproducir"}
      >
        <div className="avatarClip">
          <video
            key={currentSrc}
            ref={videoRef}
            className="avatarImg"
            src={currentSrc}
            playsInline
            muted
            loop={!isIntroActive}     // intro no loopea; carrusel sí
            preload="metadata"
          />
        </div>
      </div>

      <audio ref={audioMainRef}  src={mainMusic}  loop preload="metadata" />
      <audio ref={audioPauseRef} src={pauseMusic} loop preload="metadata" />
    </main>
  );
}
