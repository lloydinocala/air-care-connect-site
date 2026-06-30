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
import ServicesEs from './components/ServicesEs';
import ClubEs from './components/ClubEs';
import AboutEs from './components/AboutEs';
import ContactEs from './components/ContactEs';
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
            {/* English */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/club" element={<Club />} />
            <Route path="/club/documents" element={<ClubDocuments />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Español */}
            <Route path="/aire-azul" element={<AireAzul />} />
            <Route path="/aire-azul/services" element={<ServicesEs />} />
            <Route path="/aire-azul/club" element={<ClubEs />} />
            <Route path="/aire-azul/documentos" element={<ClubDocumentsEs />} />
            <Route path="/aire-azul/about" element={<AboutEs />} />
            <Route path="/aire-azul/contact" element={<ContactEs />} />
          </Routes>
        </main>
        <Footer />
        <ComfortGuideWidget />
      </div>
    </Router>
  );
}
