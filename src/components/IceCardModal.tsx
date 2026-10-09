import React, { useState, useEffect } from 'react';
import { UserCheck, X, Save, Phone, MapPin, Heart, AlertCircle, ShieldAlert } from 'lucide-react';
import { IceProfile } from '../types';

interface IceCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'panatag_ice_profile_v1';

const DEFAULT_ICE: IceProfile = {
  fullName: '',
  bloodType: 'O+',
  allergies: 'None / Wala',
  chronicConditions: '',
  maintenanceMeds: '',
  primaryContactName: '',
  primaryContactPhone: '',
  primaryContactRelation: 'Spouse / Parent',
  secondaryContactName: '',
  secondaryContactPhone: '',
  barangayEvacuationCenter: ''
};

export const IceCardModal: React.FC<IceCardModalProps> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<IceProfile>(DEFAULT_ICE);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, [isOpen]);

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-900/50">
            <Heart className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              In Case of Emergency (I.C.E.)
            </h2>
            <p className="text-xs text-rose-400 font-semibold">
              Medical ID & Emergency Contacts (Offline Saved)
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Itala ang iyong impormasyong medikal at mga taong tatawagan ng rescue team o doktor kung sakaling mawalan ng malay o maipit sa kalamidad.
        </p>

        {/* Form Fields */}
        <div className="space-y-3.5 text-xs">
          {/* Full Name & Blood Type */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-slate-400 font-semibold mb-1">Pangalan (Full Name)</label>
              <input
                type="text"
                placeholder="Juan Dela Cruz"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Blood Type</label>
              <select
                value={profile.bloodType}
                onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold focus:outline-none focus:border-rose-500"
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Unknown'].map((bt) => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Allergies & Conditions */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Allergies (Gamot/Pagkain)</label>
              <input
                type="text"
                placeholder="Hal. Penicillin, Peanuts"
                value={profile.allergies}
                onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Maintenance Medicine</label>
              <input
                type="text"
                placeholder="Hal. Amlodipine, Insulin"
                value={profile.maintenanceMeds}
                onChange={(e) => setProfile({ ...profile, maintenanceMeds: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Primary Contact */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-bold text-rose-400 flex items-center gap-1.5 text-xs">
              <Phone className="w-3.5 h-3.5" /> Pangunahing Kontak (Primary Contact)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Pangalan (hal. Maria - Asawa)"
                value={profile.primaryContactName}
                onChange={(e) => setProfile({ ...profile, primaryContactName: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
              />
              <input
                type="tel"
                placeholder="Cellphone Number (0917...)"
                value={profile.primaryContactPhone}
                onChange={(e) => setProfile({ ...profile, primaryContactPhone: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          {/* Secondary Contact */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-bold text-slate-300 flex items-center gap-1.5 text-xs">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Pangalawang Kontak (Secondary Contact)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Pangalan (hal. Kapatid / Magulang)"
                value={profile.secondaryContactName}
                onChange={(e) => setProfile({ ...profile, secondaryContactName: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
              />
              <input
                type="tel"
                placeholder="Cellphone Number (0918...)"
                value={profile.secondaryContactPhone}
                onChange={(e) => setProfile({ ...profile, secondaryContactPhone: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          {/* Evacuation Center */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Itinalagang Barangay Evacuation Center / Tagpuan
            </label>
            <input
              type="text"
              placeholder="Hal. Barangay San Roque Covered Court / Elementary School"
              value={profile.barangayEvacuationCenter}
              onChange={(e) => setProfile({ ...profile, barangayEvacuationCenter: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Save feedback & Actions */}
        <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div>
            {savedSuccess && (
              <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                <UserCheck className="w-4 h-4" /> Matagumpay na na-save sa device!
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
            >
              Isara
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-900/40"
            >
              <Save className="w-4 h-4" />
              I-save sa Phone
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
