import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, animate, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sun, Zap, ArrowRight, Shield, Wifi, Cpu, Layers, Snowflake, Flame, Activity, Disc, MoveRight, Box, Grid, CheckCircle2, Clock, Banknote, Wind, Thermometer, BatteryCharging, Power, ChevronUp, Leaf, Timer, AlertTriangle, ChevronsUp, Smile, Frown, BatteryWarning, Gauge, ZapOff, TimerReset, Plug, Volume2, MousePointer2 } from 'lucide-react';

// --- UTILS & SHARED ---

const ScrambleText = ({ text, className }: { text: string, className?: string }) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const [display, setDisplay] = useState(text);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    setTrigger(true);
  }, []);

  useEffect(() => {
    if (!trigger) return;
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(
        text.split("").map((letter, index) => {
            if (index < iterations) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join("")
      );
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1 / 3;
    }, 30);
    return () => clearInterval(interval);
  }, [trigger, text]);

  return <span className={className}>{display}</span>;
};

// Local Animated Counter for Services Page
const ServiceCounter = ({ from, to, duration = 2 }: { from: number, to: number, duration?: number }) => {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const inView = useInView(nodeRef, { once: true });

    useEffect(() => {
        if (!inView) return;
        const node = nodeRef.current;
        const controls = animate(from, to, {
            duration: duration,
            onUpdate(value) {
                if (node) node.textContent = value.toFixed(0);
            },
            ease: "easeOut"
        });
        return () => controls.stop();
    }, [from, to, inView, duration]);

    return <span ref={nodeRef}>{from}</span>;
};

const SectionHeader = ({ number, title, subtitle, description }: { number: string, title: string, subtitle: string, description?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }} 
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="mb-8 md:mb-12 relative z-10"
  >
    <div className="flex items-center gap-4 mb-4">
      <span className="font-mono text-primary text-xs tracking-[0.2em] border border-primary/30 px-2 py-1 rounded bg-primary/5 shadow-[0_0_10px_rgba(33,201,151,0.2)]">
        {number}
      </span>
      <div className="h-px w-12 bg-gradient-to-r from-primary/50 to-transparent" />
      <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium">{subtitle}</span>
    </div>
    <h2 className="text-3xl md:text-7xl font-display font-bold text-white leading-[1.1] tracking-tight mb-4 md:mb-6">
      {title}
    </h2>
    {description && (
      <p className="text-gray-400 text-base md:text-xl font-light leading-relaxed max-w-2xl border-l-2 border-primary/30 pl-4 md:pl-6">
        {description}
      </p>
    )}
  </motion.div>
);

const NavRail = () => {
  const [activeSection, setActiveSection] = useState(0);
  
  useEffect(() => {
    let timeoutId: number;
    const handleScroll = () => {
      if (timeoutId) return;
      
      timeoutId = window.setTimeout(() => {
        const sections = ['hero', 'solar', 'ev', 'storage', 'heatpump'];
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        sections.forEach((id, index) => {
          const element = document.getElementById(id);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(index);
            }
          }
        });
        timeoutId = 0;
      }, 100); // Throttled to 100ms
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(timeoutId);
    }
  }, []);

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-6 mix-blend-difference pointer-events-none">
      {['Giriş', 'Solar', 'EV Şarj', 'Depolama', 'İklim'].map((label, i) => (
        <a key={i} href={`#${['hero', 'solar', 'ev', 'storage', 'heatpump'][i]}`} className="relative flex items-center justify-end group pointer-events-auto">
           <span className={`absolute right-8 text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${activeSection === i ? 'opacity-100 translate-x-0 text-primary blur-0' : 'opacity-0 translate-x-4 text-gray-500 blur-sm'}`}>
             {label}
           </span>
           <div className="relative flex items-center justify-center w-2">
             {activeSection === i && (
                <motion.div layoutId="nav-glow" className="absolute w-1.5 h-8 bg-primary shadow-[0_0_15px_#21c997] rounded-full" />
             )}
             <motion.div 
               className={`w-1 transition-all duration-500 rounded-full bg-white/20 ${activeSection === i ? 'h-0 opacity-0' : 'h-1.5'}`}
             />
           </div>
        </a>
      ))}
    </div>
  );
};

// --- SECTION 1: SOLAR (High Efficiency) ---

