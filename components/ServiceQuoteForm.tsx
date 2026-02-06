import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Battery, Thermometer, User, Smartphone, Mail, ArrowRight, Home, ChevronRight, Activity, Clock, Plug, AlertCircle, Camera, Image as ImageIcon, X } from 'lucide-react';
import { Lead } from '../types';

type ServiceType = 'ev' | 'storage' | 'heatpump';

interface ServiceQuoteData {
  // Selection
  selectedServices: ServiceType[];
  
  // EV Specs
  monthlyBill?: number;
  vehicleCount?: number;
  carBatteryCapacity?: number;
  desiredChargeTime?: string;

  // Storage Specs
  existingHeatPumpState?: string;
  existingEVState?: string;
  desiredBackupDuration?: string;

  // Heat Pump Specs
  heatingArea?: number;
  gridConnectionType?: string;

  // Contact
  fullName: string;
  email: string;
  phone: string;
}

// --- UI COMPONENTS ---

const SelectionCard = ({ 
    id, 
    label, 
    icon: Icon, 
    selected, 
    onClick 
}: { id: ServiceType, label: string, icon: any, selected: boolean, onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className={`relative group flex flex-col items-center justify-center gap-4 p-6 rounded-3xl border-2 transition-all duration-300 w-full aspect-square md:aspect-[4/3] ${
            selected 
            ? 'bg-[#121820] border-primary shadow-[0_0_30px_rgba(33,201,151,0.15)]' 
            : 'bg-[#0b0f14] border-white/10 hover:border-white/20 hover:bg-[#121820]'
        }`}
    >
        {selected && (
            <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <Check size={14} className="text-black stroke-[3]" />
            </div>
        )}
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${selected ? 'bg-primary text-black' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
            <Icon size={32} strokeWidth={1.5} />
        </div>
        <div className={`font-bold text-lg ${selected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
            {label}
        </div>
    </button>
);

const RadioOption = ({ label, value, selected, onClick, sub }: any) => (
    <button
        type="button"
        onClick={() => onClick(value)}
        className={`w-full p-4 rounded-xl border text-left transition-all ${
            selected 
            ? 'bg-primary/10 border-primary text-white' 
            : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
        }`}
    >
        <div className="font-bold text-sm">{label}</div>
        {sub && <div className="text-xs opacity-60 mt-1">{sub}</div>}
    </button>
);

const ServiceQuoteForm = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [photo, setPhoto] = useState<string | null>(null);
    
    const { register, handleSubmit, watch, setValue, getValues, formState: { errors }, trigger } = useForm<ServiceQuoteData>({
        defaultValues: {
            selectedServices: [],
            vehicleCount: 1,
            heatingArea: 100,
            monthlyBill: 2000
        }
    });

    const selectedServices = watch('selectedServices');
    
    const toggleService = (id: ServiceType) => {
        const current = selectedServices || [];
        if (current.includes(id)) {
            setValue('selectedServices', current.filter(s => s !== id));
        } else {
            setValue('selectedServices', [...current, id]);
        }
    };

    // Dynamic Cross-Sell Logic: Adds/Removes services based on Storage form answers
    const handleCrossSell = (type: 'heatpump' | 'ev', action: 'add' | 'remove', fieldName: any, value: any) => {
        // First update the field value
        setValue(fieldName, value);
        trigger(fieldName);

        // Then update the service list
        const current = getValues('selectedServices') || [];
        let updated = [...current];

        if (action === 'add') {
            if (!updated.includes(type)) {
                updated.push(type);
            }
        } else {
            // Only remove if it wasn't the ONLY selected service (prevent empty form)
            // And mostly we remove it if user says "I already have it" or "No"
            if (updated.includes(type)) {
                updated = updated.filter(s => s !== type);
            }
        }
        setValue('selectedServices', updated);
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

    const nextStep = async () => {
        if (step === 0) {
            if (selectedServices.length === 0) {
                alert("Lütfen en az bir hizmet seçiniz.");
                return;
            }
            setStep(1);
        } else if (step === 1) {
            // Validate Technical Step
            let fieldsToValidate: any[] = [];
            
            if (selectedServices.includes('ev')) {
                fieldsToValidate.push('monthlyBill', 'carBatteryCapacity', 'desiredChargeTime');
            }
            if (selectedServices.includes('storage')) {
                // Storage needs bill too now
                fieldsToValidate.push('monthlyBill', 'existingHeatPumpState', 'existingEVState', 'desiredBackupDuration');
            }
            if (selectedServices.includes('heatpump')) {
                fieldsToValidate.push('heatingArea', 'gridConnectionType');
                if (!selectedServices.includes('ev') && !selectedServices.includes('storage')) fieldsToValidate.push('monthlyBill');
            }

            const isStepValid = await trigger(fieldsToValidate);
            if (isStepValid) {
                setStep(2);
            }
        }
    };

    const onSubmit = async (data: ServiceQuoteData) => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        const newLead: Lead = {
            id: `SQ-${Math.floor(Math.random() * 10000)}`,
            status: 'new',
            createdAt: new Date().toISOString(),
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            
            // Map general fields
            monthlyBill: data.monthlyBill || 0,
            roofArea: 0, // Not primarily a solar roof lead
            city: '-', 
            district: '-',
            wantsStorage: data.selectedServices.includes('storage'),
            hasEV: data.selectedServices.includes('ev'),
            usesHeatPump: data.selectedServices.includes('heatpump'),
            propertyType: 'service', // UPDATED: Distinct type for service quotes
            source: 'web',
            note: `Özel Hizmet Teklifi: ${data.selectedServices.join(', ')}`,
            photo: photo || undefined,

            // Specifics
            requestedServices: data.selectedServices,
            vehicleCount: data.vehicleCount,
            carBatteryCapacity: data.carBatteryCapacity,
            desiredChargeTime: data.desiredChargeTime,
            existingHeatPumpState: data.existingHeatPumpState,
            existingEVState: data.existingEVState,
            desiredBackupDuration: data.desiredBackupDuration,
            heatingArea: data.heatingArea,
            gridConnectionType: data.gridConnectionType,
        };

        const existingLeads = JSON.parse(localStorage.getItem('leads') || '[]');
        localStorage.setItem('leads', JSON.stringify([newLead, ...existingLeads]));

        setIsSubmitting(false);
        setSuccess(true);
    };

    if (success) {
        return (
            <div className="min-h-screen pt-32 pb-20 container mx-auto px-6 flex items-center justify-center">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-lg w-full bg-[#0b0f14] border border-white/10 p-12 rounded-3xl text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-600" />
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                        <Check size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Başvurunuz Alındı</h2>
                    <p className="text-gray-400 mb-8">
                        Teknik ekibimiz seçimlerinizi analiz ederek size özel çözümlerle en kısa sürede dönüş yapacaktır.
                    </p>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-colors"
                    >
                        Ana Sayfaya Dön
                    </button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-32 pb-20 container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
                
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Özel Hizmet Teklifi</h1>
                    <p className="text-gray-400">İhtiyacınız olan sistemleri seçin, size en uygun mühendislik çözümünü sunalım.</p>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-10">
                    {[0, 1, 2].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary' : 'bg-white/10'}`} />
                    ))}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-[#0b0f14] border border-white/5 rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                    <AnimatePresence mode="wait">
                        
                        {/* STEP 0: SELECTION */}
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 relative z-10"
                            >
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Activity className="text-primary" size={20} />
                                    Hangi sistemlerle ilgileniyorsunuz?
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <SelectionCard 
                                        id="ev" 
                                        label="EV Şarj" 
                                        icon={Zap} 
                                        selected={selectedServices.includes('ev')} 
                                        onClick={() => toggleService('ev')} 
                                    />
                                    <SelectionCard 
                                        id="storage" 
                                        label="Depolama" 
                                        icon={Battery} 
                                        selected={selectedServices.includes('storage')} 
                                        onClick={() => toggleService('storage')} 
                                    />
                                    <SelectionCard 
                                        id="heatpump" 
                                        label="Isı Pompası" 
                                        icon={Thermometer} 
                                        selected={selectedServices.includes('heatpump')} 
                                        onClick={() => toggleService('heatpump')} 
                                    />
                                </div>
                                <div className="text-xs text-gray-500 text-center">* Birden fazla seçim yapabilirsiniz.</div>
                            </motion.div>
                        )}

                        {/* STEP 1: DYNAMIC QUESTIONS */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10 relative z-10"
                            >
                                {/* STORAGE SECTION */}
                                {selectedServices.includes('storage') && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                                            <Battery className="text-blue-400" />
                                            <h3 className="text-lg font-bold text-white">Enerji Depolama Detayları</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm text-gray-400">Ortalama Aylık Elektrik Faturası (TL)</label>
                                                <input type="number" {...register('monthlyBill', { required: true })} className={`w-full bg-black/30 border rounded-xl p-3 text-white focus:border-primary/50 outline-none ${errors.monthlyBill ? 'border-red-500' : 'border-white/10'}`} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className={`text-sm ${errors.existingHeatPumpState ? 'text-red-400' : 'text-gray-400'}`}>Isı Pompanız Var mı? *</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <RadioOption 
                                                        label="Evet" 
                                                        value="yes" 
                                                        selected={watch('existingHeatPumpState') === 'yes'} 
                                                        onClick={() => handleCrossSell('heatpump', 'remove', 'existingHeatPumpState', 'yes')} 
                                                    />
                                                    <RadioOption 
                                                        label="Hayır" 
                                                        value="no" 
                                                        selected={watch('existingHeatPumpState') === 'no'} 
                                                        onClick={() => handleCrossSell('heatpump', 'remove', 'existingHeatPumpState', 'no')} 
                                                    />
                                                    <RadioOption 
                                                        label="Eklemek İstiyorum" 
                                                        value="want-to-add" 
                                                        selected={watch('existingHeatPumpState') === 'want-to-add'} 
                                                        onClick={() => handleCrossSell('heatpump', 'add', 'existingHeatPumpState', 'want-to-add')} 
                                                    />
                                                </div>
                                                <input type="hidden" {...register('existingHeatPumpState', { required: true })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className={`text-sm ${errors.existingEVState ? 'text-red-400' : 'text-gray-400'}`}>Elektrikli Aracınız Var mı? *</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <RadioOption 
                                                        label="Evet" 
                                                        value="yes" 
                                                        selected={watch('existingEVState') === 'yes'} 
                                                        onClick={() => handleCrossSell('ev', 'remove', 'existingEVState', 'yes')} 
                                                    />
                                                    <RadioOption 
                                                        label="Hayır" 
                                                        value="no" 
                                                        selected={watch('existingEVState') === 'no'} 
                                                        onClick={() => handleCrossSell('ev', 'remove', 'existingEVState', 'no')} 
                                                    />
                                                    <RadioOption 
                                                        label="Şarj İst. İstiyorum" 
                                                        value="want-charger" 
                                                        selected={watch('existingEVState') === 'want-charger'} 
                                                        onClick={() => handleCrossSell('ev', 'add', 'existingEVState', 'want-charger')} 
                                                    />
                                                </div>
                                                <input type="hidden" {...register('existingEVState', { required: true })} />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className={`text-sm ${errors.desiredBackupDuration ? 'text-red-400' : 'text-gray-400'}`}>Kesinti Anında İdare Süresi *</label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <RadioOption label="0-2 Saat" sub="Kritik Yükler" value="0-2" selected={watch('desiredBackupDuration') === '0-2'} onClick={(v:any) => { setValue('desiredBackupDuration', v); trigger('desiredBackupDuration'); }} />
                                                    <RadioOption label="6-12 Saat" sub="Tüm Ev (Gece)" value="6-12" selected={watch('desiredBackupDuration') === '6-12'} onClick={(v:any) => { setValue('desiredBackupDuration', v); trigger('desiredBackupDuration'); }} />
                                                    <RadioOption label="12-24 Saat" sub="Tam Off-Grid" value="12-24" selected={watch('desiredBackupDuration') === '12-24'} onClick={(v:any) => { setValue('desiredBackupDuration', v); trigger('desiredBackupDuration'); }} />
                                                </div>
                                                <input type="hidden" {...register('desiredBackupDuration', { required: true })} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* EV SECTION */}
                                {selectedServices.includes('ev') && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                                            <Zap className="text-primary" />
                                            <h3 className="text-lg font-bold text-white">Elektrikli Araç Şarj Detayları</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Only ask for bill if not already asked in Storage */}
                                            {!selectedServices.includes('storage') && (
                                                <div className="space-y-2">
                                                    <label className="text-sm text-gray-400">Ortalama Aylık Elektrik Faturası (TL)</label>
                                                    <input type="number" {...register('monthlyBill', { required: true })} className={`w-full bg-black/30 border rounded-xl p-3 text-white focus:border-primary/50 outline-none ${errors.monthlyBill ? 'border-red-500' : 'border-white/10'}`} />
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-400">Araç Batarya Kapasitesi (kWh)</label>
                                                <input type="number" {...register('carBatteryCapacity', { required: true })} placeholder="Örn: 77" className={`w-full bg-black/30 border rounded-xl p-3 text-white focus:border-primary/50 outline-none ${errors.carBatteryCapacity ? 'border-red-500' : 'border-white/10'}`} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-400">Araç Sayısı</label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3].map(num => (
                                                        <button key={num} type="button" onClick={() => setValue('vehicleCount', num)} className={`flex-1 py-3 rounded-xl border ${watch('vehicleCount') === num ? 'bg-primary text-black border-primary' : 'bg-black/30 border-white/10 text-gray-400'}`}>{num}+</button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-400">Hedeflenen Şarj Süresi</label>
                                                <select {...register('desiredChargeTime', { required: true })} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-primary/50 outline-none">
                                                    <option value="0-2">0 - 2 Saat (Ultra Hızlı DC)</option>
                                                    <option value="2-4">2 - 4 Saat (Hızlı AC/DC)</option>
                                                    <option value="4-8">4 - 8 Saat (Standart AC)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* HEAT PUMP SECTION */}
                                {selectedServices.includes('heatpump') && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                                            <Thermometer className="text-orange-400" />
                                            <h3 className="text-lg font-bold text-white">Isı Pompası Detayları</h3>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Only ask if not in EV or Storage */}
                                            {!selectedServices.includes('ev') && !selectedServices.includes('storage') && (
                                                <div className="space-y-2">
                                                    <label className="text-sm text-gray-400">Ortalama Aylık Fatura (TL)</label>
                                                    <input type="number" {...register('monthlyBill', { required: true })} className={`w-full bg-black/30 border rounded-xl p-3 text-white focus:border-primary/50 outline-none ${errors.monthlyBill ? 'border-red-500' : 'border-white/10'}`} />
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-400">Isınma Alanı (m²)</label>
                                                <input type="number" {...register('heatingArea', { required: true })} className={`w-full bg-black/30 border rounded-xl p-3 text-white focus:border-primary/50 outline-none ${errors.heatingArea ? 'border-red-500' : 'border-white/10'}`} />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className={`text-sm ${errors.gridConnectionType ? 'text-red-400' : 'text-gray-400'}`}>Şebeke Bağlantı Tipi *</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <RadioOption label="Monofaze (Tek Faz)" sub="Standart Ev" value="monophase" selected={watch('gridConnectionType') === 'monophase'} onClick={(v:any) => { setValue('gridConnectionType', v); trigger('gridConnectionType'); }} />
                                                    <RadioOption label="Trifaze (Sanayi)" sub="3 Faz" value="industrial" selected={watch('gridConnectionType') === 'industrial'} onClick={(v:any) => { setValue('gridConnectionType', v); trigger('gridConnectionType'); }} />
                                                </div>
                                                <input type="hidden" {...register('gridConnectionType', { required: true })} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* STEP 2: CONTACT */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 relative z-10"
                            >
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <User className="text-primary" size={20} />
                                    İletişim Bilgileri
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Ad Soyad</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            <input {...register('fullName', { required: true })} className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary/50 outline-none" placeholder="Adınız Soyadınız" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">E-Posta</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            <input {...register('email', { required: true })} className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary/50 outline-none" placeholder="ornek@email.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400">Telefon</label>
                                        <div className="relative group">
                                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            <input {...register('phone', { required: true })} className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary/50 outline-none" placeholder="05XX XXX XX XX" />
                                        </div>
                                    </div>

                                    {/* Photo Upload */}
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400 ml-1">İlgili Alan Fotoğrafı (Opsiyonel)</label>
                                        <div className="relative w-full">
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={handlePhotoUpload}
                                                className="hidden" 
                                                id="service-photo-upload"
                                            />
                                            <label 
                                                htmlFor="service-photo-upload" 
                                                className={`flex items-center gap-3 w-full bg-[#121820] border border-dashed rounded-xl py-4 px-4 text-sm cursor-pointer transition-all hover:bg-white/5 ${photo ? 'border-primary/50 text-primary' : 'border-white/20 text-gray-400'}`}
                                            >
                                                {photo ? (
                                                    <>
                                                        <div className="w-10 h-10 rounded-lg bg-cover bg-center shrink-0 border border-white/10" style={{ backgroundImage: `url(${photo})` }} />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-bold truncate">Fotoğraf Seçildi</div>
                                                            <div className="text-[10px] opacity-70">Değiştirmek için tıklayın</div>
                                                        </div>
                                                        <Check size={18} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                            <Camera size={20} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-bold text-white">Fotoğraf Yükle</div>
                                                            <div className="text-[10px] opacity-50">Alan görseli (Max 5MB)</div>
                                                        </div>
                                                        <ImageIcon size={18} />
                                                    </>
                                                )}
                                            </label>
                                            {photo && (
                                                <button 
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); setPhoto(null); }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                                                >
                                                    <X size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/5 relative z-10">
                        {step > 0 && (
                            <button type="button" onClick={() => setStep(s => s - 1)} className="text-gray-400 hover:text-white transition-colors">
                                Geri Dön
                            </button>
                        )}
                        <div className="ml-auto">
                            {step < 2 ? (
                                <button type="button" onClick={nextStep} className="bg-white text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
                                    Devam Et <ChevronRight size={18} />
                                </button>
                            ) : (
                                <button type="submit" disabled={isSubmitting} className="bg-primary text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(33,201,151,0.3)]">
                                    {isSubmitting ? 'İşleniyor...' : 'Başvuruyu Tamamla'} <Check size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ServiceQuoteForm;