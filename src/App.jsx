import { useEffect, useRef, useState } from 'react';

// ============================================================
// MOOND — Parcours d'entrée (v2)
// 1. Vidéo intro (11s) → 2. Landing MOOND → 3. Trois portes
// Un seul bouton son en haut à gauche, contrôle vidéo PUIS musique
// ============================================================

export default function App() {
  const [step, setStep] = useState('video');
  const [videoStarted, setVideoStarted] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // ========== AUTOPLAY VIDÉO ==========
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const tryPlay = () => {
      const p = v.play();
      if (p !== undefined) {
        p.then(() => {
          setVideoStarted(true);
          setTimeout(() => setShowSkip(true), 2000);
        }).catch(() => {
          setShowStart(true);
        });
      }
    };

    if (v.readyState >= 2) {
      tryPlay();
    } else {
      v.addEventListener('loadeddata', tryPlay, { once: true });
      const fallback = setTimeout(() => {
        if (v.paused) tryPlay();
      }, 1500);
      return () => clearTimeout(fallback);
    }
  }, []);

  const goToLanding = () => setStep('landing');
  const goToPortes = () => {
    setStep('portes');
    window.scrollTo(0, 0);
  };

  const startVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play().then(() => {
      setVideoStarted(true);
      setShowStart(false);
      setTimeout(() => setShowSkip(true), 1000);
    });
  };

  // ========== BOUTON SON UNIFIÉ ==========
  const toggleSound = () => {
    const v = videoRef.current;
    const a = audioRef.current;
    const newState = !soundOn;
    setSoundOn(newState);

    if (step === 'video') {
      if (v) v.muted = !newState;
    } else {
      if (a) {
        if (newState) {
          a.play().catch(() => {});
        } else {
          a.pause();
        }
      }
    }
  };

  // Au passage vidéo → landing, on bascule du son vidéo au son audio
  useEffect(() => {
    const v = videoRef.current;
    const a = audioRef.current;
    if (!v || !a) return;

    if (step !== 'video') {
      v.muted = true;
      if (soundOn) {
        a.play().catch(() => {});
      }
    }
  }, [step]);

  return (
    <>
      <style>{styles}</style>

      <audio ref={audioRef} src="/vhs-lullaby.mp3" loop preload="auto" />

      {/* ============ LOGO ============ */}
      <div className={`logo-corner ${step !== 'video' ? 'visible' : ''}`}>
        M<span className="o-accent">O</span>OND
      </div>

      {/* ============ BOUTON SON — UNIQUE, TOUJOURS HAUT À GAUCHE ============ */}
      <button
        className="sound-btn"
        onClick={toggleSound}
        aria-label={soundOn ? 'Couper le son' : 'Activer le son'}
      >
        <svg viewBox="0 0 24 24">
          {soundOn ? (
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          ) : (
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.17v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          )}
        </svg>
      </button>

      {/* ============ HAMBURGER ============ */}
      <div className={`menu-trigger ${step !== 'video' ? 'visible' : ''}`}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* ============ ÉCRAN 1 — VIDÉO ============ */}
      <div className={`screen-video ${step !== 'video' ? 'fading' : ''}`}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onEnded={goToLanding}
        >
          <source src="/intro.mp4" type="video/mp4" />
        </video>

        {showStart && (
          <button className="start-btn" onClick={startVideo}>
            <span>COMMENCER</span>
            <span className="start-btn-icon">▶</span>
          </button>
        )}

        {showSkip && (
          <button className="skip-btn" onClick={goToLanding}>
            Passer →
          </button>
        )}
      </div>

      {/* ============ ÉCRAN 2 — LANDING ============ */}
      <div className={`screen-landing ${step === 'landing' ? 'visible' : ''} ${step === 'portes' ? 'fading' : ''}`}>
        <div className="landing-halo"></div>

        <h1 className="moond-title">
          M<span className="o1">O</span>
          <span className="o2">O</span>ND
        </h1>

        <p className="landing-subtitle">
          <em>
            certains souvenirs <span className="accent">résistent</span>
          </em>
        </p>

        <button className="enter-btn" onClick={goToPortes}>
          ENTRER
        </button>

        <div className="landing-footer">
          MOOND &nbsp;·&nbsp; ARCHIVE FAMILIALE &nbsp;·&nbsp; 1994
        </div>
      </div>

      {/* ============ ÉCRAN 3 — TROIS PORTES ============ */}
      <div className={`screen-portes ${step === 'portes' ? 'visible' : ''}`}>
        <div className="portes-header">
          <h2 className="portes-title">
            <em>
              Choisissez ce que
              <br />
              vous voulez découvrir.
            </em>
          </h2>
          <p className="portes-subtitle">
            <em>Trois portes. Trois vérités.</em>
          </p>
        </div>

        <div className="portes-container">
          <a href="#famille" className="porte porte-famille" onClick={(e) => e.preventDefault()}>
            <div className="porte-icon">
              <svg viewBox="0 0 64 64" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <circle cx="18" cy="20" r="5" />
                <path d="M10 50 L10 32 Q10 27 18 27 Q26 27 26 32 L26 50" />
                <path d="M27 14 L41 14" />
                <circle cx="34" cy="20" r="6" />
                <path d="M25 52 L25 32 Q25 26 34 26 Q43 26 43 32 L43 52" />
                <circle cx="48" cy="20" r="5" />
                <path d="M40 50 L40 32 Q40 27 48 27 Q56 27 56 32 L56 50" />
              </svg>
            </div>
            <div className="porte-content">
              <div className="porte-title">LA FAMILLE</div>
              <div className="porte-desc">
                <em>
                  Vêtements, personnages
                  <br />
                  et quotidien imparfait.
                </em>
              </div>
            </div>
            <div className="porte-arrow">→</div>
          </a>

          <a href="#fragments" className="porte porte-fragments" onClick={(e) => e.preventDefault()}>
            <div className="porte-icon">
              <svg viewBox="0 0 100 100">
                <text x="8" y="22" className="vhs-icon-text">PLAY ▶</text>
                <text x="8" y="92" className="vhs-icon-text">00:00:17</text>
              </svg>
            </div>
            <div className="porte-content">
              <div className="porte-title">LES FRAGMENTS</div>
              <div className="porte-desc">
                <em>
                  Archives VHS, extraits
                  <br />
                  retrouvés et anomalies.
                </em>
              </div>
            </div>
            <div className="porte-arrow">→</div>
          </a>

          <a href="#manifeste" className="porte porte-manifeste" onClick={(e) => e.preventDefault()}>
            <div className="porte-icon">
              <svg viewBox="0 0 64 64">
                <defs>
                  <radialGradient id="eclipse-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="40%" stopColor="#0A0807" stopOpacity="1" />
                    <stop offset="55%" stopColor="#C9A84C" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#C9A84C" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="32" cy="32" r="28" fill="url(#eclipse-glow)" />
                <circle cx="32" cy="32" r="16" fill="#0A0807" stroke="#C9A84C" strokeWidth="1" opacity="0.9" />
              </svg>
            </div>
            <div className="porte-content">
              <div className="porte-title">LE MANIFESTE</div>
              <div className="porte-desc">
                <em>
                  Nos intentions. Notre vision.
                  <br />
                  Pourquoi MOOND existe.
                </em>
              </div>
            </div>
            <div className="porte-arrow">→</div>
          </a>
        </div>

        <div className="portes-footer">
          <p>
            <em>
              Chaque choix vous mènera plus loin.
              <br />
              Ou ramènera quelque chose à la surface.
            </em>
          </p>
        </div>
      </div>
    </>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Space+Mono:wght@400;700&display=swap');

