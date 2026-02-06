import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Check, ArrowRight, Activity, Clock, Shield, Radio, Copy, Server, Globe, Cpu, RefreshCw, FileText, Home } from 'lucide-react';
import { ContactMessage } from '../types';
import { useNavigate } from 'react-router-dom';

// --- COMPONENTS ---

const SystemStatusRadar = () => {
  return (
    <div className="relative w-full aspect-square max-w-[300px] md:max-w-[500px] mx-auto flex items-center justify-center overflow-hidden rounded-full border border-white/5 bg-black/40 backdrop-blur-md group">
       {/* Rotating Ring */}
       <motion.div 
         animate={{ rotate: 360 }}
         transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
         className="absolute inset-4 rounded-full border border-dashed border-primary/20"
       />
       <motion.div 
         animate={{ rotate: -360 }}
         transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
         className="absolute inset-16 rounded-full border border-dotted border-white/10"
       />

       {/* Grid Background */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(33,201,151,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(33,201,151,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 rounded-full" />

       {/* Center Hub */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 flex flex-col items-center justify-center z-10 shadow-[0_0_50px_rgba(33,201,151,0.15)]">
           <div className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-widest mb-1">System Status</div>
           <div className="text-lg md:text-2xl font-bold text-white mb-2 font-display">ONLINE</div>
           <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-3" />
           
           <div className="flex gap-2 md:gap-4 text-xs">
                <div className="flex flex-col items-center">
                    <span className="text-gray-500 font-mono text-[8px] md:text-[9px]">PING</span>
                    <span className="text-primary font-mono text-[10px] md:text-xs">12ms</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-gray-500 font-mono text-[8px] md:text-[9px]">LOAD</span>
                    <span className="text-emerald-400 font-mono text-[10px] md:text-xs">%4</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-gray-500 font-mono text-[8px] md:text-[9px]">UPTIME</span>
                    <span className="text-blue-400 font-mono text-[10px] md:text-xs">99.9</span>
                </div>
           </div>
       </div>

       {/* Orbiting Metrics */}
       {[0, 120, 240].map((deg, i) => (
           <motion.div
             key={i}
             className="absolute top-1/2 left-1/2 w-full h-full"
             style={{ rotate: deg }}
           >
               <motion.div 
                 className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#121820] border border-white/10 px-2 md:px-3 py-1 md:py-1.5 rounded text-[8px] md:text-[10px] font-mono text-gray-300 flex items-center gap-2"
                 style={{ rotate: -deg }} // Counter rotate to keep text upright
               >
                   <div className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full ${i===0 ? 'bg-primary' : i===1 ? 'bg-blue-500' : 'bg-purple-500'} animate-pulse`} />
                   {i === 0 ? "CRM_NODE_01" : i === 1 ? "VOICE_GATEWAY" : "DB_SHARD_ACTIVE"}
               </motion.div>
           </motion.div>
       ))}
    </div>
  );
};

const ContactCard = ({ icon: Icon, title, value, sub, actionLabel, onAction }: any) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="group relative overflow-hidden bg-[#121820]/80 backdrop-blur-sm border border-white/5 p-5 md:p-6 rounded-2xl transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(33,201,151,0.1)]"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 flex items-start gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-300 shrink-0">
                <Icon size={20} className="md:w-6 md:h-6" />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-gray-400 text-xs font-mono tracking-widest uppercase mb-1">{title}</h4>
                <div className="text-white font-bold text-base md:text-lg mb-1 truncate">{value}</div>
                <div className="text-gray-500 text-xs mb-4 truncate">{sub}</div>
                
                <button 
                    onClick={onAction}
                    className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider hover:text-white transition-colors"
                >
                    {actionLabel} <ArrowRight size={12} />
                </button>
            </div>
        </div>
    </motion.div>
);

const LiveStatusBadge = ({ icon: Icon, label, value, color = "text-primary", bg = "bg-primary/10" }: any) => (
    <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/5 rounded-lg backdrop-blur-md">
        <div className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')} animate-pulse`} />
        <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wider font-mono">{label}</span>
            <span className={`text-xs font-bold ${color}`}>{value}</span>
        </div>
    </div>
);

// --- MAIN PAGE ---

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', department: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create new message object
    const newMessage: ContactMessage = {
        id: `MSG-${Math.floor(Math.random() * 10000)}`,
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        department: formState.department || 'Genel',
        message: formState.message,
        createdAt: new Date().toISOString(),
        isRead: false
    };

    // Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Save to localStorage
    const existingMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    localStorage.setItem('contact_messages', JSON.stringify([newMessage, ...existingMessages]));

    setIsSubmitting(false);
    setIsSent(true);
    setFormState({ name: '', email: '', phone: '', department: '', message: '' });
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      // Could add toast here
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] pt-28 md:pt-32 pb-24 relative overflow-hidden font-sans">
       
       {/* Background Grid & Noise */}
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none opacity-20" />
       
       {/* Cinematic Glows */}
       <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
       <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

       <div className="container mx-auto px-6 relative z-10">
          
          {/* Header Title */}
          <div className="mb-12 md:mb-16 text-center lg:text-left">
             <motion.div 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-primary mb-4 md:mb-6"
             >
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                BAĞLANTI MERKEZİ
             </motion.div>
             <motion.h1 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="text-4xl md:text-7xl font-display font-bold text-white leading-none tracking-tight"
             >
                İletişime <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-200 to-white">Geç.</span>
             </motion.h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
             
             {/* LEFT COLUMN: INFO & STATUS */}
             <div className="lg:col-span-5 space-y-8 md:space-y-10">
                
                {/* Status Bar */}
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                   className="flex flex-wrap gap-3 md:gap-4"
                >
                   <LiveStatusBadge icon={Activity} label="Sistem Durumu" value="OPERASYONEL" />
                   <LiveStatusBadge icon={Clock} label="Ort. Yanıt Süresi" value="< 24 SAAT" color="text-blue-400" />
                </motion.div>

                <p className="text-gray-400 text-base md:text-lg leading-relaxed border-l-2 border-white/10 pl-4 md:pl-6">
                   Projeleriniz için teknik destek, satış öncesi bilgi veya genel sorularınız için mühendislik ekibimizle doğrudan bağlantı kurun.
                </p>

                {/* Contact Cards Grid */}
                <div className="space-y-4">
                   <ContactCard 
                      icon={Phone} 
                      title="Çağrı Merkezi" 
                      value="+90 (462) 330 61 00" 
                      sub="GSM: +90 (532) 285 99 85" 
                      actionLabel="Hemen Ara" 
                      onAction={() => window.open('tel:+904623306100')}
                   />
                   <ContactCard 
                      icon={Mail} 
                      title="E-Posta Destek" 
                      value="info@northenerji.com" 
                      sub="Kurumsal ve Teknik Talepler" 
                      actionLabel="Adresi Kopyala" 
                      onAction={() => copyToClipboard('info@northenerji.com')}
                   />
                   <ContactCard 
                      icon={MapPin} 
                      title="Genel Merkez" 
                      value="Trabzon, Ortahisar" 
                      sub="Sanayi, Değirmen 1 Nolu Sokak No:2/1" 
                      actionLabel="Yol Tarifi Al" 
                      onAction={() => window.open('https://maps.app.goo.gl/f4xZw3X71niQVR2WA')}
                   />
                </div>

                {/* Neural Map Visual (Functional Version) */}
                <div className="hidden lg:block pt-10">
                    <SystemStatusRadar />
                </div>
             </div>

             {/* RIGHT COLUMN: INTERACTIVE FORM */}
             <div className="lg:col-span-7 relative pt-8 md:pt-12">
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                  className="relative bg-[#0b0f14]/90 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 z-10 shadow-[0_0_80px_rgba(59,130,246,0.3)]"
                >
                   {/* Decorative Tech Lines */}
                   <div className="absolute top-10 right-0 w-20 h-[1px] bg-gradient-to-l from-blue-500/50 to-transparent" />
                   <div className="absolute bottom-10 left-0 w-20 h-[1px] bg-gradient-to-r from-blue-500/50 to-transparent" />
                   
                   {/* Corner Accents */}
                   <div className="absolute top-6 left-6 w-3 h-3 border-t border-l border-white/30" />
                   <div className="absolute bottom-6 right-6 w-3 h-3 border-b border-r border-white/30" />

                   <div className="mb-8 md:mb-10 relative z-20">
                      <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 flex items-center gap-3">
                          Talep Oluştur
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]" />
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500">Form aracılığıyla iletilen talepler CRM sistemimize otomatik düşer.</p>
                   </div>

                   {isSent ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="py-12 flex flex-col items-center justify-center relative"
                      >
                         {/* Glowing Background Effect */}
                         <div className="absolute inset-0 bg-primary/5 blur-[60px] rounded-full pointer-events-none" />

                         {/* Success Icon */}
                         <div className="relative mb-8">
                             <motion.div 
                               initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
                               className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-full flex items-center justify-center border border-primary/30 shadow-[0_0_40px_rgba(33,201,151,0.3)]"
                             >
                                 <Check size={40} className="text-primary drop-shadow-[0_0_10px_rgba(33,201,151,0.8)] md:w-[48px] md:h-[48px]" />
                             </motion.div>
                             <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20" />
                         </div>

                         <h4 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 text-center">İletim Başarılı</h4>
                         <p className="text-gray-400 text-sm mb-8 text-center max-w-sm">Talebiniz güvenli bir şekilde North sunucularına aktarıldı.</p>

                         {/* Ticket / Receipt Card */}
                         <div className="w-full max-w-sm bg-[#080a0c] border border-white/10 rounded-xl p-5 relative overflow-hidden mb-8 group hover:border-primary/30 transition-colors">
                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-600" />
                             <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
                             
                             <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                                 <div className="text-xs text-gray-400 font-mono uppercase tracking-widest">İşlem Özeti</div>
                                 <FileText size={18} className="text-primary transition-colors" />
                             </div>

                             {/* Timeline */}
                             <div className="space-y-3">
                                 <div className="flex items-center gap-3">
                                     <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
                                         <Check size={10} className="text-emerald-500" />
                                     </div>
                                     <span className="text-xs text-white">Talep Alındı</span>
                                 </div>
                                 <div className="flex items-center gap-3">
                                     <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
                                         <Check size={10} className="text-emerald-500" />
                                     </div>
                                     <span className="text-xs text-white">Sisteme İşlendi</span>
                                 </div>
                                 <div className="flex items-center gap-3">
                                     <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10 animate-pulse">
                                         <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                     </div>
                                     <span className="text-xs text-gray-400">Uzman Ataması Bekleniyor</span>
                                 </div>
                             </div>
                         </div>

                         <div className="flex flex-col w-full max-w-sm gap-3">
                             <button 
                                onClick={() => { setIsSent(false); }} 
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
                             >
                                 <RefreshCw size={14} /> Yeni Talep Oluştur
                             </button>
                             <button 
                                onClick={() => navigate('/')} 
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                             >
                                 <Home size={14} /> Ana Sayfaya Dön
                             </button>
                         </div>
                      </motion.div>
                   ) : (
                      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 relative z-20">
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {/* Name */}
                            <div className="relative group">
                               <input 
                                  type="text" 
                                  required
                                  value={formState.name}
                                  onChange={e => setFormState({...formState, name: e.target.value})}
                                  onFocus={() => setActiveField('name')}
                                  onBlur={() => setActiveField(null)}
                                  className="peer w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-transparent focus:border-primary focus:outline-none transition-colors"
                                  placeholder="Ad Soyad"
                               />
                               <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${activeField === 'name' || formState.name ? '-top-5 text-xs text-primary' : 'top-3 text-gray-500'}`}>
                                  Ad Soyad
                               </label>
                            </div>

                            {/* Email */}
                            <div className="relative group">
                               <input 
                                  type="email" 
                                  required
                                  value={formState.email}
                                  onChange={e => setFormState({...formState, email: e.target.value})}
                                  onFocus={() => setActiveField('email')}
                                  onBlur={() => setActiveField(null)}
                                  className="peer w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-transparent focus:border-primary focus:outline-none transition-colors"
                                  placeholder="E-Posta"
                               />
                               <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${activeField === 'email' || formState.email ? '-top-5 text-xs text-primary' : 'top-3 text-gray-500'}`}>
                                  E-Posta Adresi
                               </label>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {/* Phone */}
                            <div className="relative group">
                               <input 
                                  type="tel" 
                                  value={formState.phone}
                                  onChange={e => setFormState({...formState, phone: e.target.value})}
                                  onFocus={() => setActiveField('phone')}
                                  onBlur={() => setActiveField(null)}
                                  className="peer w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-transparent focus:border-primary focus:outline-none transition-colors"
                                  placeholder="Telefon"
                               />
                               <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${activeField === 'phone' || formState.phone ? '-top-5 text-xs text-primary' : 'top-3 text-gray-500'}`}>
                                  Telefon (Opsiyonel)
                               </label>
                            </div>

                            {/* Department Select */}
                            <div className="relative group">
                               <select 
                                  value={formState.department}
                                  onChange={e => setFormState({...formState, department: e.target.value})}
                                  onFocus={() => setActiveField('department')}
                                  onBlur={() => setActiveField(null)}
                                  className="peer w-full bg-transparent border-b border-white/20 py-3 text-white focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
                               >
                                  <option value="" className="bg-[#121820] text-gray-500">Seçiniz</option>
                                  <option value="satis" className="bg-[#121820]">Satış ve Teklif</option>
                                  <option value="teknik" className="bg-[#121820]">Teknik Destek</option>
                                  <option value="ik" className="bg-[#121820]">İnsan Kaynakları</option>
                                  <option value="diger" className="bg-[#121820]">Diğer</option>
                               </select>
                               <label className={`absolute left-0 transition-all duration-300 pointer-events-none -top-5 text-xs text-primary`}>
                                  İlgili Departman
                               </label>
                            </div>
                         </div>

                         {/* Message */}
                         <div className="relative group pt-4 pb-6">
                            <textarea 
                               rows={4}
                               required
                               value={formState.message}
                               onChange={e => setFormState({...formState, message: e.target.value})}
                               onFocus={() => setActiveField('message')}
                               onBlur={() => setActiveField(null)}
                               className="peer w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white placeholder-transparent focus:border-primary/50 focus:bg-white/[0.05] focus:outline-none transition-all resize-none"
                               placeholder="Mesajınız"
                            />
                            <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${activeField === 'message' || formState.message ? '-top-2 text-xs text-primary bg-[#0b0f14] px-2 rounded' : 'top-8 text-gray-500'}`}>
                               Mesajınız / Proje Detayları
                            </label>
                         </div>

                         <div className="pt-2 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                            <div className="text-[10px] text-gray-500 max-w-[200px] text-center md:text-left">
                               * KVKK kapsamında kişisel verileriniz korunmaktadır.
                            </div>
                            <button 
                              type="submit" 
                              disabled={isSubmitting}
                              className="group relative inline-flex items-center justify-center w-full md:w-auto gap-3 px-8 py-4 bg-[#121820] text-white font-bold rounded-xl overflow-hidden transition-all border border-white/10 hover:border-primary hover:shadow-[0_0_20px_rgba(33,201,151,0.3)] disabled:opacity-50"
                            >
                                <span className="relative z-10">{isSubmitting ? 'İşleniyor...' : 'GÖNDER'}</span>
                                {!isSubmitting && <Send size={18} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                         </div>

                      </form>
                   )}
                </motion.div>
             </div>

          </div>
       </div>
    </div>
  );
};

export default Contact;