const Solar3DCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  return (
    <div style={{ perspective: 1000 }} className="relative w-full max-w-[300px] md:max-w-[400px] aspect-[3/4] mx-auto z-10">
      {/* Backlight Glow Effect - Strictly contained within the wrapper area to prevent bleeding */}
      <motion.div 
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-4 bg-amber-500/50 rounded-[2rem] blur-[40px] -z-10"
      />
      
      {/* Ambient Outer Glow - Centered on the card, restrained width */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-amber-600/10 blur-[80px] -z-20 pointer-events-none rounded-full" />

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
        style={{ rotateX, rotateY }}
        className="relative z-10 w-full h-full rounded-[2rem] bg-[#050505] border border-white/10 overflow-hidden shadow-2xl"
      >
        {/* Panel Grid Visual */}
        <div className="absolute inset-0 grid grid-cols-4 gap-[1px] bg-black p-[1px] opacity-90">
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="bg-[#0f1520] relative overflow-hidden group/cell">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent group-hover/cell:from-amber-500/20 transition-colors duration-500" />
            </div>
          ))}
        </div>
        
        {/* Simple Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
             <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                     <Sun size={20} />
                 </div>
                 <div>
                     <div className="text-white font-bold text-base md:text-lg">Maksimum Verim</div>
                     <div className="text-gray-400 text-[10px] md:text-xs">Yapay Zeka Destekli</div>
                 </div>
             </div>
             <div className="h-1 w-full bg-gray-800 rounded-full mt-4 overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }} 
                    whileInView={{ width: "98%" }} 
                    transition={{ duration: 1.5 }} 
                    className="h-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" 
                 />
             </div>
        </div>
      </motion.div>
    </div>
  );
};

const SolarSection = () => {
  return (
    <section id="solar" className="relative min-h-screen bg-[#0b0f14] border-b border-white/5 py-12 md:py-24">
      <div className="container mx-auto px-6 relative z-10">
         <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-16">
            
            <div className="lg:w-1/2">
               <SectionHeader 
                 number="01" 
                 title="GÜNEŞ ENERJİSİ" 
                 subtitle="Fotovoltaik Sistemler"
                 description="Çatınızdaki atıl alanı, evinize para kazandıran bir enerji santraline dönüştürün. Kuzey Avrupa standartlarında mühendislik ile tanışın."
               />
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {[
                    { title: "Elektrik Faturasına Son", desc: "Tüketiminizi %100'e kadar karşılayın.", icon: Banknote },
                    { title: "30 Yıl Garanti", desc: "Sektörün en uzun performans garantisi.", icon: Shield },
                    { title: "Akıllı İzleme", desc: "Telefondan anlık üretim takibi.", icon: Wifi },
                    { title: "Değer Artışı", desc: "Evinizin emlak değerini yükseltir.", icon: Activity }
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <item.icon className="text-amber-400 w-6 h-6 mb-3" />
                        <h4 className="text-white font-bold mb-1">{item.title}</h4>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  ))}
               </div>
               
               <Link to="/basvuru" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-amber-400 transition-all">
                  Ücretsiz Keşif İste <ArrowRight size={18} />
               </Link>
            </div>

            <div className="lg:w-1/2 flex justify-center w-full">
               <Solar3DCard />
            </div>

         </div>
      </div>
    </section>
  );
};

// --- SECTION 2: EV (2D FLAT VECTOR SCENE - PREMIUM VERSION) ---

const TwoDCharger = () => (
    <div className="relative w-20 md:w-24 h-56 md:h-64 flex flex-col items-center justify-end">
        {/* Glow behind */}
        <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full" />
        
        {/* Station Body SVG - Sleeker Design */}
        <svg viewBox="0 0 100 300" className="w-full h-full drop-shadow-[0_0_20px_rgba(33,201,151,0.4)]">
            <defs>
               <linearGradient id="chargerBody" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#111827" />
                  <stop offset="50%" stopColor="#1f2937" />
                  <stop offset="100%" stopColor="#111827" />
               </linearGradient>
            </defs>
            {/* Main Body */}
            <path d="M25,280 L75,280 L75,40 C75,25 65,15 50,15 C35,15 25,25 25,40 Z" 
                  fill="url(#chargerBody)" stroke="#22c55e" strokeWidth="2" />
            
            {/* Screen Area */}
            <rect x="32" y="50" width="36" height="60" rx="4" fill="#000" stroke="#22c55e" strokeWidth="1" />
            <path d="M40,70 L50,80 L60,65" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse" />
            
            {/* LED Status Ring */}
            <circle cx="50" cy="30" r="3" fill="#22c55e" className="animate-pulse">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Cable Holster */}
            <path d="M75,100 L85,100 L85,140 L75,140" fill="none" stroke="#22c55e" strokeWidth="2" />
        </svg>
    </div>
);