:root {
  --terracotta: #D4500A;
  --gold: #C9A84C;
  --cream: #F5EDD6;
  --black: #110E0A;
  --black-deep: #0A0807;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html, body, #root {
  background: var(--black);
  color: var(--cream);
  font-family: 'Cormorant Garamond', serif;
  overflow-x: hidden;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.04;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E");
}

/* === LOGO MOOND (haut à gauche, à côté du bouton son) === */
.logo-corner {
  position: fixed;
  top: 28px;
  left: 78px;
  z-index: 100;
  font-family: 'Cinzel', serif;
  font-weight: 500;
  font-size: 22px;
  letter-spacing: 0.15em;
  color: var(--cream);
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}
.logo-corner.visible { opacity: 1; pointer-events: auto; }
.logo-corner .o-accent { color: var(--terracotta); }

/* === BOUTON SON — UNIQUE, TOUJOURS HAUT À GAUCHE === */
.sound-btn {
  position: fixed;
  top: 24px;
  left: 24px;
  z-index: 101;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(212, 80, 10, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.3s ease;
  box-shadow: 0 4px 16px rgba(212, 80, 10, 0.25);
}
.sound-btn:hover { transform: scale(1.08); }
.sound-btn svg { width: 18px; height: 18px; fill: var(--cream); }

/* === HAMBURGER === */
.menu-trigger {
  position: fixed;
  top: 28px;
  right: 28px;
  width: 36px;
  height: 36px;
  z-index: 100;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.6s ease;
  pointer-events: none;
}
.menu-trigger.visible { opacity: 1; pointer-events: auto; }
.menu-trigger span {
  display: block;
  height: 1.5px;
  background: var(--cream);
  transition: all 0.3s ease;
}
.menu-trigger span:nth-child(1) { width: 28px; }
.menu-trigger span:nth-child(2) { width: 22px; }
.menu-trigger span:nth-child(3) { width: 28px; }
.menu-trigger:hover span { background: var(--terracotta); }

/* ====================================================== */
/* SCREEN 1 — VIDÉO                                       */
/* ====================================================== */
.screen-video {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: var(--black-deep);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 1.2s ease;
}
.screen-video.fading {
  opacity: 0;
  pointer-events: none;
}
.screen-video video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}
.screen-video video::-webkit-media-controls,
.screen-video video::-webkit-media-controls-panel,
.screen-video video::-webkit-media-controls-play-button,
.screen-video video::-webkit-media-controls-start-playback-button {
  display: none !important;
  -webkit-appearance: none !important;
}

