// ============================================================
// MOOND — Carte d'un personnage de la famille
// Portrait circulaire + rustine signature + bouton "SON DRESSING"
// ============================================================

export default function PersonnageCard({ personnage, onOpenDressing }) {
  return (
    <div className="personnage-card">
      <div className="personnage-header">
        <div className="personnage-portrait">
          <img src={personnage.portrait} alt={personnage.name} loading="lazy" />
        </div>
        <div className="personnage-rustine-display">
          <img src={personnage.rustine.img || `/images/rustines/${personnage.rustine.slug}.jpg`}
               alt={personnage.rustine.label}
               loading="lazy" />
        </div>
      </div>

      <div className="personnage-info">
        <div className="personnage-name">{personnage.name}</div>
        {personnage.age && <div className="personnage-age">{personnage.age}</div>}
        <p className="personnage-desc"><em>{personnage.descriptif}</em></p>
      </div>

      <button className="personnage-cta" onClick={() => onOpenDressing(personnage.slug)}>
        SON DRESSING <span className="arrow">→</span>
      </button>

      <style>{`
        .personnage-card {
          background: rgba(10, 8, 7, 0.5);
          border: 1px solid rgba(245, 237, 214, 0.08);
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
        }
        .personnage-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at top, rgba(212, 80, 10, 0.05) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .personnage-card:hover {
          border-color: rgba(212, 80, 10, 0.5);
          transform: translateY(-4px);
        }
        .personnage-card:hover::before { opacity: 1; }

        .personnage-header {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 22px;
          position: relative;
          z-index: 2;
        }

        .personnage-portrait {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--terracotta);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
          transition: all 0.4s ease;
          flex-shrink: 0;
        }
        .personnage-portrait img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(15%) contrast(1.05);
          transition: filter 0.4s ease;
        }
        .personnage-card:hover .personnage-portrait {
          transform: scale(1.04);
          box-shadow: 0 10px 26px rgba(212, 80, 10, 0.3);
        }
        .personnage-card:hover .personnage-portrait img {
          filter: grayscale(0%) contrast(1.1);
        }

        .personnage-rustine-display {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          transform: rotate(-2deg);
          transition: transform 0.4s ease;
        }
        .personnage-rustine-display img {
          max-width: 100%;
          max-height: 72px;
          width: auto;
          height: auto;
          filter: drop-shadow(0 3px 6px rgba(0,0,0,0.4));
        }
        .personnage-card:hover .personnage-rustine-display {
          transform: rotate(-3deg) translateY(-2px);
        }

        .personnage-info {
          flex: 1;
          position: relative;
          z-index: 2;
          margin-bottom: 20px;
        }
        .personnage-name {
          font-family: 'Cinzel', serif;
          font-weight: 500;
          font-size: 19px;
          letter-spacing: 0.15em;
          color: var(--cream);
          margin-bottom: 4px;
        }
        .personnage-age {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.25em;
          color: var(--gold);
          margin-bottom: 14px;
          text-transform: uppercase;
        }
        .personnage-desc {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 15px;
          line-height: 1.5;
          color: rgba(245, 237, 214, 0.78);
        }

        .personnage-cta {
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          color: var(--terracotta);
          background: transparent;
          border: 1px solid var(--terracotta);
          padding: 14px 24px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }
        .personnage-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--terracotta);
          transform: translateX(-101%);
          transition: transform 0.4s ease;
          z-index: -1;
        }
        .personnage-cta:hover::before { transform: translateX(0); }
        .personnage-cta:hover { color: var(--cream); }
        .personnage-cta .arrow { transition: transform 0.3s ease; }
        .personnage-cta:hover .arrow { transform: translateX(4px); }
      `}</style>
    </div>
  );
}
