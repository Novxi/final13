import React, { useRef, useState, useEffect } from 'react';
import { SERVICES } from '../constants';
import { ServiceItem } from '../types';
import { motion, useInView, useMotionValue, useSpring, useTransform, animate, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Users, ShieldCheck, CheckCircle2, Search, FileText, Hammer, Power, Satellite, DraftingCompass, HardHat, LineChart, Battery, Sun, BellRing, Smartphone, Download, Home as HomeIcon, Settings, BarChart3, Wifi, Signal, ArrowRight, Crown, Star, Gem, Plug, Volume2, Activity, Leaf, Thermometer, Wind, Smile, Frown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';

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

// --- ANIMATED COUNTER ---
const AnimatedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });
  const isInView = useInView(ref, { once: true, margin: "-10px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString('tr-TR') + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref} />;
};

// --- SERVICE CARD (OPTIMIZED) ---
// Using CSS Variables instead of React State to prevent re-renders on mousemove
const ServiceCard: React.FC<{ service: ServiceItem; index: number }> = ({ service, index }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    div.style.setProperty('--mouse-x', `${x}px`);
    div.style.setProperty('--mouse-y', `${y}px`);
    div.style.setProperty('--card-opacity', '1');
  };

  const handleMouseLeave = () => {
    if (!divRef.current) return;
    divRef.current.style.setProperty('--card-opacity', '0');
  };

  const CardContent = ({ layerType }: { layerType: 'base' | 'reveal' }) => (
    <div className="flex flex-col h-full relative z-20 pointer-events-none">
      <h3 className={`text-2xl font-display font-semibold mb-4 tracking-tight transition-all duration-300 ${layerType === 'reveal' ? 'text-white drop-shadow-[0_0_15px_rgba(33,201,151,0.5)]' : 'text-gray-200'}`}>
        {service.title}
      </h3>
      <p className={`text-[15px] leading-7 mb-8 font-light tracking-wide transition-all duration-300 min-h-[80px] ${layerType === 'reveal' ? 'text-white drop-shadow-md' : 'text-gray-400'}`}>
        {service.description}
      </p>
      <ul className="space-y-3 mb-8">
        {service.features.map((f: string) => (
          <li key={f} className={`flex items-start text-sm transition-all duration-300 ${layerType === 'reveal' ? 'text-white drop-shadow-sm' : 'text-gray-500'}`}>
            <CheckCircle2 className={`w-4 h-4 mr-3 mt-0.5 shrink-0 ${layerType === 'reveal' ? 'text-primary drop-shadow-[0_0_8px_rgba(33,201,151,0.8)]' : 'text-gray-600'}`} />
            <span className="font-light tracking-wide">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative h-full rounded-[2rem] bg-[#12151b] overflow-hidden border border-white/10 transition-colors duration-500 service-card hover:border-primary/30"
      style={{
        '--mouse-x': '0px',
        '--mouse-y': '0px',
        '--card-opacity': '0'
      } as React.CSSProperties}
    >
      <div className="p-8 h-full"><CardContent layerType="base" /></div>
      
      {/* Reveal Layer managed by CSS variables */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: 'var(--card-opacity)',
          WebkitMaskImage: `radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), black, transparent)`,
          maskImage: `radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), black, transparent)`,
        }}
      >
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-primary/20 mix-blend-plus-lighter" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <div className="p-8 h-full relative z-10"><CardContent layerType="reveal" /></div>
      </div>
      
      {/* Dynamic Icon - Updated: Grayish by default, Colored on reveal */}
      <div 
         className="absolute -bottom-8 -right-8 w-48 h-48 pointer-events-none z-30 transition-all duration-300 ease-in-out grayscale group-hover:grayscale-0 opacity-20 group-hover:opacity-100" 
         style={{ 
             transform: 'translate(calc(20px - var(--card-opacity) * 20px), calc(20px - var(--card-opacity) * 20px))' 
         }}
      >
        <div className="w-full h-full text-gray-700 group-hover:text-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-colors duration-500">
           {React.isValidElement(service.icon) && React.cloneElement(service.icon as React.ReactElement<any>, { className: "w-full h-full stroke-[1.25] fill-none" })}
        </div>
      </div>
      
      {/* Border Glow */}
      <div 
        className="absolute inset-0 rounded-[2rem] border border-primary/40 pointer-events-none transition-opacity duration-300" 
        style={{ opacity: 'var(--card-opacity)' }} 
      />
    </motion.div>
  );
};

const ProcessStep = ({ step, title, desc, icon: Icon, index, total }: any) => {
  const isEven = index % 2 === 0;
  return (
    <div className={`flex items-center gap-8 mb-24 last:mb-0 relative ${isEven ? 'flex-row' : 'flex-row-reverse text-right'}`}>
      <div className="hidden md:block w-1/2" />
      <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center z-10">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75" />
          <div className="relative w-12 h-12 bg-[#0b0f14] rounded-full border border-primary text-primary flex items-center justify-center font-bold font-display shadow-[0_0_15px_rgba(33,201,151,0.4)]">
             <span className="text-sm">{step}</span>
          </div>
        </div>
      </div>
      <motion.div 
        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}
      >
        <div className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 shadow-2xl overflow-hidden">
          {/* Background Icon Opacity */}
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform rotate-12 group-hover:scale-110">
             <Icon size={120} />
          </div>

          <div className={`absolute top-2 ${isEven ? 'right-4' : 'left-4'} text-9xl font-display font-bold text-white/[0.03] select-none pointer-events-none transition-transform group-hover:scale-110 duration-700`}>{step}</div>
          <div className={`relative z-10 flex flex-col ${isEven ? 'md:items-start' : 'md:items-end'} items-start`}>
            <div className="mb-4 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-transparent border border-white/10 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(33,201,151,0.15)] group-hover:shadow-[0_0_30px_rgba(33,201,151,0.3)] transition-all">
              <Icon strokeWidth={1.25} className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-gray-400 font-light leading-relaxed">{desc}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- 3D ELITE CARD COMPONENT ---
const EliteCard3D = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
    
    // Dynamic Glare
    const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
    const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set((clientX - left) / width - 0.5);
        y.set((clientY - top) / height - 0.5);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <div style={{ perspective: 1000 }} className="relative w-full max-w-md aspect-[1.6/1] mx-auto z-10 min-h-[220px]">
            <motion.div
                initial={{ opacity: 0, y: 50, rotateX: 0 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, type: "spring" }}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="w-full h-full relative rounded-3xl bg-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer group"
            >
                 {/* Card Visual */}
                 <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-3xl border border-amber-500/30 overflow-hidden" style={{ transform: "translateZ(0px)" }}>
                     {/* Gloss */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent z-10" />
                     
                     {/* Glare Effect */}
                     <motion.div 
                        className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-50 group-hover:opacity-80 transition-opacity"
                        style={{
                            background: useTransform(
                                [glareX, glareY],
                                ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.3) 0%, transparent 60%)`
                            ),
                        }}
                     />
                 </div>

                 {/* 3D CONTENT LAYERS */}
                 <div className="absolute inset-0 p-8 h-full flex flex-col justify-between z-30 pointer-events-none">
                     <div className="flex justify-between items-start" style={{ transform: "translateZ(30px)" }}>
                         <div className="flex items-center gap-2">
                             <div className="w-10 h-10 bg-white/10 backdrop-blur rounded flex items-center justify-center text-white font-display font-bold text-xl border border-white/10 shadow-lg">N</div>
                             <div className="text-white/80 font-display tracking-[0.2em] text-sm">NORTH<span className="text-amber-400 font-bold">ELITE</span></div>
                         </div>
                         <Gem size={32} className="text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                     </div>
                     
                     <div className="flex items-center gap-4 opacity-50" style={{ transform: "translateZ(20px)" }}>
                         <div className="h-10 w-14 border border-white/20 rounded-md bg-white/5" />
                         <Wifi size={24} className="text-white" />
                     </div>

                     <div style={{ transform: "translateZ(40px)" }}>
                         <div className="text-amber-400/80 text-xs font-mono uppercase tracking-widest mb-1">Platinum Member</div>
                         <div className="text-2xl text-white font-display uppercase tracking-widest drop-shadow-md">SAYIN MÜŞTERİMİZ</div>
                     </div>
                 </div>
                 
                 {/* Back Glow */}
                 <motion.div 
                    style={{ transform: "translateZ(-20px)" }}
                    className="absolute inset-4 bg-amber-500/20 blur-[40px] rounded-full -z-10" 
                 />
            </motion.div>
        </div>
    );
};

// --- ELITE MEMBERSHIP SECTION ---
const EliteMembershipSection = () => (
    <section className="py-24 bg-gradient-to-b from-[#0b0f14] via-[#121212] to-[#0b0f14] relative overflow-hidden">
        {/* Golden Accents */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                
                <div className="lg:w-1/2">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs font-bold tracking-widest uppercase mb-6">
                            <Crown size={14} /> Exclusive Club
                        </div>
                        <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
                            North <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Elite</span>
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Bizden sadece bir ürün satın almıyorsunuz; ayrıcalıklar dünyasına adım atıyorsunuz. North Elite üyeleri, standartların ötesinde bir hizmet deneyimi yaşar.
                        </p>
                        
                        <div className="space-y-6">
                            {[
                                { title: "Öncelikli Servis", desc: "Teknik destek taleplerinizde en üst sırada yer alırsınız." },
                                { title: "Yıllık Bakım Hediyesi", desc: "Sisteminizi ilk günkü performansında tutan ücretsiz check-up." },
                                { title: "Konsiyerj Hizmeti", desc: "Enerji bürokrasisi ve yasal süreçleri sizin yerinize biz yönetiriz." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                                        <Star size={14} className="text-amber-400" fill="currentColor" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">{item.title}</h4>
                                        <p className="text-gray-500 text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="lg:w-1/2 flex justify-center w-full">
                    <EliteCard3D />
                </div>

            </div>
        </div>
    </section>
);

const Home = () => {
  return (
    <div className="bg-background">
      <Hero />
      
      {/* Services Section - Reduced Top Padding */}
      <section className="py-24 relative overflow-hidden bg-background border-t border-white/5">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[800px] bg-primary/[0.02] blur-[150px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight"
            >
              Hizmetlerimiz
            </motion.h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-light">Mühendislik harikası çözümlerle enerji bağımsızlığına giden yolculuğunuz.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, idx) => (<ServiceCard key={service.id} service={service} index={idx} />))}
          </div>
        </div>
      </section>

      {/* Stats Section - ENHANCED VISUALS */}
      <section className="py-24 bg-[#121820]/30 relative border-y border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
        {/* Glow behind stats */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-full bg-primary/5 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
             {[
               { val: 150, suffix: '+', label: 'Tamamlanan Proje', icon: <Trophy className="w-8 h-8 text-yellow-400" />, gradient: "from-yellow-400 to-amber-600" },
               { val: 25, suffix: 'MW', label: 'Kurulu Güç', icon: <Zap className="w-8 h-8 text-primary" />, gradient: "from-primary to-emerald-600" },
               { val: 100, suffix: '%', label: 'Müşteri Memnuniyeti', icon: <Users className="w-8 h-8 text-blue-400" />, gradient: "from-blue-400 to-indigo-600" },
               { val: 25, suffix: ' Yıl', label: 'Garanti Süresi', icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />, gradient: "from-emerald-400 to-teal-600" }
             ].map((stat, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="group relative flex flex-col items-center text-center p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 shadow-2xl"
               >
                 <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
                 
                 <div className="mb-6 p-4 bg-black/40 rounded-2xl ring-1 ring-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                 
                 <div className={`font-display text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br ${stat.gradient} mb-3 tracking-tighter drop-shadow-sm`}>
                     <AnimatedCounter value={stat.val} suffix={stat.suffix} />
                 </div>
                 
                 <div className="text-sm md:text-base text-gray-400 font-medium tracking-wide uppercase">{stat.label}</div>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      <EliteMembershipSection />

      {/* Timeline Section */}
      <section className="py-32 bg-[#0b0f14] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
           {/* Static SVG icons instead of animated for better performance on mobile */}
           <div className="absolute top-[5%] left-[-5%] md:left-[5%] text-primary opacity-[0.05]"><Satellite className="w-64 h-64 md:w-96 md:h-96 stroke-1" /></div>
           <div className="absolute top-[15%] right-[-10%] md:right-[5%] text-blue-400 opacity-[0.05]"><DraftingCompass className="w-72 h-72 md:w-[500px] md:h-[500px] stroke-1" /></div>
           
           {/* New Icons at the bottom */}
           <div className="absolute bottom-[5%] left-[-5%] md:left-[10%] text-emerald-400 opacity-[0.05]"><HardHat className="w-56 h-56 md:w-80 md:h-80 stroke-1" /></div>
           <div className="absolute bottom-[10%] right-[-5%] md:right-[15%] text-amber-400 opacity-[0.05]"><Settings className="w-48 h-48 md:w-64 md:h-64 stroke-1" /></div>
        </div>
        <div className="absolute inset-0 bg-radial-gradient from-primary/[0.03] to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight relative inline-block">
              Nasıl Çalışır?
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></span>
            </h2>
            <p className="text-gray-400 text-lg font-light">Enerji bağımsızlığına giden yolculuğunuz sadece 4 adım.</p>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
            {[
              { step: '01', title: 'Ücretsiz Keşif', desc: 'Uzman mühendislerimiz çatınızı uydudan ve yerinde analiz ederek en verimli kurulum alanlarını belirler.', icon: Search },
              { step: '02', title: 'Projelendirme', desc: 'Tüketim verilerinize göre size özel amortisman raporu ve sistem tasarımı hazırlanır.', icon: FileText },
              { step: '03', title: 'Premium Kurulum', desc: 'Alman menşeili ekipmanlar ve sertifikalı ekiplerimizle 1-2 gün içinde kurulum tamamlanır.', icon: Hammer },
              { step: '04', title: 'Enerji Üretimi', desc: 'Sistem devreye alınır, mobil uygulama üzerinden üretimi izlemeye ve tasarruf etmeye başlarsınız.', icon: Power },
            ].map((item, idx) => (<ProcessStep key={idx} step={item.step} title={item.title} desc={item.desc} icon={item.icon} index={idx} total={4} />))}
          </div>
        </div>
      </section>

      {/* Mobile App Promo Section */}
      <section className="py-24 relative overflow-hidden bg-[#0b0f14] border-t border-white/5">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            <div className="lg:w-1/2 text-center lg:text-left">
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
                  <Smartphone className="w-4 h-4" />
                  <span>North Mobile App</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">Enerjiniz <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-200">Cebinizde Olsun</span></h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">Üretim verilerinizi anlık takip edin, tasarruf analizlerinizi görüntüleyin ve sisteminizi uzaktan yönetin. Yapay zeka destekli bildirimlerle verimliliğinizi maksimize edin.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                  <a href="#" className="group relative flex items-center gap-4 bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/10 hover:border-white/25 px-7 py-4 rounded-2xl transition-all duration-300 w-full sm:w-auto overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white group-hover:text-primary transition-colors duration-300 relative z-10"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.3-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.98 1.07-3.12-1.02.05-2.29.69-3.02 1.55-.65.77-1.22 2.02-1.06 3.09 1.14.09 2.3-.64 3.01-1.52z"/></svg>
                    <div className="text-left relative z-10"><div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-0.5 group-hover:text-gray-300">Download on the</div><div className="text-xl font-display font-bold text-white tracking-wide group-hover:scale-105 transition-transform origin-left">App Store</div></div>
                  </a>
                  <a href="#" className="group relative flex items-center gap-4 bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/10 hover:border-white/25 px-7 py-4 rounded-2xl transition-all duration-300 w-full sm:w-auto overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white group-hover:text-green-400 transition-colors duration-300 relative z-10"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.3,10.84L17.3,12.55L15.05,10.3L17.3,8.04L20.3,9.75C20.7,10 20.7,10.59 20.3,10.84M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" /></svg>
                    <div className="text-left relative z-10"><div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-0.5 group-hover:text-gray-300">Get it on</div><div className="text-xl font-display font-bold text-white tracking-wide group-hover:scale-105 transition-transform origin-left">Google Play</div></div>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Phone Mockup */}
            <div className="lg:w-1/2 relative flex justify-center items-center">
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="relative z-10 w-[320px] mx-auto">
                <div className="relative w-[320px] h-[660px] bg-black rounded-[60px] shadow-[0_0_0_2px_#3a3a3a,0_0_0_6px_#1e1e1e,0_0_20px_10px_rgba(0,0,0,0.5)] z-20">
                   <div className="absolute inset-[6px] bg-black rounded-[52px] border-[4px] border-black overflow-hidden ring-1 ring-white/10">
                    <div className="w-full h-full bg-gradient-to-b from-[#0a0e14] via-[#0f151f] to-[#0a0e14] relative flex flex-col">
                      <div className="h-12 w-full flex items-center justify-between px-7 pt-3.5 z-50">
                         <span className="text-white text-[12px] font-medium tracking-wide">9:41</span>
                         <div className="flex items-center gap-1.5"><Signal className="w-3.5 h-3.5 text-white fill-current" /><Wifi className="w-3.5 h-3.5 text-white" /><div className="w-5 h-2.5 border-[1.5px] border-white/40 rounded-[3px] relative flex items-center px-0.5"><div className="h-1.5 w-full bg-white rounded-[1px]" /></div></div>
                      </div>
                      <div className="flex-1 px-5 pt-2 flex flex-col relative z-40">
                         <div className="flex justify-between items-center mb-8"><div><div className="text-xs text-gray-400 font-medium mb-0.5">Hoş geldin,</div><div className="text-white font-display font-bold text-xl tracking-tight">Oktay Gül</div></div><div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"><BellRing className="w-5 h-5 text-white" /><div className="absolute top-1 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0f151f]" /></div></div>
                         <div className="relative h-64 flex items-center justify-center mb-6">
                            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 flex items-center justify-center"><div className="w-48 h-48 bg-primary/20 rounded-full blur-3xl" /></motion.div>
                            <svg className="w-56 h-56 -rotate-90 relative z-10" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#1f2937" strokeWidth="6" strokeLinecap="round" /><motion.circle cx="50" cy="50" r="40" fill="none" stroke="#21c997" strokeWidth="6" strokeLinecap="round" strokeDasharray="251.2" initial={{ strokeDashoffset: 251.2 }} whileInView={{ strokeDashoffset: [251.2, 40, 45, 35, 40] }} viewport={{ once: true }} transition={{ strokeDashoffset: { duration: 2.5, times: [0, 0.6, 0.7, 0.8, 1], ease: "easeOut" }}}/></svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20"><Zap className="w-6 h-6 text-primary mb-2 drop-shadow-[0_0_8px_rgba(33,201,151,0.8)]" fill="currentColor" /><div className="text-4xl font-display font-bold text-white tracking-tighter drop-shadow-lg">4.2</div><div className="text-sm font-medium text-gray-400">kW Üretim</div></div>
                         </div>
                         <div className="grid grid-cols-2 gap-3 mb-6">
                            {[{ icon: Battery, color: 'text-blue-400', bg: 'bg-blue-500/10', val: '%85', label: 'Batarya' }, { icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/10', val: '₺850', label: 'Tasarruf' }].map((item, i) => (
                              <div key={i} className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-28"><div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center mb-2`}><item.icon className={`w-4 h-4 ${item.color}`} /></div><div><div className="text-2xl font-bold text-white tracking-tight">{item.val}</div><div className="text-xs text-gray-400 font-medium">{item.label}</div></div></div>
                            ))}
                         </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#0f1520]/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center px-6 pb-2 z-50"><div className="flex flex-col items-center gap-1"><HomeIcon className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(33,201,151,0.5)]" strokeWidth={2.5} /></div><div className="flex flex-col items-center gap-1 opacity-40"><BarChart3 className="w-6 h-6 text-white" /></div><div className="flex flex-col items-center gap-1 opacity-40"><Settings className="w-6 h-6 text-white" /></div></div>
                    </div>
                   </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;