import { useState, useEffect, useRef } from "react";

// ─── PALETTE & DESIGN SYSTEM ───────────────────────────────────────────────
const C = {
  terra: "#D4500A",
  gold: "#C9A84C",
  cream: "#F5EDD6",
  black: "#110E0A",
  brun: "#3A2A1A",
  gris: "#8A7A6A",
  pale: "#EDE5D0",
};

// ─── VISIT SYSTEM ──────────────────────────────────────────────────────────
const getVisitData = () => {
  try {
    const raw = localStorage.getItem("moond_visits");
    if (!raw) return { count: 0, firstSeen: Date.now(), lastSeen: Date.now(), pagesViewed: [] };
    return JSON.parse(raw);
  } catch { return { count: 0, firstSeen: Date.now(), lastSeen: Date.now(), pagesViewed: [] }; }
};

const incrementVisit = () => {
  const d = getVisitData();
  const updated = { ...d, count: d.count + 1, lastSeen: Date.now() };
  try { localStorage.setItem("moond_visits", JSON.stringify(updated)); } catch {}
  return updated;
};

// Phase based on visit count — very slow reveal
// Visits 1-5 : CONFORT (no anomalies)
// Visits 6-15 : MICRO-INCOHÉRENCES (doubt)
// Visits 16-30 : MÉMOIRE IMPARFAITE
// Visits 31-50 : ABSENCE
// Visits 51+ : FRAGMENTATION
const getPhase = (count) => {
  if (count <= 5) return "confort";
  if (count <= 15) return "micro";
  if (count <= 30) return "memoire";
  if (count <= 50) return "absence";
  return "fragmentation";
};

// ─── AGE VARIATIONS (micro-contradiction from visit 6+) ────────────────────
const getLeoAge = (count) => {
  if (count <= 5) return "12 ans";
  if (count <= 10) return "12 ans";
  if (count <= 15) return "13 ans";
  if (count <= 20) return "12 ans";
  return count % 2 === 0 ? "12 ans" : "13 ans";
};

