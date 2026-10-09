export type Language = 'fil' | 'en' | 'ceb';

export type DisasterCategory = 
  | 'all'
  | 'typhoon'
  | 'earthquake'
  | 'flood'
  | 'volcano'
  | 'firstaid'
  | 'fire'
  | 'gobag';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'panatag' | 'system';
  text: string;
  timestamp: number;
  category?: DisasterCategory;
  suggestedActions?: string[];
  isEmergencyAlert?: boolean;
  offlineGenerated?: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  tagalogName: string;
  number: string;
  tel: string;
  agency: string;
  category: 'national' | 'weather' | 'rescue' | 'health' | 'fire' | 'police';
  description: string;
  availableHours: string;
  smsAvailable?: boolean;
  smsNumber?: string;
}

export interface GoBagItem {
  id: string;
  title: string;
  tagalogTitle: string;
  category: 'water_food' | 'first_aid' | 'tools_light' | 'documents' | 'hygiene' | 'clothing' | 'special';
  essential: boolean;
  notes: string;
  packed: boolean;
}

export interface StormSignal {
  signal: number;
  windSpeed: string;
  leadTime: string;
  waveHeight: string;
  threatLevel: string;
  color: string;
  impacts: string[];
  actions: string[];
}

export interface EarthquakeIntensity {
  scale: string;
  name: string;
  tagalogName: string;
  description: string;
  color: string;
  safetyAction: string;
}

export interface IceProfile {
  fullName: string;
  bloodType: string;
  allergies: string;
  chronicConditions: string;
  maintenanceMeds: string;
  primaryContactName: string;
  primaryContactPhone: string;
  primaryContactRelation: string;
  secondaryContactName: string;
  secondaryContactPhone: string;
  barangayEvacuationCenter: string;
}
