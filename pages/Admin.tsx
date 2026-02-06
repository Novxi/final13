import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_LEADS, MOCK_MESSAGES } from '../constants';
import { Lead, ContactMessage } from '../types';
import { Search, Filter, LogOut, Trash2, CheckCircle, XCircle, Clock, Phone, MapPin, User, FileText, Zap, Battery, ChevronDown, LayoutDashboard, Users, Settings, Bell, RefreshCw, RotateCcw, PieChart, TrendingUp, BarChart3, AlertTriangle, MessageSquare, Mail, Home, Building2, Factory, Layers, Sun, CloudSun, Triangle, AlignJustify, Plug, Activity, Timer, Globe, MessageCircle, Thermometer, Briefcase, Package, Image as ImageIcon, Eye, EyeOff, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG ---
const STATUS_CONFIG: Record<string, { label: string, color: string, bg: string, icon: any }> = {
  'new': { label: 'Yeni Başvuru', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Zap },
  'contacted': { label: 'Arandı', color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: Phone },
  'won': { label: 'Onaylandı', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle },
  'lost': { label: 'Reddedildi', color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle },
};

// Map technical keys to readable labels
const TECH_LABELS: Record<string, string> = {
    // Subtypes
    detached: 'Müstakil Villa',
    apartment: 'Bina / Site',
    farm: 'Bağ Evi',
    plaza: 'Plaza / Ofis',
    gas_station: 'Benzinlik',
    hotel: 'Otel',
    mall: 'AVM',
    market: 'Market',
    other_biz: 'Diğer Ticari',
    production: 'Üretim Tesisi',
    warehouse: 'Depo / Antrepo',
    datacenter: 'Veri Merkezi',
    cold_storage: 'Soğuk Hava Deposu',
    
    // Roof Types
    pitched: 'Eğimli Çatı',
    flat: 'Düz / Teras',
    
    // Materials
    tile: 'Kiremit',
    panel: 'Sandviç Panel',
    shingle: 'Shingle',
    concrete: 'Beton',
    metal: 'Metal / Sac',
    
    // Shading
    none: 'Gölge Yok',
    partial: 'Kısmi Gölge',
    
    // Phases / Connections
    monophase: 'Monofaze (220V)',
    triphase: 'Trifaze (380V)',
    lv: 'Alçak Gerilim (AG)',
    mv: 'Orta Gerilim (OG)',
    industrial: 'Trifaze (Sanayi)',
    
    // Ops
    day: 'Gündüz (08-18)',
    '24h': '7/24 Sürekli',

    // New Service Keys
    yes: 'Var',
    no: 'Yok',
    'want-to-add': 'Eklemek İstiyor',
    'want-charger': 'Şarj İstasyonu İstiyor',
    '0-2': '0-2 Saat',
    '2-4': '2-4 Saat',
    '4-8': '4-8 Saat',
    '6-12': '6-12 Saat',
    '12-24': '12-24 Saat'
};

const getPropertyTypeConfig = (type?: string) => {
    switch(type) {
        case 'business': return { label: 'Ticari', icon: Building2, color: 'text-indigo-400', bg: 'bg-indigo-500/20' };
        case 'factory': return { label: 'Endüstriyel', icon: Factory, color: 'text-orange-400', bg: 'bg-orange-500/20' };
        case 'service': return { label: 'Hizmet Teklifi', icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/20' };
        case 'land': return { label: 'Arazi GES', icon: Layers, color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
        default: return { label: 'Konut', icon: Home, color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
    }
};

// --- HELPER: CALCULATE POWER SPECS (Fallback if not saved) ---
const calculatePowerSpecs = (lead: Lead) => {
    // If values are saved in DB, use them
    if (lead.calculatedRecommendedKw && lead.calculatedInstallableKw) {
        return {
            recommended: lead.calculatedRecommendedKw,
            installable: lead.calculatedInstallableKw
        };
    }

    // Otherwise, recalculate on the fly (for legacy data)
    let powerNeed = 0;
    const bill = lead.monthlyBill || 0;
    const area = lead.roofArea || 0;

    if (lead.propertyType === 'land') {
        // Updated Land Formula: (((fatura / 1.2) / 3.586) * 1.2) / 1000
        powerNeed = (((bill / 1.2) / 3.586) * 1.2) / 1000;
    } else if (lead.propertyType === 'factory') {
        // Updated Factory Formula: ((((fatura / 1.2) / 4)) * 1.2) / 1000
        powerNeed = ((((bill / 1.2) / 4) * 1.2) / 1000);
    } else if (lead.propertyType === 'business') {
        if (bill > 5550) powerNeed = bill * 0.00225;
        else powerNeed = bill * 0.0026;
    } else {
        // Home
        if (bill > 700) powerNeed = bill * 0.0035;
        else powerNeed = bill * 0.0052;
    }

    const maxInstallablePower = area * 0.12;

    return {
        recommended: powerNeed.toFixed(2),
        installable: maxInstallablePower.toFixed(1)
    };
};

// --- COMPONENTS ---

const StatCard = ({ title, value, sub, icon: Icon, trend, trendUp }: any) => (
    <div className="bg-[#121820]/80 backdrop-blur-md border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-primary/20 transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon size={48} />
        </div>
        <div className="relative z-10">
            <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">{title}</div>
            <div className="text-3xl font-display font-bold text-white mb-1">{value}</div>
            <div className="text-[10px] text-gray-500 flex items-center gap-1">
                {trend && <span className={`${trendUp ? 'text-emerald-400' : 'text-red-400'} font-bold`}>{trend}</span>}
                <span>{sub}</span>
            </div>
        </div>
    </div>
);

// --- DELETE CONFIRMATION MODAL ---
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={onClose}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#1a0a0a] border border-red-500/30 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
                <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                        <Trash2 size={32} className="text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Kayıt Silinecek</h3>
                    <p className="text-gray-400 text-sm mb-6">Bu veri kalıcı olarak silinecektir. Bu işlem geri alınamaz. Emin misiniz?</p>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold transition-colors"
                        >
                            İptal
                        </button>
                        <button 
                            onClick={onConfirm}
                            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors shadow-lg shadow-red-900/20"
                        >
                            Evet, Sil
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Helper for rendering spec items
const TechSpecItem = ({ label, value, icon: Icon }: any) => (
    <div className="flex flex-col gap-1 p-3 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/[0.05] transition-colors">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
            {Icon && <Icon size={12} className="text-primary/70" />}
            {label}
        </div>
        <div className="text-white font-medium text-sm">{value || '-'}</div>
    </div>
);

const LeadDetailModal = ({ lead, onClose, onDeleteClick }: { lead: Lead, onClose: () => void, onDeleteClick: (id: string) => void }) => {
    const [showPhoto, setShowPhoto] = useState(false);
    
    if (!lead) return null;
    const StatusIcon = STATUS_CONFIG[lead.status]?.icon || Clock;
    const propConfig = getPropertyTypeConfig(lead.propertyType);

    const t = (key: string | undefined) => key ? (TECH_LABELS[key] || key) : '-';

    // Calculate or retrieve power specs
    const powerSpecs = calculatePowerSpecs(lead);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <motion.div 
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-[#0b0f14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-[#121820] flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                            {lead.fullName ? lead.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{lead.fullName || 'İsimsiz Müşteri'}</h2>
                            <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                                <Clock size={12} />
                                <span>{new Date(lead.createdAt).toLocaleString('tr-TR')}</span>
                                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                <span>ID: {lead.id}</span>
                                {lead.source === 'whatsapp' && (
                                    <>
                                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                        <span className="flex items-center gap-1 text-green-500 font-bold"><MessageCircle size={10} /> WhatsApp</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <XCircle size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Status Bar */}
                    <div className={`flex items-center gap-3 p-4 rounded-xl mb-8 border ${STATUS_CONFIG[lead.status].bg.replace('/10', '/5')} ${STATUS_CONFIG[lead.status].color.replace('text-', 'border-').replace('400', '500/20')}`}>
                        <StatusIcon size={20} className={STATUS_CONFIG[lead.status].color} />
                        <div>
                            <div className={`text-xs font-bold uppercase tracking-wider ${STATUS_CONFIG[lead.status].color}`}>Mevcut Durum</div>
                            <div className="text-white text-sm font-medium">{STATUS_CONFIG[lead.status].label}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* LEFT COLUMN: Contact & Location */}
                        <div className="space-y-6">
                            <h3 className="text-gray-500 text-xs uppercase tracking-widest font-bold border-b border-white/5 pb-2">İletişim Bilgileri</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Phone className="text-gray-500 w-4 h-4 mt-1" />
                                    <div>
                                        <div className="text-xs text-gray-500">Telefon</div>
                                        <div className="text-white font-mono">{lead.phone}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="text-gray-500 w-4 h-4 mt-1" />
                                    <div>
                                        <div className="text-xs text-gray-500">Konum</div>
                                        <div className="text-white">{lead.district ? `${lead.district}, ${lead.city}` : '-'}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FileText className="text-gray-500 w-4 h-4 mt-1" />
                                    <div>
                                        <div className="text-xs text-gray-500">E-Posta</div>
                                        <div className="text-white">{lead.email || '-'}</div>
                                    </div>
                                </div>
                            </div>
                            
                            {lead.note && (
                                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl mt-4">
                                    <div className="text-xs text-yellow-500 font-bold mb-1 uppercase tracking-wider">Sistem Notu</div>
                                    <div className="text-gray-300 text-sm">{lead.note}</div>
                                </div>
                            )}

                            {/* PHOTO VIEWER TOGGLE */}
                            {lead.photo && (
                                <div className="mt-6">
                                    <button 
                                        onClick={() => setShowPhoto(!showPhoto)}
                                        className="w-full flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                                            <ImageIcon size={16} className="text-primary" />
                                            Yüklenen Fotoğraf
                                        </div>
                                        {showPhoto ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                                    </button>
                                    
                                    <AnimatePresence>
                                        {showPhoto && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden mt-2"
                                            >
                                                <div className="rounded-lg border border-white/10 overflow-hidden bg-black relative">
                                                    <img src={lead.photo} alt="Başvuru Fotoğrafı" className="w-full h-auto max-h-[300px] object-contain" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: System Requests & Engineering Calc */}
                        <div className="space-y-6">
                            <h3 className="text-gray-500 text-xs uppercase tracking-widest font-bold border-b border-white/5 pb-2">Sistem Talepleri</h3>
                            
                            {/* Property Type Badge */}
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${propConfig.bg} ${propConfig.color}`}>
                                    <propConfig.icon size={16} />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">{lead.propertyType === 'service' ? 'Teklif Tipi' : 'Mülk Tipi'}</div>
                                    <div className="text-white font-bold">{lead.propertyType === 'service' ? 'Özel Hizmet Paketi' : propConfig.label}</div>
                                </div>
                            </div>

                            {/* ENGINEERING ANALYSIS BLOCK (NEW) */}
                            {lead.propertyType !== 'service' && (
                                <div className="bg-[#0f1319] border border-white/10 p-4 rounded-xl space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                        <Calculator size={12} className="text-primary" />
                                        Mühendislik Analizi
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                                            <div className="text-[10px] text-gray-500 mb-1">İhtiyaç Duyulan Güç</div>
                                            <div className="text-emerald-400 font-bold font-mono text-lg">{powerSpecs.recommended} kWp</div>
                                        </div>
                                        <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                                            <div className="text-[10px] text-gray-500 mb-1">Çatı Kapasitesi</div>
                                            <div className={`font-bold font-mono text-lg ${parseFloat(powerSpecs.installable as string) >= parseFloat(powerSpecs.recommended as string) ? 'text-white' : 'text-yellow-500'}`}>
                                                {powerSpecs.installable} kWp
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Detailed Tech Specs Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {lead.buildingSubtype && <TechSpecItem label="Yapı Detayı" value={t(lead.buildingSubtype)} icon={propConfig.icon} />}
                                
                                {lead.propertyType === 'home' && lead.roofType && (
                                    <>
                                        <TechSpecItem label="Çatı Tipi" value={t(lead.roofType)} icon={Triangle} />
                                        <TechSpecItem label="Materyal" value={t(lead.roofMaterial)} icon={Layers} />
                                        <TechSpecItem label="Gölge" value={t(lead.shading)} icon={CloudSun} />
                                        <TechSpecItem label="Faz" value={t(lead.infrastructurePhase)} icon={Plug} />
                                    </>
                                )}

                                {lead.requestedServices && lead.requestedServices.includes('ev') && (
                                    <>
                                        <TechSpecItem label="Araç Sayısı" value={lead.vehicleCount} icon={CheckCircle} />
                                        <TechSpecItem label="Batarya" value={`${lead.carBatteryCapacity} kWh`} icon={Battery} />
                                        <TechSpecItem label="Şarj Süresi" value={t(lead.desiredChargeTime)} icon={Timer} />
                                    </>
                                )}

                                {lead.requestedServices && lead.requestedServices.includes('storage') && (
                                    <>
                                        <TechSpecItem label="Mevcut EV" value={t(lead.existingEVState)} icon={CheckCircle} />
                                        <TechSpecItem label="Mevcut HP" value={t(lead.existingHeatPumpState)} icon={CheckCircle} />
                                        <TechSpecItem label="Yedekleme" value={t(lead.desiredBackupDuration)} icon={Battery} />
                                    </>
                                )}

                                {lead.requestedServices && lead.requestedServices.includes('heatpump') && (
                                    <>
                                        <TechSpecItem label="Isıtma Alanı" value={`${lead.heatingArea} m²`} icon={Thermometer} />
                                        <TechSpecItem label="Şebeke" value={t(lead.gridConnectionType)} icon={Zap} />
                                    </>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {lead.monthlyBill > 0 && (
                                    <div className="bg-white/5 p-3 rounded-lg">
                                        <div className="text-xs text-gray-500 mb-1">Fatura</div>
                                        <div className="text-white font-bold">{lead.monthlyBill.toLocaleString()} TL</div>
                                    </div>
                                )}
                                {lead.roofArea > 0 && (
                                    <div className="bg-white/5 p-3 rounded-lg">
                                        <div className="text-xs text-gray-500 mb-1">Alan</div>
                                        <div className="text-white font-bold">{lead.roofArea} m²</div>
                                    </div>
                                )}
                            </div>
                            
                            {lead.propertyType !== 'service' && (
                                <div className="space-y-2">
                                    <div className={`flex items-center justify-between p-3 rounded-lg border ${lead.wantsStorage === 'yes' || lead.wantsStorage === true ? 'border-primary/30 bg-primary/5' : 'border-white/5 bg-white/[0.02] opacity-50'}`}>
                                        <span className="text-sm text-gray-300 flex items-center gap-2"><Battery size={14} /> Batarya</span>
                                        {lead.wantsStorage === 'yes' || lead.wantsStorage === true ? <CheckCircle size={14} className="text-primary" /> : <div className="w-3 h-3 rounded-full border border-gray-600" />}
                                    </div>
                                    <div className={`flex items-center justify-between p-3 rounded-lg border ${lead.hasEV === 'yes' || lead.hasEV === true ? 'border-primary/30 bg-primary/5' : 'border-white/5 bg-white/[0.02] opacity-50'}`}>
                                        <span className="text-sm text-gray-300 flex items-center gap-2"><Zap size={14} /> EV Şarj</span>
                                        {lead.hasEV === 'yes' || lead.hasEV === true ? <CheckCircle size={14} className="text-primary" /> : <div className="w-3 h-3 rounded-full border border-gray-600" />}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/10 bg-[#121820] flex justify-between items-center gap-3">
                    <button 
                        onClick={() => onDeleteClick(lead.id)}
                        className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-sm font-bold bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-lg"
                    >
                        <Trash2 size={16} /> <span className="hidden sm:inline">Kaydı Sil</span>
                    </button>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                            Kapat
                        </button>
                        <button onClick={() => window.open(`tel:${lead.phone}`)} className="px-4 py-2 rounded-lg bg-primary text-black text-sm font-bold hover:bg-white transition-colors flex items-center gap-2">
                            <Phone size={14} /> Hemen Ara
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

// ... (Rest of the Admin Component remains largely the same, mostly imports and structure) ...
const MessageDetailModal = ({ message, onClose, onDeleteClick }: { message: ContactMessage, onClose: () => void, onDeleteClick: (id: string) => void }) => {
    if (!message) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <motion.div 
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-[#0b0f14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-[#121820] flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xl">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{message.name}</h2>
                            <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                                <Clock size={12} />
                                <span>{new Date(message.createdAt).toLocaleString('tr-TR')}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <XCircle size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-3 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1">Departman</div>
                                <div className="text-white font-bold uppercase tracking-wider">{message.department}</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1">Telefon</div>
                                <div className="text-white font-bold font-mono">{message.phone}</div>
                            </div>
                        </div>
                        
                        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
                            <div className="text-xs text-gray-500 mb-2">Mesaj İçeriği</div>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{message.message}</p>
                        </div>

                        <div>
                            <div className="text-xs text-gray-500 mb-1">E-Posta Adresi</div>
                            <div className="text-white flex items-center gap-2">
                                <Mail size={14} className="text-primary" />
                                {message.email}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/10 bg-[#121820] flex justify-between items-center gap-3">
                    <button 
                        onClick={() => onDeleteClick(message.id)}
                        className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-sm font-bold bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-lg"
                    >
                        <Trash2 size={16} /> <span className="hidden sm:inline">Mesajı Sil</span>
                    </button>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                            Kapat
                        </button>
                        <button onClick={() => window.open(`mailto:${message.email}`)} className="px-4 py-2 rounded-lg bg-primary text-black text-sm font-bold hover:bg-white transition-colors flex items-center gap-2">
                            <Mail size={14} /> Yanıtla
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [leadTypeFilter, setLeadTypeFilter] = useState<'all' | 'general' | 'service'>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'reports' | 'messages'>('dashboard');
  
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  // Load Data
  useEffect(() => {
    if (isAuthenticated) {
        const storedLeads = localStorage.getItem('leads');
        let finalLeads: Lead[] = [];
        if (storedLeads) {
            try {
                finalLeads = JSON.parse(storedLeads);
            } catch (e) {
                console.error("Error parsing leads", e);
                finalLeads = [];
            }
        } else {
            finalLeads = [...MOCK_LEADS];
            localStorage.setItem('leads', JSON.stringify(finalLeads));
        }
        setLeads(finalLeads.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

        const storedMessages = localStorage.getItem('contact_messages');
        let finalMessages: ContactMessage[] = [];
        if (storedMessages) {
            try {
                finalMessages = JSON.parse(storedMessages);
            } catch (e) {
                console.error("Error parsing messages", e);
                finalMessages = [];
            }
        } else {
            finalMessages = [...MOCK_MESSAGES];
            localStorage.setItem('contact_messages', JSON.stringify(finalMessages));
        }
        setMessages(finalMessages.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        
        const newLeadsCount = finalLeads.filter(l => l.status === 'new').length;
        const newMessagesCount = finalMessages.filter(m => !m.isRead).length;
        const notes = [];
        if(newLeadsCount > 0) notes.push(`Sistemde ${newLeadsCount} yeni başvuru bekliyor.`);
        if(newMessagesCount > 0) notes.push(`${newMessagesCount} okunmamış mesajınız var.`);
        setNotifications(notes);
    }
  }, [isAuthenticated]);

  const stats = useMemo(() => {
    const total = leads.length;
    const pending = leads.filter(l => l.status === 'new').length;
    const won = leads.filter(l => l.status === 'won').length;
    const serviceQuotes = leads.filter(l => l.propertyType === 'service').length;
    const conversion = total > 0 ? ((won / total) * 100).toFixed(1) : '0.0';
    return { total, pending, won, conversion, serviceQuotes };
  }, [leads]);

  const updateLeadStatus = (id: string, newStatus: string) => {
      setLeads(prevLeads => {
          const updated = prevLeads.map(l => l.id === id ? { ...l, status: newStatus as any } : l);
          localStorage.setItem('leads', JSON.stringify(updated));
          return updated;
      });
  };

  const initiateDelete = (e: React.MouseEvent | null, id: string) => {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    if (activeTab === 'messages') {
        const updatedMessages = messages.filter(m => m.id !== itemToDelete);
        setMessages(updatedMessages);
        localStorage.setItem('contact_messages', JSON.stringify(updatedMessages));
        if (selectedMessage?.id === itemToDelete) setSelectedMessage(null);
    } else {
        const updatedLeads = leads.filter(l => l.id !== itemToDelete);
        setLeads(updatedLeads);
        localStorage.setItem('leads', JSON.stringify(updatedLeads));
        if (selectedLead?.id === itemToDelete) setSelectedLead(null);
    }
    
    setItemToDelete(null);
  };

  const resetData = () => {
      if(window.confirm("TÜM veriler silinecek ve varsayılan örneklere dönülecek. Onaylıyor musunuz?")) {
          localStorage.removeItem('leads');
          localStorage.removeItem('contact_messages');
          
          const defaultLeads = [...MOCK_LEADS];
          const defaultMessages = [...MOCK_MESSAGES];
          
          localStorage.setItem('leads', JSON.stringify(defaultLeads));
          localStorage.setItem('contact_messages', JSON.stringify(defaultMessages));
          
          setLeads(defaultLeads);
          setMessages(defaultMessages);
      }
  };


//whatsapp

  const syncWithWhatsApp = async () => {
  try {
    setSyncLoading(true);

    const API_URL = String(import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/$/, "");
    const res = await fetch(`${API_URL}/api/applications`, { cache: "no-store" });

    if (!res.ok) throw new Error("API erişilemedi");

    const data = await res.json();

    const toNumber = (v: any) => {
      const n = Number(String(v ?? "").replace(/[^\d]/g, ""));
      return Number.isFinite(n) ? n : 0;
    };

    const includesAny = (source: string, keys: string[]) => {
      const s = (source || "").toLowerCase();
      return keys.some(k => s.includes(k.toLowerCase()));
    };

    const mapPropertyType = (typeRaw: any) => {
      const t = String(typeRaw || "").trim().toLowerCase();
      if (t === "konut") return "home";
      if (t === "işletme" || t === "isletme") return "business";
      if (t === "fabrika") return "factory";
      return "unknown";
    };

    // UI için daha düzgün label çıkması istersen (TECH_LABELS ile eşleşsin diye):
    const mapRoofType = (v: any) => {
      const s = String(v || "").toLowerCase();
      if (s.includes("eğim")) return "pitched"; // TECH_LABELS: pitched -> Eğimli Çatı
      if (s.includes("düz")) return "flat";     // TECH_LABELS: flat -> Düz / Teras
      return v || "-";
    };

    const mapRoofMaterial = (v: any) => {
      const s = String(v || "").toLowerCase();
      if (s.includes("kiremit")) return "tile";       // TECH_LABELS: tile -> Kiremit
      if (s.includes("sac") || s.includes("metal")) return "metal"; // TECH_LABELS: metal -> Metal / Sac
      if (s.includes("beton")) return "concrete";     // TECH_LABELS: concrete -> Beton
      return v || "-"; // bilinmeyen ise aynen bas
    };

    // Senin botta "Gün boyu / Yarım gün / Az" geliyor.
    // Admin kartı "Gölge" yazıyor; burada güneşlenmeye göre gölgeyi türetiyoruz.
    const mapShadingFromSun = (v: any) => {
      const s = String(v || "").toLowerCase();
      if (s.includes("gün boyu")) return "none";   // TECH_LABELS: none -> Gölge Yok
      if (s.includes("yarım") || s.includes("az")) return "partial"; // TECH_LABELS: partial -> Kısmi Gölge
      return v || "-";
    };

    const mappedLeads: Lead[] = (data || []).map((item: any) => {
      const extras: string = String(item.extra_systems ?? item.services ?? "");

      return {
        id: `wa-${item.id}`,
        fullName: item.name || "Bilinmiyor",
        phone: item.phone || "",
        email: item.email || "",

        city: item.city || "Bilinmiyor",
        district: item.district || "-",

        propertyType: mapPropertyType(item.type),
        buildingSubtype: item.property_type || "unknown",

        roofArea: toNumber(item.roof_area),
        monthlyBill: toNumber(item.monthly_bill),

        // ✅ Admin.tsx'in okuduğu alan isimleri:
        roofType: mapRoofType(item.roof_shape),
        roofMaterial: mapRoofMaterial(item.roof_material),
        shading: mapShadingFromSun(item.sun_exposure),

        // İşyeri/fabrika alanları (Admin.tsx bunları business/factory’de okuyor)
        operatingHours: item.working_hours || undefined,
        connectionType: item.electricity_type || undefined,

        wantsStorage: includesAny(extras, ["Enerji Depolama", "Depolama"]) ? "yes" : "no",
        hasEV: includesAny(extras, ["EV Şarj", "Şarj", "Şarj İstasyonu"]) ? "yes" : "no",
        usesHeatPump: includesAny(extras, ["Isı Pompası", "Isi Pompasi"]) ? "yes" : "no",

        status: "new",
        source: "whatsapp",
        createdAt: item.created_at || new Date().toISOString(),
      };
    });

    setLeads((prev: Lead[]) => {
      const map = new Map<string, Lead>(prev.map(l => [l.id, l]));

      for (const incoming of mappedLeads) {
        const old = map.get(incoming.id);

        if (!old) {
          map.set(incoming.id, incoming);
        } else {
          // status'u bozmadan güncelle
          map.set(incoming.id, {
            ...old,
            ...incoming,
            status: old.status
          });
        }
      }

      const merged = Array.from(map.values()).sort((a, b) => {
        const ta = new Date(a.createdAt || 0).getTime();
        const tb = new Date(b.createdAt || 0).getTime();
        return tb - ta;
      });

      localStorage.setItem("leads", JSON.stringify(merged));
      return merged;
    });

  } catch (err) {
    console.error("WhatsApp sync error:", err);
    alert("WhatsApp verileri çekilirken hata oluştu.");
  } finally {
    setSyncLoading(false);
  }
};

const filteredLeads = (leads || []).filter((lead) => {
  const matchesSearch =
    (lead.fullName?.toLowerCase() || "").includes((filterText || "").toLowerCase()) ||
    (lead.phone || "").includes(filterText || "") ||
    (lead.city?.toLowerCase() || "").includes((filterText || "").toLowerCase());

  const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
  return matchesSearch && matchesStatus;
});

  return (
    <div className="min-h-screen bg-[#0b0f14] flex font-sans text-gray-200">

 
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 bg-[#0f131a] border-r border-white/5 flex-shrink-0 flex flex-col sticky top-0 h-screen z-40 transition-all">
         <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5">
             <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-black font-bold">N</div>
             <span className="ml-3 font-display font-bold text-white hidden lg:block">NORTH ADMIN</span>
         </div>
         
         <nav className="p-4 space-y-2 flex-1">
             <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-3 p-3 w-full text-left rounded-xl cursor-pointer transition-colors ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                 <LayoutDashboard size={20} />
                 <span className="hidden lg:block font-medium">Panel</span>
             </button>
             <button onClick={() => setActiveTab('customers')} className={`flex items-center gap-3 p-3 w-full text-left rounded-xl cursor-pointer transition-colors ${activeTab === 'customers' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                 <Users size={20} />
                 <span className="hidden lg:block font-medium">Müşteriler</span>
             </button>
             <button onClick={() => setActiveTab('reports')} className={`flex items-center gap-3 p-3 w-full text-left rounded-xl cursor-pointer transition-colors ${activeTab === 'reports' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                 <BarChart3 size={20} />
                 <span className="hidden lg:block font-medium">Raporlar</span>
             </button>
             <button onClick={() => setActiveTab('messages')} className={`flex items-center gap-3 p-3 w-full text-left rounded-xl cursor-pointer transition-colors ${activeTab === 'messages' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                 <MessageSquare size={20} />
                 <span className="hidden lg:block font-medium">Mesajlar</span>
             </button>
         </nav>

         <div className="p-4 space-y-2 border-t border-white/5">
             <button onClick={resetData} className="flex items-center gap-3 p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl w-full transition-colors text-xs">
                 <RotateCcw size={16} />
                 <span className="hidden lg:block font-medium">Verileri Sıfırla</span>
             </button>
             <button onClick={() => { setIsAuthenticated(false); navigate('/', { replace: true }); }} className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl w-full transition-colors">
                 <LogOut size={20} />
                 <span className="hidden lg:block font-medium">Çıkış</span>
             </button>
         </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-x-hidden">
         <header className="h-20 bg-[#0b0f14]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-30">
             <h1 className="text-xl font-bold text-white">
                 {activeTab === 'dashboard' && 'Genel Bakış'}
                 {activeTab === 'customers' && 'Müşteri Listesi'}
                 {activeTab === 'reports' && 'Analiz Raporları'}
                 {activeTab === 'messages' && 'Gelen Kutusu'}
             </h1>
             <div className="flex items-center gap-4">
                 <div className="relative">
                     <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-gray-400 hover:text-white relative hover:bg-white/5 rounded-lg transition-colors">
                         <Bell size={20} />
                         {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                     </button>
                     <AnimatePresence>
                         {showNotifications && (
                             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-80 bg-[#121820] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                                 <div className="p-3 border-b border-white/5 font-bold text-sm text-white">Bildirimler</div>
                                 <div className="max-h-64 overflow-y-auto">
                                     {notifications.length === 0 ? (<div className="p-4 text-xs text-gray-500 text-center">Bildirim yok</div>) : (notifications.map((note, i) => (<div key={i} className="p-3 border-b border-white/5 text-xs text-gray-300 hover:bg-white/5 transition-colors">{note}</div>)))}
                                 </div>
                             </motion.div>
                         )}
                     </AnimatePresence>
                 </div>
                 <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                     <div className="text-right hidden sm:block">
                         <div className="text-sm font-bold text-white">Yönetici</div>
                         <div className="text-xs text-primary">Super Admin</div>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-gray-700 border border-white/10 flex items-center justify-center">
                         <User size={20} />
                     </div>
                 </div>
             </div>
         </header>

         <div className="p-8">
            {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard title="Toplam Başvuru" value={stats.total} sub="Tüm zamanlar" icon={FileText} />
                    <StatCard title="Bekleyen" value={stats.pending} sub="Aksiyon gerekiyor" trend={stats.pending > 0 ? `${stats.pending} Yeni` : undefined} trendUp={true} icon={Clock} />
                    <StatCard title="Hizmet Teklifi" value={stats.serviceQuotes} sub="Isı Pompası / EV" icon={Package} />
                    <StatCard title="Dönüşüm Oranı" value={`%${stats.conversion}`} sub="Başarı oranı" icon={RefreshCw} />
                </div>
            )}

            {activeTab === 'reports' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="bg-[#121820] border border-white/5 p-8 rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
                         <PieChart size={64} className="text-gray-600 mb-4" />
                         <h3 className="text-xl font-bold text-white mb-2">Durum Dağılımı</h3>
                         <div className="w-full space-y-3 mt-4">
                             {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                                 const count = leads.filter(l => l.status === key).length;
                                 const pct = leads.length > 0 ? (count / leads.length) * 100 : 0;
                                 return (<div key={key}><div className="flex justify-between text-xs mb-1"><span className="text-gray-400">{config.label}</span><span className="text-white font-bold">{count} ({pct.toFixed(0)}%)</span></div><div className="w-full h-2 bg-white/5 rounded-full overflow-hidden"><div className={`h-full ${config.color.replace('text-', 'bg-')}`} style={{ width: `${pct}%` }} /></div></div>)
                             })}
                         </div>
                     </div>
                     <div className="bg-[#121820] border border-white/5 p-8 rounded-2xl flex flex-col justify-center min-h-[300px]">
                         <TrendingUp size={64} className="text-gray-600 mb-4 mx-auto" />
                         <h3 className="text-xl font-bold text-white text-center mb-2">Şehir Analizi</h3>
                         <p className="text-gray-500 text-sm text-center">En çok başvuru alınan lokasyonlar</p>
                         <div className="mt-6 space-y-2">
                             {Array.from(new Set(leads.map(l => l.city))).slice(0, 5).map(city => {
                                 const count = leads.filter(l => l.city === city).length;
                                 return (<div key={city} className="flex items-center justify-between p-3 bg-white/5 rounded-lg"><span className="text-white">{city}</span><span className="text-primary font-bold">{count} Başvuru</span></div>)
                             })}
                         </div>
                     </div>
                </div>
            )}

            {activeTab === 'messages' && (
                <div className="bg-[#121820] border border-white/5 rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-[600px] mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-white">İletişim Talepleri</h2>
                        <div className="text-xs text-gray-500">Toplam {messages.length} mesaj</div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500"><MessageSquare size={48} className="mb-4 opacity-20" /><p>Henüz mesaj yok.</p></div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {messages.map((msg) => (
                                    <div key={msg.id} onClick={() => setSelectedMessage(msg)} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group text-sm cursor-pointer">
                                        <div className="col-span-3"><div className="font-bold text-white group-hover:text-primary transition-colors truncate">{msg.name}</div><div className="text-xs text-gray-500 font-mono mt-0.5">{msg.email}</div></div>
                                        <div className="col-span-2"><span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-300 uppercase tracking-wide">{msg.department}</span></div>
                                        <div className="col-span-5 text-gray-400 truncate pr-4">{msg.message}</div>
                                        <div className="col-span-1 text-gray-500 text-xs text-right">{new Date(msg.createdAt).toLocaleDateString('tr-TR')}</div>
                                        <div className="col-span-1 flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity relative z-50"><button type="button" onClick={(e) => initiateDelete(e, msg.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Sil"><Trash2 size={18} /></button></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(activeTab === 'dashboard' || activeTab === 'customers') && (
                <div className={`bg-[#121820] border border-white/5 rounded-2xl overflow-hidden shadow-xl flex flex-col ${activeTab === 'dashboard' ? 'min-h-[400px]' : 'min-h-[600px] mt-0'}`}>
                    <div className="p-6 border-b border-white/5 flex flex-col gap-6">
                        <div className="flex flex-col xl:flex-row gap-4 justify-between items-center">
                            <div className="relative w-full xl:w-96"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" /><input type="text" placeholder="İsim, telefon, şehir ara..." value={filterText} onChange={(e) => setFilterText(e.target.value)} className="w-full bg-[#0b0f14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-primary/50 outline-none transition-colors" /></div>
                            <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
                                <button onClick={() => setLeadTypeFilter('all')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${leadTypeFilter === 'all' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>Tümü</button>
                                <button onClick={() => setLeadTypeFilter('general')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${leadTypeFilter === 'general' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>GES Keşif</button>
                                <button onClick={() => setLeadTypeFilter('service')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${leadTypeFilter === 'service' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>Hizmet Teklifi</button>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 w-full">
                            {['all', 'new', 'contacted', 'won', 'lost'].map(status => (
                                <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap ${statusFilter === status ? 'bg-white/10 border border-white/20 text-white' : 'bg-transparent border border-white/5 text-gray-500 hover:bg-white/5'}`}>{status === 'all' ? 'Tüm Durumlar' : STATUS_CONFIG[status].label}</button>
                            ))}
                            <button onClick={syncWithWhatsApp} disabled={syncLoading} className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500 hover:text-black transition-all text-xs font-bold uppercase flex items-center gap-2 whitespace-nowrap ml-auto">{syncLoading ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <MessageCircle size={14} />} Bot Verilerini Çek</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white/[0.02] border-b border-white/5 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                        <div className="col-span-3">Müşteri</div>
                        <div className="col-span-2">Konum</div>
                        <div className="col-span-2">Tip / Sistem</div>
                        <div className="col-span-2">Tarih</div>
                        <div className="col-span-2">Durum</div>
                        <div className="col-span-1 text-right">İşlem</div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredLeads.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500"><Filter size={48} className="mb-4 opacity-20" /><p>Kriterlere uygun kayıt bulunamadı.</p></div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {filteredLeads.map((lead) => {
                                    const propConfig = getPropertyTypeConfig(lead.propertyType);
                                    return (
                                        <div key={lead.id} onClick={() => setSelectedLead(lead)} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group text-sm cursor-pointer">
                                            <div className="col-span-3">
                                                <div className="flex items-center gap-2"><div className="font-bold text-white group-hover:text-primary transition-colors truncate">{lead.fullName || 'İsimsiz'}</div>{lead.source === 'whatsapp' ? (<div title="WhatsApp Bot Başvurusu" className="bg-green-500/10 p-1 rounded-full"><MessageCircle size={12} className="text-green-500" /></div>) : (<div title="Web Sitesi Başvurusu" className="bg-blue-500/10 p-1 rounded-full"><Globe size={12} className="text-blue-500" /></div>)}</div>
                                                <div className="text-xs text-gray-500 font-mono mt-0.5">{lead.phone}</div>
                                            </div>
                                            <div className="col-span-2 text-gray-400 truncate">{lead.district ? `${lead.city} / ${lead.district}` : lead.city}</div>
                                            <div className="col-span-2 flex gap-2 items-center">
                                                <div title={propConfig.label} className={`w-6 h-6 rounded flex items-center justify-center ${propConfig.bg} ${propConfig.color}`}><propConfig.icon size={12} /></div>
                                                {lead.propertyType === 'service' ? (<div className="flex gap-1">{lead.requestedServices?.includes('ev') && <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Zap size={10} /></div>}{lead.requestedServices?.includes('heatpump') && <div className="w-5 h-5 rounded bg-orange-500/20 flex items-center justify-center text-orange-400"><Thermometer size={10} /></div>}{lead.requestedServices?.includes('storage') && <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center text-blue-400"><Battery size={10} /></div>}</div>) : (<><div className="w-px h-4 bg-white/10 mx-1" />{lead.wantsStorage && (<div title="Depolama" className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center text-blue-400"><Battery size={12} /></div>)}{lead.hasEV && (<div title="EV Şarj" className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center text-green-400"><Zap size={12} /></div>)}</>)}
                                            </div>
                                            <div className="col-span-2 text-gray-500 text-xs">{new Date(lead.createdAt).toLocaleDateString('tr-TR')}</div>
                                            <div className="col-span-2" onClick={(e) => e.stopPropagation()}>
                                                <div className="relative group/dropdown">
                                                    <button type="button" className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold w-full transition-all ${STATUS_CONFIG[lead.status].bg} ${STATUS_CONFIG[lead.status].color}`}><span className="truncate">{STATUS_CONFIG[lead.status].label}</span><ChevronDown size={12} className="ml-auto opacity-50" /></button>
                                                    <div className="absolute top-full left-0 w-full mt-1 bg-[#1a202c] border border-white/10 rounded-lg shadow-2xl overflow-hidden hidden group-hover/dropdown:block z-50">
                                                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (<button key={key} type="button" onClick={(e) => { e.stopPropagation(); updateLeadStatus(lead.id, key); }} className={`w-full text-left px-3 py-2 text-xs hover:bg-white/5 flex items-center gap-2 ${lead.status === key ? 'bg-white/5 text-white' : 'text-gray-400'}`}><div className={`w-1.5 h-1.5 rounded-full ${config.bg.replace('/10', '')}`} />{config.label}</button>))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-1 flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity relative z-50">
                                                <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Detay"><FileText size={18} /></button>
                                                <button type="button" onClick={(e) => initiateDelete(e, lead.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Sil"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-white/5 bg-[#0b0f14] text-xs text-gray-500 flex justify-between"><span>Toplam {filteredLeads.length} kayıt listeleniyor</span><span>North CRM v1.0</span></div>
                </div>
            )}
         </div>
      </main>

      <AnimatePresence>
        {selectedLead && <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} onDeleteClick={(id) => initiateDelete(null, id)} />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedMessage && <MessageDetailModal message={selectedMessage} onClose={() => setSelectedMessage(null)} onDeleteClick={(id) => initiateDelete(null, id)} />}
      </AnimatePresence>

      <AnimatePresence>
        {itemToDelete && <DeleteConfirmModal isOpen={!!itemToDelete} onClose={() => setItemToDelete(null)} onConfirm={confirmDelete} />}
      </AnimatePresence>

    </div>
  );
};

export default Admin;