const getVHSYear = (count) => {
  if (count <= 5) return "1994";
  if (count <= 12) return "1994";
  if (count <= 20) return "1993";
  return count % 3 === 0 ? "1995" : "1994";
};

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      background: ${C.black};
      color: ${C.cream};
      font-family: 'Cormorant Garamond', serif;
      font-size: 17px;
      line-height: 1.7;
      cursor: default;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${C.black}; }
    ::-webkit-scrollbar-thumb { background: ${C.terra}; border-radius: 2px; }

    ::selection { background: ${C.terra}20; color: ${C.cream}; }

    .cinzel { font-family: 'Cinzel', serif; }
    .mono { font-family: 'Space Mono', monospace; font-size: 12px; }
    .italic { font-style: italic; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInSlow { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes flicker {
      0%, 97%, 100% { opacity: 1; }
      98% { opacity: 0.7; }
      99% { opacity: 0.9; }
    }
    @keyframes glitch {
      0% { transform: translate(0); }
      20% { transform: translate(-2px, 1px); }
      40% { transform: translate(1px, -1px); }
      60% { transform: translate(-1px, 0); }
      80% { transform: translate(0, 1px); }
      100% { transform: translate(0); }
    }
    @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
    @keyframes breathe { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
    @keyframes ticker {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
    @keyframes drawReveal {
      from { clip-path: inset(0 100% 0 0); }
      to { clip-path: inset(0 0% 0 0); }
    }

    .fade-in { animation: fadeIn 0.8s ease forwards; }
    .fade-in-slow { animation: fadeInSlow 1.2s ease forwards; }

    .noise-bg {
      position: relative;
    }
    .noise-bg::before {
      content: '';
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 9999;
      opacity: 0.4;
    }

    .drawer-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: ${C.black}CC;
      z-index: 900;
      animation: fadeInSlow 0.2s ease;
    }

    .drawer {
      position: fixed;
      top: 0; right: 0;
      width: min(480px, 95vw);
      height: 100vh;
      background: #1A1208;
      border-left: 1px solid ${C.terra}40;
      z-index: 901;
      overflow-y: auto;
      animation: slideInDrawer 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      padding: 48px 36px;
    }

    @keyframes slideInDrawer {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    .hover-terra:hover { color: ${C.terra}; transition: color 0.3s; }
    .hover-gold:hover { color: ${C.gold}; transition: color 0.3s; }

    .vhs-line {
      position: relative;
    }
    .vhs-line::after {
      content: '';
      position: absolute;
      left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, ${C.terra}20, transparent);
      animation: scanline 8s linear infinite;
      pointer-events: none;
    }

    /* ── MOBILE ─────────────────────────────────────────── */
    @media (max-width: 768px) {

      body { font-size: 15px; }

      /* Header */
      .mobile-header-inner {
        padding: 0 16px !important;
        height: 56px !important;
      }
      .mobile-logo { font-size: 18px !important; }
      .mobile-nav { display: none !important; }
      .mobile-nav-open { display: flex !important; }
      .mobile-cart-btn {
        padding: 5px 10px !important;
        font-size: 9px !important;
      }
      .mobile-hamburger { display: flex !important; }

      /* Drawer */
      .drawer {
        width: 100vw !important;
        padding: 56px 20px 32px !important;
      }

      /* Sections */
      .section-pad {
        padding: 48px 16px !important;
      }

      /* Grids → single column */
      .grid-auto {
        grid-template-columns: 1fr !important;
      }

      /* Hero */
      .hero-btns {
        flex-direction: column !important;
        align-items: stretch !important;
      }
      .hero-btns button {
        width: 100% !important;
      }

      /* VHS player */
      .vhs-flex {
        flex-direction: column !important;
      }

      /* Manifeste grid */
      .manifeste-grid {
        grid-template-columns: 1fr !important;
      }

      /* Footer */
      .footer-inner {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 20px !important;
      }
      .footer-right {
        text-align: left !important;
      }
    }

    /* Mobile nav overlay */
    .mobile-nav-overlay {
      display: none;
      position: fixed;
      top: 56px; left: 0; right: 0; bottom: 0;
      background: ${C.black}F8;
      z-index: 99;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 32px;
    }
    .mobile-hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
    }
    .mobile-hamburger span {
      display: block;
      width: 22px; height: 1px;
      background: ${C.cream};
      transition: all 0.3s;
    }
  `}</style>
);

// ─── CART DRAWER ────────────────────────────────────────────────────────────
const CartDrawer = ({ cart, onClose, onRemove }) => {
  const [confirmClear, setConfirmClear] = useState(false);
  const total = cart.reduce((sum, item) => {
    const n = parseFloat((item.price || "0").replace(/[^0-9.,]/g, "").replace(",", "."));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: 20, right: 20,
          background: "none", border: "none",
          color: `${C.cream}60`, cursor: "pointer",
          fontFamily: "Space Mono, monospace", fontSize: 11,
          letterSpacing: "0.2em", transition: "color 0.3s",
        }}
          onMouseEnter={e => e.target.style.color = C.cream}
          onMouseLeave={e => e.target.style.color = `${C.cream}60`}
        >
          FERMER ×
        </button>

        {/* Title */}
        <div style={{
          fontFamily: "Cinzel, serif", fontSize: 20, fontWeight: 600,
          letterSpacing: "0.12em", color: C.cream,
          marginBottom: 4,
        }}>
          MIS DE CÔTÉ
        </div>
        <div style={{
          fontFamily: "Space Mono, monospace", fontSize: 10,
          color: `${C.cream}40`, letterSpacing: "0.2em",
          marginBottom: 32,
        }}>
          ce que vous conservez
        </div>

        {cart.length === 0 ? (
          <div style={{
            paddingTop: 48, textAlign: "center",
            fontStyle: "italic", color: `${C.cream}65`,
            fontSize: 15, lineHeight: 1.8,
          }}>
            Rien encore.<br />
            <span style={{ fontSize: 13 }}>Les fragments attendent d'être choisis.</span>
          </div>
        ) : (
          <>
            {/* Items */}
            <div style={{ marginBottom: 32 }}>
              {cart.map((item, i) => (
                <div key={i} style={{
                  padding: "16px 0",
                  borderBottom: `1px solid ${C.terra}15`,
                  display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", gap: 12,
                  animation: "fadeIn 0.3s ease",
                }}>
                  <div style={{ flex: 1 }}>
                    {/* Rustine badge */}
                    {item.rustine && (
                      <div style={{
                        display: "inline-block",
                        border: `1px solid ${C.terra}50`,
                        padding: "2px 7px",
                        fontFamily: "Space Mono, monospace", fontSize: 8,
                        color: C.terra, letterSpacing: "0.15em",
                        marginBottom: 6,
                      }}>
                        {item.rustine}
                      </div>
                    )}
                    <div style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontSize: 15, color: C.cream,
                      lineHeight: 1.4, marginBottom: 4,
                    }}>
                      {item.name}
                    </div>
                    {item.condition && (
                      <div style={{
                        fontFamily: "Space Mono, monospace", fontSize: 9,
                        color: `${C.cream}40`, letterSpacing: "0.1em",
                      }}>
                        {item.condition}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <span style={{
                      fontFamily: "Cinzel, serif", fontSize: 16,
                      color: C.gold, whiteSpace: "nowrap",
                    }}>
                      {item.price}
                    </span>
                    <button onClick={() => onRemove(i)} style={{
                      background: "none", border: "none",
                      fontFamily: "Space Mono, monospace", fontSize: 9,
                      color: `${C.cream}30`, cursor: "pointer",
                      letterSpacing: "0.1em", transition: "color 0.2s",
                    }}
                      onMouseEnter={e => e.target.style.color = C.terra}
                      onMouseLeave={e => e.target.style.color = `${C.cream}30`}
                    >
                      retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "baseline",
              padding: "16px 0",
              borderTop: `1px solid ${C.terra}30`,
              marginBottom: 28,
            }}>
              <span style={{
                fontFamily: "Space Mono, monospace", fontSize: 11,
                color: `${C.cream}60`, letterSpacing: "0.15em",
              }}>
                TOTAL
              </span>
              <span style={{
                fontFamily: "Cinzel, serif", fontSize: 22,
                color: C.cream,
              }}>
                {total.toFixed(2).replace(".", ",")} €
              </span>
            </div>

            {/* Clear cart */}
            {!confirmClear ? (
              <button onClick={() => setConfirmClear(true)} style={{
                background: "none", border: "none",
                fontFamily: "Space Mono, monospace", fontSize: 9,
                color: `${C.cream}25`, cursor: "pointer",
                letterSpacing: "0.15em", marginBottom: 20,
                transition: "color 0.2s", display: "block",
              }}
                onMouseEnter={e => e.target.style.color = `${C.terra}80`}
                onMouseLeave={e => e.target.style.color = `${C.cream}25`}
              >
                tout retirer
              </button>
            ) : (
              <div style={{
                marginBottom: 20,
                display: "flex", alignItems: "center", gap: 12,
                animation: "fadeIn 0.2s ease",
              }}>
                <span style={{
                  fontFamily: "Space Mono, monospace", fontSize: 9,
                  color: `${C.cream}50`, letterSpacing: "0.1em",
                }}>
                  tout retirer ?
                </span>
                <button onClick={() => { onRemove("all"); setConfirmClear(false); }} style={{
                  background: "none", border: `1px solid ${C.terra}60`,
                  color: C.terra, fontFamily: "Space Mono, monospace",
                  fontSize: 9, letterSpacing: "0.15em",
                  padding: "3px 10px", cursor: "pointer",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.target.style.background = `${C.terra}20`; }}
                  onMouseLeave={e => { e.target.style.background = "none"; }}
                >
                  oui
                </button>
                <button onClick={() => setConfirmClear(false)} style={{
                  background: "none", border: `1px solid ${C.cream}20`,
                  color: `${C.cream}40`, fontFamily: "Space Mono, monospace",
                  fontSize: 9, letterSpacing: "0.15em",
                  padding: "3px 10px", cursor: "pointer",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.target.style.borderColor = `${C.cream}50`; e.target.style.color = C.cream; }}
                  onMouseLeave={e => { e.target.style.borderColor = `${C.cream}20`; e.target.style.color = `${C.cream}40`; }}
                >
                  non
                </button>
              </div>
            )}

            {/* Checkout CTA */}
            <button style={{
              width: "100%",
              background: C.terra,
              border: "none",
              color: C.cream,
              fontFamily: "Cinzel, serif", fontSize: 12,
              letterSpacing: "0.3em", padding: "16px",
              cursor: "pointer", transition: "background 0.3s",
            }}
              onMouseEnter={e => e.target.style.background = "#B84008"}
              onMouseLeave={e => e.target.style.background = C.terra}
            >
              FINALISER LA CONSERVATION
            </button>

            <p style={{
              marginTop: 16, textAlign: "center",
              fontStyle: "italic", fontSize: 12,
              color: `${C.cream}30`, lineHeight: 1.7,
            }}>
              Ces fragments vous attendent.<br />Ils ne seront pas remplacés.
            </p>
          </>
        )}
      </div>
    </>
  );
};

// ─── VHS ENTRY SCREEN ───────────────────────────────────────────────────────
const VHSEntry = ({ onEnter, visitCount }) => {
  const [phase, setPhase] = useState("loading"); // loading → title → ready
  const [timecode, setTimecode] = useState("00:00:00:00");
  const [noise, setNoise] = useState(false);
  const phase_ = getPhase(visitCount);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("title"), 1800);
    const t2 = setTimeout(() => setPhase("ready"), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      const f = String(Math.floor(now.getMilliseconds() / 33)).padStart(2, "0");
      setTimecode(`${h}:${m}:${s}:${f}`);
      if (Math.random() < 0.02) setNoise(true);
      else setNoise(false);
    }, 33);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: C.black,
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000,
      animation: phase === "loading" ? "flicker 0.5s infinite" : "none",
    }}>
      {/* Scanlines */}
      <div style={{
        position: "absolute", inset: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
        pointerEvents: "none", zIndex: 1,
      }} />

      {/* Noise overlay */}
      {noise && <div style={{
        position: "absolute", inset: 0,
        background: "repeating-linear-gradient(90deg, transparent 0px, rgba(255,255,255,0.03) 1px, transparent 2px)",
        zIndex: 2, pointerEvents: "none",
      }} />}

      {/* Timecode — top left */}
      <div style={{
        position: "absolute", top: 24, left: 24,
        fontFamily: "Space Mono, monospace", fontSize: 11,
        color: `${C.terra}99`, letterSpacing: "0.1em",
        zIndex: 3,
      }}>
        {timecode}
      </div>

      {/* REC dot — top right */}
      <div style={{
        position: "absolute", top: 24, right: 24,
        display: "flex", alignItems: "center", gap: 6,
        fontFamily: "Space Mono, monospace", fontSize: 11,
        color: `${C.terra}99`, zIndex: 3,
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: C.terra,
          animation: "pulse 1.5s ease-in-out infinite",
        }} />
        REC
      </div>

      {/* Main content */}
      <div style={{ textAlign: "center", zIndex: 3, padding: "0 24px" }}>
        {phase === "loading" && (
          <div style={{
            fontFamily: "Space Mono, monospace", fontSize: 13,
            color: `${C.cream}60`, letterSpacing: "0.3em",
          }}>
            LECTURE EN COURS…
          </div>
        )}

        {(phase === "title" || phase === "ready") && (
          <div style={{ animation: "fadeIn 0.6s ease forwards" }}>
            {/* Logo MOOND */}
            <div style={{
              fontFamily: "Cinzel, serif", fontSize: "clamp(48px, 10vw, 96px)",
              fontWeight: 700, letterSpacing: "0.25em",
              color: C.cream,
              textShadow: `0 0 40px ${C.terra}40`,
              marginBottom: 8,
              animation: noise ? "glitch 0.1s ease" : "none",
            }}>
              M<span style={{ color: C.terra }}>O</span><span style={{ color: C.gold }}>O</span>ND
            </div>

            {/* Tagline — only shows from visit 1 */}
            <div style={{
              fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
              fontSize: 16, color: `${C.cream}70`,
              letterSpacing: "0.15em", marginBottom: 48,
              animation: "fadeInSlow 1.5s ease 0.3s both",
            }}>
              {phase_ === "confort" && "une archive familiale"}
              {phase_ === "micro" && "vous avez remarqué quelque chose ?"}
              {phase_ === "memoire" && "certains souvenirs résistent"}
              {phase_ === "absence" && "il manque quelque chose"}
              {phase_ === "fragmentation" && "l'archive est instable"}
            </div>

            {phase === "ready" && (
              <button onClick={onEnter} style={{
                background: "transparent",
                border: `1px solid ${C.terra}60`,
                color: C.cream,
                fontFamily: "Cinzel, serif", fontSize: 12,
                letterSpacing: "0.3em", padding: "12px 36px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                animation: "fadeIn 0.5s ease 0.2s both",
              }}
                onMouseEnter={e => {
                  e.target.style.borderColor = C.terra;
                  e.target.style.color = C.terra;
                }}
                onMouseLeave={e => {
                  e.target.style.borderColor = `${C.terra}60`;
                  e.target.style.color = C.cream;
                }}
              >
                ENTRER
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom info */}
      <div style={{
        position: "absolute", bottom: 24, left: 0, right: 0,
        textAlign: "center",
        fontFamily: "Space Mono, monospace", fontSize: 10,
        color: `${C.cream}30`, letterSpacing: "0.2em",
        zIndex: 3,
      }}>
        MOOND · ARCHIVE FAMILIALE · {getVHSYear(visitCount)}
      </div>
    </div>
  );
};

// ─── TICKER ─────────────────────────────────────────────────────────────────
const Ticker = ({ visitCount }) => {
  const phase = getPhase(visitCount);

  const messages = {
    confort: [
      "MOOND · archive familiale",
      "RMS — Raté Mais Stylé · lancement 18 mars 2027",
      "SANS PARLER · le vêtement qui parle à ta place",
      "Rustines interchangeables · tous âges",
      "Imparfait de la tête aux pieds. C'est peu. C'est exactement ça.",
    ],
    micro: [
      "MOOND · archive familiale",
      "RMS — Raté Mais Stylé · lancement 18 mars 2027",
      "Léo a " + getLeoAge(visitCount) + " sur cette cassette",
      "SANS PARLER · le vêtement qui parle à ta place",
      "Certains détails changent. D'autres restent.",
    ],
    memoire: [
      "MOOND · archive familiale · restauration en cours",
      "Mamie se souvient de choses qui n'ont pas eu lieu",
      "RMS — Raté Mais Stylé",
      "La date sur cette cassette n'est pas la bonne",
      "SANS PARLER · le vêtement qui parle à ta place",
    ],
    absence: [
      "MOOND · il manque quelque chose",
      "Imparfait de la tête aux pieds. C'est peu. C'est exactement ça.",
      "RMS — Raté Mais Stylé",
      "La chambre du fond est rarement montrée",
      "Certaines photos ont été recadrées",
    ],
    fragmentation: [
      "MOOND · archive instable",
      "Cette page a changé depuis votre dernière visite",
      "Certains fragments ont disparu",
      "L'archive lutte pour rester cohérente",
      "SANS PARLER · le vêtement qui parle à ta place",
    ],
  };

  const text = (messages[phase] || messages.confort).join("  ·  ") + "  ·  ";

  return (
    <div style={{
      background: `${C.terra}15`,
      borderTop: `1px solid ${C.terra}30`,
      borderBottom: `1px solid ${C.terra}30`,
      overflow: "hidden", whiteSpace: "nowrap",
      padding: "8px 0",
    }}>
      <div style={{
        display: "inline-block",
        fontFamily: "Space Mono, monospace", fontSize: 11,
        color: `${C.terra}CC`, letterSpacing: "0.15em",
        animation: "ticker 35s linear infinite",
      }}>
        {text}{text}
      </div>
    </div>
  );
};

// ─── HEADER ─────────────────────────────────────────────────────────────────
const Header = ({ activeSection, setActiveSection, cartCount, onOpenCart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navItems = [
    { id: "famille", label: "La famille" },
    { id: "banalites", label: "Banalités" },
    { id: "reliques", label: "Reliques" },
    { id: "fragments", label: "Fragments" },
    { id: "archive", label: "L'archive" },
  ];

  const handleNav = (id) => {
    setActiveSection(id);
    setMenuOpen(false);
  };

  return (
    <>
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? `${C.black}F0` : C.black,
        borderBottom: `1px solid ${C.terra}25`,
        backdropFilter: scrolled ? "blur(8px)" : "none",
        transition: "all 0.4s ease",
      }}>
        <div className="mobile-header-inner" style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 64,
        }}>
          {/* Logo */}
          <div className="mobile-logo" style={{
            fontFamily: "Cinzel, serif", fontSize: 22, fontWeight: 700,
            letterSpacing: "0.2em", cursor: "pointer", flexShrink: 0,
          }} onClick={() => handleNav("home")}>
            M<span style={{ color: C.terra }}>O</span><span style={{ color: C.gold }}>O</span>ND
          </div>

          {/* Desktop Nav */}
          <nav className="mobile-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {navItems.map(item => (
              <button key={item.id}
                onClick={() => handleNav(item.id)}
                style={{
                  background: "none", border: "none",
                  fontFamily: "Cinzel, serif", fontSize: 11,
                  letterSpacing: "0.2em",
                  color: activeSection === item.id ? C.terra : `${C.cream}70`,
                  cursor: "pointer", transition: "color 0.3s",
                  borderBottom: activeSection === item.id ? `1px solid ${C.terra}` : "1px solid transparent",
                  paddingBottom: 2,
                }}
                onMouseEnter={e => { if (activeSection !== item.id) e.target.style.color = C.cream; }}
                onMouseLeave={e => { if (activeSection !== item.id) e.target.style.color = `${C.cream}70`; }}
              >
                {item.label.toUpperCase()}
              </button>
            ))}

            {/* Cart button */}
            <button className="mobile-cart-btn" onClick={onOpenCart} style={{
              background: "none",
              border: `1px solid ${cartCount > 0 ? C.terra : C.terra + "30"}`,
              color: cartCount > 0 ? C.cream : `${C.cream}40`,
              fontFamily: "Space Mono, monospace", fontSize: 10,
              letterSpacing: "0.15em", padding: "6px 14px",
              cursor: "pointer", transition: "all 0.3s",
              display: "flex", alignItems: "center", gap: 8,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.terra; e.currentTarget.style.color = C.cream; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = cartCount > 0 ? C.terra : C.terra + "30"; e.currentTarget.style.color = cartCount > 0 ? C.cream : `${C.cream}40`; }}
            >
              MIS DE CÔTÉ
              {cartCount > 0 && (
                <span style={{
                  background: C.terra, color: C.cream,
                  borderRadius: "50%", width: 18, height: 18,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700, flexShrink: 0,
                  animation: "fadeIn 0.3s ease",
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile right — cart + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Mobile cart icon */}
            <button onClick={onOpenCart} style={{
              background: "none",
              border: `1px solid ${cartCount > 0 ? C.terra : C.terra + "30"}`,
              color: cartCount > 0 ? C.cream : `${C.cream}40`,
              fontFamily: "Space Mono, monospace", fontSize: 9,
              letterSpacing: "0.1em", padding: "5px 10px",
              cursor: "pointer", transition: "all 0.3s",
              display: "none",
              alignItems: "center", gap: 6,
              // shown via CSS on mobile
            }} className="mobile-cart-icon">
              {cartCount > 0 ? `(${cartCount})` : "MIS DE CÔTÉ"}
            </button>

            {/* Hamburger */}
            <button
              className="mobile-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span style={{ transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
              <span style={{ opacity: menuOpen ? 0 : 1 }} />
              <span style={{ transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <div className="mobile-nav-overlay" style={{ display: menuOpen ? "flex" : "none" }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => handleNav(item.id)} style={{
            background: "none", border: "none",
            fontFamily: "Cinzel, serif", fontSize: 18,
            letterSpacing: "0.25em",
            color: activeSection === item.id ? C.terra : C.cream,
            cursor: "pointer", padding: "8px 0",
          }}>
            {item.label.toUpperCase()}
          </button>
        ))}
        <button onClick={() => { onOpenCart(); setMenuOpen(false); }} style={{
          marginTop: 16,
          background: "none",
          border: `1px solid ${C.terra}60`,
          color: C.cream,
          fontFamily: "Space Mono, monospace", fontSize: 12,
          letterSpacing: "0.2em", padding: "10px 24px",
          cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          MIS DE CÔTÉ
          {cartCount > 0 && (
            <span style={{
              background: C.terra, color: C.cream,
              borderRadius: "50%", width: 20, height: 20,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700,
            }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
};

// ─── PRODUCT DRAWER ─────────────────────────────────────────────────────────
const ProductDrawer = ({ product, onClose, onAddToCart }) => {
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: 20, right: 20,
          background: "none", border: "none",
          color: `${C.cream}60`, cursor: "pointer",
          fontFamily: "Space Mono, monospace", fontSize: 11,
          letterSpacing: "0.2em",
          transition: "color 0.3s",
        }}
          onMouseEnter={e => e.target.style.color = C.cream}
          onMouseLeave={e => e.target.style.color = `${C.cream}60`}
        >
          FERMER ×
        </button>

        {/* Fragment label */}
        <div style={{
          fontFamily: "Space Mono, monospace", fontSize: 10,
          color: `${C.terra}80`, letterSpacing: "0.2em",
          marginBottom: 24,
        }}>
          FRAGMENT RÉCUPÉRÉ
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "Cinzel, serif", fontSize: 20, fontWeight: 600,
          letterSpacing: "0.1em", color: C.cream,
          marginBottom: 8, lineHeight: 1.3,
        }}>
          {product.name}
        </h2>

        {/* Condition */}
        {product.condition && (
          <div style={{
            fontFamily: "Space Mono, monospace", fontSize: 10,
            color: C.gold, letterSpacing: "0.15em",
            marginBottom: 20,
          }}>
            {product.condition}
          </div>
        )}

        {/* Archive description */}
        <div style={{
          borderLeft: `2px solid ${C.terra}40`,
          paddingLeft: 16,
          marginBottom: 28,
        }}>
          <p style={{
            fontStyle: "italic", color: `${C.cream}90`,
            fontSize: 15, lineHeight: 1.8,
          }}>
            {product.archiveNote}
          </p>
        </div>

        {/* Details */}
        {product.details && (
          <div style={{ marginBottom: 28 }}>
            {product.details.map((d, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: `1px solid ${C.terra}15`,
                fontFamily: "Space Mono, monospace", fontSize: 11,
              }}>
                <span style={{ color: `${C.cream}60` }}>{d.label}</span>
                <span style={{ color: C.cream }}>{d.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price */}
        {product.price === "sans prix" ? (
          <div style={{ marginBottom: 28 }}>
            <div style={{
              display: "inline-block",
              border: `2px solid ${C.cream}30`,
              padding: "8px 18px",
              fontFamily: "Space Mono, monospace",
              fontSize: 12,
              letterSpacing: "0.3em",
              color: `${C.cream}40`,
              transform: "rotate(-2deg)",
              transformOrigin: "left center",
              position: "relative",
            }}>
              PAS À VENDRE
            </div>
          </div>
        ) : (
          <div style={{
            display: "flex", alignItems: "baseline", gap: 12,
            marginBottom: 28,
          }}>
            {product.originalPrice && (
              <span style={{
                fontFamily: "Space Mono, monospace", fontSize: 13,
                color: `${C.cream}40`,
                textDecoration: "line-through",
              }}>
                {product.originalPrice}
              </span>
            )}
            <span style={{
              fontFamily: "Cinzel, serif", fontSize: 22,
              color: C.gold,
            }}>
              {product.price}
            </span>
          </div>
        )}

        {/* CTA */}
        {product.price !== "sans prix" && (!added ? (
          <button onClick={handleAdd} style={{
            width: "100%",
            background: C.terra,
            border: "none",
            color: C.cream,
            fontFamily: "Cinzel, serif", fontSize: 12,
            letterSpacing: "0.3em", padding: "16px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
            onMouseEnter={e => e.target.style.background = "#B84008"}
            onMouseLeave={e => e.target.style.background = C.terra}
          >
            CONSERVER CE FRAGMENT
          </button>
        ) : (
          <div style={{
            textAlign: "center", padding: "16px",
            fontStyle: "italic", color: `${C.cream}70`,
            fontSize: 14,
            animation: "fadeIn 0.4s ease",
          }}>
            Le fragment vous attend.
          </div>
        ))}

        {/* Rustine */}
        {product.rustine && (
          <div style={{
            marginTop: 24, padding: "12px 16px",
            border: `1px solid ${C.terra}30`,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `${C.terra}20`,
              border: `1px solid ${C.terra}60`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Space Mono, monospace", fontSize: 9,
              color: C.terra, textAlign: "center",
            }}>
              {product.rustine}
            </div>
            <span style={{
              fontFamily: "Space Mono, monospace", fontSize: 10,
              color: `${C.cream}50`,
            }}>
              rustine incluse
            </span>
          </div>
        )}
      </div>
    </>
  );
};

// ─── SECTION: HERO / HOME ────────────────────────────────────────────────────
const SectionHero = ({ visitCount, setActiveSection }) => {
  const [revealed, setRevealed] = useState(false);
  const phase = getPhase(visitCount);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(t);
  }, []);

  const heroLines = {
    confort: {
      main: "Imparfait de la tête aux pieds.",
      sub: "C'est peu. C'est exactement ça.",
      note: null,
    },
    micro: {
      main: "Imparfait de la tête aux pieds.",
      sub: "C'est peu. C'est exactement ça.",
      note: null,
    },
    memoire: {
      main: "Imparfait de la tête aux pieds.",
      sub: "Certains détails changent. L'essentiel reste.",
      note: null,
    },
    absence: {
      main: "Imparfait de la tête aux pieds.",
      sub: "L'archive lutte pour rester cohérente.",
      note: null,
    },
    fragmentation: {
      main: "Imparfait de la tête aux pieds.",
      sub: "Cette page a changé depuis votre dernière visite.",
      note: null,
    },
  };

  const content = heroLines[phase] || heroLines.confort;

  return (
    <section style={{
      minHeight: "80vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "80px 32px",
      position: "relative",
      textAlign: "center",
    }} className="section-pad">
      {/* Grain texture */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 50% 40%, ${C.terra}08 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {revealed && (
        <div style={{ animation: "fadeIn 1s ease forwards", position: "relative" }}>
          <p style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(28px, 5vw, 56px)",
            fontWeight: 300, fontStyle: "italic",
            color: C.cream, lineHeight: 1.3,
            marginBottom: 16,
          }}>
            {content.main}
          </p>

          <p style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(16px, 2.5vw, 22px)",
            color: `${C.cream}60`,
            marginBottom: phase !== "confort" && content.note ? 40 : 64,
          }}>
            {content.sub}
          </p>

          {content.note && (
            <p style={{
              fontFamily: "Space Mono, monospace", fontSize: 11,
              color: `${C.terra}80`, letterSpacing: "0.15em",
              marginBottom: 64,
              animation: "fadeIn 1s ease 0.8s both",
            }}>
              {content.note}
            </p>
          )}

          <div className="hero-btns" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setActiveSection("famille")} style={{
              background: "transparent",
              border: `1px solid ${C.terra}`,
              color: C.cream,
              fontFamily: "Cinzel, serif", fontSize: 11,
              letterSpacing: "0.25em", padding: "12px 28px",
              cursor: "pointer", transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.target.style.background = `${C.terra}20`; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; }}
            >
              LA FAMILLE
            </button>
            <button onClick={() => setActiveSection("fragments")} style={{
              background: "transparent",
              border: `1px solid ${C.gold}60`,
              color: `${C.cream}80`,
              fontFamily: "Cinzel, serif", fontSize: 11,
              letterSpacing: "0.25em", padding: "12px 28px",
              cursor: "pointer", transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.target.style.background = `${C.gold}10`; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; }}
            >
              LES FRAGMENTS
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

// ─── SECTION: FAMILLE ────────────────────────────────────────────────────────
const FAMILLE_DATA = [
  {
    id: "papa",
    nom: "Papa",
    role: "Il répare.",
    description: "Il scotche. Il recoud. Il maintient. Il ne pose pas de questions sur ce qu'il conserve. Seulement sur comment.",
    rustine: "ÇA TIENT",
    color: C.terra,
  },
  {
    id: "maman",
    nom: "Maman",
    role: "Elle s'adapte.",
    description: "Elle s'adapte. Elle recommence. Elle change de cap avec sincérité. Elle aime sa famille, vraiment. Mais parfois elle ne sait plus très bien quelle version d'elle-même est aimée.",
    rustine: "DEBOUT",
    color: C.gold,
  },
  {
    id: "luna",
    nom: "Luna",
    role: "Elle observe.",
    description: "Elle tient des carnets. Elle note des détails. Elle dessine des plans de la maison. Elle ne dit pas toujours ce qu'elle remarque.",
    rustine: "ENCORE ?",
    color: "#8FA0C0",
  },
  {
    id: "leo",
    nom: "Léo",
    role: "Il résiste.",
    description: "Il customise ses vêtements. Il cache ses émotions. Il quitte parfois la pièce sans raison.",
    rustine: "BOF",
    color: "#7A9080",
  },
  {
    id: "mini",
    nom: "Mini",
    role: "Il ressent.",
    description: "Il ne comprend pas encore les mots. Il ressent les absences. Il rit pour rien. Il dort mal.",
    rustine: "EN COURS",
    color: `${C.cream}90`,
  },
  {
    id: "mamie",
    nom: "Mamie",
    role: "Elle se souvient.",
    description: "Elle tricote. Elle cuisine. Elle raconte des souvenirs qui ne correspondent pas toujours aux photos. Elle est peut-être trop ancienne pour être totalement réécrite.",
    rustine: "MODE SURVIE",
    color: `${C.cream}60`,
  },
];

const FamilleCard = ({ personne, onClick, visitCount }) => {
  const [hovered, setHovered] = useState(false);
  const phase = getPhase(visitCount);

  const ageDisplay = personne.id === "leo" ? getLeoAge(visitCount) : personne.age;

  return (
    <div
      onClick={() => onClick(personne)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? personne.color + "60" : C.terra + "20"}`,
        padding: 28,
        cursor: "pointer",
        transition: "all 0.4s ease",
        background: hovered ? `${personne.color}08` : "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Rustine */}
      <div style={{
        position: "absolute", top: 16, right: 16,
        border: `1px solid ${personne.color}60`,
        padding: "3px 8px",
        fontFamily: "Space Mono, monospace", fontSize: 9,
        color: personne.color, letterSpacing: "0.15em",
        opacity: hovered ? 1 : 0.6,
        transition: "opacity 0.3s",
      }}>
        {personne.rustine}
      </div>

      <div style={{
        fontFamily: "Cinzel, serif", fontSize: 18, fontWeight: 600,
        color: C.cream, marginBottom: 4,
        display: "flex", alignItems: "baseline", gap: 8,
      }}>
        {personne.nom}
  
      </div>

      <div style={{
        fontStyle: "italic", color: `${C.cream}60`,
        marginBottom: 12, fontSize: 14,
      }}>
        {personne.role}
      </div>

      <p style={{
        fontSize: 14, color: `${C.cream}75`,
        lineHeight: 1.7,
      }}>
        {personne.description}
      </p>




    </div>
  );
};

