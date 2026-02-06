import React, { useState, useRef, useEffect } from 'react';
import { MOCK_GALLERY } from '../constants';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { X, MapPin, Calendar, Zap, ArrowUpRight, Battery, Maximize2, Layers, ChevronRight, Hash, Eye, Smartphone, Lock, Crown } from 'lucide-react';

// --- COMPONENTS ---

const FilterTabs = ({ categories, active, onChange }: { categories: string[], active: string, onChange: (c: string) => void }) => {
  return (
    <div className="flex justify-center mb-10 md:mb-16 relative z-20">
      <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
          <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2 p-1.5 bg-[#0f131a]/80 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl min-w-max mx-auto">
            {categories.map((cat) => {
              const isActive = active === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onChange(cat)}
                  className={`relative px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 z-10 whitespace-nowrap ${
                    isActive ? 'text-black font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-primary rounded-full shadow-[0_0_20px_rgba(33,201,151,0.4)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
      </div>
    </div>
  );
};

// --- 3D TILT CARD COMPONENT (HYBRID: MOUSE + GYRO) ---
const ProjectCard = ({ item, onClick, isGyroEnabled }: { item: any, onClick: () => void, isGyroEnabled: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for smooth movement
  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  // Map position/tilt to rotation degrees
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  // Dynamic glare effect
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  // --- GYROSCOPE LOGIC ---
  useEffect(() => {
    if (!isGyroEnabled) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma; 
      const beta = e.beta;

      if (gamma === null || beta === null) return;

      const clampedGamma = Math.min(Math.max(gamma, -30), 30);
      const clampedBeta = Math.min(Math.max(beta, -30), 30);

      const normalizedX = clampedGamma / 60; 
      const normalizedY = (clampedBeta - 45) / 60; 

      x.set(normalizedX);
      y.set(normalizedY);
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [isGyroEnabled, x, y]);

  // --- MOUSE LOGIC ---
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseXRel = (e.clientX - rect.left) / width - 0.5;
    const mouseYRel = (e.clientY - rect.top) / height - 0.5;

    x.set(mouseXRel);
    y.set(mouseYRel);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{ perspective: 1200 }}
      className="relative h-[350px] md:h-[450px] w-full cursor-pointer group"
      onClick={onClick}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`w-full h-full relative rounded-3xl border shadow-2xl transition-colors duration-300 bg-[#0f131a] border-white/10 group-hover:border-primary/50`}
      >
        {/* --- LAYER 0: SHADOW --- */}
        <motion.div 
           style={{ 
             transform: "translateZ(-50px)",
             opacity: useTransform(mouseY, [-0.5, 0.5], [0.4, 0.8])
           }}
           className={`absolute inset-4 blur-[40px] rounded-full -z-10 transition-opacity duration-300 bg-primary/20 group-hover:bg-primary/30`}
        />

        {/* --- LAYER 1: IMAGE --- */}
        <div 
          className="absolute inset-0 rounded-3xl overflow-hidden" 
          style={{ transform: "translateZ(0px)" }}
        >
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10 duration-500" />
          <motion.img
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            className={`w-full h-full object-cover transition-all duration-700 grayscale-[30%] group-hover:grayscale-0`}
            style={{ scale: 1.15 }}
          />
        </div>

        {/* --- LAYER 2: GLARE --- */}
        <motion.div 
          className="absolute inset-0 rounded-3xl z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.4) 0%, transparent 60%)`
            ),
            transform: "translateZ(1px)"
          }}
        />

        {/* --- LAYER 3: TECH OVERLAYS --- */}
        <div 
          className="absolute inset-0 p-5 md:p-6 flex flex-col justify-between z-30 pointer-events-none"
          style={{ transform: "translateZ(40px)" }}
        >
            <div className="flex justify-between items-start">
                <div className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[9px] md:text-[10px] font-mono text-primary flex items-center gap-2 shadow-lg">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    {item.category.toUpperCase()}
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <Eye size={16} className="md:w-[18px]" />
                </div>
            </div>

            <div>
                 <motion.div 
                   className="w-12 h-1 bg-primary mb-3 md:mb-4 origin-left"
                   style={{ transform: "translateZ(20px)" }} 
                 />
                 <h3 
                   className="text-2xl md:text-3xl font-display font-bold text-white leading-none mb-2 md:mb-3 drop-shadow-lg"
                   style={{ transform: "translateZ(40px)" }}
                 >
                    {item.title}
                 </h3>
                 <div 
                   className="flex items-center gap-4 text-gray-300 text-[10px] md:text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0"
                   style={{ transform: "translateZ(30px)" }}
                 >
                    <span className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded"><MapPin size={10} className="text-primary" /> {item.city}</span>
                    <span className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded"><Calendar size={10} className="text-primary" /> {item.date}</span>
                 </div>
            </div>
        </div>

        {/* --- LAYER 4: BORDER --- */}
        <div className={`absolute inset-0 rounded-3xl border pointer-events-none z-20 border-white/5`}>
            <div className={`absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 transition-colors duration-500 border-primary/0 group-hover:border-primary`} />
            <div className={`absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 transition-colors duration-500 border-primary/0 group-hover:border-primary`} />
        </div>

      </motion.div>
    </motion.div>
  );
};

const ProjectModal = ({ item, onClose }: { item: any, onClose: () => void }) => {
  if (!item) return null;

  const technicalSpecs = [
    { label: "Sistem Gücü", value: "15.4 kWp", icon: Zap, color: "text-yellow-400" },
    { label: "Panel Tipi", value: "Monokristal", icon: Layers, color: "text-blue-400" },
    { label: "Depolama", value: "20 kWh LFP", icon: Battery, color: "text-green-400" },
    { label: "Yıllık Üretim", value: "~22.000 kWh", icon: Maximize2, color: "text-purple-400" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 lg:p-10">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
      />
      
      <motion.div 
        layoutId={item.id}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="relative w-full max-w-7xl h-full md:h-auto md:max-h-[90vh] bg-[#0b0f14] border border-white/10 md:rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(33,201,151,0.1)] flex flex-col lg:flex-row"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 md:w-12 md:h-12 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-primary hover:text-black transition-all flex items-center justify-center border border-white/10 group"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300 md:w-6 md:h-6" />
        </button>

        {/* LEFT: IMMERSIVE IMAGE */}
        <div className="w-full lg:w-3/5 h-[35vh] lg:h-auto relative bg-gray-900 overflow-hidden group">
           <motion.img 
             initial={{ scale: 1.1 }}
             animate={{ scale: 1 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             src={item.imageUrl} 
             alt={item.title} 
             className="w-full h-full object-cover" 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f14] via-transparent to-transparent lg:bg-gradient-to-r" />
        </div>

        {/* RIGHT: TECHNICAL DOSSIER */}
        <div className="w-full lg:w-2/5 p-6 md:p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-[#0b0f14] relative flex-1">
            <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5 pointer-events-none"><Zap size={150} className="md:w-[200px]" /></div>
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-primary font-mono text-xs tracking-[0.3em] uppercase">Proje Dosyası</span>
               </div>
               <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 md:mb-6 leading-[1.1]">{item.title}</h2>
               <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300 flex items-center gap-1"><MapPin size={12} /> {item.city}</span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300 flex items-center gap-1"><Calendar size={12} /> {item.date}</span>
                  <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded text-xs text-primary font-bold">TAMAMLANDI</span>
               </div>
               <div className="prose prose-invert prose-sm mb-8 md:mb-10 text-gray-400 font-light leading-relaxed text-sm md:text-base">
                  <p>{item.description}</p>
                  <p>Mühendislik ekibimiz tarafından bölgenin güneşlenme süreleri analiz edilerek, maksimum verimlilik için özel panel yerleşimi uygulanmıştır. Sistem, akıllı inverter teknolojisi ile donatılmış olup uzaktan izlenebilmektedir.</p>
               </div>
               <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
                 {technicalSpecs.map((spec, i) => (
                   <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (i * 0.1) }} className="bg-[#121820] border border-white/5 p-3 md:p-4 rounded-xl relative overflow-hidden group hover:border-white/10 transition-colors">
                     <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="flex justify-between items-start mb-2"><spec.icon className={`${spec.color} w-4 h-4 md:w-5 md:h-5`} /></div>
                     <div className="text-[10px] md:text-xs text-gray-500 uppercase font-medium mb-1">{spec.label}</div>
                     <div className="text-white font-bold text-base md:text-lg tracking-tight">{spec.value}</div>
                   </motion.div>
                 ))}
               </div>
               <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                  {item.tags.map((tag: string) => (<span key={tag} className="text-xs text-gray-500 hover:text-primary transition-colors cursor-pointer flex items-center gap-0.5"><Hash size={10} />{tag}</span>))}
               </div>
               <div className="mt-8 pt-4 pb-8 md:pb-0">
                  <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">Benzer Bir Proje Başlat <ChevronRight size={18} /></button>
               </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN PAGE ---

const Gallery = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState('Tümü');
  const [isGyroEnabled, setIsGyroEnabled] = useState(false);
  const [showGyroButton, setShowGyroButton] = useState(false);

  const categories = ['Tümü', 'Konut GES', 'Endüstriyel GES', 'Arazi GES', 'Şarj & Depolama'];
  const filteredItems = filter === 'Tümü' ? MOCK_GALLERY : MOCK_GALLERY.filter(i => i.category === filter);
  const selectedItem = MOCK_GALLERY.find(i => i.id === selectedId);

  // Check if we are on a device that might have orientation capability
  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      // Check for iOS 13+ permission requirement pattern
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        setShowGyroButton(true);
      } else {
        // Non-iOS devices usually don't need permission, enable by default
        setIsGyroEnabled(true);
      }
    }
  }, []);

  const requestGyroPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          setIsGyroEnabled(true);
          setShowGyroButton(false);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] pt-28 md:pt-32 pb-24 relative overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] md:w-[1200px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
         <div className="absolute top-[20%] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
         <div className="absolute top-[80%] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
         <div className="absolute left-[20%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
         <div className="absolute right-[20%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-20 relative">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-primary mb-4 md:mb-6"
          >
             <Layers size={12} />
             <span>PORTFOLYO ARŞİVİ</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-8xl font-display font-bold text-white mb-4 md:mb-6 tracking-tight leading-[0.9]"
          >
            Mühendislik <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-200 to-white">İmzalarımız.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed mb-6"
          >
            Her biri, enerji bağımsızlığına atılmış dev bir adım. Türkiye'nin dört bir yanındaki başarı hikayelerimiz.
          </motion.p>
          
          {/* iOS Permission Button */}
          {showGyroButton && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={requestGyroPermission}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white text-xs font-medium hover:bg-white/20 transition-colors border border-white/10"
            >
              <Smartphone size={14} /> 3D Sensörünü Etkinleştir
            </motion.button>
          )}
        </div>

        {/* Filter */}
        <FilterTabs categories={categories} active={filter} onChange={setFilter} />

        {/* Advanced Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <ProjectCard 
                  item={item} 
                  onClick={() => setSelectedId(item.id)}
                  isGyroEnabled={isGyroEnabled}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 md:py-32 border border-white/5 bg-white/5 rounded-2xl">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6 animate-pulse">
                 <Layers className="text-gray-500 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Veri Bulunamadı</h3>
              <p className="text-gray-400 max-w-md mx-auto px-4">Seçili filtre kriterlerine uygun proje kaydı arşivimizde mevcut değil.</p>
           </motion.div>
        )}

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedId && (
          <ProjectModal item={selectedItem} onClose={() => setSelectedId(null)} />
        )}
      </AnimatePresence>

    </div>
  );
};

export default Gallery;