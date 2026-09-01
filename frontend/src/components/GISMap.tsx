import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  Eye, 
  Wind, 
  CloudRain, 
  Thermometer, 
  AlertTriangle, 
  Maximize2, 
  Crosshair, 
  Play, 
  Pause,
  Navigation,
  Info
} from 'lucide-react';
import { Coordinates, WeatherAlert, WeatherMetrics } from '../types';

interface GISMapProps {
  currentLocation: Coordinates;
  onLocationSelect: (loc: Coordinates) => void;
  activeAlerts: WeatherAlert[];
  weatherData: WeatherMetrics | null;
  onTriggerEmergencyAlert?: (alert: WeatherAlert) => void;
}

type MapLayerType = 'radar' | 'temp' | 'wind' | 'alerts';

export const GISMap: React.FC<GISMapProps> = ({
  currentLocation,
  onLocationSelect,
  activeAlerts,
  weatherData,
  onTriggerEmergencyAlert
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [activeLayers, setActiveLayers] = useState<Record<MapLayerType, boolean>>({
    radar: true,
    temp: true,
    wind: true,
    alerts: true,
  });
  const [baseMap, setBaseMap] = useState<'dark' | 'satellite'>('dark');
  const [isRadarPlaying, setIsRadarPlaying] = useState(true);
  const [radarFrame, setRadarFrame] = useState(0);

  // Toggle layer helper
  const toggleLayer = (layer: MapLayerType) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Radar playback ticker
  useEffect(() => {
    if (!isRadarPlaying) return;
    const interval = setInterval(() => {
      setRadarFrame(prev => (prev + 1) % 5);
    }, 1200);
    return () => clearInterval(interval);
  }, [isRadarPlaying]);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [currentLocation.lat, currentLocation.lng],
      zoom: 8,
      zoomControl: true,
      attributionControl: false
    });

    const tileUrl = baseMap === 'dark' 
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    // Handle map click to inspect new coordinates with reverse geocoding
    map.on('click', async (e: L.LeafletMouseEvent) => {
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

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update base tile when baseMap toggles
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileUrl = baseMap === 'dark' 
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);
  }, [baseMap]);

  // Update map center when currentLocation changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([currentLocation.lat, currentLocation.lng], 8, {
      duration: 1.2
    });
  }, [currentLocation.lat, currentLocation.lng]);

  // Re-draw overlays (Radar, Alerts, Wind, Markers)
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const group = layerGroupRef.current;
    group.clearLayers();

    // 1. Current selected location marker
    const pinIcon = L.divIcon({
      className: 'custom-user-pin',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute w-8 h-8 bg-cyan-500/30 rounded-full animate-ping"></div>
          <div class="relative w-4 h-4 bg-cyan-400 border-2 border-white rounded-full shadow-lg"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const marker = L.marker([currentLocation.lat, currentLocation.lng], { icon: pinIcon })
      .bindPopup(`
        <div class="p-2 text-xs space-y-1">
          <div class="font-bold text-cyan-600 dark:text-cyan-400 text-sm">${currentLocation.name}</div>
          <div class="text-slate-700 dark:text-slate-300">Temp: <span class="font-bold text-slate-900 dark:text-white">${weatherData?.temp || 32}°C</span> | Hum: ${weatherData?.humidity || 65}%</div>
          <div class="text-slate-500 dark:text-slate-400 font-mono">NWP Resolution: 3km WRF Grid</div>
        </div>
      `);
    group.addLayer(marker);

    // 2. Active Alert Warning Zones (Red, Orange, Yellow)
    if (activeLayers.alerts) {
      activeAlerts.forEach((alert) => {
        const colorHex = alert.severityColor === 'red' ? '#EF4444' : alert.severityColor === 'orange' ? '#F97316' : '#FBBF24';
        
        // Circular risk zone
        const circle = L.circle(alert.coordinates, {
          radius: alert.radiusKm * 1000,
          color: colorHex,
          fillColor: colorHex,
          fillOpacity: 0.18,
          weight: 2,
          dashArray: alert.severity === 'Critical' ? '4, 6' : undefined
        });

        // Pulsing core marker
        const alertIcon = L.divIcon({
          className: 'custom-alert-icon',
          html: `
            <div class="relative flex items-center justify-center w-7 h-7">
              <div class="absolute w-7 h-7 rounded-full opacity-75 animate-ping" style="background-color: ${colorHex}"></div>
              <div class="relative w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md" style="background-color: ${colorHex}">
                ⚠️
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const alertMarker = L.marker(alert.coordinates, { icon: alertIcon });

        const popupContent = `
          <div class="p-2 text-xs max-w-xs space-y-2">
            <div class="flex items-center justify-between gap-2 border-b border-slate-700 pb-1">
              <span class="font-bold text-sm" style="color: ${colorHex}">${alert.type}</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800" style="color: ${colorHex}">${alert.severity}</span>
            </div>
            <div class="font-medium text-slate-200">${alert.location}</div>
            <p class="text-slate-300 text-[11px] leading-relaxed">${alert.message}</p>
            <div class="text-[10px] text-slate-400 bg-slate-800/80 p-1.5 rounded">
              <strong>Direct Action:</strong> ${alert.actionRequired}
            </div>
            <div class="text-[10px] text-slate-400">Affected Blocks: ${alert.affectedBlocks.join(', ')}</div>
          </div>
        `;

        circle.bindPopup(popupContent);
        alertMarker.bindPopup(popupContent);

        group.addLayer(circle);
        group.addLayer(alertMarker);
      });
    }

    // 3. Simulated Doppler Precipitation Radar Overlay
    if (activeLayers.radar) {
      // Dynamic radar cells based on frame
      const radarCenters = [
        { lat: currentLocation.lat + 0.15, lng: currentLocation.lng + 0.12, intensity: 45, radius: 22000 },
        { lat: currentLocation.lat - 0.2, lng: currentLocation.lng - 0.1, intensity: 58, radius: 35000 },
        { lat: 18.5204 + (radarFrame * 0.03), lng: 73.8567 + (radarFrame * 0.02), intensity: 62, radius: 28000 },
        { lat: 17.6868 - (radarFrame * 0.04), lng: 83.2185 - (radarFrame * 0.03), intensity: 52, radius: 45000 },
      ];

      radarCenters.forEach((cell) => {
        const radarColor = cell.intensity > 55 ? '#ef4444' : cell.intensity > 40 ? '#f59e0b' : '#06b6d4';
        const radarCircle = L.circle([cell.lat, cell.lng], {
          radius: cell.radius + (radarFrame * 2500),
          color: radarColor,
          fillColor: radarColor,
          fillOpacity: 0.22 - (radarFrame * 0.03),
          weight: 1.5,
        }).bindPopup(`
          <div class="p-1 text-xs">
            <div class="font-bold text-cyan-600 dark:text-cyan-400">Doppler Radar Reflectivity</div>
            <div class="text-slate-700 dark:text-slate-300">Reflectivity: <span class="font-bold text-slate-900 dark:text-white">${cell.intensity} dBZ</span></div>
            <div class="text-slate-700 dark:text-slate-300">Rain Rate: ~${Math.round(cell.intensity * 0.45)} mm/hr</div>
            <div class="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Scan Elevation: 0.5° S-Band</div>
          </div>
        `);
        group.addLayer(radarCircle);
      });
    }

    // 4. Wind Vectors & Isobar Arrows
    if (activeLayers.wind) {
      const windOffsets = [
        { dLat: 0.3, dLng: 0.3, spd: 22, deg: 240 },
        { dLat: -0.3, dLng: 0.4, spd: 34, deg: 260 },
        { dLat: 0.4, dLng: -0.3, spd: 16, deg: 210 },
        { dLat: -0.4, dLng: -0.4, spd: 28, deg: 250 },
      ];

      windOffsets.forEach((v) => {
        const windLat = currentLocation.lat + v.dLat;
        const windLng = currentLocation.lng + v.dLng;
        const windIcon = L.divIcon({
          className: 'wind-arrow-icon',
          html: `
            <div style="transform: rotate(${v.deg}deg);" class="flex items-center gap-0.5 text-cyan-300 opacity-80">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
              <span class="text-[9px] font-mono font-bold bg-slate-900/90 px-1 rounded text-cyan-200">${v.spd}kt</span>
            </div>
          `,
          iconSize: [36, 24],
          iconAnchor: [18, 12]
        });

        const windMarker = L.marker([windLat, windLng], { icon: windIcon });
        group.addLayer(windMarker);
      });
    }
  }, [currentLocation, activeLayers, activeAlerts, weatherData, radarFrame]);

  return (
    <div className="relative w-full h-[420px] sm:h-[460px] rounded-3xl overflow-hidden bg-white dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl">
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2.5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-3.5 py-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg text-xs">
        <div className="flex items-center gap-1.5 font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
          <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>GIS Synoptic Layer</span>
        </div>
        <span className="text-slate-400">|</span>
        <span className="text-[11px] text-slate-700 dark:text-slate-300 font-mono">
          {currentLocation.lat.toFixed(2)}°N, {currentLocation.lng.toFixed(2)}°E
        </span>
      </div>

      {/* Layer Controls & Toggles (Top Right) */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl p-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleLayer('radar')}
            className={`px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all ${
              activeLayers.radar 
                ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_8px_rgba(6,182,212,0.2)]' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Toggle Precipitation Doppler Radar"
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Radar</span>
          </button>

          <button
            onClick={() => toggleLayer('wind')}
            className={`px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all ${
              activeLayers.wind 
                ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/40 font-bold shadow-[0_0_8px_rgba(14,165,233,0.2)]' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Toggle Wind Vectors & Isobars"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind</span>
          </button>

          <button
            onClick={() => toggleLayer('alerts')}
            className={`px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all ${
              activeLayers.alerts 
                ? 'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/40 font-bold shadow-[0_0_8px_rgba(239,68,68,0.2)]' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Toggle Severe Weather Warning Polygons"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Alerts</span>
          </button>
        </div>

        {/* Satellite vs Dark tile toggle */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-1.5 text-[10px] text-slate-500 dark:text-slate-400">
          <span>Base Map:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setBaseMap('dark')}
              className={`px-2 py-0.5 rounded-lg transition-all ${baseMap === 'dark' ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              OSM Map
            </button>
            <button
              onClick={() => setBaseMap('satellite')}
              className={`px-2 py-0.5 rounded-lg transition-all ${baseMap === 'satellite' ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Satellite
            </button>
          </div>
        </div>
      </div>

      {/* Radar Timeline & Playback Controller (Bottom Center) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] bg-white/80 dark:bg-slate-950/85 backdrop-blur-xl px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 shadow-2xl flex items-center gap-3 text-xs">
        <button
          onClick={() => setIsRadarPlaying(!isRadarPlaying)}
          className="p-1.5 rounded-full bg-cyan-600 dark:bg-cyan-500 hover:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold transition-transform active:scale-95 shadow-md shadow-cyan-500/30"
          title={isRadarPlaying ? 'Pause Radar Loop' : 'Play Radar Loop'}
        >
          {isRadarPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">T-{4 - radarFrame * 15}m</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(idx => (
              <div
                key={idx}
                onClick={() => setRadarFrame(idx)}
                className={`w-3.5 h-1.5 rounded-full cursor-pointer transition-colors ${
                  radarFrame === idx ? 'bg-cyan-600 dark:bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-cyan-700 dark:text-cyan-300 font-mono font-bold">LIVE NOW</span>
        </div>

        <div className="h-3 w-px bg-slate-300 dark:bg-white/10" />

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-300">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Light</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Mod</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Heavy</span>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
