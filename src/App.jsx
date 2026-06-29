import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './components/Home';
import Services from './components/Services';
import Club from './components/Club';
import About from './components/About';
import Contact from './components/Contact';
import AireAzul from './components/AireAzul';
import ClubDocuments from './components/ClubDocuments';
import ClubDocumentsEs from './components/ClubDocumentsEs';
import ComfortGuideWidget from './components/ComfortGuideWidget';
import './App.css';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div className="site-wrapper">
        <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <main onClick={() => setMenuOpen(false)}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/club" element={<Club />} />
            <Route path="/club/documents" element={<ClubDocuments />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/aire-azul" element={<AireAzul />} />
            <Route path="/aire-azul/documentos" element={<ClubDocumentsEs />} />
          </Routes>
        </main>
        <Footer />
        <ComfortGuideWidget />
      </div>
    </Router>
  );
}