const SectionFamille = ({ visitCount, onOpenDrawer }) => {
  const [selected, setSelected] = useState(null);

  const handleClick = (personne) => {
    onOpenDrawer({
      name: `${personne.nom} — Dossier`,
      archiveNote: personne.description + " " + personne.habitudes.join(". ") + ".",
      condition: "MEMBRE DE LA FAMILLE MOOND",
      price: "sans prix",
      rustine: personne.rustine,
      details: [
        { label: "Rôle", value: personne.role },
        { label: "Rustine", value: personne.rustine },
      ],
    });
  };

  return (
    <section className="section-pad" style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 48 }}>
        <div style={{
          fontFamily: "Space Mono, monospace", fontSize: 10,
          color: `${C.terra}80`, letterSpacing: "0.3em",
          marginBottom: 12,
        }}>
          ARCHIVE · LA FAMILLE
        </div>
        <h2 style={{
          fontFamily: "Cinzel, serif", fontSize: "clamp(24px, 4vw, 40px)",
          fontWeight: 600, letterSpacing: "0.1em", color: C.cream,
          marginBottom: 16,
        }}>
          Les Moond
        </h2>
        <p style={{
          fontStyle: "italic", color: `${C.cream}60`,
          fontSize: 16, maxWidth: 560,
        }}>
          Une famille ordinaire. Des habitudes ordinaires. Des vêtements qui portent des traces.
        </p>
      </div>

      <div className="grid-auto" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 2,
      }}>
        {FAMILLE_DATA.map(p => (
          <FamilleCard key={p.id} personne={p} onClick={handleClick} visitCount={visitCount} />
        ))}
      </div>
    </section>
  );
};

