import { useEffect } from 'react';

// ============================================================
// MOOND — Modale dressing plein écran
// Affiche la fiche dressing d'un personnage
// Fermeture : croix, clic extérieur, touche Échap
// ============================================================

export default function DressingModal({ personnage, onClose }) {
  // Blocage du scroll du body + écoute touche Échap
  useEffect(() => {
    if (!personnage) return;

    document.body.style.overflow = 'hidden';

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [personnage, onClose]);

  if (!personnage) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="dressing-modal" onClick={handleBackdropClick}>
      <button className="dressing-close" onClick={onClose} aria-label="Fermer">
        ✕
      </button>
      <div className="dressing-content">
        <img src={personnage.dressing} alt={`Dressing de ${personnage.name}`} />
      </div>

      <style>{`
        .dressing-modal {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(10, 8, 7, 0.92);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 60px 24px 60px;
          overflow-y: auto;
          animation: modal-fade-in 0.4s ease;
        }

        @keyframes modal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .dressing-content {
          max-width: 700px;
          width: 100%;
          position: relative;
          animation: modal-rise 0.5s ease 0.1s both;
        }
        @keyframes modal-rise {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dressing-content img {
          width: 100%;
          height: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
        }

        .dressing-close {
          position: fixed;
          top: 24px;
          right: 24px;
          z-index: 210;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(212, 80, 10, 0.95);
          color: var(--cream);
          font-size: 18px;
          font-family: 'Cinzel', serif;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, background 0.3s ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        }
        .dressing-close:hover {
          transform: scale(1.08) rotate(90deg);
          background: var(--terracotta);
        }

        @media (max-width: 700px) {
          .dressing-modal { padding: 56px 12px 40px; }
          .dressing-close { top: 16px; right: 16px; width: 40px; height: 40px; }
        }
      `}</style>
    </div>
  );
}
