import React, { useState, useRef, useEffect } from 'react';
import { VIDEOS } from '../constants';
import { Play, Pause, Share2, Film, Activity, Signal, Aperture, Wifi, Zap, Sun, Battery, MonitorPlay, Clock, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPONENTS ---

const VideoPlayerFrame = ({ video }: { video: any }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Stop video when source changes
  useEffect(() => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [video]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      key={video.id}
      className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(33,201,151,0.1)] group"
    >
      {/* Ambilight Glow Effect Behind */}
      <div className="absolute -inset-4 bg-primary/20 blur-[50px] -z-10 opacity-50" />
      
      {/* Video Element */}
      <video 
        ref={videoRef}
        src={video.url} 
        poster={video.poster}
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        controls={isPlaying} // Show native controls only when playing
        playsInline // Important for mobile
      />

      {/* Custom Overlay (Visible when paused or initially) */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center transition-opacity duration-500 z-20">
           {/* Play Button Reactor */}
           <motion.button 
             whileHover={{ scale: 1.1 }}
             whileTap={{ scale: 0.9 }}
             onClick={togglePlay}
             className="relative w-24 h-24 flex items-center justify-center group/btn cursor-pointer"
           >
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover/btn:bg-primary/40 transition-colors" />
              <div className="relative w-20 h-20 bg-white/10 border border-white/30 backdrop-blur-md rounded-full flex items-center justify-center z-10 group-hover/btn:border-primary transition-colors">
                 <Play className="w-8 h-8 text-white fill-current ml-1" />
              </div>
              {/* Spinning Ring */}
              <div className="absolute inset-0 border border-dashed border-white/20 rounded-full animate-[spin_10s_linear_infinite]" />
           </motion.button>
           
           <h2 className="mt-8 text-3xl md:text-5xl font-display font-bold text-white tracking-tight drop-shadow-2xl text-center px-4 max-w-3xl">
             {video.title}
           </h2>
           <div className="mt-4 flex items-center gap-2 text-primary font-mono text-sm tracking-widest uppercase bg-primary/10 px-4 py-1 rounded-full border border-primary/20">
              <span>{video.category}</span>
              <span className="w-1 h-1 bg-primary rounded-full" />
              <span>{video.duration}</span>
           </div>
        </div>
      )}

      {/* Tech Overlays (The "HUD") */}
      <div className="absolute top-6 left-6 flex items-center gap-3 pointer-events-none z-30">
         <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full backdrop-blur-md">
            <div className={`w-2 h-2 bg-red-500 rounded-full ${isPlaying ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] font-bold text-red-400 tracking-widest">{isPlaying ? 'PLAYING' : 'PAUSED'}</span>
         </div>
         <div className="hidden md:block text-xs font-mono text-gray-400">HD 1080p</div>
      </div>

      <div className="absolute top-6 right-6 flex items-center gap-4 pointer-events-none z-30">
          <div className="flex items-col gap-0.5">
             <div className="w-4 h-0.5 bg-primary" />
             <div className="w-4 h-0.5 bg-primary" />
             <div className="w-4 h-0.5 bg-primary/50" />
          </div>
      </div>

      {/* Scanline Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[5] pointer-events-none bg-[length:100%_4px,3px_100%] opacity-20 pointer-events-none" />
    </motion.div>
  );
};

const VideoListItem = ({ video, isActive, onClick }: { video: any, isActive: boolean, onClick: () => void }) => {
  return (
    <motion.div 
      onClick={onClick}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`group cursor-pointer relative rounded-xl overflow-hidden border transition-all duration-300 ${
        isActive 
        ? 'border-primary/50 bg-white/10 ring-1 ring-primary/20' 
        : 'border-white/5 bg-[#121820] hover:bg-white/5 hover:border-white/20'
      }`}
    >
      <div className="flex gap-4 p-3">
         {/* Thumbnail */}
         <div className="relative w-32 aspect-video rounded-lg overflow-hidden shrink-0">
            <img src={video.poster} alt={video.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
            
            {/* Play Overlay Mini */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
               <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  {isActive ? (
                      <Activity size={14} className="text-primary animate-pulse" />
                  ) : (
                      <Play size={12} className="text-white fill-white ml-0.5" />
                  )}
               </div>
            </div>
            
            {/* Duration Tag */}
            <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-white">
                {video.duration}
            </div>
         </div>

         {/* Content */}
         <div className="flex flex-col justify-center flex-1 min-w-0">
            <h4 className={`font-bold text-sm truncate transition-colors mb-1 ${isActive ? 'text-primary' : 'text-gray-200 group-hover:text-white'}`}>
              {video.title}
            </h4>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-full uppercase tracking-wider">{video.category}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
               <Clock size={10} /> 
               <span>Eklenme: 2 gün önce</span>
            </div>
         </div>
      </div>
    </motion.div>
  );
}

const CategoryTab = ({ icon: Icon, label, active, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
            active 
            ? 'bg-primary text-black border-primary font-bold shadow-[0_0_15px_rgba(33,201,151,0.4)]' 
            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
        }`}
    >
        <Icon size={16} />
        <span className="text-sm">{label}</span>
    </button>
);