.start-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 70;
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-family: 'Cinzel', serif;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.4em;
  color: var(--cream);
  background: rgba(10, 8, 7, 0.7);
  border: 1px solid var(--terracotta);
  padding: 22px 50px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  animation: fade-up 0.6s ease forwards;
}
.start-btn:hover {
  background: var(--terracotta);
  letter-spacing: 0.5em;
}
.start-btn-icon { font-size: 10px; color: var(--terracotta); }
.start-btn:hover .start-btn-icon { color: var(--cream); }

.skip-btn {
  position: absolute;
  bottom: 32px;
  right: 32px;
  z-index: 60;
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--cream);
  background: transparent;
  border: 1px solid rgba(245, 237, 214, 0.25);
  padding: 10px 18px;
  cursor: pointer;
  text-transform: uppercase;
  opacity: 0.6;
  animation: fade-in-skip 0.4s ease forwards;
  transition: all 0.3s ease;
}
@keyframes fade-in-skip { from { opacity: 0; } to { opacity: 0.6; } }
.skip-btn:hover {
  opacity: 1;
  border-color: var(--terracotta);
  color: var(--terracotta);
}

/* ====================================================== */
/* SCREEN 2 — LANDING                                     */
/* ====================================================== */
.screen-landing {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: var(--black);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 1.4s ease;
}
.screen-landing.visible { opacity: 1; pointer-events: auto; }
.screen-landing.fading { opacity: 0; pointer-events: none; }

