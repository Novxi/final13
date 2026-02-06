import React, { useState, useEffect, useRef } from 'react';
import { useForm, SubmitErrorHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle, Thermometer, Factory, Activity, Warehouse, Clock, Triangle, Layers, CloudSun, Zap, Leaf, Fuel, ShoppingBag, Server, Building, Hotel, Home as HomeIcon, Building2, Battery, Car, Home, Sun, Info, Download, ChevronRight, User, Smartphone, Mail, Briefcase, FileText, Mountain, Map, FileCheck, Anchor, Search, ArrowLeft, Camera, Image as ImageIcon, X, Plug, CheckCircle2, Cpu, Sparkles, TrendingUp, Wallet, BarChart2, MapPin, Store, AlignJustify, Box, Cloud, Snowflake, Moon, AlertTriangle, Calculator, FileDown, Printer, Share2 } from 'lucide-react';
import { TURKEY_CITIES } from '../constants';
import { Lead } from '../types';
import { jsPDF } from "jspdf";

// --- ROBUST SCHEMA DEFINITION ---
const leadSchema = z.object({
  propertyType: z.enum(["home", "business", "factory", "land"]),
  
  // Numeric fields using number() assuming valueAsNumber is used in inputs
  roofArea: z.number().min(10, "Minimum 10m² alan gereklidir"),
  monthlyBill: z.number().min(100, "Minimum fatura tutarı giriniz"),
  
  // Location
  city: z.string().min(1, "Lütfen il seçiniz"),
  district: z.string().min(1, "Lütfen ilçe seçiniz"),
  
  // Contact
  fullName: z.string().min(3, "Ad Soyad en az 3 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),

  // Optional / Conditional Fields
  buildingSubtype: z.string().optional(),
  roofType: z.string().optional(),
  roofMaterial: z.string().optional(),
  infrastructurePhase: z.string().optional(),
  shading: z.string().optional(),
  
  // Addons
  wantsStorage: z.string().optional(), // "yes" | "no"
  hasEV: z.string().optional(),
  usesHeatPump: z.string().optional(),
  
  // Technical Details (Optional based on flow)
  connectionType: z.string().optional(), // lv | mv
  // Updated preprocess to safely handle NaN and empty strings for optional numbers
  transformerPower: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    const n = Number(val);
    return isNaN(n) ? undefined : n;
  }, z.number().optional()),
  shiftCount: z.string().optional(), // Used for Shift/Working Schedule
  
  // Addon Specifics
  vehicleCount: z.preprocess((val) => val === '' ? undefined : Number(val), z.number().optional()),
  carBatteryCapacity: z.preprocess((val) => val === '' ? undefined : Number(val), z.number().optional()),
  desiredChargeTime: z.string().optional(),
  desiredBackupDuration: z.string().optional(),
  existingHeatPumpState: z.string().optional(),
  existingEVState: z.string().optional(),
  heatingArea: z.preprocess((val) => val === '' ? undefined : Number(val), z.number().optional()),
  gridConnectionType: z.string().optional(),
  
  // Land Specifics
  landOwnership: z.string().optional(),
  hasCallLetter: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

// --- UI COMPONENTS ---

const StepIndicator = ({ current, total }: { current: number, total: number }) => (
    <div className="flex items-center gap-2 mb-8">
        {Array.from({ length: total }).map((_, i) => {
            const isActive = i === current;
            const isCompleted = i < current;
            return (
                <div key={i} className="flex-1 flex items-center">
                    <div className={`h-[2px] w-full transition-all duration-700 relative overflow-hidden ${isActive || isCompleted ? 'bg-primary/30' : 'bg-white/5'}`}>
                        {(isActive || isCompleted) && (
                            <motion.div 
                                layoutId={`step-fill-${i}`}
                                className="absolute inset-0 bg-primary shadow-[0_0_10px_#21c997]"
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                transition={{ duration: 0.5 }}
                            />
                        )}
                    </div>
                </div>
            )
        })}
        <div className="ml-3 text-[10px] font-mono text-primary font-bold tracking-widest opacity-80 whitespace-nowrap">
            0{current + 1} / 0{total}
        </div>
    </div>
);

const AddonCard = ({ selected, onClick, icon: Icon, title, sub, iconColor, glowColor, gradientClass }: any) => (
    <motion.button type="button" onClick={onClick} whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }} className={`relative w-full h-[140px] md:h-[160px] rounded-[24px] overflow-hidden transition-all duration-500 group border cursor-pointer pointer-events-auto ${selected ? 'border-transparent shadow-[0_0_40px_rgba(0,0,0,0.5)]' : 'border-white/10 hover:border-white/20 bg-[#0e1217]'}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} transition-opacity duration-500 ${selected ? 'opacity-20' : 'opacity-0 group-hover:opacity-10'}`} />
        {selected && (<div className={`absolute inset-0 border-2 rounded-[24px] ${glowColor.replace('bg-', 'border-')} shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] opacity-50`} />)}
        <div className="relative h-full p-5 md:p-6 flex flex-col justify-between z-10">
            <div className="flex justify-between items-start"><div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${selected ? `${glowColor} text-black shadow-lg scale-110` : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'}`}><Icon size={20} className="md:w-6 md:h-6" strokeWidth={1.5} /></div>{selected ? (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full ${glowColor} text-black text-[9px] md:text-[10px] font-bold uppercase tracking-wider shadow-lg`}>EKLENDİ</motion.div>) : (<div className="w-6 h-6 rounded-full border border-white/20 group-hover:border-white/50 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-white" /></div>)}</div>
            <div className="text-left"><h4 className={`text-base md:text-lg font-display font-bold leading-tight mb-1 transition-colors ${selected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{title}</h4><p className={`text-[10px] md:text-xs transition-colors ${selected ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'}`}>{sub}</p></div>
        </div>
    </motion.button>
);

const SelectionGridItem = ({ selected, onClick, icon: Icon, title, sub }: any) => (
    <div 
        onClick={onClick}
        className={`relative cursor-pointer group flex flex-col p-4 rounded-2xl border-2 transition-all duration-300 h-full ${
            selected 
            ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(33,201,151,0.15)]' 
            : 'bg-[#121820] border-white/5 hover:border-white/20 hover:bg-[#1a202c]'
        }`}
    >
        {selected && (
            <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg z-10">
                <Check size={12} className="text-black stroke-[3]" />
            </div>
        )}
        <div className={`mb-3 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selected ? 'bg-primary text-black' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
            <Icon size={20} />
        </div>
        <div>
            <div className={`font-bold text-sm mb-0.5 transition-colors ${selected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{title}</div>
            {sub && <div className="text-[10px] text-gray-500">{sub}</div>}
        </div>
    </div>
);

const AnimatedBillSlider = ({ value, onChange, min = 500, max = 40000, propertyType }: any) => {
    const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    return (
        <div className="w-full bg-[#0a0d12] border border-white/10 rounded-2xl p-6 relative overflow-hidden group pointer-events-auto">
            <div className="relative z-10">
                <div className="flex justify-between items-end mb-6"><div><div className="text-gray-500 text-[10px] font-mono tracking-widest uppercase mb-2">{propertyType === 'land' ? 'Yıllık Elektrik Faturası' : 'Aylık Ortalama Fatura'}</div><div className="text-3xl md:text-4xl font-display font-bold text-white flex items-baseline gap-1">{value.toLocaleString()} <span className="text-sm font-sans font-medium text-gray-500 ml-1">TL</span></div></div></div>
                <div className="relative h-2 flex items-center"><div className="absolute w-full h-[2px] bg-white/10" /><motion.div className="absolute h-[2px] bg-primary shadow-[0_0_10px_#21c997]" style={{ width: `${percentage}%` }} /><motion.div className="absolute w-6 h-6 bg-[#0b0f14] border-2 border-primary rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-20 shadow-lg" style={{ left: `calc(${percentage}% - 12px)` }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 1 }}><div className="w-1.5 h-1.5 bg-primary rounded-full" /></motion.div><input type="range" min={min} max={max} step={propertyType === 'factory' || propertyType === 'land' ? 5000 : 100} value={value} onChange={(e) => onChange(parseInt(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" /></div>
                <div className="flex justify-between mt-4 text-[10px] text-gray-600 font-mono uppercase"><span>{min.toLocaleString()}</span><span>{max.toLocaleString()}+</span></div>
            </div>
        </div>
    );
};

const AddonDetailModal = ({ 
    type, 
    isOpen, 
    onClose, 
    onSave, 
    billAlreadyEntered 
}: { 
    type: 'ev' | 'storage' | 'heatpump', 
    isOpen: boolean, 
    onClose: () => void, 
    onSave: (data: any) => void, 
    billAlreadyEntered: boolean
}) => {
    const { register, handleSubmit } = useForm();

    if (!isOpen) return null;

    const onSubmit = (data: any) => {
        onSave(data);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-[#121820] border border-white/10 rounded-3xl p-8 relative shadow-2xl"
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <X size={18} />
                </button>

                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    {type === 'ev' && <Car className="text-emerald-400" />}
                    {type === 'storage' && <Battery className="text-blue-400" />}
                    {type === 'heatpump' && <Thermometer className="text-orange-400" />}
                    {type === 'ev' ? 'EV Şarj Detayları' : type === 'storage' ? 'Depolama Detayları' : 'Isı Pompası Detayları'}
                </h3>
                <p className="text-gray-400 text-sm mb-6">Size en uygun sistemi önerebilmemiz için birkaç detay daha gerekli.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {!billAlreadyEntered && (
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300 ml-1">Aylık Ortalama Fatura (TL)</label>
                            <input type="number" {...register('monthlyBill', { required: true, min: 100 })} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary/50 outline-none transition-colors" placeholder="Örn: 2000" />
                        </div>
                    )}
                    {type === 'ev' && (
                        <>
                            <div className="space-y-2"><label className="text-sm text-gray-300 ml-1">Araç Batarya Kapasitesi (kWh)</label><input type="number" {...register('carBatteryCapacity', { required: true })} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary/50 outline-none" placeholder="Örn: 77" /></div>
                            <div className="space-y-2"><label className="text-sm text-gray-300 ml-1">Hedeflenen Şarj Süresi</label><select {...register('desiredChargeTime', { required: true })} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary/50 outline-none"><option value="0-2">0 - 2 Saat (DC Hızlı)</option><option value="2-4">2 - 4 Saat (AC Hızlı)</option><option value="4-8">4 - 8 Saat (Standart AC)</option></select></div>
                        </>
                    )}
                    {type === 'storage' && (
                        <>
                            <div className="space-y-2"><label className="text-sm text-gray-300 ml-1">Kesinti Anında İdare Süresi</label><select {...register('desiredBackupDuration', { required: true })} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary/50 outline-none"><option value="0-2">0 - 2 Saat (Kritik Yükler)</option><option value="6-12">6 - 12 Saat (Tüm Ev - Gece)</option><option value="12-24">12 - 24 Saat (Tam Off-Grid)</option></select></div>
                            <div className="space-y-2"><label className="text-sm text-gray-300 ml-1">Isı Pompanız Var mı?</label><select {...register('existingHeatPumpState')} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary/50 outline-none"><option value="no">Hayır</option><option value="yes">Evet</option><option value="want-to-add">Eklemek İstiyorum</option></select></div>
                        </>
                    )}
                    {type === 'heatpump' && (
                        <>
                            <div className="space-y-2"><label className="text-sm text-gray-300 ml-1">Isıtma Alanı (m²)</label><input type="number" {...register('heatingArea', { required: true })} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary/50 outline-none" placeholder="Örn: 120" /></div>
                            <div className="space-y-2"><label className="text-sm text-gray-300 ml-1">Şebeke Bağlantı Tipi</label><select {...register('gridConnectionType', { required: true })} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary/50 outline-none"><option value="monophase">Monofaze (Tek Faz)</option><option value="industrial">Trifaze (Sanayi)</option></select></div>
                        </>
                    )}

                    <button type="submit" className="w-full py-3 bg-primary text-black font-bold rounded-xl hover:bg-emerald-400 transition-colors mt-4">Bilgileri Kaydet</button>
                </form>
            </motion.div>
        </div>
    );
};

const AnimatedScore = ({ value, className }: any) => {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { stiffness: 50, damping: 20 });

    useEffect(() => {
        motionValue.set(parseFloat(String(value)));
    }, [value, motionValue]);

    useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;
        
        const unsubscribe = springValue.on("change", (v) => {
            node.textContent = v.toFixed(1);
        });
        return () => unsubscribe();
    }, [springValue]);

    return <span ref={nodeRef} className={className}>{value}</span>;
}

// --- ENERGY ANALYSIS ENGINE SIDEBAR COMPONENT ---
const EnergyAnalysisEngine = ({ results, inputs }: { results: any, inputs: any }) => {
    const rec = parseFloat(results.recommended);
    const inst = parseFloat(results.installable);
    const maxVal = Math.max(rec, inst, 1); 
    const recPct = Math.min((rec / maxVal) * 100, 100);
    const instPct = Math.min((inst / maxVal) * 100, 100);
    const isCapacitySufficient = inst >= rec;

    return (
        <div className="lg:sticky lg:top-24 space-y-4">
            <div className="relative bg-[#0b0f14]/90 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 overflow-hidden shadow-2xl group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30 animate-[scan_3s_ease-in-out_infinite]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
                
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(33,201,151,0.2)]">
                            <Cpu size={18} className="text-primary animate-pulse" />
                        </div>
                        <div>
                            <div className="text-[10px] font-mono text-primary tracking-widest uppercase mb-0.5">North Simülasyon</div>
                            <div className="text-xs text-gray-400 font-medium">Sistem Analizi</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[9px] font-bold text-gray-400">ONLINE</span>
                    </div>
                </div>

                <div className="mb-8 relative z-10 pl-1">
                    <div className="text-2xl font-display font-bold text-white leading-tight mb-1">
                        {inputs.fullName ? (
                            <>Sayın <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{inputs.fullName.split(' ')[0]} </span>,</>
                        ) : (
                            <>Geleceğin Enerjisi,</>
                        )}
                    </div>
                    <div className="text-gray-500 text-sm font-light">
                        {inputs.city ? <span className="flex items-center gap-1.5"><Map size={14} /> {inputs.city} lokasyonu analiz ediliyor.</span> : 'Profiliniz oluşturuluyor.'}
                    </div>
                </div>

                <div className="mb-8 relative z-10 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                            <Zap size={12} className="text-yellow-400" /> Güç Kapasite Analizi
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${isCapacitySufficient ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10'}`}>
                            {isCapacitySufficient ? 'ALAN YETERLİ' : 'ALAN KISITLI'}
                        </span>
                    </div>
                    
                    <div className="space-y-5">
                        <div className="relative w-full">
                            <div className="flex justify-between text-[11px] text-gray-400 mb-1.5 font-medium">
                                <span>İhtiyacınız Olan</span>
                                <span className="text-white font-mono">{results.recommended} kWp</span>
                            </div>
                            <div className="h-2 w-full bg-gray-800/50 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${recPct}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"
                                />
                            </div>
                        </div>

                        <div className="relative w-full">
                            <div className="flex justify-between text-[11px] text-gray-400 mb-1.5 font-medium">
                                <span>Çatı/Arazi Kapasitesi</span>
                                <span className={`font-mono ${isCapacitySufficient ? 'text-emerald-400' : 'text-amber-400'}`}>{results.installable} kWp</span>
                            </div>
                            <div className="h-2 w-full bg-gray-800/50 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${instPct}%` }}
                                    transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                                    className={`h-full rounded-full ${isCapacitySufficient ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-500 shadow-[0_0_10px_#f59e0b]'}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                    <div className="bg-gradient-to-br from-[#151a21] to-[#0c1014] border border-white/5 p-4 rounded-2xl relative overflow-hidden group/card hover:border-primary/20 transition-colors">
                        <div className="absolute top-0 right-0 p-3 opacity-5"><Wallet size={40} /></div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1">Tasarruf</div>
                        <div className="text-3xl font-bold text-emerald-400 font-display flex items-baseline gap-0.5">
                            %<AnimatedScore value={results.offset} className="" />
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1 font-medium">Fatura Düşüşü</div>
                    </div>
                    <div className="bg-gradient-to-br from-[#151a21] to-[#0c1014] border border-white/5 p-4 rounded-2xl relative overflow-hidden group/card hover:border-primary/20 transition-colors">
                        <div className="absolute top-0 right-0 p-3 opacity-5"><TrendingUp size={40} /></div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1">Amortisman</div>
                        <div className="text-3xl font-bold text-white font-display flex items-baseline gap-1">
                            <AnimatedScore value={parseFloat(results.roi)} className="" />
                            <span className="text-sm font-sans text-gray-500 font-normal">Yıl</span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1 font-medium">Yatırım Dönüşü</div>
                    </div>
                </div>

                <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-2xl relative z-10">
                    <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">North AI Skoru</div>
                        <div className="text-white font-bold text-base">{results.verdict}</div>
                    </div>
                    <div className="relative w-12 h-12 flex-shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#1f2937" strokeWidth="6" />
                            <motion.circle 
                                cx="50" cy="50" r="42" fill="none" stroke="#21c997" strokeWidth="6"
                                strokeDasharray="263.8"
                                initial={{ strokeDashoffset: 263.8 }}
                                animate={{ strokeDashoffset: 263.8 - (263.8 * results.score) / 100 }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                            {results.score}
                        </div>
                    </div>
                </div>

            </div>

            {results.insights.length > 0 && (
                <div className="bg-[#0b0f14]/80 backdrop-blur border border-white/10 rounded-2xl p-5 shadow-lg">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Sparkles size={10} className="text-primary" /> Sistem Tespitleri
                    </h4>
                    <div className="space-y-2">
                        {results.insights.map((insight: any, i: number) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (i * 0.1) }}
                                className={`flex gap-3 text-[11px] p-2.5 rounded-lg border ${
                                    insight.type === 'good' 
                                    ? 'bg-emerald-500/5 border-emerald-500/10 text-gray-300' 
                                    : insight.type === 'warning'
                                    ? 'bg-amber-500/10 border-amber-500/20 text-gray-200'
                                    : 'bg-blue-500/5 border-blue-500/10 text-gray-300'
                                }`}
                            >
                                {insight.type === 'good' ? (
                                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" /> 
                                ) : insight.type === 'warning' ? (
                                    <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                                ) : (
                                    <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
                                )}
                                {insight.text}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// --- MAIN COMPONENT ---

const LeadForm = () => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProposal, setShowProposal] = useState(false); 
  const [generatedId, setGeneratedId] = useState<string>('');
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);
  const [photo, setPhoto] = useState<string | null>(null); 
  const [activeModal, setActiveModal] = useState<'none' | 'ev' | 'storage' | 'heatpump'>('none');
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors }, getValues } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema) as any,
    mode: 'onChange', 
    defaultValues: {
        propertyType: undefined,
        monthlyBill: 2000,
        roofArea: 100,
        connectionType: "lv",
        shiftCount: "1",
        landOwnership: "yes",
        hasCallLetter: "no",
        wantsStorage: "no",
        hasEV: "no",
        usesHeatPump: "no"
    }
  });

  const watchedBill = watch('monthlyBill');
  const watchedArea = watch('roofArea');
  const watchedCity = watch('city');
  const watchedProperty = watch('propertyType');
  const watchedSubtype = watch('buildingSubtype');
  const watchedRoofType = watch('roofType');
  const watchedMaterial = watch('roofMaterial');
  const watchedShading = watch('shading');
  const watchedShift = watch('shiftCount');
  const watchedConnectionType = watch('connectionType');
  
  // Watch addon states
  const watchedStorage = watch('wantsStorage');
  const watchedEV = watch('hasEV');
  const watchedHeatPump = watch('usesHeatPump');
  
  const allValues = watch(); 

  const handleAddonToggle = (type: 'ev' | 'storage' | 'heatpump') => {
      const currentVal = type === 'ev' ? watchedEV : type === 'storage' ? watchedStorage : watchedHeatPump;
      if (currentVal === 'yes') {
          if(type === 'ev') setValue('hasEV', 'no');
          else if(type === 'storage') setValue('wantsStorage', 'no');
          else setValue('usesHeatPump', 'no');
      } else { setActiveModal(type); }
  };

  const handleModalSave = (data: any) => {
      if (activeModal === 'ev') setValue('hasEV', 'yes');
      else if (activeModal === 'storage') setValue('wantsStorage', 'yes');
      else if (activeModal === 'heatpump') setValue('usesHeatPump', 'yes');
      
      // Update fields if provided
      if (data.monthlyBill && (!watchedBill || watchedBill < 100)) { 
          setValue('monthlyBill', Number(data.monthlyBill)); 
      }
      
      Object.keys(data).forEach(key => { 
          if (key !== 'monthlyBill') setValue(key as any, data[key]); 
      });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          if (file.size > 5 * 1024 * 1024) {
              alert("Dosya boyutu 5MB'dan küçük olmalıdır.");
              return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              setPhoto(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  // --- REVISED SIMULATION ENGINE (PHYSICS BASED V2) ---
  const [simResults, setSimResults] = useState({ score: 0, verdict: 'Analiz Ediliyor...', recommended: '0', installable: '0', offset: 0, roi: '0', co2: '0', insights: [] as any[] });
  
  useEffect(() => {
      // CONSTANTS
      const PRODUCTION_FACTOR = 1350; // kWh per kWp per year (Turkey Avg)
      const HOME_PRICE_PER_KWH = 3.0; // TL
      const BIZ_PRICE_PER_KWH = 4.5; // TL
      const HOME_SYSTEM_COST_USD = 900; // $/kWp
      const BIZ_SYSTEM_COST_USD = 700; // $/kWp (Economy of scale)
      const LAND_SYSTEM_COST_USD = 650; // $/kWp
      const USD_TL = 34;

      const bill = watchedBill || 0;
      const area = watchedArea || 0;
      let pricePerKwh = HOME_PRICE_PER_KWH;
      let systemCostPerKw = HOME_SYSTEM_COST_USD;

      // 1. DETERMINE TYPE & CONSTANTS
      if (watchedProperty === 'factory' || watchedProperty === 'business') {
          pricePerKwh = BIZ_PRICE_PER_KWH;
          systemCostPerKw = BIZ_SYSTEM_COST_USD;
      } else if (watchedProperty === 'land') {
          // Land is investment
          pricePerKwh = BIZ_PRICE_PER_KWH; 
          systemCostPerKw = LAND_SYSTEM_COST_USD;
      }

      // 2. CALCULATE RECOMMENDED CAPACITY (USING SPECIFIC FORMULAS PROVIDED)
      let recommendedKw = 0;
      
      if (watchedProperty === 'home') {
          // Konut Formula: if > 700 -> * 0.0035, else * 0.0052
          if (bill > 700) recommendedKw = bill * 0.0035;
          else recommendedKw = bill * 0.0052;
      } else if (watchedProperty === 'business') { // Ticari
          // Ticari Formula: if > 5550 -> * 0.00225, else * 0.0026
          if (bill > 5550) recommendedKw = bill * 0.00225;
          else recommendedKw = bill * 0.0026;
      } else if (watchedProperty === 'factory') { // Endüstriyel
          // Endüstriyel Formula: (((fatura/1.2)/4))*1.2)/1000
          recommendedKw = (((bill / 1.2) / 4) * 1.2) / 1000;
      } else if (watchedProperty === 'land') { // Arazi
          // Arazi Formula: (((fatura/1.2)/3.586)*1.2)/1000
          recommendedKw = (((bill / 1.2) / 3.586) * 1.2) / 1000;
      } else {
          // Default Fallback
          const annualConsumption = (bill * 12) / pricePerKwh;
          recommendedKw = annualConsumption / PRODUCTION_FACTOR;
      }

      // 3. CALCULATE INSTALLABLE CAPACITY (Based on Area)
      // Per instruction: Çatı/Arazi Kapasitesi = Çatı Alanı x 0.12
      let installableKw = area * 0.12;

      // 4. ACTUAL SYSTEM SIZE
      // For roof, min of need vs space. For land, we usually max out space.
      let actualSystemSize = 0;
      if (watchedProperty === 'land') {
          actualSystemSize = installableKw; // Maximize land use
      } else {
          actualSystemSize = Math.min(recommendedKw, installableKw);
      }

      // 5. ECONOMICS
      // Shading Loss
      let productionEfficiency = 1.0;
      if (watchedShading === 'partial') productionEfficiency = 0.85;

      const annualProduction = actualSystemSize * PRODUCTION_FACTOR * productionEfficiency;
      const annualSavingsTL = annualProduction * pricePerKwh;
      const annualBillTL = bill * 12;
      
      // ROI
      const totalSystemCostTL = actualSystemSize * systemCostPerKw * USD_TL;
      const roi = annualSavingsTL > 0 ? (totalSystemCostTL / annualSavingsTL).toFixed(1) : '0';

      // Offset %
      let offset = 0;
      if (annualBillTL > 0) {
          offset = (annualSavingsTL / annualBillTL) * 100;
      }
      
      // Clamp offset between 0 and 100 as per user request
      offset = Math.max(0, Math.min(100, offset));

      // 6. SCORING (North AI)
      // 0-100 Score
      let score = 0;
      
      // ROI Score (Max 40)
      const roiVal = parseFloat(roi);
      if (roiVal > 0 && roiVal < 10) {
          score += (10 - roiVal) * 4; // e.g. 4 years -> 24 pts. 2 years -> 32 pts.
      } else if (roiVal > 0) {
          score += 5; // Long roi
      }

      // Offset Score (Max 40)
      score += Math.min(40, offset * 0.4);

      // Bonus (Max 20)
      if (watchedShading === 'none') score += 10;
      if (watchedProperty === 'land' || watchedProperty === 'factory') score += 10; // Better investment types

      score = Math.min(99, Math.max(10, Math.round(score)));

      const co2 = (actualSystemSize * 1.2 * 0.5).toFixed(1);

      // 7. INSIGHTS
      const insights = [];
      
      if (watchedProperty === 'home' && watchedSubtype === 'apartment') {
          insights.push({ type: 'warning', text: 'Apartman/Site yönetimi karar defteri onayı gereklidir.' });
      }
      if (watchedShading === 'partial') {
          insights.push({ type: 'warning', text: 'Gölge kaynaklı %15 verim kaybı öngörülmüştür.' });
      }
      if (watchedProperty === 'factory' && watchedConnectionType === 'mv') {
          insights.push({ type: 'info', text: 'OG bağlantısı için trafo kapasite analizi yapılacaktır.' });
      }
      if (watchedProperty !== 'land' && installableKw < recommendedKw) {
           insights.push({ type: 'warning', text: `Çatı alanı ihtiyacın sadece %${Math.round((installableKw/recommendedKw)*100)}'ini karşılıyor.` });
      } else if (watchedProperty !== 'land') {
           insights.push({ type: 'good', text: 'Çatı alanı enerji ihtiyacını karşılamak için yeterli.' });
      }
      if (parseFloat(roi) < 5 && parseFloat(roi) > 0) {
          insights.push({ type: 'good', text: 'Yatırım geri dönüş süresi mükemmel (<5 Yıl).' });
      }

      setSimResults(prev => ({
          ...prev,
          recommended: recommendedKw.toFixed(2),
          installable: installableKw.toFixed(2),
          co2: co2,
          roi: roi,
          offset: Math.round(offset),
          score: score,
          verdict: score > 80 ? 'Mükemmel Yatırım' : score > 60 ? 'İyi Yatırım' : 'Değerlendirilebilir',
          insights: insights
      }));

  }, [watchedBill, watchedArea, watchedProperty, watchedCity, watchedShading, watchedSubtype, watchedConnectionType, watchedRoofType]);

  const handleDownloadPDF = () => {
      if (!submittedLead) return;

      const doc = new jsPDF();
      
      // Branding / Header
      doc.setFillColor(11, 15, 20); // Dark Background
      doc.rect(0, 0, 210, 297, 'F');
      
      // Title
      doc.setFontSize(22);
      doc.setTextColor(33, 201, 151); // Primary Green
      doc.text("NORTH ENERJI", 20, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text("Gelecegin Enerjisi", 20, 26);

      // Doc Info
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Referans No: ${submittedLead.id}`, 150, 20);
      doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 150, 26);

      // Divider
      doc.setDrawColor(50, 50, 50);
      doc.line(20, 35, 190, 35);

      // Customer Info
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text("Musteri Bilgileri", 20, 50);
      
      doc.setFontSize(11);
      doc.setTextColor(200, 200, 200);
      doc.text(`Ad Soyad: ${submittedLead.fullName}`, 20, 60);
      doc.text(`Lokasyon: ${submittedLead.district}, ${submittedLead.city}`, 20, 68);
      doc.text(`Mulkiyet Tipi: ${submittedLead.propertyType?.toUpperCase()}`, 20, 76);

      // Technical Analysis
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text("Sistem Analizi (North AI)", 20, 95);

      // Stats Box
      doc.setDrawColor(33, 201, 151);
      doc.setFillColor(20, 25, 30);
      doc.roundedRect(20, 105, 170, 40, 3, 3, 'FD');

      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text("Onerilen Guc", 30, 115);
      doc.text("Kurulabilir Guc", 85, 115);
      doc.text("Tahmini Tasarruf", 140, 115);

      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text(`${submittedLead.calculatedRecommendedKw} kWp`, 30, 125);
      doc.text(`${submittedLead.calculatedInstallableKw} kWp`, 85, 125);
      doc.text(`%${simResults.offset}`, 140, 125);

      // Detailed Specs
      let yPos = 160;
      doc.setFontSize(12);
      doc.text("Teknik Detaylar:", 20, yPos);
      yPos += 10;
      doc.setFontSize(10);
      doc.setTextColor(180, 180, 180);
      
      const details = [
          `Cati Alani: ${submittedLead.roofArea} m2`,
          `Fatura: ${submittedLead.monthlyBill} TL`,
          `Yapi Tipi: ${submittedLead.buildingSubtype || '-'}`,
          `Golge Durumu: ${submittedLead.shading === 'partial' ? 'Kismi Golge' : 'Acik Alan'}`,
          `Yatirim Donusu (ROI): ${simResults.roi} Yil`,
          `AI Skoru: ${simResults.score}/100`
      ];

      details.forEach((detail) => {
          doc.text(`• ${detail}`, 25, yPos);
          yPos += 8;
      });

      // Addons
      if (submittedLead.wantsStorage || submittedLead.hasEV || submittedLead.usesHeatPump) {
          yPos += 10;
          doc.setFontSize(12);
          doc.setTextColor(33, 201, 151);
          doc.text("Ek Talepler:", 20, yPos);
          yPos += 8;
          doc.setFontSize(10);
          doc.setTextColor(255, 255, 255);
          if (submittedLead.wantsStorage) doc.text("[x] Enerji Depolama (Batarya)", 25, yPos);
          if (submittedLead.hasEV) doc.text("[x] Elektrikli Arac Sarj Istasyonu", 25, yPos + (submittedLead.wantsStorage ? 6 : 0));
          // ... logic for positioning
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("Bu belge North Enerji Simülasyon Motoru tarafindan otomatik olusturulmustur.", 20, 280);
      doc.text("Resmi teklif yerine gecmez. Kesif sonrasi kesinlesecektir.", 20, 285);

      doc.save(`north-enerji-teklif-${submittedLead.id}.pdf`);
  };

  const getFieldsForStep = (currentStep: number, type: string) => {
      if (currentStep === 0) return ['propertyType'];
      if (currentStep === 3) return ['fullName', 'email', 'phone'];
      if (currentStep === 1) {
          const fields = ['roofArea'];
          if (type === 'land') fields.push('landOwnership', 'hasCallLetter', 'connectionType');
          else if (type === 'business' || type === 'factory') {
              fields.push('buildingSubtype', 'shiftCount'); 
              if (type === 'factory') {
                  fields.push('connectionType', 'roofType', 'transformerPower');
              }
          } else if (type === 'home') {
              fields.push('buildingSubtype', 'roofType', 'roofMaterial', 'shading');
          }
          return fields;
      }
      if (currentStep === 2) {
          if (type === 'land') return ['transformerPower', 'contractPower', 'monthlyBill'];
          return ['monthlyBill', 'city', 'district'];
      }
      return [];
  };

  const getSliderConfig = () => {
      if (watchedProperty === 'business') return { min: 2000, max: 200000 };
      if (watchedProperty === 'factory') return { min: 50000, max: 5000000 };
      if (watchedProperty === 'land') return { min: 100000, max: 10000000 };
      return { min: 500, max: 15000 }; 
  };

  const nextStep = async () => { 
      const fields = getFieldsForStep(step, watchedProperty); 
      const valid = await trigger(fields as any); 
      if (valid) {
          setStep(prev => prev + 1); 
      } else {
          alert("Lütfen tüm zorunlu alanları doldurunuz.");
      }
  };
  const prevStep = () => { setStep(prev => Math.max(prev - 1, 0)); };
  
  const onSubmit = async (data: LeadFormData) => {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newLead: Lead = { 
          id: `L-${Math.floor(Math.random() * 10000)}`, 
          status: 'new', 
          createdAt: new Date().toISOString(), 
          propertyType: data.propertyType as any, 
          fullName: data.fullName, 
          email: data.email, 
          phone: data.phone, 
          city: data.city, 
          district: data.district, 
          monthlyBill: data.monthlyBill, 
          roofArea: data.roofArea, 
          photo: photo || undefined, 
          calculatedRecommendedKw: simResults.recommended, 
          calculatedInstallableKw: simResults.installable, 
          wantsStorage: data.wantsStorage === 'yes', 
          hasEV: data.hasEV === 'yes', 
          usesHeatPump: data.usesHeatPump === 'yes', 
          // Spread other fields safely
          ...data 
      };

      const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
      localStorage.setItem('leads', JSON.stringify([newLead, ...existingLeads]));
      setGeneratedId(newLead.id);
      setSubmittedLead(newLead); // Save for PDF and Summary View
      setIsSubmitting(false);
      setShowProposal(true);
  };
  
  

  // --- RENDER ---
  if (showProposal && submittedLead) {
      return (
          <div className="max-w-5xl mx-auto py-8 px-4 md:px-6 relative z-10 pointer-events-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                className="bg-[#0b0f14] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(33,201,151,0.15)] relative z-0"
              >
                  {/* Confetti / Celebration Bg */}
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
                  </div>

                  <div className="relative z-10 p-8 md:p-12">
                      {/* Success Header */}
                      <div className="text-center mb-10">
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-24 h-24 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-full flex items-center justify-center border border-primary/30 mx-auto mb-6 shadow-[0_0_40px_rgba(33,201,151,0.3)]"
                          >
                              <CheckCircle2 size={48} className="text-primary drop-shadow-[0_0_10px_rgba(33,201,151,0.8)]" />
                          </motion.div>
                          <h2 className="text-3xl md:text-5xl text-white font-display font-bold mb-4 tracking-tight">Başvurunuz Alındı</h2>
                          <p className="text-gray-400 text-lg max-w-xl mx-auto">
                              Talebiniz North Enerji mühendislik ekibine iletildi. Referans numaranız ile sürecinizi takip edebilirsiniz.
                          </p>
                      </div>

                      {/* Digital Ticket / Summary Card */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                          {/* Left: Key Stats */}
                          <div className="lg:col-span-2 bg-[#121820] border border-white/5 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Zap size={120} /></div>
                              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                                  <div>
                                      <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Referans Kodu</div>
                                      <div className="text-2xl text-white font-mono font-bold tracking-wider">{submittedLead.id}</div>
                                  </div>
                                  <div className="text-right">
                                      <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">North AI Skoru</div>
                                      <div className="text-2xl text-primary font-bold">{simResults.score}/100</div>
                                  </div>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                  <div>
                                      <div className="text-xs text-gray-500 mb-1">Önerilen Sistem</div>
                                      <div className="text-white font-bold text-lg">{submittedLead.calculatedRecommendedKw} kWp</div>
                                  </div>
                                  <div>
                                      <div className="text-xs text-gray-500 mb-1">Tahmini Tasarruf</div>
                                      <div className="text-emerald-400 font-bold text-lg">%{simResults.offset}</div>
                                  </div>
                                  <div>
                                      <div className="text-xs text-gray-500 mb-1">Amortisman</div>
                                      <div className="text-white font-bold text-lg">{simResults.roi} Yıl</div>
                                  </div>
                                  <div>
                                      <div className="text-xs text-gray-500 mb-1">Lokasyon</div>
                                      <div className="text-white font-bold text-sm truncate">{submittedLead.city}</div>
                                  </div>
                                  <div>
                                      <div className="text-xs text-gray-500 mb-1">Yapı Tipi</div>
                                      <div className="text-white font-bold text-sm capitalize">{submittedLead.propertyType}</div>
                                  </div>
                              </div>
                          </div>

                          {/* Right: Addons & Info */}
                          <div className="lg:col-span-1 bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                              <div>
                                  <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Sparkles size={16} className="text-primary" /> Ek Hizmetler</h4>
                                  <div className="space-y-3">
                                      <div className={`flex items-center justify-between p-2 rounded bg-black/20 ${submittedLead.wantsStorage ? 'opacity-100' : 'opacity-30'}`}>
                                          <span className="text-sm text-gray-300 flex items-center gap-2"><Battery size={14} /> Batarya</span>
                                          {submittedLead.wantsStorage && <Check size={14} className="text-primary" />}
                                      </div>
                                      <div className={`flex items-center justify-between p-2 rounded bg-black/20 ${submittedLead.hasEV ? 'opacity-100' : 'opacity-30'}`}>
                                          <span className="text-sm text-gray-300 flex items-center gap-2"><Car size={14} /> EV Şarj</span>
                                          {submittedLead.hasEV && <Check size={14} className="text-primary" />}
                                      </div>
                                      <div className={`flex items-center justify-between p-2 rounded bg-black/20 ${submittedLead.usesHeatPump ? 'opacity-100' : 'opacity-30'}`}>
                                          <span className="text-sm text-gray-300 flex items-center gap-2"><Thermometer size={14} /> Isı Pompası</span>
                                          {submittedLead.usesHeatPump && <Check size={14} className="text-primary" />}
                                      </div>
                                  </div>
                              </div>
                              <div className="mt-6 pt-4 border-t border-white/10 text-[10px] text-gray-500 leading-tight">
                                  * Bu veriler ön analiz sonucudur. Kesin sonuçlar saha keşfi sonrası netleşecektir.
                              </div>
                          </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <button 
                            onClick={handleDownloadPDF}
                            className="group flex items-center justify-center gap-3 px-8 py-4 bg-primary text-black font-bold rounded-xl hover:bg-white transition-all shadow-[0_0_30px_rgba(33,201,151,0.2)] hover:scale-105"
                          >
                              <FileDown size={20} />
                              Ön Teklifi İndir (PDF)
                          </button>
                          <button 
                            onClick={() => navigate('/')}
                            className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 border border-white/10 transition-all"
                          >
                              Ana Sayfaya Dön
                          </button>
                      </div>
                  </div>
              </motion.div>
          </div>
      )
  }

  return (
    <div className="w-full max-w-6xl mx-auto relative z-0 pointer-events-auto">
        {/* Fixed Back Button */}
        <div className="relative z-[90] mb-8">
            <button
                onClick={(e) => { e.preventDefault(); navigate('/'); }}
                className="cursor-pointer pointer-events-auto flex items-center gap-2 text-gray-400 hover:text-white transition-all group bg-black/40 hover:bg-black/60 px-4 py-2 rounded-full border border-white/10 hover:border-primary/50 shadow-lg"
            >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:text-primary transition-all">
                    <ArrowLeft size={16} />
                </div>
                <span className="text-sm font-medium">Ana Sayfaya Dön</span>
            </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative z-10">
            {/* Form Area */}
            <div className={`flex-1 flex flex-col min-h-[500px] pointer-events-auto ${step === 0 ? '' : 'bg-[#0b0f14] border border-white/10 rounded-3xl p-6 md:p-12 relative shadow-2xl z-0'}`}>
                {step > 0 && <div className="absolute inset-0 bg-white/[0.01] pointer-events-none rounded-3xl" />}
                
                <div className="relative z-10 flex flex-col h-full">
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                        {step === 0 ? "Nasıl bir yapı için enerji çözümü arıyorsunuz?" : "Ücretsiz Keşif Formu"}
                    </h1>
                    
                    {step > 0 && <StepIndicator current={step} total={4} />}

                    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between pointer-events-auto">
                        <div className="flex-1 overflow-visible">
                            <AnimatePresence mode='wait'>
                                {/* Step 0: Property Type Selection */}
                                {step === 0 && (
                                    <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col justify-center min-h-[400px]">
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            {[
                                            { id: 'home', label: 'Konut', sub: 'Müstakil & Site', icon: Home, color: 'from-emerald-500/20 to-teal-500/20' },
                                            { id: 'business', label: 'Ticari', sub: 'Otel, AVM & Plaza', icon: Building2, color: 'from-blue-500/20 to-indigo-500/20' },
                                            { id: 'factory', label: 'Endüstriyel', sub: 'Fabrika, Depo & Üretim', icon: Factory, color: 'from-orange-500/20 to-red-500/20' },
                                            { id: 'land', label: 'Arazi', sub: 'GES & Yatırım', icon: Mountain, color: 'from-amber-500/20 to-yellow-500/20' }
                                            ].map((type) => {
                                                const isSelected = watchedProperty === type.id;
                                                return (
                                                    <button key={type.id} type="button" onClick={() => setValue('propertyType', type.id as any)} className={`group relative flex flex-col items-center justify-center gap-4 md:gap-6 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 transition-all duration-500 w-full h-[200px] md:h-[320px] overflow-hidden cursor-pointer pointer-events-auto ${isSelected ? 'border-primary bg-[#0b0f14] shadow-[0_0_60px_rgba(33,201,151,0.2)] scale-[1.02] z-10' : 'border-white/5 bg-[#121820]/50 hover:border-white/20 hover:bg-[#121820]'}`}>
                                                        <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl`} />
                                                        <div className={`relative z-10 w-16 h-16 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center transition-all duration-500 ${isSelected ? 'bg-primary text-black shadow-[0_0_30px_#21c997]' : 'bg-white/5 text-gray-400 group-hover:text-white group-hover:bg-white/10'}`}><type.icon size={32} className="md:w-[48px] md:h-[48px]" strokeWidth={1.5} /></div>
                                                        <div className="relative z-10 text-center"><div className={`text-lg md:text-2xl font-bold transition-colors mb-1 md:mb-2 ${isSelected ? 'text-white' : 'text-gray-300'}`}>{type.label}</div><div className="text-[10px] md:text-sm text-gray-500 font-medium tracking-wide uppercase">{type.sub}</div></div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        {errors.propertyType && <span className="text-red-400 text-xs flex items-center gap-1 justify-center mt-6"><AlertCircle size={12}/> {errors.propertyType.message}</span>}
                                    </motion.div>
                                )}

                                {/* Step 1: Details */}
                                {step === 1 && (
                                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                        <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-4">Yapı Detayları</h3>
                                        
                                        {/* Common Area Field */}
                                        <div className="space-y-2"><label className="text-sm text-white font-medium ml-1">Kullanılabilir Alan (m²)</label><input type="number" {...register('roofArea', { valueAsNumber: true })} className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-6 text-white focus:border-primary/50 outline-none transition-all font-mono text-xl shadow-inner pointer-events-auto"/></div>

                                        {/* --- HOME SPECIFIC VISUAL SELECTORS --- */}
                                        {watchedProperty === 'home' && (
                                            <div className="space-y-8 mt-6">
                                                {/* Building Type */}
                                                <div className="space-y-3">
                                                    <label className="text-sm text-gray-400 ml-1">Yapı Tipi</label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 h-auto sm:h-32">
                                                        <SelectionGridItem 
                                                            title="Müstakil Villa" 
                                                            icon={HomeIcon} 
                                                            selected={watchedSubtype === 'detached'} 
                                                            onClick={() => setValue('buildingSubtype', 'detached')} 
                                                        />
                                                        <SelectionGridItem 
                                                            title="Bina / Site" 
                                                            icon={Building2} 
                                                            selected={watchedSubtype === 'apartment'} 
                                                            onClick={() => setValue('buildingSubtype', 'apartment')} 
                                                        />
                                                        <SelectionGridItem 
                                                            title="Bağ Evi" 
                                                            icon={Leaf} 
                                                            selected={watchedSubtype === 'farm'} 
                                                            onClick={() => setValue('buildingSubtype', 'farm')} 
                                                        />
                                                    </div>
                                                </div>

                                                {/* Roof Shape */}
                                                <div className="space-y-3">
                                                    <label className="text-sm text-gray-400 ml-1">Çatı Tipi</label>
                                                    <div className="grid grid-cols-2 gap-3 h-28">
                                                        <SelectionGridItem 
                                                            title="Eğimli" 
                                                            sub="Klasik / Kırma"
                                                            icon={Triangle} 
                                                            selected={watchedRoofType === 'pitched'} 
                                                            onClick={() => setValue('roofType', 'pitched')} 
                                                        />
                                                        <SelectionGridItem 
                                                            title="Düz" 
                                                            sub="Teras / Beton"
                                                            icon={Layers} 
                                                            selected={watchedRoofType === 'flat'} 
                                                            onClick={() => setValue('roofType', 'flat')} 
                                                        />
                                                    </div>
                                                </div>

                                                {/* Roof Material */}
                                                <div className="space-y-3">
                                                    <label className="text-sm text-gray-400 ml-1">Çatı Materyali</label>
                                                    <div className="grid grid-cols-3 gap-2 sm:gap-3 h-28 sm:h-32">
                                                        <SelectionGridItem 
                                                            title="Kiremit" 
                                                            sub="Klasik Çatı"
                                                            icon={HomeIcon} 
                                                            selected={watchedMaterial === 'tile'} 
                                                            onClick={() => setValue('roofMaterial', 'tile')} 
                                                        />
                                                        <SelectionGridItem 
                                                            title="Sac / Panel" 
                                                            sub="Metal Kaplama"
                                                            icon={AlignJustify} 
                                                            selected={watchedMaterial === 'panel'} 
                                                            onClick={() => setValue('roofMaterial', 'panel')} 
                                                        />
                                                        <SelectionGridItem 
                                                            title="Beton" 
                                                            sub="Düz Teras"
                                                            icon={Box} 
                                                            selected={watchedMaterial === 'concrete'} 
                                                            onClick={() => setValue('roofMaterial', 'concrete')} 
                                                        />
                                                    </div>
                                                </div>

                                                {/* Shading */}
                                                <div className="space-y-3">
                                                    <label className="text-sm text-gray-400 ml-1">Gölge Durumu</label>
                                                    <div className="grid grid-cols-2 gap-3 h-28">
                                                        <SelectionGridItem 
                                                            title="Açık" 
                                                            sub="Tam Güneş"
                                                            icon={Sun} 
                                                            selected={watchedShading === 'none'} 
                                                            onClick={() => setValue('shading', 'none')} 
                                                        />
                                                        <SelectionGridItem 
                                                            title="Parçalı" 
                                                            sub="Kısmi Gölge"
                                                            icon={Cloud} 
                                                            selected={watchedShading === 'partial'} 
                                                            onClick={() => setValue('shading', 'partial')} 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* --- COMMERCIAL / INDUSTRIAL (VISUAL SELECTORS) --- */}
                                        {(watchedProperty === 'business' || watchedProperty === 'factory') && (
                                            <div className="space-y-8 mt-6">
                                                <div className="space-y-3">
                                                    <label className="text-sm text-gray-400 ml-1">Yapı Tipi</label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        {watchedProperty === 'business' ? (
                                                            <>
                                                                <SelectionGridItem title="Plaza / Ofis" icon={Building2} selected={watchedSubtype === 'plaza'} onClick={() => setValue('buildingSubtype', 'plaza')} />
                                                                <SelectionGridItem title="Benzinlik" icon={Fuel} selected={watchedSubtype === 'gas_station'} onClick={() => setValue('buildingSubtype', 'gas_station')} />
                                                                <SelectionGridItem title="Otel" icon={Hotel} selected={watchedSubtype === 'hotel'} onClick={() => setValue('buildingSubtype', 'hotel')} />
                                                                <SelectionGridItem title="AVM" icon={ShoppingBag} selected={watchedSubtype === 'mall'} onClick={() => setValue('buildingSubtype', 'mall')} />
                                                                <SelectionGridItem title="Market" icon={Store} selected={watchedSubtype === 'market'} onClick={() => setValue('buildingSubtype', 'market')} />
                                                                <SelectionGridItem title="Diğer Ticari" icon={Briefcase} selected={watchedSubtype === 'other_biz'} onClick={() => setValue('buildingSubtype', 'other_biz')} />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <SelectionGridItem title="Üretim Tesisi" icon={Factory} selected={watchedSubtype === 'production'} onClick={() => setValue('buildingSubtype', 'production')} />
                                                                <SelectionGridItem title="Depo" icon={Warehouse} selected={watchedSubtype === 'warehouse'} onClick={() => setValue('buildingSubtype', 'warehouse')} />
                                                                <SelectionGridItem title="Soğuk Hava" icon={Snowflake} selected={watchedSubtype === 'cold_storage'} onClick={() => setValue('buildingSubtype', 'cold_storage')} />
                                                                <SelectionGridItem title="Veri Merkezi" icon={Server} selected={watchedSubtype === 'datacenter'} onClick={() => setValue('buildingSubtype', 'datacenter')} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Connection Type - Factory Only */}
                                                {watchedProperty === 'factory' && (
                                                    <>
                                                        <div className="space-y-3">
                                                            <label className="text-sm text-gray-400 ml-1">Çatı Tipi</label>
                                                            <div className="grid grid-cols-2 gap-3 h-28">
                                                                <SelectionGridItem 
                                                                    title="Eğimli / Tonoz" 
                                                                    sub="Sandviç Panel"
                                                                    icon={Triangle} 
                                                                    selected={watchedRoofType === 'pitched'} 
                                                                    onClick={() => setValue('roofType', 'pitched')} 
                                                                />
                                                                <SelectionGridItem 
                                                                    title="Düz / Teras" 
                                                                    sub="Membran / Beton"
                                                                    icon={Layers} 
                                                                    selected={watchedRoofType === 'flat'} 
                                                                    onClick={() => setValue('roofType', 'flat')} 
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <label className="text-sm text-gray-400 ml-1">Elektrik Bağlantı Tipi</label>
                                                            <div className="grid grid-cols-2 gap-3 h-28">
                                                                <SelectionGridItem 
                                                                    title="Alçak Gerilim" 
                                                                    sub="Standart Sanayi"
                                                                    icon={Plug} 
                                                                    selected={watchedConnectionType === 'lv'} 
                                                                    onClick={() => setValue('connectionType', 'lv')} 
                                                                />
                                                                <SelectionGridItem 
                                                                    title="Orta Gerilim" 
                                                                    sub="Özel Trafo"
                                                                    icon={Zap} 
                                                                    selected={watchedConnectionType === 'mv'} 
                                                                    onClick={() => setValue('connectionType', 'mv')} 
                                                                />
                                                            </div>
                                                        </div>

                                                        {watchedConnectionType === 'mv' && (
                                                             <div className="space-y-2">
                                                                <label className="text-sm text-gray-400 ml-1">Trafo Gücü (kVA)</label>
                                                                <input type="number" {...register('transformerPower', { valueAsNumber: true })} className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-6 text-white focus:border-primary/50 outline-none transition-all" placeholder="Örn: 400" />
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                {/* Shift Schedule */}
                                                <div className="space-y-3">
                                                    <label className="text-sm text-gray-400 ml-1">Çalışma Düzeni</label>
                                                    <div className="grid grid-cols-2 gap-3 h-28">
                                                        <SelectionGridItem 
                                                            title="Gündüz (08-18)" 
                                                            sub="Standart Mesai"
                                                            icon={Sun} 
                                                            selected={watchedShift === 'day'} 
                                                            onClick={() => setValue('shiftCount', 'day')} 
                                                        />
                                                        <SelectionGridItem 
                                                            title="7/24 Vardiya" 
                                                            sub="Sürekli Operasyon"
                                                            icon={Clock} 
                                                            selected={watchedShift === '24h'} 
                                                            onClick={() => setValue('shiftCount', '24h')} 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Technical / Grid Connection (ONLY FOR LAND - REMOVED FOR BUSINESS/FACTORY) */}
                                        {watchedProperty === 'land' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                                <div className="space-y-2">
                                                    <label className="text-sm text-gray-400 ml-1">Bağlantı Tipi</label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button type="button" onClick={() => setValue('connectionType', 'lv')} className={`py-3 rounded-xl border transition-colors cursor-pointer pointer-events-auto ${watch('connectionType') === 'lv' ? 'bg-primary/20 border-primary text-primary' : 'bg-[#121820] border-white/10 text-gray-400 hover:text-white'}`}>AG (Alçak)</button>
                                                        <button type="button" onClick={() => setValue('connectionType', 'mv')} className={`py-3 rounded-xl border transition-colors cursor-pointer pointer-events-auto ${watch('connectionType') === 'mv' ? 'bg-primary/20 border-primary text-primary' : 'bg-[#121820] border-white/10 text-gray-400 hover:text-white'}`}>OG (Orta)</button>
                                                    </div>
                                                </div>
                                                
                                                {/* Transformer Power if MV */}
                                                {watch('connectionType') === 'mv' && (
                                                    <div className="space-y-2">
                                                        <label className="text-sm text-gray-400 ml-1">Trafo Gücü (kVA)</label>
                                                        <input type="number" {...register('transformerPower', { valueAsNumber: true })} className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-6 text-white focus:border-primary/50 outline-none transition-all" placeholder="Örn: 400" />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Photo Upload Section */}
                                        <div className="space-y-2 pt-4 border-t border-white/5">
                                            <label className="text-sm text-gray-400 ml-1">Alan Fotoğrafı / Proje Görseli</label>
                                            <div className="relative w-full">
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={handlePhotoUpload}
                                                    className="hidden" 
                                                    id="lead-photo-upload"
                                                />
                                                <label 
                                                    htmlFor="lead-photo-upload" 
                                                    className={`flex items-center gap-3 w-full bg-[#121820] border border-dashed rounded-xl py-4 px-6 text-sm cursor-pointer pointer-events-auto transition-all hover:bg-white/5 ${photo ? 'border-primary/50 text-primary' : 'border-white/20 text-gray-400'}`}
                                                >
                                                    {photo ? (
                                                        <>
                                                            <div className="w-10 h-10 rounded-lg bg-cover bg-center shrink-0 border border-white/10" style={{ backgroundImage: `url(${photo})` }} />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-bold truncate">Fotoğraf Seçildi</div>
                                                                <div className="text-[10px] opacity-70">Değiştirmek için tıklayın</div>
                                                            </div>
                                                            <CheckCircle2 size={18} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                                <Camera size={20} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-bold text-white">Fotoğraf Yükle (İsteğe Bağlı)</div>
                                                                <div className="text-[10px] opacity-50">Çatı veya arazi görseli (Max 5MB)</div>
                                                            </div>
                                                            <ImageIcon size={18} />
                                                        </>
                                                    )}
                                                </label>
                                                {photo && (
                                                    <button 
                                                        type="button"
                                                        onClick={(e) => { e.preventDefault(); setPhoto(null); }}
                                                        className="absolute top-3 right-3 p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors cursor-pointer pointer-events-auto"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Addons - NOW AVAILABLE FOR ALL TYPES */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/5">
                                            <AddonCard selected={watch('wantsStorage') === 'yes'} onClick={() => handleAddonToggle('storage')} icon={Battery} title="Depolama" sub="Kesintisiz Güç" iconColor="bg-blue-500 text-white" glowColor="bg-blue-500" gradientClass="from-blue-600/30 to-blue-900/10" />
                                            <AddonCard selected={watch('hasEV') === 'yes'} onClick={() => handleAddonToggle('ev')} icon={Car} title="EV Şarj" sub="Hızlı Şarj İstasyonu" iconColor="bg-emerald-500 text-white" glowColor="bg-emerald-500" gradientClass="from-emerald-600/30 to-emerald-900/10" />
                                            <AddonCard selected={watch('usesHeatPump') === 'yes'} onClick={() => handleAddonToggle('heatpump')} icon={Thermometer} title="Isı Pompası" sub="İklimlendirme" iconColor="bg-orange-500 text-white" glowColor="bg-orange-500" gradientClass="from-orange-600/30 to-orange-900/10" />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 2: Bill & Location */}
                                {step === 2 && (
                                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                        <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-4">Konum ve Fatura</h3>
                                        <AnimatedBillSlider value={watchedBill} onChange={(val: number) => setValue('monthlyBill', val)} propertyType={watchedProperty} {...getSliderConfig()} />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                            <div className="space-y-2"><label className="text-sm text-gray-400 ml-1">İl</label><select {...register('city')} onChange={(e) => { setValue('city', e.target.value); setValue('district', ''); }} className="w-full bg-[#121820] border border-white/10 rounded-xl py-4 px-4 text-white appearance-none outline-none focus:border-primary/50 cursor-pointer pointer-events-auto"><option value="">Seçiniz</option>{TURKEY_CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}</select></div>
                                            <div className="space-y-2"><label className="text-sm text-gray-400 ml-1">İlçe</label><select {...register('district')} disabled={!watchedCity} className="w-full bg-[#121820] border border-white/10 rounded-xl py-4 px-4 text-white appearance-none outline-none focus:border-primary/50 disabled:opacity-50 cursor-pointer pointer-events-auto"><option value="">Seçiniz</option>{watchedCity && TURKEY_CITIES.find(c => c.name === watchedCity)?.districts.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Contact */}
                                {step === 3 && (
                                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                         <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-4">İletişim Bilgileri</h3>
                                         <div className="space-y-6">
                                            <div className="space-y-2"><label className="text-sm text-gray-400 ml-1">Ad Soyad</label><input {...register('fullName')} className="w-full bg-[#121820] border border-white/10 rounded-xl py-4 px-4 text-white focus:border-primary/50 outline-none pointer-events-auto" placeholder="Adınız Soyadınız" /></div>
                                            <div className="space-y-2"><label className="text-sm text-gray-400 ml-1">Telefon</label><input {...register('phone')} className="w-full bg-[#121820] border border-white/10 rounded-xl py-4 px-4 text-white focus:border-primary/50 outline-none pointer-events-auto" placeholder="05XX..." /></div>
                                            <div className="space-y-2"><label className="text-sm text-gray-400 ml-1">E-Posta</label><input {...register('email')} className="w-full bg-[#121820] border border-white/10 rounded-xl py-4 px-4 text-white focus:border-primary/50 outline-none pointer-events-auto" placeholder="ornek@email.com" /></div>
                                         </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* NAV BUTTONS */}
                        <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center relative z-20 pointer-events-auto">
                            {step > 0 && <button type="button" onClick={prevStep} className="text-gray-400 hover:text-white transition-colors font-medium cursor-pointer pointer-events-auto">Geri Dön</button>}
                            <button type="submit" onClick={step === 3 ? undefined : nextStep} disabled={isSubmitting} className={`ml-auto px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer pointer-events-auto ${step === 3 ? 'bg-primary text-black hover:bg-white' : 'bg-white text-black hover:bg-gray-200'}`}>
                                {isSubmitting ? 'İşleniyor...' : (step === 3 ? 'Başvuruyu Tamamla' : 'Devam Et')}
                                {step !== 3 && <ChevronRight size={18} />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            {/* Side Area - Display Always (North AI Analysis) */}
            <div className={`shrink-0 relative z-0 transition-all duration-500 ease-in-out ${step > 0 ? 'lg:w-80 w-full opacity-100 translate-x-0' : 'lg:w-0 w-full lg:opacity-0 lg:translate-x-20 overflow-hidden h-0 lg:h-auto'}`}>
                <div className="w-full lg:w-80 mt-8 lg:mt-0">
                    {step > 0 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                            <EnergyAnalysisEngine results={simResults} inputs={allValues} />
                        </motion.div>
                    )}
                </div>
            </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
            {activeModal !== 'none' && <AddonDetailModal type={activeModal} isOpen={true} onClose={() => setActiveModal('none')} onSave={handleModalSave} billAlreadyEntered={watchedBill > 100} />}
        </AnimatePresence>
    </div>
  );
};

export default LeadForm;