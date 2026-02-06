import React from 'react';

export interface Lead {
  id: string;
  monthlyBill: number;
  roofArea: number; // Used for Land area or Roof area
  city: string;
  district: string;
  wantsStorage: boolean | string;
  hasEV: boolean | string;
  usesHeatPump: boolean | string;
  phone: string;
  status: 'new' | 'contacted' | 'won' | 'lost';
  note?: string;
  createdAt: string;
  fullName?: string;
  email?: string;
  // Updated propertyType to include 'service'
  propertyType?: 'home' | 'business' | 'factory' | 'land' | 'service';
  source?: 'web' | 'whatsapp';
  
  // New Field for Photo Upload (Base64 string)
  photo?: string; 

  // Calculated Engineering Values
  calculatedRecommendedKw?: string | number;
  calculatedInstallableKw?: string | number;

  // Detailed Specs (General)
  buildingSubtype?: string;
  roofType?: string;
  roofMaterial?: string;
  infrastructurePhase?: string;
  shading?: string;
  operatingHours?: string;
  roofHeight?: string;
  systemPriority?: string;
  connectionType?: string;
  transformerPower?: number;
  hasReactivePenalty?: string;
  shiftCount?: string;

  // Land Specific
  contractPower?: number;
  hasCallLetter?: string;
  landOwnership?: string;

  // Service Quote Specifics (New)
  requestedServices?: string[]; // ['ev', 'storage', 'heatpump']
  vehicleCount?: number;
  carBatteryCapacity?: number;
  desiredChargeTime?: string; // '0-2', '2-4', '4-8'
  
  existingHeatPumpState?: string; // 'yes', 'no', 'want-to-add'
  existingEVState?: string; // 'yes', 'no', 'want-charger'
  desiredBackupDuration?: string; // '0-2', '6-12', '12-24'
  
  heatingArea?: number;
  gridConnectionType?: string; // 'monophase', 'industrial' (3-phase)
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Konut GES' | 'Endüstriyel GES' | 'Arazi GES' | 'Şarj & Depolama';
  city: string;
  description: string;
  imageUrl: string;
  date: string;
  tags: string[];
}

export interface CityData {
  name: string;
  districts: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

export interface VideoMedia {
  id: string;
  title: string;
  url: string; // Embed URL or MP4
  poster: string;
}