.landing-halo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  max-width: 100vw;
  max-height: 100vw;
  background: radial-gradient(circle, rgba(212, 80, 10, 0.08) 0%, transparent 50%);
  pointer-events: none;
  animation: halo-pulse 8s ease-in-out infinite;
}
@keyframes halo-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.moond-title {
  font-family: 'Cinzel', serif;
  font-weight: 500;
  font-size: clamp(64px, 14vw, 180px);
  letter-spacing: 0.08em;
  color: var(--cream);
  margin-bottom: 32px;
  position: relative;
  z-index: 2;
  text-shadow: 0 0 40px rgba(245, 237, 214, 0.15);
  opacity: 0;
  animation: fade-up 1.6s ease 0.3s forwards;
}
.moond-title .o1 {
  color: var(--terracotta);
  text-shadow: 0 0 30px rgba(212, 80, 10, 0.5);
  animation: o-flicker 4s ease-in-out infinite;
  display: inline-block;
}
.moond-title .o2 {
  color: var(--gold);
  text-shadow: 0 0 25px rgba(201, 168, 76, 0.4);
  animation: o-flicker 4s ease-in-out infinite 0.5s;
  display: inline-block;
}
@keyframes o-flicker {
  0%, 92%, 100% { opacity: 1; }
  93% { opacity: 0.4; }
  94% { opacity: 1; }
  95% { opacity: 0.6; }
  96% { opacity: 1; }
}

.landing-subtitle {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 300;
  font-size: clamp(16px, 2.2vw, 22px);
  color: var(--cream);
  opacity: 0;
  letter-spacing: 0.04em;
  margin-bottom: 56px;
  position: relative;
  z-index: 2;
  animation: fade-up 1.4s ease 1.2s forwards;
}
.landing-subtitle .accent { color: var(--terracotta); }

.enter-btn {
  font-family: 'Cinzel', serif;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0.4em;
  color: var(--cream);
  background: transparent;
  border: 1px solid var(--terracotta);
  padding: 18px 60px;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  z-index: 2;
  opacity: 0;
  animation: fade-up 1.4s ease 1.8s forwards;
  overflow: hidden;
}
.enter-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--terracotta);
  transform: translateX(-101%);
  transition: transform 0.4s ease;
  z-index: -1;
}
.enter-btn:hover::before { transform: translateX(0); }
.enter-btn:hover {
  color: var(--cream);
  letter-spacing: 0.5em;
}

.landing-footer {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--gold);
  opacity: 0;
  text-transform: uppercase;
  white-space: nowrap;
  animation: fade-in 1.4s ease 2.2s forwards;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fade-in { to { opacity: 0.7; } }

/* ====================================================== */
/* SCREEN 3 — TROIS PORTES                                */
/* ====================================================== */
.screen-portes {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: 100px 24px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 1.4s ease;
}
.screen-portes.visible { opacity: 1; pointer-events: auto; }

.portes-header {
  text-align: center;
  margin-bottom: 56px;
  max-width: 600px;
}
.portes-title {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1.2;
  color: var(--cream);
  margin-bottom: 18px;
}
.portes-subtitle {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 300;
  font-size: clamp(16px, 2vw, 20px);
  color: rgba(245, 237, 214, 0.55);
  letter-spacing: 0.02em;
}

.portes-container {
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 100%;
  max-width: 720px;
}

.porte {
  display: grid;
  grid-template-columns: 130px 1fr 50px;
  align-items: center;
  padding: 26px 28px;
  border: 1px solid;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  position: relative;
  transition: all 0.4s ease;
  overflow: hidden;
  background: rgba(10, 8, 7, 0.4);
}
.porte::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}
.porte:hover { transform: translateX(4px); }
.porte:hover::before { opacity: 1; }

.porte-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  border-right: 1px solid;
  padding-right: 20px;
  margin-right: 24px;
}
.porte-icon svg {
  width: 64px;
  height: 64px;
  transition: transform 0.4s ease;
}
.porte:hover .porte-icon svg { transform: scale(1.05); }

