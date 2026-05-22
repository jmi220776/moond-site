import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// ============================================================
// MOOND — Header global
// Logo (gauche, à côté du bouton son) + Hamburger (droite)
// Bouton son qui contrôle vhs-lullaby
// ============================================================

export default function Header() {
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef(null);

  // Audio en boucle vhs-lullaby
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (soundOn) {
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  }, [soundOn]);

  const toggleSound = () => setSoundOn(prev => !prev);

  return (
    <>
      <audio ref={audioRef} src="/vhs-lullaby.mp3" loop preload="auto" />

      {/* Bouton son — haut à gauche */}
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

      {/* Logo MOOND — haut à gauche, à côté du bouton son */}
      <Link to="/" className="logo-corner">
        M<span className="o-accent">O</span>OND
      </Link>

      {/* Hamburger — haut à droite (inactif pour l'instant) */}
      <div className="menu-trigger">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <style>{`
        .sound-btn {
          position: fixed;
          top: 24px;
          left: 24px;
          z-index: 101;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(212, 80, 10, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
          box-shadow: 0 4px 16px rgba(212, 80, 10, 0.25);
        }
        .sound-btn:hover { transform: scale(1.08); }
        .sound-btn svg { width: 18px; height: 18px; fill: var(--cream); }

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
          transition: color 0.3s ease;
        }
        .logo-corner:hover { color: var(--terracotta); }
        .logo-corner .o-accent { color: var(--terracotta); }

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
        }
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

        @media (max-width: 640px) {
          .sound-btn { top: 18px; left: 18px; width: 34px; height: 34px; }
          .sound-btn svg { width: 16px; height: 16px; }
          .menu-trigger { top: 20px; right: 20px; }
          .logo-corner { top: 22px; left: 64px; font-size: 17px; }
        }
      `}</style>
    </>
  );
}