// ─── SECTION: BANALITÉS (quotidien réel) ────────────────────────────────────
// This section is the cornerstone of Phase 1 — 70% everyday content
const BANALITES_DATA = [
  {
    type: "liste_courses",
    title: "Liste de courses — semaine du 14",
    content: [
      "pain (boulangerie)", "lait x3", "yaourts pour Mini",
      "dentifrice (celui de Léo aussi)", "farine", "sel — on n'a plus de sel",
      "chaussettes (Léo encore)", "café", "jus d'orange",
      "— tu peux acheter des cornichons ?", "cornichons",
    ],
    note: "Retrouvée dans la poche du manteau de Papa.",
    color: C.terra,
  },
  {
    type: "recette",
    title: "Tarte aux pommes de Mamie",
    content: [
      "Pour la pâte : farine, beurre, sel, un peu d'eau froide.",
      "Les pommes : Golden. Toujours Golden. Ne pas changer.",
      "Sucre vanillé. Canelle si les enfants sont d'accord.",
      "Cuire 35 minutes. Ou 40. Ça dépend du four.",
      "Note : Léo n'aime plus la tarte aux pommes depuis l'année dernière.",
      "Il n'a pas expliqué pourquoi.",
    ],
    note: "Carnet de Mamie. Dernière mise à jour incertaine.",
    color: C.gold,
  },
  {
    type: "dessin",
    title: "Dessin — non signé",
    content: "Un soleil. Une maison. Cinq silhouettes. La cinquième est plus petite que les autres. Une maison avec beaucoup de fenêtres. Le gazon est vert vif. Le soleil est orange.",
    note: "Trouvé derrière le radiateur du couloir. Pas de prénom.",
    color: `${C.cream}60`,
    isItalic: true,
  },
  {
    type: "ticket",
    title: "Ticket de caisse — Carrefour Market",
    content: [
      "CORN FLAKES KELLOGG       2,49",
      "JAMBON BLANC 4TR          3,19",
      "LAIT DEMI ECR X6          5,78",
      "CHAUSSETTES ENF T27/30    4,99",
      "CHAUSSETTES ENF T27/30    4,99",
      "TOTAL TTC                24,67",
      "CB VISA ****8821",
    ],
    note: "Samedi matin, probablement.",
    color: C.gris,
    isMono: true,
  },
  {
    type: "note",
    title: "Post-it — frigo",
    content: "Ne pas oublier → RDV pédicure mercredi / appeler Mme Fontaine / Léo — autorisation sortie scolaire à signer AVANT JEUDI / huile moteur Papa",
    note: "Écriture de Maman. Certains points ont été barrés. Pas tous.",
    color: `${C.terra}80`,
  },
  {
    type: "calendrier",
    title: "Calendrier mural — mars",
    content: [
      "3 — réunion école Luna", "7 — dentiste Mini",
      "12 — anniversaire Tante Véronique (ne pas oublier)",
      "15 — ??", "18 — ",
      "22 — retour Papa (déplacement ?)",
      "29 — vacances (début)",
    ],
    note: "La case du 18 est vide. Quelque chose d'effacé.",
    color: C.gold,
  },
];

