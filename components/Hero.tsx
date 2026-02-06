import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

// --- MAGNETIC BUTTON COMPONENT ---
const MagneticButton = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.3); // Magnetic strength
    y.set((clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20 pb-0 bg-[#0b0f14]">
      
      {/* 1. BACKGROUND: THE COSMIC NEBULA */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep Space Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0b0f14] to-[#020202]" />
        
        {/* Northern Lights / Nebula Effect */}
        <motion.div 
           animate={{ 
             opacity: [0.3, 0.6, 0.3],
             scale: [1, 1.2, 1],
             rotate: [0, 10, -10, 0]
           }}
           transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[150vw] md:w-[80vw] h-[80vh] bg-gradient-to-r from-primary/10 via-blue-600/10 to-purple-600/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen"
        />
        
        {/* Animated Grid Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-[linear-gradient(to_bottom,transparent_0%,#0b0f14_100%),linear-gradient(rgba(33,201,151,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(33,201,151,0.1)_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:60px_60px] perspective-[1000px] origin-bottom transform rotate-x-[60deg] opacity-20" />

        {/* Floating Particles */}
        {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                    width: Math.random() * 2 + 1,
                    height: Math.random() * 2 + 1,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                }}
                animate={{
                    y: [0, -100],
                    opacity: [0, 0.8, 0],
                }}
                transition={{
                    duration: Math.random() * 5 + 5,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "linear",
                }}
            />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-6 md:mb-8 hover:border-primary/50 transition-colors shadow-[0_0_20px_rgba(33,201,151,0.1)]"
          >
            <div className="relative">
                <span className="absolute inset-0 rounded-full bg-primary blur-sm animate-pulse opacity-50"></span>
                <div className="w-2 h-2 bg-primary rounded-full relative z-10" />
            </div>
            <span className="text-[10px] md:text-xs font-mono text-primary tracking-[0.2em] font-bold">NORTH OS // ONLINE</span>
          </motion.div>
          
          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 md:mb-8 leading-[0.9] drop-shadow-2xl">
            <span className="block text-white">GELECEĞİ</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-200 to-teal-500 animate-gradient-x">TASARLA.</span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-gray-400 mb-10 md:mb-12 leading-relaxed font-light px-4 md:px-0">
            Kusursuz mühendislik, sınırsız özgürlük. Yaşam alanınızı, North teknolojisiyle kendi kendine yeten <span className="text-white font-medium border-b border-primary/30 pb-0.5">otonom bir enerji ekosistemine</span> dönüştürün.
          </p>

          {/* Magnetic Buttons - DARK & GLOWING */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-16 w-full px-4 md:px-0">
            <MagneticButton className="w-full sm:w-auto">
               <Link
                to="/basvuru"
                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-[#121820] text-white font-bold rounded-full overflow-hidden transition-all border border-primary/50 shadow-[0_0_30px_rgba(33,201,151,0.2)] hover:shadow-[0_0_50px_rgba(33,201,151,0.5)] hover:border-primary text-sm md:text-base"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles size={18} className="text-primary" /> Hemen Başla
                </span>
              </Link>
            </MagneticButton>
            
            <MagneticButton className="w-full sm:w-auto">
              <Link
                to="/galeri"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white/5 text-white font-medium rounded-full border border-white/10 hover:bg-white/10 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] backdrop-blur-md text-sm md:text-base"
              >
                Projeleri İncele
              </Link>
            </MagneticButton>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
             <span className="text-[10px] text-gray-500 uppercase tracking-widest">Keşfet</span>
             <div className="w-[1px] h-12 md:h-16 bg-gradient-to-b from-transparent via-primary/50 to-transparent relative overflow-hidden">
                <motion.div 
                   animate={{ y: [-100, 100] }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 bg-gradient-to-b from-transparent via-primary to-transparent"
                />
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;