const TwoDCar = ({ status }: { status: string }) => {
    return (
        <motion.div 
            className="relative w-56 h-28 md:w-72 md:h-36"
            animate={status === 'parked' || status === 'charging' ? { y: [0, -2, 0] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
            <svg viewBox="0 0 320 160" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                <defs>
                    <linearGradient id="carBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#064e3b" />
                        <stop offset="40%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#064e3b" />
                    </linearGradient>
                    <linearGradient id="windowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                         <stop offset="0%" stopColor="#1f2937" stopOpacity="0.9"/>
                         <stop offset="100%" stopColor="#000" stopOpacity="0.95"/>
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <filter id="underglow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="8" result="blur"/>
                        <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
                    </filter>
                </defs>

                {/* Underglow */}
                <ellipse cx="160" cy="135" rx="130" ry="10" fill="#22c55e" opacity="0.3" filter="url(#underglow)" />

                {/* WHEELS (Solid - No Rims) */}
                {[75, 245].map((cx, i) => (
                    <g key={i}>
                        {/* Tire */}
                        <circle cx={cx} cy="125" r="22" fill="#0f172a" />
                        {/* Shadow Center */}
                        <circle cx={cx} cy="125" r="8" fill="#020617" />
                    </g>
                ))}

                {/* CAR BODY (Modern Sport Sedan/Coupe) */}
                <path d="M 20,115 
                         C 20,115 15,100 30,90
                         L 70,85 
                         L 100,55 
                         L 210,50 
                         L 270,75 
                         L 300,85 
                         C 310,90 315,100 310,115 
                         L 280,115 
                         A 26 26 0 0 1 210 115
                         L 110,115
                         A 26 26 0 0 1 40 115
                         Z" 
                      fill="url(#carBodyGrad)" 
                      stroke="#047857" 
                      strokeWidth="1" 
                />

                {/* WINDOWS (Sleek Profile) */}
                <path d="M 105,58 L 205,54 L 260,78 L 75,82 Z" fill="url(#windowGrad)" stroke="#374151" strokeWidth="1" />
                {/* Window Reflection */}
                <path d="M 110,60 L 180,58 L 150,80 Z" fill="white" fillOpacity="0.1" />

                {/* HEADLIGHT (Cyberpunk Blade) */}
                <path d="M 295,90 L 305,88 L 302,95 Z" fill="#fef08a" filter="url(#glow)" />
                {/* Headlight Beam */}
                <path d="M 305,90 L 450,70 L 450,110 Z" fill="url(#headlightBeam)" opacity={status === 'driving' ? 0.2 : 0} className="transition-opacity duration-500">
                     <defs>
                        <linearGradient id="headlightBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                        </linearGradient>
                     </defs>
                </path>

                {/* TAILLIGHT (Blade Strip) */}
                <path d="M 25,92 L 35,92" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" filter="url(#glow)" />

                {/* DOOR LINES & DETAILS */}
                <path d="M 130,82 L 130,110" stroke="#065f46" strokeWidth="1" />
                <path d="M 200,80 L 200,110" stroke="#065f46" strokeWidth="1" />
                <path d="M 135,88 L 145,88" stroke="#022c22" strokeWidth="2" strokeLinecap="round" /> {/* Handle */}

                {/* CHARGING PORT */}
                {status === 'charging' && (
                    <circle cx="85" cy="85" r="3" fill="#fff" filter="url(#glow)" className="animate-pulse" />
                )}
            </svg>
        </motion.div>
    )
}

const TwoDCable = ({ connected }: { connected: boolean }) => {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20">
            <defs>
                <filter id="neonStroke2D">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
            </defs>
            {connected && (
                <motion.path 
                    d="M 120 280 C 140 280, 160 380, 260 270" // Adjusted for new port position
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    filter="url(#neonStroke2D)"
                />
            )}
        </svg>
    )
}

const OpenEVScene = ({ mode }: { mode: 'standard' | 'turbo' }) => {
    const [status, setStatus] = useState<'driving' | 'parked' | 'charging'>('driving');
    const [chargePercent, setChargePercent] = useState(10);
    const inViewRef = useRef(null);

    useEffect(() => {
        setStatus('driving');
        const driveTimer = setTimeout(() => setStatus('parked'), 1000);
        const chargeTimer = setTimeout(() => setStatus('charging'), 1800);
        return () => { clearTimeout(driveTimer); clearTimeout(chargeTimer); };
    }, [mode]); // Re-run animation when mode changes

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (status === 'charging') {
            interval = setInterval(() => {
                setChargePercent(prev => prev < 100 ? prev + 1 : 100);
            }, mode === 'turbo' ? 30 : 150); // Faster charging visual for Turbo
        }
        return () => clearInterval(interval);
    }, [status, mode]);

    return (
        <div ref={inViewRef} className="relative w-full h-[320px] md:h-[400px] flex items-center justify-center overflow-hidden bg-[#0b0f14]/80 rounded-3xl border border-white/5 shadow-2xl">
            {/* 2D Cyberpunk Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
            <div className="absolute top-0 right-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-emerald-900/10 to-transparent" />

            <div className="relative w-full max-w-3xl h-full flex items-end pb-8 md:pb-12 px-6 md:px-12">
                
                {/* CHARGING STATION (Fixed Left) */}
                <div className="relative z-10 mr-2 md:mr-4 shrink-0">
                    <TwoDCharger />
                </div>

                {/* CABLE (Connects components) */}
                <div className="absolute inset-0 pointer-events-none">
                     <TwoDCable connected={status === 'charging'} />
                </div>

                {/* CAR (Animates In) */}
                <motion.div
                    className="relative z-10 mb-4 flex-1"
                    initial={{ x: 600 }}
                    animate={status !== 'driving' ? { x: 0 } : { x: 600 }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                >
                    <TwoDCar status={status} />
                    
                    {/* EMOJI REACTION (Top Right of Car) */}
                    <AnimatePresence>
                        {status !== 'driving' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="absolute -top-8 -right-0 md:-top-12 md:-right-4"
                            >
                                <div className={`p-2 md:p-3 rounded-full backdrop-blur-md border shadow-lg ${
                                    mode === 'turbo' 
                                    ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                                    : 'bg-red-500/20 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                                }`}>
                                    {mode === 'turbo' ? (
                                        <Smile className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
                                    ) : (
                                        <Frown className="w-6 h-6 md:w-8 md:h-8 text-red-400" />
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Floating HUD - 2D Style */}
                    <AnimatePresence>
                        {status === 'charging' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0 }}
                                animate={{ opacity: 1, y: -60, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute top-0 left-1/2 -translate-x-1/2"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/60 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.2)] backdrop-blur-md relative overflow-hidden">
                                        <div className="absolute bottom-0 left-0 w-full bg-emerald-500/20 transition-all duration-300" style={{ height: `${chargePercent}%` }} />
                                        <Zap className="text-emerald-400 w-6 h-6 md:w-8 md:h-8 fill-emerald-400/20 animate-pulse relative z-10" />
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                                        {chargePercent}%
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

            </div>
        </div>
    );
};

const ChargingComparisonHUD = ({ mode, setMode }: { mode: 'standard' | 'turbo', setMode: (m: 'standard' | 'turbo') => void }) => {
    return (
        <div className={`relative w-full p-4 md:p-6 mt-8 md:mt-12 rounded-3xl border shadow-2xl overflow-hidden group transition-colors duration-500 ${
            mode === 'turbo' ? 'bg-[#050f0c] border-primary/20' : 'bg-[#1a0a0a] border-red-500/10'
        }`}>
            
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none transition-all duration-1000">
                <div className={`absolute -top-[20%] -right-[20%] w-[80%] h-[120%] blur-[80px] rounded-full opacity-20 transition-colors duration-1000 ${mode === 'turbo' ? 'bg-primary/20' : 'bg-red-500/10'}`} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
            </div>
            
            <h3 className="relative z-10 text-white font-display font-bold text-base md:text-lg flex items-center gap-2 mb-4 md:mb-6">
                <Activity className="text-primary w-5 h-5" />
                Şarj Hızı Karşılaştırması
            </h3>

            <div className="relative z-10 flex flex-col gap-3 md:gap-4">
                
                {/* --- OPTION 1: STANDARD (Cleaner Look - No Lines) --- */}
                <div 
                    onClick={() => setMode('standard')}
                    className={`relative p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-300 flex items-center gap-3 md:gap-4 border ${
                        mode === 'standard' ? 'bg-white/10 border-red-500/50' : 'bg-transparent border-white/5 hover:bg-white/5'
                    }`}
                >
                    {/* Icon */}
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                        <Plug className="text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    
                    {/* Bar Container - Removed Lines */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                             <span className="text-xs md:text-sm font-bold text-gray-300">Standart Priz</span>
                             <span className="text-[10px] md:text-xs text-gray-500">3kW AC</span>
                        </div>
                        <div className="h-3 md:h-4 bg-white/5 rounded-full overflow-hidden relative">
                             {/* Quarter Red Bar = Slow */}
                             <motion.div 
                                initial={{ width: "0%" }}
                                whileInView={{ width: "25%" }}
                                transition={{ duration: 1.5 }}
                                className="absolute inset-y-0 left-0 bg-red-500/60"
                             />
                        </div>
                    </div>

                    {/* Time Label */}
                    <div className="shrink-0 text-right w-16 md:w-20">
                        <div className="text-base md:text-xl font-bold text-red-400">8 Sa</div>
                        <div className="text-[9px] md:text-[10px] text-gray-500 uppercase">Bekleme</div>
                    </div>
                </div>

                {/* --- OPTION 2: NORTH TURBO (Short Bar) --- */}
                <div 
                    onClick={() => setMode('turbo')}
                    className={`relative p-3 md:p-4 rounded-xl border cursor-pointer transition-all duration-300 flex items-center gap-3 md:gap-4 ${
                        mode === 'turbo' ? 'bg-primary/10 border-primary/50 shadow-[0_0_20px_rgba(33,201,151,0.1)]' : 'bg-transparent border-white/5 hover:bg-white/5'
                    }`}
                >
                    {/* Icon */}
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 ${mode === 'turbo' ? 'bg-primary text-black' : 'bg-gray-800 text-gray-400'}`}>
                        <Zap className="w-5 h-5 fill-current" />
                    </div>
                    
                    {/* Bar Container */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                             <div className="flex items-center gap-2">
                                <span className="text-xs md:text-sm font-bold text-white">North Turbo</span>
                                {mode === 'turbo' && <span className="text-[8px] md:text-[9px] bg-primary text-black px-1.5 rounded font-bold animate-pulse">24x HIZLI</span>}
                             </div>
                             <span className="text-[10px] md:text-xs text-primary/80">120kW DC</span>
                        </div>
                        <div className="h-3 md:h-4 bg-white/5 rounded-full overflow-hidden relative">
                             {/* Full Green Bar = Fast */}
                             <motion.div 
                                initial={{ width: "0%" }}
                                whileInView={{ width: "100%" }} 
                                transition={{ duration: 1, delay: 0.2 }}
                                className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_#21c997]"
                             />
                        </div>
                    </div>

                    {/* Time Label */}
                    <div className="shrink-0 text-right w-16 md:w-20">
                        <div className="text-base md:text-xl font-bold text-primary">20 Dk</div>
                        <div className="text-[9px] md:text-[10px] text-gray-500 uppercase">Tam Şarj</div>
                    </div>
                </div>

            </div>
            
            {/* Footer Stat */}
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] md:text-xs text-gray-400">
                <span>* %10 - %80 Şarj Aralığı</span>
                <span className="text-primary font-bold">Zaman Tasarrufu: 7s 40dk</span>
            </div>
            
        </div>
    )
}

const EVSection = () => {
    const [mode, setMode] = useState<'standard' | 'turbo'>('standard');
    
    return (
        <section id="ev" className="py-12 md:py-24 bg-[#0b0f14] relative overflow-hidden border-t border-white/5">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 md:gap-16 items-center">
                     <div className="lg:w-1/2 order-2 lg:order-1 w-full">
                         <OpenEVScene mode={mode} />
                         <ChargingComparisonHUD mode={mode} setMode={setMode} />
                     </div>
                     <div className="lg:w-1/2 order-1 lg:order-2">
                         <SectionHeader 
                             number="02"
                             title="HIZLI ŞARJ"
                             subtitle="E-Mobilite Çözümleri"
                             description="Eviniz veya iş yeriniz için akıllı şarj istasyonu. Aracınızı güvenle şarj edin, yola her zaman hazır çıkın."
                         />
                         
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            {[
                                { title: "22kW AC / 180kW DC", desc: "İhtiyacınıza uygun güç seçenekleri.", icon: Zap },
                                { title: "Evrensel Uyumluluk", desc: "Tüm elektrikli araç modelleri ile tam uyumlu.", icon: Plug },
                                { title: "Akıllı Yük Dengeleme", desc: "Evinizin elektrik altyapısını yormadan maksimum hızda şarj.", icon: Activity },
                                { title: "Mobil Uygulama", desc: "Şarjı uzaktan başlatın/durdurun.", icon: Wifi }
                            ].map((item, i) => (
                                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex gap-4">
                                       <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                           <item.icon size={20} />
                                       </div>
                                       <div>
                                           <h4 className="text-white font-bold">{item.title}</h4>
                                           <p className="text-gray-400 text-sm">{item.desc}</p>
                                       </div>
                                    </div>
                                </div>
                            ))}
                         </div>
                         <div className="mt-6 md:mt-10">
                             {/* UPDATED LINK */}
                             <Link to="/hizmet-teklifi" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-primary font-bold hover:text-white transition-colors border border-primary/30 px-6 py-3 rounded-full hover:bg-primary hover:text-black">
                                 Şarj İstasyonu Teklifi Al <ArrowRight size={18} />
                             </Link>
                         </div>
                     </div>
                </div>
            </div>
        </section>
    );
};

const StorageBatteryVisual = () => {
    return (
        <div className="relative w-full max-w-[280px] md:max-w-md aspect-[4/5] p-2 flex flex-col items-center justify-end overflow-hidden mx-auto">
            {/* Top Contact */}
            <div className="absolute top-10 w-24 h-1 bg-white/20 rounded-full z-20" />
            
            <div className="w-full h-[80%] bg-[#080a0c] rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(33,201,151,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(33,201,151,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                {/* Animated Liquid Fill */}
                <motion.div 
                    initial={{ height: "0%" }}
                    whileInView={{ height: "100%" }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-900/60 via-emerald-600/20 to-emerald-400/5"
                >
                    <div className="absolute top-0 w-full h-1 bg-emerald-500/50 shadow-[0_0_20px_#10b981]" />
                </motion.div>

                {/* Bubbles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[1, 2, 3, 4, 5].map(i => (
                        <motion.div
                            key={i}
                            animate={{ y: [-20, -400], opacity: [0, 1, 0] }}
                            transition={{ duration: 3 + i, repeat: Infinity, ease: "linear", delay: i }}
                            className="absolute bottom-0 w-2 h-2 bg-emerald-400/30 rounded-full"
                            style={{ left: `${20 * i}%` }}
                        />
                    ))}
                </div>

                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center flex-col z-10">
                    <Zap className="text-emerald-400 w-12 h-12 md:w-16 md:h-16 mb-4 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-pulse" />
                    <div className="text-white font-bold text-4xl md:text-5xl font-display flex items-baseline gap-1">
                        %<ServiceCounter from={0} to={100} duration={2.5} />
                    </div>
                    <div className="text-emerald-400/70 text-xs md:text-sm uppercase tracking-widest mt-2 border border-emerald-500/30 px-3 py-1 rounded-full bg-emerald-500/5">
                        Tam Dolu
                    </div>
                </div>
            </div>
        </div>
    );
};

const StorageSection = () => {
  return (
    <section id="storage" className="py-12 md:py-32 bg-[#050505] relative border-t border-white/5">
       <div className="container mx-auto px-6 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
             
             {/* Visual */}
             <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
                 <StorageBatteryVisual />
             </div>

             {/* Info */}
             <div className="lg:col-span-7 order-1 lg:order-2">
                <SectionHeader 
                  number="03" 
                  title="KESİNTİSİZ ENERJİ" 
                  subtitle="Depolama Sistemleri"
                  description="Şebeke elektriği kesilse bile hayatınız durmasın. Gündüz güneşten ürettiğiniz fazladan enerjiyi depolayın, gece veya kesinti anında kullanın."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                   <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                       <h4 className="text-white font-bold text-lg mb-2">Off-Grid Özgürlüğü</h4>
                       <p className="text-gray-400 text-sm">Şebekeden tamamen bağımsız çalışabilme özelliği ile dağ evinde bile şehir konforu.</p>
                   </div>
                   <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                       <h4 className="text-white font-bold text-lg mb-2">Güvenli LFP Teknoloji</h4>
                       <p className="text-gray-400 text-sm">Yanma ve patlama riski olmayan, 6000+ çevrim ömrüne sahip en güvenli batarya kimyası.</p>
                   </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-900/20 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs md:text-sm font-bold">
                        <Shield size={16} /> 10 Yıl Garanti
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-900/20 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs md:text-sm font-bold">
                        <Zap size={16} /> 0.01sn Devreye Girme
                    </div>
                </div>
                
                <div className="mt-8">
                     {/* UPDATED LINK */}
                     <Link to="/hizmet-teklifi" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-primary font-bold hover:text-white transition-colors border border-primary/30 px-6 py-3 rounded-full hover:bg-primary hover:text-black">
                         Depolama Çözümü İste <ArrowRight size={18} />
                     </Link>
                </div>
             </div>

          </div>
       </div>
    </section>
  );
};

// --- SECTION 4: HEAT PUMP (STATIC SPECS - NO ANIMATION) ---

const HeatPumpSpecs = () => {
    return (
        <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-[600px] mx-auto mt-8">
            <div className="bg-[#121820] border border-white/5 p-4 md:p-6 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-900/20 flex items-center justify-center text-emerald-400 mb-3">
                    <Leaf size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white font-display mb-1">COP 5.0</div>
                <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">Yüksek Verimlilik</div>
            </div>
            <div className="bg-[#121820] border border-white/5 p-4 md:p-6 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-900/20 flex items-center justify-center text-blue-400 mb-3">
                    <Thermometer size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white font-display mb-1">-25°C</div>
                <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">Çalışma Aralığı</div>
            </div>
            <div className="bg-[#121820] border border-white/5 p-4 md:p-6 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-900/20 flex items-center justify-center text-purple-400 mb-3">
                    <Volume2 size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white font-display mb-1">35 dB</div>
                <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">Sessiz Mod</div>
            </div>
            <div className="bg-[#121820] border border-white/5 p-4 md:p-6 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-900/20 flex items-center justify-center text-orange-400 mb-3">
                    <Wind size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white font-display mb-1">%75</div>
                <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">Hava Kaynaklı</div>
            </div>
        </div>
    );
};

const HeatPumpSection = () => {
  return (
    <section id="heatpump" className="min-h-screen bg-[#020405] relative flex items-center py-12 md:py-32 border-t border-white/5">
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
       
       <div className="container mx-auto px-6 relative z-10">
          <SectionHeader 
             number="04" 
             title="AKILLI İKLİM" 
             subtitle="Isı Pompası Teknolojisi"
             description="Eviniz artık pasif bir yapı değil, enerjiyi dönüştüren aktif bir ekosistem. Dışarıdaki havayı alın, sıkıştırın ve 5 katı verimle evinize dağıtın."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
             
             {/* LEFT: Static Specs Grid (Replaces Animation) */}
             <div className="relative order-2 lg:order-1">
                <HeatPumpSpecs />
             </div>

             {/* RIGHT: Benefits */}
             <div className="order-1 lg:order-2">
                 <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                    Doğalgaza Veda Edin. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-orange-500">Geleceğin Isınma Çözümü.</span>
                 </h3>
                 <p className="text-gray-400 text-base md:text-lg mb-8 md:mb-10 leading-relaxed">
                    Kömür, doğalgaz veya odun yakmanıza gerek yok. Isı pompası, termodinamik yasalarını kullanarak havada asılı duran enerjiyi toplar ve evinize transfer eder.
                 </p>

                 <div className="space-y-6">
                    {[
                        { title: "COP 5.0 Verimlilik", desc: "Harcadığınız her 1kW elektrik karşılığında 5kW ısı enerjisi kazanın." },
                        { title: "Hem Isıtma Hem Soğutma", desc: "Kışın radyatörlerinizi ısıtır, yazın evinizi serinletir. Tek sistem, 4 mevsim." },
                        { title: "Sıfır Karbon Emisyonu", desc: "Fosil yakıt tüketmez, bacaya ihtiyaç duymaz. Tamamen elektriklidir." }
                    ].map((item, i) => (
                        <div 
                           key={i}
                           className="flex gap-4"
                        >
                           <div className="mt-1">
                               <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                   <div className="w-2 h-2 rounded-full bg-primary" />
                               </div>
                           </div>
                           <div>
                               <h4 className="text-white font-bold text-base md:text-lg">{item.title}</h4>
                               <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                           </div>
                        </div>
                    ))}
                 </div>

                 <div className="mt-10 md:mt-12">
                     {/* UPDATED LINK */}
                     <Link to="/hizmet-teklifi" className="text-white border-b border-primary pb-1 hover:text-primary transition-colors inline-flex items-center gap-2 text-sm md:text-base">
                        Evinize Uygun Modeli Öğrenin <MoveRight size={16} />
                     </Link>
                 </div>
             </div>

          </div>
       </div>
    </section>
  );
};

// --- MAIN PAGE ---

const Services = () => {
  return (
    <div className="bg-[#0b0f14] min-h-screen selection:bg-primary selection:text-black font-sans">
      <NavRail />
      
      {/* Hero Intro - Redesigned for High Impact with 3D Rotating Background (Performance Optimized) */}
      <section id="hero" className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden text-center px-6 bg-[#0b0f14]">
         
         {/* 3D Background Scene */}
         <div className="absolute inset-0 perspective-[1000px] overflow-hidden pointer-events-none">
            
            {/* Animated Gradient Spotlights - Reduced Blur Radius for Performance */}
            <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[80px] mix-blend-screen animate-pulse will-change-transform" />
            <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[80px] mix-blend-screen animate-pulse delay-1000 will-change-transform" />

            {/* 3D Rotating Cube/Structure - Hardware Accelerated */}
            <div className="absolute inset-0 flex items-center justify-center transform-style-3d">
               <motion.div
                  animate={{ 
                     rotateX: [0, 360], 
                     rotateY: [0, 360] 
                  }}
                  transition={{ 
                     duration: 40, 
                     repeat: Infinity, 
                     ease: "linear" 
                  }}
                  className="relative w-[30vh] h-[30vh] md:w-[50vh] md:h-[50vh] border border-white/5 rounded-full will-change-transform"
                  style={{ transformStyle: 'preserve-3d' }}
               >
                  {/* Inner Rings - Reduced complexity for mobile */}
                  {[...Array(3)].map((_, i) => (
                     <div 
                        key={i}
                        className="absolute inset-0 border border-primary/20 rounded-full"
                        style={{ 
                           transform: `rotateX(${i * 60}deg) rotateY(${i * 60}deg)`,
                        }}
                     />
                  ))}
                  
                  {/* Core Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-32 md:h-32 bg-primary/10 blur-2xl rounded-full" />
               </motion.div>
            </div>
            
            {/* Floor Grid - CSS Only for Performance */}
            <div className="absolute bottom-0 left-[-50%] right-[-50%] h-[50vh] bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,transparent,black)]" 
                 style={{ transform: 'perspective(500px) rotateX(60deg)' }} />
         </div>

         {/* Content */}
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="relative z-10"
         >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[9px] md:text-[10px] font-mono tracking-[0.2em] text-primary mb-6 md:mb-8 shadow-[0_0_20px_rgba(33,201,151,0.2)]">
                <Box className="w-3 h-3 text-primary" />
                3D SIMULATION READY
            </div>

            <h1 className="text-5xl md:text-9xl font-display font-bold tracking-tighter mb-6 md:mb-8 leading-[0.9] select-none drop-shadow-2xl">
               <span className="block text-white mix-blend-overlay">ENERJİNİ</span>
               {/* Filled Gradient Text with Outline */}
               <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-200 to-white relative">
                   YÖNET.
                   <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-200 to-white blur-lg opacity-50">YÖNET.</span>
               </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed mb-10 md:mb-12">
               Tam kontrol, tam bağımsızlık. Evinizin enerji altyapısını <span className="text-white font-medium border-b border-primary/50">geleceğin teknolojisiyle</span> yönetin.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
               <Link 
                 to="/basvuru" 
                 className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] text-sm md:text-base"
               >
                  <MousePointer2 size={18} /> Simülasyonu Başlat
               </Link>
            </motion.div>
         </motion.div>
         
         <motion.div 
           initial={{opacity: 0}} 
           animate={{opacity: 1}} 
           transition={{delay: 1.5}}
           className="absolute bottom-12 flex flex-col items-center gap-4 text-gray-500 text-[10px] md:text-xs tracking-widest font-mono animate-bounce"
         >
            KEŞFETMEK İÇİN KAYDIR
            <div className="w-px h-8 md:h-12 bg-gradient-to-b from-primary to-transparent" />
         </motion.div>
      </section>

      <SolarSection />
      <EVSection />
      <StorageSection />
      <HeatPumpSection />

      {/* Footer CTA */}
      <section className="py-20 md:py-32 bg-black relative overflow-hidden text-center border-t border-white/5">
         <div className="container mx-auto px-6 relative z-10">
            <h2 className="text-3xl md:text-6xl font-display font-bold text-white mb-6 md:mb-8">
               Hemen Tasarrufa Başlayın
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8 md:mb-10 text-base md:text-lg">
                Uzman mühendislerimiz eviniz için en uygun sistemi projelendirsin. Ücretsiz keşif için form doldurmanız yeterli.
            </p>
            <Link 
               to="/basvuru"
               className="group relative inline-flex items-center gap-4 px-8 py-4 md:px-12 md:py-6 bg-primary text-black font-bold text-base md:text-lg rounded-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_50px_rgba(33,201,151,0.5)]"
            >
               <span className="relative z-10">Ücretsiz Keşif Randevusu</span>
               <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
         </div>
      </section>

    </div>
  );
};

export default Services;