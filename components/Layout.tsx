import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Sparkles, Lock } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

// --- VIP WELCOME TOAST ---
const WelcomeToast = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShow(true), 1500);
        const hideTimer = setTimeout(() => setShow(false), 8000);
        return () => { clearTimeout(timer); clearTimeout(hideTimer); };
    }, []);

    return (
        <AnimatePresence>
            {show && (
                <motion.div 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    className="fixed top-24 right-6 z-[100000] hidden md:flex items-center gap-4 bg-[#0b0f14]/80 backdrop-blur-xl border border-primary/20 p-4 rounded-2xl shadow-[0_0_30px_rgba(33,201,151,0.15)] pointer-events-auto"
                >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center relative">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">Hoş Geldiniz</div>
                        <div className="text-sm text-white">North Enerji ekosistemini keşfedin.</div>
                    </div>
                    <button onClick={() => setShow(false)} className="ml-2 text-gray-500 hover:text-white"><X size={14} /></button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
        const scrolled = window.scrollY > 20;
        if (scrolled !== isScrolled) setIsScrolled(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  useEffect(() => {
    // Close mobile menu on route change
    setMobileMenuOpen(false);
  }, [location]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [mobileMenuOpen]);

  // --- ADMIN MODE: Bypasses standard layout completely ---
  if (isAdmin) {
      return <>{children}</>;
  }

  const navLinks = [
    { name: 'Hizmetler', path: '/hizmetler' },
    { name: 'Galeri', path: '/galeri' },
    { name: 'North TV', path: '/video' },
    { name: 'İletişim', path: '/iletisim' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f14] text-gray-100 font-sans selection:bg-primary selection:text-black relative">
      {/* Global Elements */}
      <WelcomeToast />
      <div className="noise-bg" />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[100001] pointer-events-none"
        style={{ scaleX }}
      />

      {/* 
          HEADER FIX - ULTIMATE:
          - Parent: pointer-events-none (Transparent clicks pass through)
          - Children (Logo, Nav, Buttons): pointer-events-auto (They capture clicks)
          - Container: pointer-events-none (Crucial! So the empty space between logo and nav doesn't block clicks)
      */}
      <header
        className={`fixed top-0 left-0 right-0 z-[99999] transition-all duration-500 border-b border-transparent pointer-events-none ${
          isScrolled ? 'bg-[#0b0f14]/80 backdrop-blur-xl border-white/5 py-3' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between pointer-events-none">
          {/* Logo - Auto Pointer */}
          <Link to="/" className="flex items-center gap-2 group relative z-50 cursor-pointer pointer-events-auto">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors border border-transparent group-hover:border-primary/20">
              <Sun className="text-primary w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight leading-none text-white">NORTH</span>
              <span className="text-xs text-primary font-medium tracking-widest uppercase">ENERJİ</span>
            </div>
          </Link>

          {/* Desktop Nav - Auto Pointer */}
          <nav className="hidden md:flex items-center gap-8 relative z-50 pointer-events-auto">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group py-2 cursor-pointer"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* CTA & Mobile Toggle - Auto Pointer */}
          <div className="flex items-center gap-4 relative z-50 pointer-events-auto">
            {/* Exclusive Client Portal Button */}
            
            <Link
              to="/basvuru"
              className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 bg-primary/20 border border-primary/50 rounded-full hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(33,201,151,0.4)] hover:scale-105 cursor-pointer"
            >
              Teklif Al
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            className="fixed inset-0 z-[100002] bg-[#0b0f14]/95 backdrop-blur-xl pt-28 px-6 md:hidden flex flex-col items-center justify-center h-screen pointer-events-auto"
          >
            <div className="flex flex-col gap-6 text-center w-full max-w-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-3xl font-display font-medium text-white hover:text-primary transition-colors py-2 cursor-pointer"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/basvuru"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-6 w-full py-4 text-xl font-bold text-white bg-primary/20 border border-primary rounded-2xl hover:bg-primary hover:text-black transition-all cursor-pointer"
              >
                Teklif Al
              </Link>
              <Link 
                to="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-gray-500 mt-8 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock size={14} /> Client Portal Girişi
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-24 md:pt-0 relative z-0">
        <AnimatePresence mode='wait'>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative z-0 h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#121820] border-t border-white/5 pt-16 pb-8 relative overflow-hidden z-10">
        {/* Footer Glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Sun className="text-primary w-6 h-6" />
                <span className="font-display font-bold text-xl text-white">NORTH ENERJİ</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Geleceğin enerjisini bugünden tasarlıyoruz. Konut ve ticari solar çözümlerinde mühendislik odaklı yaklaşım.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-white mb-4">Hizmetler</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/hizmetler" className="hover:text-primary transition-colors cursor-pointer">Solar Sistemler</Link></li>
                <li><Link to="/hizmetler" className="hover:text-primary transition-colors cursor-pointer">Enerji Depolama</Link></li>
                <li><Link to="/hizmetler" className="hover:text-primary transition-colors cursor-pointer">Araç Şarj İstasyonları</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-white mb-4">Kurumsal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/galeri" className="hover:text-primary transition-colors cursor-pointer">Projeler</Link></li>
                <li><Link to="/video" className="hover:text-primary transition-colors cursor-pointer">Medya</Link></li>
                <li><Link to="/iletisim" className="hover:text-primary transition-colors cursor-pointer">İletişim</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-white mb-4">İletişim</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-primary font-bold">+90 (462) 330 61 00</span>
                </li>
                <li>info@northenerji.com.tr</li>
                <li>Sanayi, Değirmen 1 Nolu Sokak No:2/1, 61030 Ortahisar/Trabzon</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>&copy; 2024 North Enerji Sistemleri A.Ş. Tüm hakları saklıdır.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors cursor-pointer">KVKK</a>
              <a href="#" className="hover:text-white transition-colors cursor-pointer">Çerez Politikası</a>
              <a href="#" className="hover:text-white transition-colors cursor-pointer">Gizlilik</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;