const BanaliteCard = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        border: `1px solid ${item.color}25`,
        padding: 24,
        cursor: "pointer",
        transition: "all 0.3s ease",
        background: open ? `${item.color}06` : "transparent",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{
            fontFamily: "Space Mono, monospace", fontSize: 9,
            color: `${item.color}80`, letterSpacing: "0.2em",
            marginBottom: 6,
          }}>
            {item.type.replace("_", " ").toUpperCase()}
          </div>
          <div style={{
            fontFamily: "Cinzel, serif", fontSize: 15,
            color: C.cream,
          }}>
            {item.title}
          </div>
        </div>
        <div style={{
          color: `${C.cream}40`,
          fontFamily: "Space Mono, monospace", fontSize: 12,
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.3s",
          marginTop: 4,
        }}>
          ↓
        </div>
      </div>

      {/* Note */}
      <div style={{
        fontFamily: "Space Mono, monospace", fontSize: 10,
        color: `${C.cream}40`, fontStyle: "italic",
        marginTop: 8,
      }}>
        {item.note}
      </div>

      {/* Content — expanded */}
      <div style={{
        maxHeight: open ? "400px" : "0",
        overflow: "hidden",
        transition: "max-height 0.4s ease",
      }}>
        <div style={{
          marginTop: 20,
          borderTop: `1px solid ${item.color}20`,
          paddingTop: 16,
        }}>
          {Array.isArray(item.content) ? (
            <div>
              {item.content.map((line, i) => (
                <div key={i} style={{
                  fontFamily: item.isMono ? "Space Mono, monospace" : "Cormorant Garamond, serif",
                  fontSize: item.isMono ? 12 : 15,
                  color: `${C.cream}80`,
                  padding: "3px 0",
                  fontStyle: item.isItalic ? "italic" : "normal",
                  borderBottom: item.isMono ? `1px solid ${C.terra}10` : "none",
                }}>
                  {line}
                </div>
              ))}
            </div>
          ) : (
            <p style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 15, fontStyle: item.isItalic ? "italic" : "normal",
              color: `${C.cream}80`, lineHeight: 1.8,
            }}>
              {item.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionBanalites = () => (
  <section className="section-pad" style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
    <div style={{ marginBottom: 48 }}>
      <div style={{
        fontFamily: "Space Mono, monospace", fontSize: 10,
        color: `${C.terra}80`, letterSpacing: "0.3em",
        marginBottom: 12,
      }}>
        ARCHIVE · QUOTIDIEN
      </div>
      <h2 style={{
        fontFamily: "Cinzel, serif", fontSize: "clamp(24px, 4vw, 40px)",
        fontWeight: 600, letterSpacing: "0.1em", color: C.cream,
        marginBottom: 16,
      }}>
        Banalités
      </h2>
      <p style={{
        fontStyle: "italic", color: `${C.cream}60`,
        fontSize: 16, maxWidth: 560,
      }}>
        Des choses trouvées dans la maison. Des notes. Des listes. Des détails qui n'ont pas d'importance.
      </p>
    </div>

    <div className="grid-auto" style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
      gap: 2,
    }}>
      {BANALITES_DATA.map((item, i) => (
        <BanaliteCard key={i} item={item} />
      ))}
    </div>
  </section>
);

// ─── SECTION: RELIQUES (boutique-archive) ───────────────────────────────────
const RELIQUES_DATA = [
  {
    name: "Sweat retrouvé — Caisse 7",
    archiveNote: "Retrouvé dans une caisse après l'arrêt de l'émission. L'étiquette intérieure a été recousue deux fois. Présence d'une rustine « ÇA TIENT ». La caisse portait un numéro différent sur deux de ses quatre faces.",
    condition: "ÉTAT GÉNÉRAL · USURE VISIBLE",
    price: "49 €",
    rustine: "ÇA TIENT",
    details: [
      { label: "Origine", value: "Caisse 7 · archive textile" },
      { label: "Coutures", value: "visibles · assumées" },
      { label: "Velcro", value: "2 emplacements" },
      { label: "Référence", value: "MOOND-SW-007" },
    ],
    code: "MOOND-SW-007",
  },
  {
    name: "T-shirt — Écriture inconnue",
    archiveNote: "Un prénom au marqueur sur la nuque. Illisible. Probablement un enfant. Peut-être pas. La taille correspond à plusieurs âges selon les marques. Patch ENCORE ? déjà posé avant qu'on le retrouve.",
    condition: "DÉJÀ PORTÉ · MARQUEUR NUQUE",
    price: "22 €",
    rustine: "ENCORE ?",
    details: [
      { label: "Taille", value: "incertaine · 8-12 ans" },
      { label: "Marqueur nuque", value: "prénom illisible" },
      { label: "Velcro", value: "1 emplacement" },
      { label: "Référence", value: "RMS-TS-011" },
    ],
    code: "RMS-TS-011",
  },
  {
    name: "Pack Rustines — ÉTATS",
    archiveNote: "Cinq rustines de la famille ÉTATS. Produites chez Envie Pro, Ingré. Velcro interchangeable, pose en 3 secondes sur n'importe quel vêtement. Elles disent ce qu'on n'arrive pas toujours à dire soi-même.",
    condition: "NEUF · SÉRIE VIRALE",
    price: "15 €",
    rustine: "BOF",
    details: [
      { label: "Contenu", value: "5 rustines DTF" },
      { label: "BOF", value: "inclus" },
      { label: "MODE SURVIE", value: "inclus" },
      { label: "EN CHARGEMENT", value: "inclus" },
      { label: "DEBOUT", value: "inclus" },
      { label: "AILLEURS", value: "inclus" },
    ],
    code: "SP-PACK-ETATS-01",
  },
  {
    name: "Chaussettes RMS — Le Quatuor",
    archiveNote: "Quatre chaussettes. Six combinaisons de paires possibles. Coton bio GOTS, tricot circulaire. Chaque chaussette est une seule chose — c'est le client qui compose. L'imperfection n'est pas un défaut, c'est le produit.",
    condition: "NEUF · COTON BIO GOTS",
    price: "22 €",
    rustine: "BOF",
    details: [
      { label: "Contenu", value: "4 chaussettes individuelles" },
      { label: "Combinaisons", value: "6 paires possibles" },
      { label: "Matière", value: "Coton bio GOTS" },
      { label: "Taille", value: "0-24 mois" },
    ],
    code: "RMS-SOCK-Q4-01",
  },

  {
    name: "Body taché — Série Naissance",
    archiveNote: "Un body avec une trace de purée sur l'épaule gauche. La tache a été traitée mais reste visible. C'est voulu. La notice dit : « L'accident est la signature. Ne pas chercher à effacer. » C'est le premier produit que RMS a fabriqué.",
    condition: "TACHÉ · CERTIFIÉ OEKO-TEX",
    price: "24 €",
    originalPrice: null,
    rustine: "EN COURS",
    details: [
      { label: "Taille", value: "0-24 mois" },
      { label: "Tache", value: "purée · épaule gauche" },
      { label: "Certification", value: "Oeko-Tex Standard 100" },
      { label: "Référence", value: "RMS-BODY-001" },
    ],
    code: "RMS-BODY-001",
  },
];

