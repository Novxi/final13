import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';

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
    <section className="relative h-[100dvh] min-h-[800px] flex flex-col justify-center items-center overflow-hidden bg-[#0b0f14] py-0">
      
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

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center max-w-7xl mx-auto flex flex-col items-center justify-center w-full"
        >
          {/* MAIN HERO CONTENT RESTRUCTURED */}
          <div className="flex flex-col items-center justify-center gap-6 md:gap-8 mb-10 w-full pt-16 md:pt-24">
              
              {/* 1. Logo Image */}
        
        <div className="flex justify-center w-full">
  <div className="relative inline-flex items-center justify-center">
    {/* Glow halo */}
    <div
      className="absolute -inset-6 -z-10 rounded-full blur-2xl opacity-80"
      style={{
        background:
          "radial-gradient(circle, rgba(255,204,0,0.45) 0%, rgba(255,204,0,0.18) 35%, transparent 70%)",
      }}
    />

    <img
      src="/images/logo.png"
      alt="North Enerji"
      className="relative h-14 sm:h-20 md:h-24 lg:h-28 w-auto object-contain mx-auto"
      style={{
        filter:
          "drop-shadow(0 0 14px rgba(255,204,0,0.55)) drop-shadow(0 0 40px rgba(255,204,0,0.25))",
      }}
    />
  </div>
</div>


              {/* 2. Text: İSTEDİĞİNİZ (Titanium Style) */}
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-6xl md:text-7xl font-display font-bold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-500 drop-shadow-[0_5px_15px_rgba(255,255,255,0.1)] text-center w-full pb-2"
              >
                İSTEDİĞİNİZ
              </motion.h2>

              {/* 3. Animated Badges: YERDE | SÜREYLE | GÜÇTE */}
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 w-full px-4">
                  {['YERDE', 'SÜREYLE', 'GÜÇTE'].map((word, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1,
                            y: [0, -5, 0] // Gentle float
                        }}
                        transition={{ 
                            opacity: { duration: 0.5, delay: 0.5 + (i * 0.15) },
                            scale: { duration: 0.5, delay: 0.5 + (i * 0.15), type: "spring" },
                            y: { duration: 3 + i, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }
                        }}
                        className="group relative"
                      >
                          {/* Main Container */}
                          <div className="relative px-6 py-3 md:px-10 md:py-4 rounded-2xl bg-[#121820]/60 backdrop-blur-xl border border-white/10 text-white font-display font-bold text-sm md:text-xl tracking-[0.15em] shadow-xl overflow-hidden transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(33,201,151,0.2)] flex items-center justify-center min-w-[120px] md:min-w-[160px]">
                              {/* Shimmer Effect */}
                              <motion.div 
                                  className="absolute top-0 left-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
                                  animate={{ x: ['-200%', '300%'] }}
                                  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 1.5 }}
                              />
                              {/* Content */}
                              <div className="relative z-10 flex items-center gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-blue-400' : i === 1 ? 'bg-purple-400' : 'bg-primary'} animate-pulse shadow-[0_0_10px_currentColor]`} />
                                  {word}
                              </div>
                          </div>
                      </motion.div>
                  ))}
              </div>

              {/* 4. Text: ELEKTRİK (High Voltage Effect) */}
              <div className="relative w-full flex justify-center perspective-[500px]">
                  {/* Main Text with Flowing Energy Gradient */}
                  <motion.h2 
                    animate={{ backgroundPosition: ["0% center", "200% center"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="relative z-20 text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-display font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary bg-[size:200%_auto] drop-shadow-[0_0_35px_rgba(33,201,151,0.6)] py-2 text-center w-full"
                  >
                    ELEKTRİK
                  </motion.h2>
              </div>
          </div>

          {/* Description (Preserved) */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-400 mb-10 md:mb-12 leading-relaxed font-light px-4 md:px-0 text-center relative z-30">
            North Enerji Teknolojisiyle Yaşam Alanınızı Kendi Kendine Yeten <span className="text-white font-medium border-b border-primary/30 pb-0.5">otonom bir enerji ekosistemine</span> dönüştürün.
          </p>

          {/* Magnetic Buttons (Preserved) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-12 w-full px-4 md:px-0 relative z-30">
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

          {/* Scroll Indicator - Bottom Anchored */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-30 opacity-60 hover:opacity-100 transition-opacity"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
             <span className="text-[10px] text-gray-500 uppercase tracking-widest">Keşfet</span>
             <ChevronDown size={20} className="text-primary animate-bounce" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;