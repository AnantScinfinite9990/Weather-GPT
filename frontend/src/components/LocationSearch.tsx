import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown, Search, Loader2 } from 'lucide-react';
import { Coordinates } from '../types';
import { PRESET_REGIONS } from '../data/mockWeatherData';

interface LocationSearchProps {
  currentLocation: Coordinates;
  onLocationSelect: (loc: Coordinates) => void;
  presetRegions?: Coordinates[];
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ currentLocation, onLocationSelect, presetRegions }) => {
  const regionsToUse = presetRegions || PRESET_REGIONS;
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
        const data = await res.json();
        if (data.results) {
          setResults(data.results);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Geocoding failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (loc: Coordinates) => {
    onLocationSelect(loc);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative group" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 text-xs font-medium backdrop-blur-md transition-all"
      >
        <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
        <span className="max-w-[70px] sm:max-w-[140px] truncate">{currentLocation.name.split(',')[0]}</span>
        <ChevronDown className={`w-3 h-3 text-slate-500 dark:text-slate-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-100 dark:border-white/10 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 dark:text-slate-200"
              autoFocus
            />
            {isSearching && <Loader2 className="w-3 h-3 text-cyan-500 animate-spin absolute right-4 top-1/2 -translate-y-1/2" />}
          </div>
          
          <div className="max-h-60 overflow-y-auto py-1">
            {query && results.length > 0 ? (
              <>
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Search Results</div>
                {results.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { if (r.latitude !== undefined && r.longitude !== undefined) handleSelect({ name: `${r.name}, ${r.admin1 || r.country}`, lat: r.latitude, lng: r.longitude }) }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-cyan-700 dark:hover:text-cyan-300 flex flex-col transition-colors text-slate-700 dark:text-slate-300"
                  >
                    <span className="font-semibold">{r.name}</span>
                    <span className="text-[10px] text-slate-500">{r.admin1 ? `${r.admin1}, ` : ''}{r.country}</span>
                  </button>
                ))}
              </>
            ) : query && !isSearching ? (
              <div className="px-3 py-4 text-center text-xs text-slate-500">No results found</div>
            ) : (
              <>
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Preset Regions
                </div>
                {regionsToUse.map((region) => (
                  <button
                    key={region.name}
                    onClick={() => handleSelect(region)}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center justify-between transition-colors ${
                      currentLocation.name === region.name ? 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 font-semibold' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{region.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{region.lat.toFixed(1)}°N</span>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
