import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import PersonnageCard from '../components/PersonnageCard.jsx';
import DressingModal from '../components/DressingModal.jsx';
import { PERSONNAGES } from '../data/personnages.js';
import { RUSTINES } from '../data/rustines.js';

// ============================================================
// MOOND — Page Famille
// Hero + 4 onglets : VÊTEMENTS / PERSONNAGES / RUSTINES / QUOTIDIEN
// ============================================================

export default function Famille() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('vetements');
  const [openDressingSlug, setOpenDressingSlug] = useState(null);

  const openDressing = (slug) => setOpenDressingSlug(slug);
  const closeDressing = () => setOpenDressingSlug(null);

  const dressingPersonnage = openDressingSlug
    ? PERSONNAGES.find(p => p.slug === openDressingSlug)
    : null;

  return (
    <>
      <Header />

      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-content-block">
          <div className="breadcrumb">
            <span onClick={() => navigate('/')} style={{cursor:'pointer'}}>ACCUEIL</span>
            <span className="sep">/</span>
            <span className="current">LA FAMILLE</span>
          </div>
          <h1 className="hero-title">LA FAMILLE.</h1>
          <p className="hero-tagline">
            Vêtements, personnages<br />et quotidien imparfait.
          </p>
          <p className="hero-text">
            Nous sommes une famille mouvante.<br />
            On crée, on recycle, on répare.<br />
            Rien n'est parfait, tout est vivant.
          </p>
        </div>
        <div className="hero-image-block">
          <img className="hero-image" src="/images/famille-hero.jpg" alt="La famille MOOND" />
        </div>
      </section>

      {/* ============ ONGLETS ============ */}
      <section className="tabs-section">
        <div className="tabs">
          <div className={`tab ${activeTab === 'vetements' ? 'active' : ''}`} onClick={() => setActiveTab('vetements')}>
            <div className="tab-icon">
              <svg viewBox="0 0 24 24"><path d="M3 7l4-3h2c0 1.5 1.5 2 3 2s3-0.5 3-2h2l4 3v4l-3-1v10H6V10l-3 1V7z" /></svg>
            </div>
            VÊTEMENTS
          </div>
          <div className={`tab ${activeTab === 'personnages' ? 'active' : ''}`} onClick={() => setActiveTab('personnages')}>
            <div className="tab-icon">
              <svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" /><circle cx="16" cy="9" r="2" /><path d="M3 20v-2c0-2 2-4 6-4s6 2 6 4v2" /><path d="M14 20v-1c0-1.5 1.5-3 4-3s3 1 3 2v2" /></svg>
            </div>
            PERSONNAGES
          </div>
          <div className={`tab ${activeTab === 'rustines' ? 'active' : ''}`} onClick={() => setActiveTab('rustines')}>
            <div className="tab-icon">
              <svg viewBox="0 0 24 24"><path d="M14.7 6.3l3 3-9.5 9.5L4 20l1.2-4.2 9.5-9.5z" /><path d="M14 7l3 3" /></svg>
            </div>
            RUSTINES
          </div>
          <div className={`tab ${activeTab === 'quotidien' ? 'active' : ''}`} onClick={() => setActiveTab('quotidien')}>
            <div className="tab-icon">
              <svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="1" /><circle cx="12" cy="13" r="3.5" /><path d="M8 6l2-3h4l2 3" /></svg>
            </div>
            QUOTIDIEN
          </div>
        </div>
      </section>

      {/* ============ CONTENU DES ONGLETS ============ */}
      <div className="tab-content">

        {/* === VÊTEMENTS === */}
        {activeTab === 'vetements' && (
          <div className="products-grid">
            <div className="product-card">
              <div className="product-image vetements-1"></div>
              <div className="product-category">Nouvelle Collection</div>
              <div className="product-name"><em>Automne / Hiver 24</em></div>
              <span className="product-arrow">→</span>
            </div>
            <div className="product-card">
              <div className="product-image vetements-2"></div>
              <div className="product-category">Pièces Uniques</div>
              <div className="product-name"><em>Imparfaites et réelles</em></div>
              <span className="product-arrow">→</span>
            </div>
            <div className="product-card">
              <div className="product-image vetements-3"></div>
              <div className="product-category">Rustines</div>
              <div className="product-name"><em>Chaque trace raconte</em></div>
              <span className="product-arrow">→</span>
            </div>
            <div className="product-card">
              <div className="product-image vetements-4"></div>
              <div className="product-category">Derrière les portes</div>
              <div className="product-name"><em>Le quotidien de la famille</em></div>
              <span className="product-arrow">→</span>
            </div>
          </div>
        )}

        {/* === PERSONNAGES === */}
        {activeTab === 'personnages' && (
          <>
            <div className="personnages-intro">
              <h3><em>Six membres. Six voix.</em></h3>
              <p>Chacun porte ses pièces. Chacun a son histoire. Cliquez pour entrer dans son univers.</p>
            </div>
            <div className="personnages-grid">
              {PERSONNAGES.map(p => (
                <PersonnageCard key={p.slug} personnage={p} onOpenDressing={openDressing} />
              ))}
            </div>
          </>
        )}

        {/* === RUSTINES === */}
        {activeTab === 'rustines' && (
          <>
            <div className="rustines-intro">
              <h3><em>Le vêtement qui parle pour toi.</em></h3>
              <p>17 rustines en velcro. Trois familles. Aucun mot n'est innocent.<br />
                Posez. Retirez. Composez. Recommencez.</p>
            </div>

            {Object.entries(RUSTINES).map(([key, family]) => (
              <div key={key} className="rustines-section">
                <div className={`rustines-section-title ${key}`}>{family.title}</div>
                <div className="rustines-row">
                  {family.items.map(r => (
                    <div key={r.slug} className="rustine-img">
                      <img src={r.img} alt={r.label} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* === QUOTIDIEN === */}
        {activeTab === 'quotidien' && (
          <div className="quotidien-grid">
            <div className="quotidien-feature">
              <div className="tag">À LA UNE</div>
              <h4><em>Le jour où Léo a refusé de mettre les chaussettes assorties.</em></h4>
              <p>Il avait 4 ans. C'était un mardi. Et on a compris qu'il avait raison.</p>
              <span className="read">LIRE LE JOURNAL →</span>
            </div>
            <div className="quotidien-side">
              <div className="quotidien-item">
                <div className="date">JOURNAL · MAI 2026</div>
                <h5><em>L'atelier ouvre ses portes une fois par mois.</em></h5>
              </div>
              <div className="quotidien-item">
                <div className="date">JOURNAL · AVRIL 2026</div>
                <h5><em>Une pièce raccommodée, ce n'est pas une pièce abîmée.</em></h5>
              </div>
              <div className="quotidien-item">
                <div className="date">JOURNAL · MARS 2026</div>
                <h5><em>Pourquoi le 18 mars 2027 ?</em></h5>
              </div>
              <div className="quotidien-item">
                <div className="date">JOURNAL · FÉVRIER 2026</div>
                <h5><em>Mamie a dit : "Ne jette pas, donne-le moi."</em></h5>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============ CITATION ============ */}
      <section className="citation">
        <div className="citation-box">
          <div className="citation-image"></div>
          <div>
            <p className="citation-text"><em>On ne cherche pas la perfection.<br />On cherche ce qui reste vrai.</em></p>
            <p className="citation-author"><em>— L'équipe MOOND</em></p>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="page-footer">
        <button className="back-btn" onClick={() => navigate('/')}>← RETOUR AUX PORTES</button>

        <div className="oo-totem">
          <svg viewBox="0 0 100 100">
            <g stroke="#C9A84C" strokeWidth="0.8" opacity="0.6">
              <line x1="50" y1="10" x2="50" y2="20" />
              <line x1="20" y1="50" x2="30" y2="50" />
              <line x1="50" y1="80" x2="50" y2="90" />
              <line x1="70" y1="50" x2="80" y2="50" />
              <line x1="28" y1="28" x2="35" y2="35" />
              <line x1="72" y1="28" x2="65" y2="35" />
              <line x1="28" y1="72" x2="35" y2="65" />
              <line x1="72" y1="72" x2="65" y2="65" />
            </g>
            <circle cx="40" cy="50" r="11" fill="none" stroke="#D4500A" strokeWidth="1.5" />
            <circle cx="60" cy="50" r="11" fill="none" stroke="#C9A84C" strokeWidth="1.5" />
          </svg>
        </div>

        <div style={{ width: 48 }} />
      </footer>

      {/* ============ MODALE DRESSING ============ */}
      <DressingModal personnage={dressingPersonnage} onClose={closeDressing} />

      <style>{styles}</style>
    </>
  );
}

const styles = `
/* ============ HERO ============ */
.hero {
  padding: 130px 40px 60px;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 60px;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.breadcrumb {
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 0.3em;
  margin-bottom: 32px;
  color: var(--gray);
}
.breadcrumb .current { color: var(--terracotta); }
.breadcrumb .sep { margin: 0 10px; opacity: 0.4; }

.hero-title {
  font-family: 'Cinzel', serif;
  font-weight: 500;
  font-size: clamp(40px, 5vw, 64px);
  letter-spacing: 0.06em;
  color: var(--terracotta);
  margin-bottom: 24px;
  line-height: 1;
}

.hero-tagline {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(20px, 2.2vw, 28px);
  line-height: 1.3;
  color: var(--cream);
  margin-bottom: 38px;
}

.hero-text {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: clamp(15px, 1.4vw, 17px);
  line-height: 1.8;
  color: var(--gray);
}

.hero-image {
  width: 100%;
  height: auto;
  border-radius: 2px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

/* ============ ONGLETS ============ */
.tabs-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 40px 0;
}

.tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid rgba(245, 237, 214, 0.1);
}

.tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px 0;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  font-family: 'Cinzel', serif;
  font-size: 12px;
  letter-spacing: 0.25em;
  color: var(--gray);
}
.tab:hover { color: var(--cream); }
.tab.active {
  color: var(--cream);
  border-bottom-color: var(--terracotta);
}

.tab-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tab-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.5;
}

.tab-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px;
  animation: fade-in-tab 0.6s ease;
}
@keyframes fade-in-tab {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* === VÊTEMENTS === */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.product-card {
  cursor: pointer;
  transition: transform 0.4s ease;
}
.product-card:hover { transform: translateY(-6px); }

.product-image {
  width: 100%;
  aspect-ratio: 3/4;
  background-color: rgba(245, 237, 214, 0.04);
  margin-bottom: 18px;
  border-radius: 2px;
  background-size: cover;
  background-position: center;
}
.vetements-1 { background: linear-gradient(135deg, #2a2522, #1a1612); }
.vetements-2 { background: linear-gradient(135deg, #c46a2a, #8a3e15); }
.vetements-3 { background: linear-gradient(135deg, #5a4530, #3a2a1c); }
.vetements-4 { background: linear-gradient(135deg, #3a3530, #1f1c18); }

.product-category {
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--cream);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.product-name {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 17px;
  color: var(--terracotta);
  margin-bottom: 14px;
}
.product-arrow {
  color: var(--terracotta);
  font-family: 'Cinzel', serif;
  font-size: 18px;
  transition: transform 0.3s ease;
  display: inline-block;
}
.product-card:hover .product-arrow { transform: translateX(6px); }

/* === PERSONNAGES === */
.personnages-intro {
  text-align: center;
  margin-bottom: 60px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.personnages-intro h3 {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(24px, 3vw, 32px);
  color: var(--cream);
  margin-bottom: 14px;
}
.personnages-intro p {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 300;
  font-size: 16px;
  color: var(--gray);
  line-height: 1.7;
}

.personnages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

/* === RUSTINES === */
.rustines-intro {
  text-align: center;
  margin-bottom: 50px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}
.rustines-intro h3 {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(24px, 3vw, 32px);
  color: var(--cream);
  margin-bottom: 14px;
}
.rustines-intro p {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 300;
  font-size: 16px;
  color: var(--gray);
  line-height: 1.7;
}

.rustines-section { margin-bottom: 50px; }
.rustines-section-title {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  letter-spacing: 0.35em;
  color: var(--gray);
  margin-bottom: 22px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(245, 237, 214, 0.08);
}
.rustines-section-title.etats { color: var(--cream); }
.rustines-section-title.reponses { color: var(--cream); }
.rustines-section-title.diagnostics { color: var(--terracotta); }

.rustines-row {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
  padding: 14px 0;
}

.rustine-img {
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
  position: relative;
}
.rustine-img img {
  height: 76px;
  width: auto;
  user-select: none;
  -webkit-user-drag: none;
}
.rustine-img:nth-child(odd) { transform: rotate(-1deg); }
.rustine-img:nth-child(even) { transform: rotate(0.8deg); }
.rustine-img:nth-child(3n) { transform: rotate(-1.5deg); }
.rustine-img:nth-child(4n) { transform: rotate(1.2deg); }
.rustine-img:hover {
  transform: translateY(-6px) rotate(-2deg) scale(1.05);
  filter: drop-shadow(0 10px 18px rgba(0,0,0,0.55));
  z-index: 5;
}

/* === QUOTIDIEN === */
.quotidien-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 40px;
  margin-bottom: 50px;
}

.quotidien-feature {
  background: rgba(10, 8, 7, 0.4);
  padding: 40px;
  border-left: 2px solid var(--terracotta);
}
.quotidien-feature .tag {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.3em;
  color: var(--gold);
  text-transform: uppercase;
  margin-bottom: 16px;
}
.quotidien-feature h4 {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 400;
  font-size: 28px;
  line-height: 1.3;
  color: var(--cream);
  margin-bottom: 18px;
}
.quotidien-feature p {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: 16px;
  line-height: 1.7;
  color: var(--gray);
  margin-bottom: 24px;
}
.quotidien-feature .read {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  letter-spacing: 0.3em;
  color: var(--terracotta);
  cursor: pointer;
}

.quotidien-side {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.quotidien-item {
  padding: 22px 0;
  border-bottom: 1px solid rgba(245, 237, 214, 0.08);
  cursor: pointer;
  transition: padding 0.3s ease;
}
.quotidien-item:hover { padding-left: 8px; }
.quotidien-item .date {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--gold);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.quotidien-item h5 {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 400;
  font-size: 18px;
  color: var(--cream);
  line-height: 1.4;
}

/* === CITATION === */
.citation {
  max-width: 1400px;
  margin: 60px auto;
  padding: 40px;
}
.citation-box {
  border: 1px solid rgba(245, 237, 214, 0.12);
  padding: 40px;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 40px;
  align-items: center;
  background: rgba(10, 8, 7, 0.3);
}
.citation-image {
  aspect-ratio: 4/3;
  background: linear-gradient(135deg, rgba(212, 80, 10, 0.15), rgba(17, 14, 10, 0.9));
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}
.citation-image::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(201, 168, 76, 0.3) 0%, transparent 60%);
}
.citation-image::after {
  content: '⚙';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 60px;
  color: rgba(245, 237, 214, 0.2);
}
.citation-text {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(20px, 2.4vw, 30px);
  line-height: 1.4;
  color: var(--cream);
  margin-bottom: 22px;
}
.citation-author {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 300;
  font-size: 14px;
  color: var(--gray);
}

/* === FOOTER === */
.page-footer {
  max-width: 1400px;
  margin: 0 auto;
  padding: 50px 40px 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.back-btn {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  letter-spacing: 0.3em;
  color: var(--terracotta);
  background: transparent;
  border: 1px solid var(--terracotta);
  padding: 16px 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.back-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--terracotta);
  transform: translateX(-101%);
  transition: transform 0.4s ease;
  z-index: -1;
}
.back-btn:hover::before { transform: translateX(0); }
.back-btn:hover { color: var(--cream); }

.oo-totem { display: flex; align-items: center; justify-content: center; }
.oo-totem svg { width: 70px; height: 70px; }

/* === MOBILE === */
@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 110px 24px 40px;
    gap: 40px;
  }
  .hero-content-block { order: 2; }
  .hero-image-block { order: 1; }
  .tabs-section { padding: 30px 24px 0; }
  .tab-content { padding: 40px 24px; }
  .citation { padding: 40px 24px; }
  .citation-box { grid-template-columns: 1fr; padding: 24px; }
  .citation-image { aspect-ratio: 16/9; }
  .quotidien-grid { grid-template-columns: 1fr; }
  .page-footer { padding: 40px 24px 60px; flex-direction: column; gap: 30px; }
}

@media (max-width: 700px) {
  .tabs { grid-template-columns: repeat(2, 1fr); }
  .tab { font-size: 10px; padding: 16px 8px; }
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .personnages-grid { grid-template-columns: 1fr; gap: 20px; }
  .rustines-row { gap: 12px; }
  .rustine-img img { height: 60px; }
}
`;