const ReliquéCard = ({ relique, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(relique)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? C.terra + "60" : C.terra + "20"}`,
        padding: 28,
        cursor: "pointer",
        transition: "all 0.4s ease",
        background: hovered ? `${C.terra}06` : "transparent",
        position: "relative",
      }}
    >
      {/* Archive code */}
      <div style={{
        fontFamily: "Space Mono, monospace", fontSize: 9,
        color: `${C.terra}60`, letterSpacing: "0.2em",
        marginBottom: 12,
      }}>
        {relique.code}
      </div>

      <h3 style={{
        fontFamily: "Cinzel, serif", fontSize: 15, fontWeight: 600,
        color: C.cream, marginBottom: 8, lineHeight: 1.3,
      }}>
        {relique.name}
      </h3>

      <div style={{
        fontFamily: "Space Mono, monospace", fontSize: 9,
        color: C.gold, letterSpacing: "0.15em",
        marginBottom: 12,
      }}>
        {relique.condition}
      </div>

      <p style={{
        fontSize: 13, color: `${C.cream}65`,
        lineHeight: 1.7, fontStyle: "italic",
        marginBottom: 16,
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {relique.archiveNote}
      </p>

      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{
          fontFamily: "Cinzel, serif", fontSize: 18,
          color: C.gold,
        }}>
          {relique.price}
        </span>
        <span style={{
          fontFamily: "Space Mono, monospace", fontSize: 10,
          color: hovered ? C.terra : `${C.cream}40`,
          letterSpacing: "0.15em",
          transition: "color 0.3s",
        }}>
          {hovered ? "EXAMINER →" : "→"}
        </span>
      </div>
    </div>
  );
};

const SectionReliques = ({ onOpenDrawer }) => (
  <section className="section-pad" style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
    <div style={{ marginBottom: 48 }}>
      <div style={{
        fontFamily: "Space Mono, monospace", fontSize: 10,
        color: `${C.terra}80`, letterSpacing: "0.3em",
        marginBottom: 12,
      }}>
        ARCHIVE · FRAGMENTS RÉCUPÉRÉS
      </div>
      <h2 style={{
        fontFamily: "Cinzel, serif", fontSize: "clamp(24px, 4vw, 40px)",
        fontWeight: 600, letterSpacing: "0.1em", color: C.cream,
        marginBottom: 16,
      }}>
        Reliques
      </h2>
      <p style={{
        fontStyle: "italic", color: `${C.cream}60`,
        fontSize: 16, maxWidth: 560,
      }}>
        Des objets retrouvés. Des vêtements conservés. Ni simplement des produits,
        ni simplement des souvenirs.
      </p>
    </div>

    <div className="grid-auto" style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: 2,
    }}>
      {RELIQUES_DATA.map((r, i) => (
        <ReliquéCard key={i} relique={r} onClick={onOpenDrawer} />
      ))}
    </div>
  </section>
);

// ─── SECTION: FRAGMENTS NARRATIFS (RUSTINES SANS PARLER) ───────────────────
const RUSTINES_IMAGE = "data:image/jpeg;base64,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";

const RUSTINES_DATA = [
  {
    famille: "ÉTATS",
    description: "Ce que tu es en ce moment.",
    fond: "#110E0A",
    texte: "#F5EDD6",
    bordure: "#F5EDD640",
    items: [
      { label: "BOF", desc: "Entre les deux. Ni bien ni mal. Exactement entre." },
      { label: "MODE SURVIE", desc: "Le mode qu'on n'annonce pas. Celui qui se voit." },
      { label: "EN CHARGEMENT", desc: "Ni bien ni mal. En transition. Ça revient." },
      { label: "DEBOUT", desc: "Minimaliste. Peut être une victoire ou un simple constat." },
      { label: "AILLEURS", desc: "Physiquement là. Mentalement parti. Reconnaissable." },
    ],
  },
  {
    famille: "RÉPONSES",
    description: "Ce que tu dis sans ouvrir la bouche.",
    fond: "#F5EDD6",
    texte: "#110E0A",
    bordure: "#110E0A40",
    items: [
      { label: "PAS ENVIE", desc: "Pour les jours sans explication. Sans devoir justifier." },
      { label: "ENCORE ?", desc: "Quand la même chose revient pour la troisième fois." },
      { label: "ON FAIT ALLER", desc: "Typiquement français. Universel quand même." },
      { label: "OUI OUI", desc: "La capitulation polie. Tout le monde l'a dit." },
      { label: "PLUS TARD", desc: "Le report comme mode de vie. Intemporel." },
      { label: "À VOIR", desc: "Ni oui ni non. La réponse de quelqu'un qui ne veut pas se mouiller." },
    ],
  },
  {
    famille: "DIAGNOSTICS",
    description: "Ce que tu observes sur toi-même.",
    fond: "#D4500A",
    texte: "#F5EDD6",
    bordure: "#F5EDD640",
    items: [
      { label: "J'ESSAIE", desc: "Honnête. Court. Plus difficile à dire qu'il n'y paraît." },
      { label: "GROS BORDEL", desc: "Populaire. Intemporel. 25 ans comme 55 ans." },
      { label: "DE MON MIEUX", desc: "Émotion retenue. Adulte. Deux mots qui disent tout." },
      { label: "ÇA TIENT", desc: "Fragile + résilient en deux mots." },
      { label: "SYSTÈME D", desc: "La débrouille érigée en philosophie." },
      { label: "EN COURS", desc: "Je ne suis pas arrivé. Je suis en train. Honnêteté sans excuse." },
    ],
  },
];

const RustineTag = ({ label, fond, texte, onClick, famille }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick({ label, fond, texte, famille })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: fond,
        color: texte,
        fontFamily: "Space Mono, monospace",
        fontSize: "clamp(9px, 1.2vw, 11px)",
        fontWeight: 700,
        letterSpacing: "0.18em",
        padding: "10px 14px",
        cursor: "pointer",
        border: `1px solid ${texte}25`,
        outline: hovered ? `2px solid ${texte}60` : "2px solid transparent",
        outlineOffset: 2,
        transition: "outline 0.2s ease, transform 0.15s ease",
        transform: hovered ? "translateY(-2px)" : "none",
        userSelect: "none",
        whiteSpace: "nowrap",
        position: "relative",
      }}
    >
      {label}
    </div>
  );
};

const SectionFragments = ({ onOpenDrawer }) => {
  const [activeRustine, setActiveRustine] = useState(null);

  const handleRustineClick = (rustine) => {
    const found = RUSTINES_DATA
      .flatMap(f => f.items.map(i => ({ ...i, famille: f.famille, fond: f.fond, texte: f.texte })))
      .find(i => i.label === rustine.label);
    if (found) {
      onOpenDrawer({
        name: `Rustine · ${found.label}`,
        archiveNote: found.desc,
        condition: `FAMILLE ${found.famille} · DTF`,
        price: "6 €",
        rustine: found.label,
        details: [
          { label: "Famille", value: found.famille },
          { label: "Technique", value: "DTF · Envie Pro, Ingré" },
          { label: "Pose", value: "3 secondes · velcro" },
          { label: "Format", value: "Rectangle · coutures apparentes" },
        ],
      });
    }
  };

  return (
    <section className="section-pad" style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{
          fontFamily: "Space Mono, monospace", fontSize: 10,
          color: `${C.terra}80`, letterSpacing: "0.3em",
          marginBottom: 12,
        }}>
          SANS PARLER · LE VOCABULAIRE
        </div>
        <h2 style={{
          fontFamily: "Cinzel, serif", fontSize: "clamp(24px, 4vw, 40px)",
          fontWeight: 600, letterSpacing: "0.1em", color: C.cream,
          marginBottom: 16,
        }}>
          Les Rustines
        </h2>
        <p style={{
          fontStyle: "italic", color: `${C.cream}60`,
          fontSize: 16, maxWidth: 560,
        }}>
          17 formules. Trois familles. Le vêtement qui parle à ta place.
        </p>
      </div>

      {/* Image hero */}
      <div style={{
        marginBottom: 80,
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${C.terra}25`,
      }}>
        <img
          src={RUSTINES_IMAGE}
          alt="Les 17 rustines SANS PARLER — Petites phrases. Grande utilité."
          style={{
            width: "100%",
            display: "block",
            objectFit: "cover",
            maxHeight: 480,
            filter: "brightness(0.92)",
          }}
        />
      </div>
      <div style={{
        marginBottom: 48,
        fontFamily: "Space Mono, monospace",
        fontSize: 10,
        color: `${C.cream}65`,
        letterSpacing: "0.2em",
        textAlign: "center",
      }}>
        PETITES PHRASES. GRANDE UTILITÉ. · MOOND
      </div>

      {/* Trois familles */}
      {RUSTINES_DATA.map((famille, fi) => (
        <div key={fi} style={{ marginBottom: 52 }}>
          {/* Famille header — description seule, sans label */}
          <div style={{
            marginBottom: 24,
            borderBottom: `1px solid ${famille.fond === "#F5EDD6" ? C.cream + "20" : famille.fond + "40"}`,
            paddingBottom: 12,
          }}>
            <div style={{
              fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
              fontSize: 17, color: C.cream,
              letterSpacing: "0.05em",
            }}>
              {famille.description}
            </div>
          </div>

          {/* Rustines — tag + description groupés */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 8,
          }}>
            {famille.items.map((item, ii) => (
              <div
                key={ii}
                onClick={() => handleRustineClick({ label: item.label, fond: famille.fond, texte: famille.texte, famille: famille.famille })}
                style={{ cursor: "pointer" }}
              >
                {/* Tag */}
                <div style={{
                  background: famille.fond,
                  color: famille.texte,
                  fontFamily: "Space Mono, monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  padding: "10px 14px",
                  marginBottom: 8,
                  display: "inline-block",
                  border: famille.fond === "#110E0A" ? `1px solid ${C.cream}25` : "none",
                }}>
                  {item.label}
                </div>
                {/* Description */}
                <div style={{
                  fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                  fontSize: 13, color: C.cream, lineHeight: 1.6,
                  paddingLeft: 4,
                }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Tagline bas */}
      <div style={{
        marginTop: 16,
        paddingTop: 32,
        borderTop: `1px solid ${C.terra}15`,
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: "Cinzel, serif", fontSize: 11,
          color: `${C.cream}30`, letterSpacing: "0.25em",
        }}>
          PETITES PHRASES. GRANDE UTILITÉ.
        </div>
      </div>
    </section>
  );
};

// ─── SECTION: ARCHIVE / VHS ──────────────────────────────────────────────────
const VHSPlayer = ({ visitCount }) => {
  const [playing, setPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [timecode, setTimecode] = useState("00:00:00:00");
  const [isCut, setIsCut] = useState(false);
  const intervalRef = useRef(null);
  const year = getVHSYear(visitCount);

  const transcription = [
    { time: "00:00:12", text: "Papa : « C'est qui qui a mangé mes cornichons ? »" },
    { time: "00:00:31", text: "Mamie : « Laisse, c'est pas grave. »" },
    { time: "00:01:04", text: "Luna : « Papa, t'arrêtes de filmer ? »" },
    { time: "00:01:22", text: "[bruit de chaise]" },
    { time: "00:01:45", text: "Maman : « On est tous là, c'est bien. »" },
    { time: "00:01:58", text: "[silence — 4 secondes]" },
    { time: "00:02:03", text: "⚡ COUPURE · 11 SECONDES MANQUANTES" },
    { time: "00:02:14", text: "[reprise]" },
    { time: "00:02:29", text: "Mamie : « Tu te souviens de cette année-là ? »" },
    { time: "00:02:41", text: "Papa : « Quelle année ? »" },
    { time: "00:02:49", text: "Mamie : « Cette année-là. »" },
    { time: "00:03:02", text: "[fin de la séquence]" },
  ];

  useEffect(() => {
    if (!playing) {
      clearInterval(intervalRef.current);
      return;
    }
    let i = currentLine;
    intervalRef.current = setInterval(() => {
      i++;
      if (i >= transcription.length) {
        setPlaying(false);
        clearInterval(intervalRef.current);
        return;
      }
      if (transcription[i].text.includes("COUPURE")) setIsCut(true);
      else setIsCut(false);
      setCurrentLine(i);
      setTimecode(transcription[i].time + ":00");
    }, 1400);
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  const handlePlay = () => {
    if (!playing) {
      setCurrentLine(0);
      setIsCut(false);
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  };

  return (
    <div style={{
      border: `1px solid ${C.terra}30`,
      padding: 32, maxWidth: 640,
      background: "#0D0A06",
    }}>
      {/* VHS header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 24,
        paddingBottom: 16, borderBottom: `1px solid ${C.terra}20`,
      }}>
        <div>
          <div style={{
            fontFamily: "Space Mono, monospace", fontSize: 9,
            color: `${C.terra}80`, letterSpacing: "0.2em",
          }}>
            VHS · FAMILLE MOOND #3 · {year}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: playing ? C.terra : `${C.terra}40`,
            animation: playing ? "pulse 1s infinite" : "none",
          }} />
          <span style={{
            fontFamily: "Space Mono, monospace", fontSize: 10,
            color: playing ? C.terra : `${C.terra}40`,
          }}>
            {playing ? "LECTURE" : "ARRÊT"}
          </span>
        </div>
      </div>

      {/* Timecode */}
      <div style={{
        fontFamily: "Space Mono, monospace", fontSize: 13,
        color: `${C.terra}90`, marginBottom: 20,
        letterSpacing: "0.1em",
      }}>
        {timecode || "00:00:00:00"}
      </div>

      {/* Transcription */}
      <div style={{ minHeight: 160, marginBottom: 24 }}>
        {transcription.slice(0, currentLine + 1).map((line, i) => (
          <div key={i} style={{
            display: "flex", gap: 16,
            padding: "6px 0",
            opacity: i === currentLine ? 1 : 0.35,
            transition: "opacity 0.3s",
            borderLeft: line.text.includes("COUPURE") ? `2px solid ${C.terra}` : "none",
            paddingLeft: line.text.includes("COUPURE") ? 12 : 0,
          }}>
            <span style={{
              fontFamily: "Space Mono, monospace", fontSize: 9,
              color: `${C.terra}60`, flexShrink: 0, marginTop: 2,
            }}>
              {line.time}
            </span>
            <span style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 15, fontStyle: "italic",
              color: line.text.includes("COUPURE") ? C.terra :
                line.text.startsWith("[") ? `${C.cream}50` : C.cream,
            }}>
              {line.text}
            </span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button onClick={handlePlay} style={{
        background: playing ? "transparent" : C.terra,
        border: `1px solid ${C.terra}`,
        color: C.cream,
        fontFamily: "Space Mono, monospace", fontSize: 11,
        letterSpacing: "0.2em", padding: "10px 24px",
        cursor: "pointer", transition: "all 0.3s",
      }}>
        {playing ? "■ STOP" : "▶ LIRE"}
      </button>
    </div>
  );
};

const SectionArchive = ({ visitCount }) => {
  const phase = getPhase(visitCount);

  return (
    <section className="section-pad" style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 48 }}>
        <div style={{
          fontFamily: "Space Mono, monospace", fontSize: 10,
          color: `${C.terra}80`, letterSpacing: "0.3em",
          marginBottom: 12,
        }}>
          ARCHIVE · VHS · DOCUMENTS
        </div>
        <h2 style={{
          fontFamily: "Cinzel, serif", fontSize: "clamp(24px, 4vw, 40px)",
          fontWeight: 600, letterSpacing: "0.1em", color: C.cream,
          marginBottom: 16,
        }}>
          L'Archive
        </h2>
        <p style={{
          fontStyle: "italic", color: `${C.cream}60`,
          fontSize: 16, maxWidth: 560,
        }}>
          {phase === "confort" && "Des enregistrements familiaux. Des moments ordinaires conservés."}
          {phase === "micro" && "Des enregistrements. Certains détails changent entre les lectures."}
          {phase === "memoire" && "Une mémoire qui tente de rester cohérente."}
          {(phase === "absence" || phase === "fragmentation") && "Il manque onze secondes. Personne n'explique pourquoi."}
        </p>
      </div>

      <div className="vhs-flex" style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <VHSPlayer visitCount={visitCount} />

        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{
            fontFamily: "Space Mono, monospace", fontSize: 10,
            color: `${C.terra}60`, letterSpacing: "0.2em",
            marginBottom: 20,
          }}>
            AUTRES DOCUMENTS
          </div>

          {[
            { label: "Notice — Micro-ondes SAMSUNG", date: "sans date", note: "Page 7 manquante. Elle a été utilisée." },
            { label: "Facture EDF — Novembre", date: "2006", note: "Adresse différente de celle d'aujourd'hui." },
            { label: "Carnet de santé — couverture", date: "intact", note: "Prénom visible. Pas de date de naissance." },
            { label: "Programme TV — semaine 43", date: "1997", note: "Une émission entourée au stylo rouge. Le titre est partiellement effacé." },
          ].map((doc, i) => (
            <div key={i} style={{
              padding: "16px 0",
              borderBottom: `1px solid ${C.terra}15`,
              display: "flex", justifyContent: "space-between",
              alignItems: "flex-start",
            }}>
              <div>
                <div style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: 15, color: C.cream,
                  marginBottom: 4,
                }}>
                  {doc.label}
                </div>
                <div style={{
                  fontFamily: "Space Mono, monospace", fontSize: 10,
                  color: `${C.cream}40`, fontStyle: "italic",
                }}>
                  {doc.note}
                </div>
              </div>
              <div style={{
                fontFamily: "Space Mono, monospace", fontSize: 10,
                color: `${C.terra}60`, marginLeft: 16, flexShrink: 0,
              }}>
                {doc.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── SILENCE (cinematic pause between sections) ──────────────────────────────
const Silence = ({ text, visitCount }) => {
  const phase = getPhase(visitCount);
  if (phase === "confort") return null; // No silences in phase 1

  return (
    <div style={{
      padding: "60px 32px",
      textAlign: "center",
      borderTop: `1px solid ${C.terra}15`,
      borderBottom: `1px solid ${C.terra}15`,
    }}>
      <p style={{
        fontFamily: "Cormorant Garamond, serif",
        fontStyle: "italic", fontSize: 16,
        color: `${C.cream}65`,
        maxWidth: 400, margin: "0 auto",
        letterSpacing: "0.05em",
      }}>
        {text}
      </p>
    </div>
  );
};

// ─── MANIFESTO ───────────────────────────────────────────────────────────────
const SectionManifeste = () => (
  <section style={{
    padding: "100px 32px",
    borderTop: `1px solid ${C.terra}20`,
    background: `${C.terra}05`,
  }}>
    <div style={{ maxWidth: 680, margin: "0 auto" }}>

      {/* Label */}
      <div style={{
        fontFamily: "Space Mono, monospace", fontSize: 10,
        color: `${C.terra}80`, letterSpacing: "0.3em",
        marginBottom: 40, textAlign: "center",
      }}>
        MOOND · MANIFESTE
      </div>

      {/* Option A — phrase d'ouverture */}
      <p style={{
        fontFamily: "Cormorant Garamond, serif",
        fontSize: "clamp(16px, 2.5vw, 22px)",
        color: `${C.cream}70`, lineHeight: 1.7,
        marginBottom: 48, textAlign: "center",
        fontStyle: "italic",
      }}>
        MOOND est un projet créatif. Une famille fictive. Des vêtements réels.
      </p>

      {/* Citation — coupée après Vide. */}
      <blockquote style={{
        fontFamily: "Cormorant Garamond, serif",
        fontSize: "clamp(18px, 3vw, 28px)",
        fontStyle: "italic", fontWeight: 300,
        color: C.cream, lineHeight: 1.6,
        marginBottom: 48,
        borderLeft: `3px solid ${C.terra}60`,
        paddingLeft: 28,
        textAlign: "left",
      }}>
        « On vous a menti. Des chaussettes pareilles sur un enfant, c'est comme un livre dont toutes les pages sont blanches. Propre. Parfait.{" "}
        <span style={{
          display: "block",
          fontSize: "clamp(28px, 5vw, 48px)",
          color: C.terra,
          fontWeight: 700,
          letterSpacing: "0.05em",
          marginTop: 8,
          fontStyle: "italic",
        }}>
          Vide.
        </span>
        »
      </blockquote>

      {/* Deux blocs RMS + SANS PARLER */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 32, marginBottom: 64,
      }}>
        <div style={{
          borderTop: `2px solid ${C.terra}60`,
          paddingTop: 20,
        }}>
          <div style={{
            fontFamily: "Cinzel, serif", fontSize: 12,
            fontWeight: 600, color: C.terra,
            letterSpacing: "0.2em", marginBottom: 12,
          }}>
            RMS
          </div>
          <p style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: 15, color: `${C.cream}75`,
            lineHeight: 1.7, fontStyle: "italic",
          }}>
            Des vêtements pour les enfants. Et une permission pour les parents.
          </p>
        </div>

        <div style={{
          borderTop: `2px solid ${C.gold}60`,
          paddingTop: 20,
        }}>
          <div style={{
            fontFamily: "Cinzel, serif", fontSize: 12,
            fontWeight: 600, color: C.gold,
            letterSpacing: "0.2em", marginBottom: 12,
          }}>
            SANS PARLER
          </div>
          <p style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: 15, color: `${C.cream}75`,
            lineHeight: 1.7, fontStyle: "italic",
          }}>
            Un système de rustines interchangeables. Pour dire ce qu'on n'arrive pas toujours à dire.
          </p>
        </div>
      </div>

      {/* Option C — phrase de clôture */}
      <div style={{
        textAlign: "center",
        borderTop: `1px solid ${C.terra}20`,
        paddingTop: 48,
      }}>
        <p style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "clamp(20px, 3.5vw, 32px)",
          fontStyle: "italic", fontWeight: 300,
          color: C.cream, lineHeight: 1.6,
          letterSpacing: "0.05em",
        }}>
          Imparfait de la tête aux pieds.
        </p>
        <p style={{
          fontFamily: "Space Mono, monospace",
          fontSize: 11, color: `${C.cream}40`,
          letterSpacing: "0.25em", marginTop: 12,
        }}>
          C'est peu. C'est exactement ça.
        </p>
      </div>

    </div>
  </section>
);

// ─── FOOTER ──────────────────────────────────────────────────────────────────
const Footer = ({ visitCount }) => {
  const phase = getPhase(visitCount);

  return (
    <footer style={{
      borderTop: `1px solid ${C.terra}20`,
      padding: "48px 32px",
      background: `#0A0806`,
    }}>
      <div className="footer-inner" style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", flexWrap: "wrap", gap: 32,
      }}>
        <div>
          <div style={{
            fontFamily: "Cinzel, serif", fontSize: 20, fontWeight: 700,
            letterSpacing: "0.2em", color: C.cream, marginBottom: 8,
          }}>
            M<span style={{ color: C.terra }}>O</span><span style={{ color: C.gold }}>O</span>ND
          </div>
          <p style={{
            fontStyle: "italic", color: `${C.cream}50`,
            fontSize: 14, maxWidth: 300,
          }}>
            Imparfait de la tête aux pieds.
          </p>
        </div>

        <div className="footer-right" style={{
          fontFamily: "Space Mono, monospace", fontSize: 10,
          color: `${C.cream}30`, textAlign: "right",
          lineHeight: 2,
        }}>
          <div>@ratemaisstyle</div>
          <div>Orléans · 2026</div>
          <div style={{ marginTop: 8, color: `${C.terra}40` }}>
            {phase !== "confort" && `Visite ${visitCount} · Phase ${phase.toUpperCase()}`}
            {phase === "confort" && "Archive familiale"}
          </div>
        </div>
      </div>

      {/* Phase-specific footer note */}
      {(phase === "absence" || phase === "fragmentation") && (
        <div style={{
          maxWidth: 1200, margin: "24px auto 0",
          paddingTop: 24, borderTop: `1px solid ${C.terra}15`,
          fontFamily: "Space Mono, monospace", fontSize: 10,
          color: `${C.terra}50`, fontStyle: "italic",
          textAlign: "center",
        }}>
          Certaines sections de cette archive sont temporairement indisponibles.
        </div>
      )}
    </footer>
  );
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function MoondApp() {
  const [showVHS, setShowVHS] = useState(true);
  const [visitData, setVisitData] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const [drawerProduct, setDrawerProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const audioRef = useRef(null);
  const [soundOn, setSoundOn] = useState(false);

  const toggleSound = () => {
    if (!audioRef.current) return;
    if (soundOn) {
      audioRef.current.pause();
      setSoundOn(false);
    } else {
      audioRef.current.volume = 0.35;
      audioRef.current.play().catch(() => {});
      setSoundOn(true);
    }
  };

  const handleAddToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  const handleRemoveFromCart = (index) => {
    if (index === "all") setCart([]);
    else setCart(prev => prev.filter((_, i) => i !== index));
  };

  // Check for ad bypass
  const isAdBypass = typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("src") === "ad";

  useEffect(() => {
    const data = incrementVisit();
    setVisitData(data);
    if (isAdBypass) {
      setShowVHS(false);
    }
  }, []);

  const visitCount = visitData?.count || 1;

  const handleEnter = () => {
    setShowVHS(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "famille": return <SectionFamille visitCount={visitCount} onOpenDrawer={setDrawerProduct} />;
      case "banalites": return <SectionBanalites />;
      case "reliques": return <SectionReliques onOpenDrawer={setDrawerProduct} />;
      case "fragments": return <SectionFragments onOpenDrawer={setDrawerProduct} />;
      case "archive": return <SectionArchive visitCount={visitCount} />;
      default: return (
        <>
          <SectionHero visitCount={visitCount} setActiveSection={setActiveSection} />
          <Silence
            text="Les vêtements ne montrent pas ce que tu portes. Ils montrent ce que tu vis."
            visitCount={visitCount}
          />
          <SectionFamille visitCount={visitCount} onOpenDrawer={setDrawerProduct} />
          <Silence
            text="Réparer peut être plus beau que remplacer."
            visitCount={visitCount}
          />
          <SectionFragments onOpenDrawer={setDrawerProduct} />
          <SectionReliques onOpenDrawer={setDrawerProduct} />
          <Silence
            text="Ce qu'on répare, on l'aime encore plus fort."
            visitCount={visitCount}
          />
          <SectionBanalites />
          <SectionArchive visitCount={visitCount} />
          <SectionManifeste />
        </>
      );
    }
  };

  return (
    <div className="noise-bg" style={{ minHeight: "100vh", background: C.black }}>
      <GlobalStyle />
      <audio ref={audioRef} src="/vhs-lullaby.mp3" loop preload="auto" />


      {/* Bouton son — toujours visible partout */}
      <button
        onClick={toggleSound}
        style={{
          position: "fixed", bottom: 24, right: 24,
          zIndex: 99999,
          background: soundOn ? C.terra : "transparent",
          border: `2px solid ${C.terra}`,
          color: soundOn ? C.cream : C.terra,
          width: 44, height: 44,
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: 18,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.3s ease",
        }}
      >
        {soundOn ? "🔊" : "🔇"}
      </button>

      {/* VHS Entry — skip if ad bypass */}
      {showVHS && !isAdBypass && (
        <VHSEntry onEnter={handleEnter} visitCount={visitCount} />
      )}

      {/* Main site */}
      {(!showVHS || isAdBypass) && (
        <div style={{ animation: "fadeInSlow 0.8s ease" }}>
          <Ticker visitCount={visitCount} />
          <Header
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            cartCount={cart.length}
            onOpenCart={() => setShowCart(true)}
          />
          <main>
            {renderSection()}
          </main>
          <Footer visitCount={visitCount} />
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <CartDrawer
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemove={handleRemoveFromCart}
        />
      )}

      {/* Product Drawer */}
      {drawerProduct && (
        <ProductDrawer
          product={drawerProduct}
          onClose={() => setDrawerProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
