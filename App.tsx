import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ChatWidget from './components/ChatWidget';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import VideoPage from './pages/VideoPage';
import Contact from './pages/Contact';
import LeadForm from './components/LeadForm'; 
import ServiceQuoteForm from './components/ServiceQuoteForm'; // Imported new component
import { ScrollToTop } from './utils/ScrollToTop';

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hizmetler" element={<Services />} />
          <Route path="/galeri" element={<Gallery />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/iletisim" element={<Contact />} />
          
          {/* General Lead Form - Increased padding-top to 32 (8rem) to prevent header overlap issues */}
          <Route path="/basvuru" element={
            <div className="pt-32 pb-20 container mx-auto px-6 relative z-10">
               <LeadForm />
            </div>
          } />

          {/* Specific Service Quote Form */}
          <Route path="/hizmet-teklifi" element={<ServiceQuoteForm />} />
          
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ChatWidget />
      </Layout>
    </Router>
  );
};

export default App;