.porte-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}
.porte-title {
  font-family: 'Cinzel', serif;
  font-weight: 500;
  font-size: clamp(18px, 2.8vw, 24px);
  letter-spacing: 0.18em;
}
.porte-desc {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 300;
  font-size: clamp(14px, 1.8vw, 17px);
  line-height: 1.4;
  color: rgba(245, 237, 214, 0.7);
}
.porte-arrow {
  font-family: 'Cinzel', serif;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.4s ease;
}
.porte:hover .porte-arrow { transform: translateX(6px); }

.porte-famille { border-color: var(--terracotta); }
.porte-famille .porte-icon { border-right-color: rgba(212, 80, 10, 0.4); }
.porte-famille .porte-icon svg { stroke: var(--terracotta); }
.porte-famille .porte-title { color: var(--terracotta); }
.porte-famille .porte-arrow { color: var(--terracotta); }
.porte-famille::before {
  background: radial-gradient(ellipse at left, rgba(212, 80, 10, 0.08) 0%, transparent 70%);
}

.porte-fragments { border-color: rgba(245, 237, 214, 0.4); }
.porte-fragments .porte-icon {
  border-right-color: rgba(245, 237, 214, 0.2);
  background: linear-gradient(180deg,
    rgba(245, 237, 214, 0.04) 0%,
    rgba(245, 237, 214, 0.08) 50%,
    rgba(245, 237, 214, 0.02) 100%);
  position: relative;
  overflow: hidden;
}
.porte-fragments .porte-icon::before,
.porte-fragments .porte-icon::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(245, 237, 214, 0.15);
  animation: vhs-scan 3s linear infinite;
}
.porte-fragments .porte-icon::after { animation-delay: 1.5s; }
@keyframes vhs-scan {
  0% { top: 0%; opacity: 0; }
  50% { opacity: 0.6; }
  100% { top: 100%; opacity: 0; }
}
.porte-fragments .porte-title { color: var(--cream); }
.porte-fragments .porte-arrow { color: var(--cream); }
.porte-fragments::before {
  background: radial-gradient(ellipse at left, rgba(245, 237, 214, 0.04) 0%, transparent 70%);
}
.vhs-icon-text {
  font-family: 'Space Mono', monospace;
  fill: var(--cream);
  font-size: 9px;
  letter-spacing: 0.15em;
}

.porte-manifeste { border-color: rgba(201, 168, 76, 0.5); }
.porte-manifeste .porte-icon { border-right-color: rgba(201, 168, 76, 0.3); }
.porte-manifeste .porte-title { color: var(--gold); }
.porte-manifeste .porte-arrow { color: var(--gold); }
.porte-manifeste::before {
  background: radial-gradient(ellipse at left, rgba(201, 168, 76, 0.08) 0%, transparent 70%);
}

.portes-footer {
  margin-top: 64px;
  text-align: center;
  max-width: 480px;
  padding: 0 24px;
}
.portes-footer p {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 300;
  font-size: clamp(14px, 1.8vw, 17px);
  color: rgba(245, 237, 214, 0.45);
  line-height: 1.7;
}

/* ====================================================== */
/* MOBILE                                                  */
/* ====================================================== */
@media (max-width: 640px) {
  .porte {
    grid-template-columns: 80px 1fr 30px;
    padding: 20px 18px;
  }
  .porte-icon {
    height: 60px;
    padding-right: 14px;
    margin-right: 14px;
  }
  .porte-icon svg { width: 44px; height: 44px; }

  .sound-btn {
    top: 18px;
    left: 18px;
    width: 34px;
    height: 34px;
  }
  .sound-btn svg { width: 16px; height: 16px; }

  .menu-trigger { top: 20px; right: 20px; }
  .logo-corner { top: 22px; left: 64px; font-size: 17px; }

  .skip-btn { right: 20px; bottom: 20px; }
  .landing-footer { bottom: 24px; font-size: 9px; }
  .screen-portes { padding: 80px 16px 60px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;
