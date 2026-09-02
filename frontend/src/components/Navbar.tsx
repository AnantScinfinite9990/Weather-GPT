import React from 'react';
import { 
  CloudRain, 
  ShieldAlert, 
  Globe, 
  Volume2, 
  VolumeX, 
  Activity, 
  Radio, 
  MapPin,
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react';
import { LanguageCode, WeatherAlert, Coordinates } from '../types';
import { SUPPORTED_LANGUAGES, PRESET_REGIONS, UI_TRANSLATIONS } from '../data/mockWeatherData';
import { LocationSearch } from './LocationSearch';

interface NavbarProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  activeAlerts: WeatherAlert[];
  currentLocation: Coordinates;
  onLocationSelect: (loc: Coordinates) => void;
  onOpenSOSModal: () => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  presetRegions?: Coordinates[];
  currentUser?: string | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeAlerts,
  currentLocation,
  onLocationSelect,
  onOpenSOSModal,
  isSpeaking,
  onStopSpeaking,
  isDarkMode,
  onToggleTheme,
  presetRegions,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS['en'];
  const topAlert = activeAlerts.length > 0 ? activeAlerts[0] : null;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/60 backdrop-blur-md border-b border-slate-200/20 dark:border-white/10 shadow-xl">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-500/20 border border-cyan-400/50 rounded-xl flex flex-shrink-0 items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <CloudRain className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500 dark:text-cyan-400 animate-pulse" />
          </div>
          <div className="min-w-0 flex-shrink">
            <div className="flex items-center gap-2">
              <span className="font-black text-sm sm:text-xl tracking-tight bg-gradient-to-r from-cyan-600 to-emerald-600 dark:from-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent uppercase truncate">
                WeatherGPT
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 hidden sm:block">
                NWP AI Core
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Real-time Emergency Alert Marquee / Ticker */}
        <div className="flex-1 max-w-xl mx-2 hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 text-xs overflow-hidden">
          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold uppercase tracking-widest flex-shrink-0">
            <Radio className="w-3.5 h-3.5 text-red-600 dark:text-red-500 animate-ping" />
            <span>Early Warning:</span>
          </div>
          <div className="truncate text-slate-700 dark:text-slate-300">
            {topAlert ? (
              <span className="inline-flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/20 dark:border-red-500/30">
                  {topAlert.type}
                </span>
                <span className="font-medium text-red-800 dark:text-red-300">{topAlert.location}:</span>
                <span className="truncate">{topAlert.message}</span>
              </span>
            ) : (
              <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>GFS / WRF Synoptic Grid Stable. No severe alerts in current block.</span>
              </span>
            )}
          </div>
        </div>

        {/* Location Dropdown, Language Selector & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-colors flex-shrink-0"
            title="Toggle Light/Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Quick Region Selector (now with Geocoding) */}
          <LocationSearch currentLocation={currentLocation} onLocationSelect={onLocationSelect} presetRegions={presetRegions} />

          {/* Regional Indian Language Selector */}
          <div className="relative hidden md:block">
            <select
              id="language-selector"
              aria-label="Select Regional Language"
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="appearance-none bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs font-medium pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer backdrop-blur-md transition-colors"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
            <Globe className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3 h-3 text-slate-500 dark:text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Voice Speaking Indicator & Stop Button */}
          {isSpeaking && (
            <button
              onClick={onStopSpeaking}
              className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-400/40 animate-pulse flex items-center gap-1 text-xs"
              title="Stop TTS Speech"
            >
              <VolumeX className="w-4 h-4 text-cyan-600 dark:text-cyan-300" />
            </button>
          )}

          {/* Auth Controls */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Hi, {currentUser}
              </span>
              <button
                onClick={onLogout}
                className="text-[10px] sm:text-xs font-medium bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors flex-shrink-0"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="text-[10px] sm:text-xs font-semibold bg-cyan-600 hover:bg-cyan-700 text-white px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg transition-colors shadow-sm flex-shrink-0"
              >
                Log In
              </button>
            </div>
          )}

          {/* SOS Broadcast Button with Frosted Red Glass Style */}
          <button
            id="emergency-sos-btn"
            onClick={onOpenSOSModal}
            className="flex items-center gap-1 sm:gap-1.5 bg-red-100 dark:bg-red-600/20 hover:bg-red-200 dark:hover:bg-red-600/30 border border-red-300 dark:border-red-500/50 px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(239,68,68,0.1)] dark:shadow-[0_0_12px_rgba(239,68,68,0.2)] active:scale-95 flex-shrink-0"
          >
            <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce" />
            <span className="hidden sm:inline">{t.sosBroadcast}</span>
            <span className="sm:hidden">SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