// --- MAIN PAGE ---

const VideoPage = () => {
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [activeVideoId, setActiveVideoId] = useState<string>(VIDEOS[0]?.id || '');
  
  const categories = [
      { id: 'Tümü', icon: Film },
      { id: 'Tanıtım', icon: MonitorPlay },
      { id: 'Güneş Paneli', icon: Sun },
      { id: 'Araç Şarj İstasyonu', icon: Zap },
      { id: 'Enerji Depolama', icon: Battery },
  ];

  const filteredVideos = activeCategory === 'Tümü' 
      ? VIDEOS 
      : VIDEOS.filter(v => v.category === activeCategory);

  const activeVideo = VIDEOS.find(v => v.id === activeVideoId) || VIDEOS[0];

  // Reset active video to the first one of the category when category changes
  useEffect(() => {
      if (filteredVideos.length > 0 && !filteredVideos.find(v => v.id === activeVideoId)) {
          setActiveVideoId(filteredVideos[0].id);
      }
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#0b0f14] pt-32 pb-24 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
           <div>
              <motion.div 
                 initial={{ opacity: 0, y: 10 }} 
                 animate={{ opacity: 1, y: 0 }}
                 className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-primary mb-4"
              >
                 <Signal size={12} />
                 MEDYA KÜTÜPHANESİ
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight"
              >
                North <span className="text-gray-600">TV</span>
              </motion.h1>
           </div>
           
           <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar w-full md:w-auto">
               {categories.map(cat => (
                   <CategoryTab 
                        key={cat.id}
                        icon={cat.icon}
                        label={cat.id}
                        active={activeCategory === cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                   />
               ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Main Player Column */}
           <div className="lg:col-span-2">
              <AnimatePresence mode='wait'>
                  <motion.div
                    key={activeVideo.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <VideoPlayerFrame video={activeVideo} />
                  </motion.div>
              </AnimatePresence>
              
              {/* Detailed Info Card */}
              <motion.div 
                key={activeVideo.id + "_info"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-[#0b0f14]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8"
              >
                 <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-primary font-bold text-lg">{activeVideo.title}</span>
                            <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-gray-400 uppercase tracking-wider">{activeVideo.category}</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            {activeVideo.description}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {activeVideo.tags?.map((tag: string, i: number) => (
                                <span key={i} className="px-3 py-1 rounded-lg bg-[#121820] border border-white/5 text-xs text-gray-500 font-mono">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white transition-colors group" title="Paylaş">
                            <Share2 size={20} className="group-hover:scale-110 transition-transform" />
                        </button>
                        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white transition-colors group" title="Bilgi">
                            <Info size={20} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                 </div>
              </motion.div>
           </div>

           {/* Playlist Column */}
           <div className="lg:col-span-1">
              <div className="bg-[#0b0f14]/50 border border-white/5 rounded-2xl p-6 h-full backdrop-blur-md flex flex-col">
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center justify-between">
                    <span>Oynatma Listesi</span>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-mono">{filteredVideos.length} Video</span>
                    </div>
                 </h3>
                 
                 <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 max-h-[600px]">
                    <AnimatePresence mode='popLayout'>
                        {filteredVideos.map((video, idx) => (
                        <motion.div 
                            key={video.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <VideoListItem 
                                video={video} 
                                isActive={activeVideoId === video.id} 
                                onClick={() => setActiveVideoId(video.id)} 
                            />
                        </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredVideos.length === 0 && (
                        <div className="text-center py-10 text-gray-500 text-sm">
                            Bu kategoride video bulunamadı.
                        </div>
                    )}
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default VideoPage;