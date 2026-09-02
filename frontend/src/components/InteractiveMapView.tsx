import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { Search, Crosshair, Layers, ZoomIn, ZoomOut, CloudRain, Wind, Thermometer, Mic, Navigation, Home, MessageSquare, Settings } from 'lucide-react';
import { Coordinates } from '../types';

interface InteractiveMapViewProps {
  currentLocation: Coordinates;
  onLocationSelect: (loc: Coordinates) => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({ currentLocation, onLocationSelect }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  
  const [activeLayer, setActiveLayer] = useState<'radar' | 'wind' | 'temp'>('radar');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=en&format=json`);
        const data = await res.json();
        if (data.results) {
          setSearchResults(data.results);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Geocoding failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectResult = (r: any) => {
    if (r.latitude !== undefined && r.longitude !== undefined) onLocationSelect({ name: `${r.name}, ${r.admin1 || r.country}`, lat: r.latitude, lng: r.longitude });
    setSearchQuery('');
    setSearchResults([]);
  };

  const weatherLayerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([currentLocation.lat, currentLocation.lng], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);

      weatherLayerGroupRef.current = L.layerGroup().addTo(mapInstanceRef.current);

      mapInstanceRef.current.on('click', async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const roundedLat = parseFloat(lat.toFixed(4));
        const roundedLng = parseFloat(lng.toFixed(4));
        
        let locName = `Region (${roundedLat}°N, ${roundedLng}°E)`;
        try {
          const resp = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/geocode/reverse?lat=${roundedLat}&lon=${roundedLng}`);
          if (resp.ok) {
            const data = await resp.json();
            if (data && data.name) {
              locName = data.name;
            }
          }
        } catch (err) {
          // fallback
        }

        onLocationSelect({
          lat: roundedLat,
          lng: roundedLng,
          name: locName
        });
      });
    } else {
      mapInstanceRef.current.setView([currentLocation.lat, currentLocation.lng], 10);
    }

    if (markerRef.current) {
      markerRef.current.setLatLng([currentLocation.lat, currentLocation.lng]);
    } else {
      const customIcon = L.divIcon({
        className: 'custom-crosshair-icon',
        html: `<div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      markerRef.current = L.marker([currentLocation.lat, currentLocation.lng], { icon: customIcon }).addTo(mapInstanceRef.current);
    }
  }, [currentLocation]);

  // Dynamic Weather Layers based on map bounds
  useEffect(() => {
    if (!mapInstanceRef.current || !weatherLayerGroupRef.current) return;
    const map = mapInstanceRef.current;
    const group = weatherLayerGroupRef.current;

    const updateWeatherLayers = () => {
      group.clearLayers();
      const bounds = map.getBounds();
      if (!bounds || !bounds.isValid() || isNaN(bounds.getSouth())) return;
      const latStep = (bounds.getNorth() - bounds.getSouth()) / 6;

      const lngStep = (bounds.getEast() - bounds.getWest()) / 6;
      if (isNaN(latStep) || isNaN(lngStep) || latStep === 0 || lngStep === 0) return;

      if (activeLayer === 'temp') {
        for (let lat = bounds.getSouth(); lat <= bounds.getNorth(); lat += latStep) {
          for (let lng = bounds.getWest(); lng <= bounds.getEast(); lng += lngStep) {
            const baseTemp = 30 - Math.abs(lat) * 0.4;
            const temp = baseTemp + Math.sin(lat * 10) * 3 + Math.cos(lng * 10) * 3;
            const color = temp > 35 ? '#ef4444' : temp > 25 ? '#f97316' : temp > 15 ? '#eab308' : temp > 5 ? '#22c55e' : '#3b82f6';
            
            L.rectangle([
              [lat, lng],
              [lat + latStep, lng + lngStep]
            ], {
              color: 'transparent',
              fillColor: color,
              fillOpacity: 0.25,
              weight: 0
            }).addTo(group);
            
            const tempIcon = L.divIcon({
              className: 'temp-label bg-transparent',
              html: `<div class="text-white font-bold text-xs shadow-black drop-shadow-md text-center bg-black/30 rounded px-1" style="color: ${color}; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">${Math.round(temp)}°</div>`,
              iconSize: [30, 20],
              iconAnchor: [15, 10]
            });
            L.marker([lat + latStep/2, lng + lngStep/2], { icon: tempIcon, interactive: false }).addTo(group);
          }
        }
      } else if (activeLayer === 'wind') {
        for (let lat = bounds.getSouth(); lat <= bounds.getNorth(); lat += latStep) {
          for (let lng = bounds.getWest(); lng <= bounds.getEast(); lng += lngStep) {
            const windDeg = (Math.sin(lat * 2) + Math.cos(lng * 2)) * 180 + 180;
            const windIcon = L.divIcon({
              className: 'wind-arrow-icon bg-transparent',
              html: `
                <div style="transform: rotate(${windDeg}deg);" class="flex items-center justify-center text-cyan-400 drop-shadow-md opacity-90">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                  </svg>
                </div>
              `,
              iconSize: [28, 28],
              iconAnchor: [14, 14]
            });
            L.marker([lat + latStep/2, lng + lngStep/2], { icon: windIcon, interactive: false }).addTo(group);
          }
        }
      } else if (activeLayer === 'radar') {
        const radarImgBounds: L.LatLngBoundsExpression = [
          [bounds.getSouth(), bounds.getWest()],
          [bounds.getNorth(), bounds.getEast()]
        ];
        L.imageOverlay(
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBu-diyQMFiM8THEWKf9gAwtOn9SLGdEyf7aNlsZ_GqSRgelVx6h0BrFApGDtsDzZ2_k6du3VC2kWmt5tOqYdy9Evk2aowATuVMO_9YmdTnh7n5tS3d3j5zcc-iPRbyWi06cME19s0tegvmvSkg6pjAQHumlmdfXPSB5IYmCWXLFfyQSQVpXVLTrR4jFVghokxg_-8PGyBwooMA3IBttLGm-zwg8M1x-RSJEH1EJR5g2EaYRO8X39hO7g',
          radarImgBounds,
          { opacity: 0.65, interactive: false }
        ).addTo(group);
      }
    };

    updateWeatherLayers();
    map.on('moveend', updateWeatherLayers);
    
    return () => {
      map.off('moveend', updateWeatherLayers);
      group.clearLayers();
    };
  }, [activeLayer]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        onLocationSelect({ name: 'Current Location', lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col bg-[#121826] text-[#F8FAFC] z-50">
      <style>{`
        .glass-panel {
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 16px); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Main Map Container */}
      <main className="relative flex-1 w-full h-full pb-16">
        {/* Leaflet Map Canvas */}
        <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-[#121826]" />
        
        {/* Map Dimmer for Text Legibility */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#121826]/80 to-transparent z-20 pointer-events-none"></div>

        {/* Map Info Header */}
        <div className="absolute top-4 left-0 right-0 z-30 flex flex-col items-center pointer-events-none">
          <span className="text-xs font-semibold tracking-wider text-[#F8FAFC]/90">
            {new Date().toISOString().slice(11, 16)} UTC | {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
          </span>
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#F8FAFC]/70 uppercase mt-1">
            {currentLocation.name} Sector
          </span>
        </div>

        {/* Search Bar Container */}
        <div className="absolute top-14 left-4 right-4 z-[1000]">
          <div className="glass-panel rounded-full flex items-center px-4 py-3 shadow-lg pointer-events-auto">
            <Search className="w-5 h-5 text-[#94A3B8] mr-3" />
            <input 
              type="text" 
              placeholder="Search location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-base flex-1 text-[#F8FAFC] placeholder-[#94A3B8] p-0 focus:outline-none" 
            />
            <button aria-label="Voice Search" className="ml-3 p-1 rounded-full hover:bg-white/10 transition-colors focus:outline-none">
              <Mic className="w-5 h-5 text-[#94A3B8]" />
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="mt-2 glass-panel rounded-2xl overflow-hidden shadow-2xl pointer-events-auto max-h-60 overflow-y-auto">
              {searchResults.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSelectResult(r)}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 flex flex-col transition-colors text-[#F8FAFC] border-b border-white/5 last:border-0"
                >
                  <span className="font-semibold text-sm">{r.name}</span>
                  <span className="text-[11px] text-[#94A3B8]">{r.admin1 ? `${r.admin1}, ` : ''}{r.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map Controls (Right Side) */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-4 z-30">
          <button 
            onClick={handleLocateMe}
            aria-label="Current Location" 
            className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-[#F8FAFC] hover:bg-white/10 transition-colors shadow-lg pointer-events-auto"
          >
            <Navigation className="w-5 h-5" />
          </button>
          
          <button 
            aria-label="Map Layers" 
            className="w-12 h-12 rounded-full glass-panel flex items-center justify-center text-[#F8FAFC] hover:bg-white/10 transition-colors shadow-lg pointer-events-auto"
          >
            <Layers className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col rounded-3xl glass-panel overflow-hidden shadow-lg pointer-events-auto">
            <button 
              onClick={handleZoomIn}
              aria-label="Zoom In" 
              className="w-12 h-12 flex items-center justify-center text-[#F8FAFC] hover:bg-white/10 transition-colors border-b border-[#F8FAFC]/10"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button 
              onClick={handleZoomOut}
              aria-label="Zoom Out" 
              className="w-12 h-12 flex items-center justify-center text-[#F8FAFC] hover:bg-white/10 transition-colors"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Precipitation Legend */}
        {activeLayer === 'radar' && (
          <div className="absolute left-4 bottom-28 z-30 pointer-events-none">
            <div className="glass-panel rounded-2xl p-4 w-48 shadow-lg">
              <h3 className="text-[10px] font-bold tracking-wider text-[#F8FAFC] uppercase mb-2">Precipitation</h3>
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 mb-1"></div>
              <div className="flex justify-between text-[11px] text-[#94A3B8]">
                <span>Light</span>
                <span>Heavy</span>
              </div>
            </div>
          </div>
        )}

        {/* Layer Filters (Bottom) */}
        <div className="absolute left-0 right-0 bottom-20 px-4 z-30 overflow-x-auto no-scrollbar pt-2 pointer-events-auto">
          <div className="flex space-x-3 w-max">
            {/* Active Chip */}
            <button 
              onClick={() => setActiveLayer('radar')}
              className={`px-5 py-2.5 rounded-full flex items-center space-x-2 font-medium text-sm whitespace-nowrap shadow-sm transition-colors ${activeLayer === 'radar' ? 'bg-blue-500/20 border border-blue-500 text-blue-500' : 'glass-panel text-[#F8FAFC] hover:bg-white/10'}`}
            >
              <CloudRain className="w-4 h-4" />
              <span>Radar</span>
            </button>
            <button 
              onClick={() => setActiveLayer('wind')}
              className={`px-5 py-2.5 rounded-full flex items-center space-x-2 font-medium text-sm whitespace-nowrap shadow-sm transition-colors ${activeLayer === 'wind' ? 'bg-blue-500/20 border border-blue-500 text-blue-500' : 'glass-panel text-[#F8FAFC] hover:bg-white/10'}`}
            >
              <Wind className="w-4 h-4" />
              <span>Wind</span>
            </button>
            <button 
              onClick={() => setActiveLayer('temp')}
              className={`px-5 py-2.5 rounded-full flex items-center space-x-2 font-medium text-sm whitespace-nowrap shadow-sm transition-colors ${activeLayer === 'temp' ? 'bg-blue-500/20 border border-blue-500 text-blue-500' : 'glass-panel text-[#F8FAFC] hover:bg-white/10'}`}
            >
              <Thermometer className="w-4 h-4" />
              <span>Temp</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
