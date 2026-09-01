import React, { useState } from 'react';
import { Settings as SettingsIcon, MapPin, Plus, Trash2, Globe, User, Palette, CheckCircle, Sparkles } from 'lucide-react';
import { Coordinates, PersonaType, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/mockWeatherData';

interface SettingsViewProps {
  presetRegions: Coordinates[];
  onAddRegion: (region: Coordinates) => void;
  onRemoveRegion: (name: string) => void;
  currentPersona: PersonaType;
  onPersonaChange: (persona: PersonaType) => void;
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  presetRegions,
  onAddRegion,
  onRemoveRegion,
  currentPersona,
  onPersonaChange,
  currentLang,
  onLanguageChange,
  isDarkMode,
  onToggleTheme
}) => {
  const [cityName, setCityName] = useState('');
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName.trim() || !latInput || !lngInput) return;

    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (isNaN(lat) || isNaN(lng)) return;

    const newLoc: Coordinates = {
      name: cityName.trim(),
      lat,
      lng,
      state: 'Custom Region',
      country: 'India'
    };

    onAddRegion(newLoc);
    setCityName('');
    setLatInput('');
    setLngInput('');
    setSuccessMsg(`Successfully added ${newLoc.name} to default forecast regions!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pb-28 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <SettingsIcon className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
            <span>WeatherGPT System Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure default 7-day forecast regions, AI personas, language preferences, and system telemetry.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 text-xs font-bold animate-in">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Default Forecast Locations Section */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span>Default 7-Day Forecast Locations</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage preloaded and custom cities (like Pune, Jabalpur, Delhi, etc.) for instant NWP soundings.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20">
            {presetRegions.length} Active Regions
          </span>
        </div>

        {/* Add Location Form */}
        <form onSubmit={handleAddLocation} className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">City / Region Name</label>
            <input
              type="text"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="e.g., Nagpur, Jabalpur"
              className="w-full bg-slate-100 dark:bg-black/40 text-xs text-slate-900 dark:text-white rounded-xl py-2 px-3 border border-slate-300 dark:border-white/10 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Latitude (°N)</label>
            <input
              type="number"
              step="any"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              placeholder="e.g., 21.1458"
              className="w-full bg-slate-100 dark:bg-black/40 text-xs text-slate-900 dark:text-white rounded-xl py-2 px-3 border border-slate-300 dark:border-white/10 focus:outline-none focus:border-cyan-500 font-mono"
              required
            />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">Longitude (°E)</label>
            <input
              type="number"
              step="any"
              value={lngInput}
              onChange={(e) => setLngInput(e.target.value)}
              placeholder="e.g., 79.0882"
              className="w-full bg-slate-100 dark:bg-black/40 text-xs text-slate-900 dark:text-white rounded-xl py-2 px-3 border border-slate-300 dark:border-white/10 focus:outline-none focus:border-cyan-500 font-mono"
              required
            />
          </div>
          <div className="sm:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl flex items-center justify-center transition-all shadow-md shadow-cyan-500/20 active:scale-95"
              title="Add Region"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Region List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 max-h-[320px] overflow-y-auto pr-1">
          {presetRegions.map((reg, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/5 hover:border-cyan-500/30 transition-all">
              <div className="truncate">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{reg.name}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  {reg.lat.toFixed(2)}°N, {reg.lng.toFixed(2)}°E
                </p>
              </div>
              <button
                onClick={() => onRemoveRegion(reg.name)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                title="Remove Region"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Persona & Language Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default Persona */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <span>Default AI Expert Persona</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select your domain expertise lens for NWP model analysis and advisories.
          </p>
          <div className="grid grid-cols-1 gap-2 pt-2">
            {(['Farmer', 'Aviator', 'Disaster Manager', 'Researcher', 'Citizen'] as PersonaType[]).map((p) => (
              <button
                key={p}
                onClick={() => onPersonaChange(p)}
                className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                  currentPersona === p
                    ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-100 dark:bg-black/30 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                }`}
              >
                <span>{p}</span>
                {currentPersona === p && <Sparkles className="w-3.5 h-3.5 text-cyan-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Language & Appearance */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <span>Language & Theme</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose regional Indian language support and UI appearance mode.
          </p>
          
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">Interface Language</label>
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="w-full bg-slate-100 dark:bg-black/40 text-xs text-slate-900 dark:text-white rounded-xl py-2.5 px-3 border border-slate-300 dark:border-white/10 focus:outline-none focus:border-cyan-500 font-medium"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">Visual Theme</label>
              <button
                onClick={onToggleTheme}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between hover:border-cyan-500/40 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-500" />
                  <span>{isDarkMode ? 'Dark Twilight Mode (Active)' : 'Light Clean Mode (Active)'}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-mono">Toggle</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
