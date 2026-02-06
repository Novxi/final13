import React, { useState, useEffect, useRef } from 'react';
import { generateSolarAdvice } from '../services/geminiService';
import { X, Sparkles, ArrowUp, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Merhaba. Ben North Intelligence. Enerji mimarinizi tasarlamanıza nasıl yardımcı olabilirim?' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
        const aiResponse = await generateSolarAdvice(userMsg);
        setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'ai', text: 'Bağlantı şu an kurulamıyor. Lütfen tekrar deneyin.' }]);
    } finally {
        setLoading(false);
    }
  };

  // --- PREMIUM TRIGGER BUTTON ---
  const TriggerButton = () => (
    <motion.button
      onClick={() => setIsOpen(true)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group w-14 h-14 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 rounded-full border border-white/5" />
      
      {/* Rainbow Glow Border Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity duration-500 animate-pulse" />
      
      <Sparkles className="relative z-10 w-6 h-6 text-white group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
    </motion.button>
  );

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[100] font-sans antialiased flex flex-col items-end">
      <AnimatePresence mode="wait">
        {!isOpen && (
            <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -90 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 90 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                <TriggerButton />
            </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} // Apple-style easing
            className="origin-bottom-right w-[calc(100vw-32px)] sm:w-[380px] h-[80vh] sm:h-[650px] max-h-[85vh] flex flex-col bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02]">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-800 to-black border border-white/10 flex items-center justify-center">
                     <Sparkles className="w-4 h-4 text-primary" strokeWidth={2} />
                  </div>
                  <div>
                     <h3 className="text-white font-display font-bold text-sm tracking-wide">North Intelligence</h3>
                     <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Aktif
                     </div>
                  </div>
               </div>
               <button 
                 onClick={() => setIsOpen(false)} 
                 className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-gray-400 hover:text-white"
               >
                  <X size={16} />
               </button>
            </div>

            {/* --- MESSAGES --- */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
               {messages.map((m, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                     <div className={`max-w-[85%] p-4 text-sm leading-relaxed shadow-lg ${
                        m.role === 'user' 
                        ? 'bg-white text-black rounded-2xl rounded-tr-sm font-medium' 
                        : 'bg-[#1c1c1e] text-gray-200 border border-white/5 rounded-2xl rounded-tl-sm'
                     }`}>
                        {m.text}
                     </div>
                  </motion.div>
               ))}
               
               {/* Thinking Indicator (Apple Intelligence Style) */}
               {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                     <div className="bg-[#1c1c1e] border border-white/5 rounded-2xl rounded-tl-sm p-4 flex items-center gap-1.5 shadow-lg">
                        <div className="w-2 h-2 bg-gradient-to-r from-primary to-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 bg-gradient-to-r from-primary to-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-gradient-to-r from-primary to-emerald-400 rounded-full animate-bounce" />
                     </div>
                  </motion.div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* --- INPUT AREA --- */}
            <div className="p-5 bg-gradient-to-t from-black/50 to-transparent">
               <div className="relative group bg-[#1c1c1e] border border-white/10 focus-within:border-primary/50 rounded-[20px] p-1.5 pl-4 flex items-center gap-2 shadow-lg transition-colors duration-300">
                  <input 
                     type="text" 
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                     placeholder="North Enerji'ye sor..."
                     className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-600 font-medium w-full"
                     autoFocus
                  />
                  
                  {/* "Northla" Button with Rainbow Glow */}
                  <div className="relative shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-2xl blur opacity-75 animate-pulse"></div>
                      <button 
                         onClick={handleSend}
                         disabled={loading || !input.trim()}
                         className="relative px-4 py-2.5 rounded-2xl bg-white text-black text-xs font-bold tracking-wide hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.3)] z-10"
                      >
                         Northla <ArrowUp size={14} strokeWidth={3} />
                      </button>
                  </div>
               </div>
               <div className="text-[10px] text-gray-600 text-center mt-3 font-medium tracking-wide">
                  Powered by North Generative Engine
               </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWidget;