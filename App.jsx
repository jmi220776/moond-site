import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Famille from './pages/Famille.jsx';
import './styles/global.css';

// ============================================================
// MOOND — App principale avec routing
// "/"        → Home (vidéo + landing + 3 portes)
// "/famille" → Page Famille (hero + 4 onglets + dressings)
// ============================================================

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/famille" element={<Famille />} />
      </Routes>
    </BrowserRouter>
  );
}
