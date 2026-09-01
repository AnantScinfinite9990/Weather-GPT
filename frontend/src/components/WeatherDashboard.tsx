import React from 'react';
import { 
  Sun, 
  CloudSun, 
  CloudRain, 
  CloudLightning, 
  Wind, 
  Droplets, 
  Compass, 
  Gauge, 
  Activity, 
  Sprout, 
  Cloud, 
  ArrowUpRight, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Info,
  Calendar
} from 'lucide-react';
import { WeatherMetrics, LanguageCode } from '../types';
import { UI_TRANSLATIONS } from '../data/mockWeatherData';

interface WeatherDashboardProps {
  data: WeatherMetrics | null;
  currentLang: LanguageCode;
  isLoading: boolean;
}

export const WeatherDashboard: React.FC<WeatherDashboardProps> = ({
  data,
  currentLang,
  isLoading
}) => {
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS['en'];

  if (isLoading || !data) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-36 rounded-2xl bg-slate-800/60 border border-slate-700/50" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-800/40 border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  // Get AQI Color
  const getAQIBadge = (status: string) => {
    switch (status) {
      case 'Good':
        return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' };
      case 'Moderate':
        return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' };
      case 'Poor':
        return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' };
      case 'Unhealthy':
      case 'Hazardous':
        return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' };
      default:
        return { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' };
    }
  };

  const aqiBadge = getAQIBadge(data.aqiStatus);

  return (
    <div className="space-y-4">
      {/* Primary Current Weather Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-100 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-5 sm:p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/15 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                Live Synoptic Sounding
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Updated at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {data.location}
            </h2>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm font-medium">
              <span>{data.condition}</span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span className="text-cyan-700 dark:text-cyan-300">Feels like {data.feelsLike}°C</span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span className="text-slate-500 dark:text-slate-400">Precip: {data.precipitation} mm</span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center justify-center">
              {data.condition.includes('Rain') || data.condition.includes('Downpour') ? (
                <CloudRain className="w-8 h-8 text-cyan-600 dark:text-cyan-400 animate-bounce" />
              ) : data.condition.includes('Thunderstorm') ? (
                <CloudLightning className="w-8 h-8 text-amber-600 dark:text-amber-400 animate-pulse" />
              ) : data.condition.includes('Cloud') ? (
                <CloudSun className="w-8 h-8 text-sky-600 dark:text-sky-300" />
              ) : (
                <Sun className="w-8 h-8 text-amber-600 dark:text-amber-400 animate-spin" style={{ animationDuration: '18s' }} />
              )}
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight flex items-start">
                <span>{data.temp}</span>
                <span className="text-xl font-normal text-cyan-700 dark:text-cyan-400 ml-1">°C</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                <span>H: {Math.round(data.temp + 3)}°</span>
                <span>L: {Math.round(data.temp - 4)}°</span>
              </div>
            </div>
          </div>
        </div>

        {/* NWP Telemetry Badge Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">CAPE Index:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{data.nwpModel.cape} J/kg</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Cloud className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Cloud Ceiling:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{data.nwpModel.cloudBaseAGL} m AGL</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Sprout className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Soil Moisture:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{data.soilMoisture}%</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Activity className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Grid Model:</span>
            <span className="font-bold text-cyan-700 dark:text-cyan-300 truncate">WRF-India 3km</span>
          </div>
        </div>
      </div>

      {/* Atmospheric Metrics Bento Grid with Frosted Glass styling */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Temperature & Thermal */}
        <div className="bg-slate-100 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-4 rounded-2xl flex items-center gap-3.5 hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="p-3 bg-orange-500/20 rounded-xl text-orange-600 dark:text-orange-400 shrink-0">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tighter">Thermal Sensation</p>
            <h4 className="text-xl font-black text-slate-900 dark:text-white">{data.feelsLike}°C</h4>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Dew {data.dewPoint}°C</span>
          </div>
        </div>

        {/* Wind Speed & Direction */}
        <div className="bg-slate-100 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-4 rounded-2xl flex items-center gap-3.5 hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-600 dark:text-cyan-400 shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tighter">Wind Speed</p>
            <h4 className="text-xl font-black text-slate-900 dark:text-white">{data.windSpeed} <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-mono">km/h</span></h4>
            <span className="text-[10px] text-cyan-700 dark:text-cyan-300 font-medium">{data.windDirectionText}</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-slate-100 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-4 rounded-2xl flex items-center gap-3.5 hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="p-3 bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tighter">Humidity</p>
            <h4 className="text-xl font-black text-slate-900 dark:text-white">{data.humidity}%</h4>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{data.pressure} hPa</span>
          </div>
        </div>

        {/* AQI Index */}
        <div className="bg-slate-100 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-4 rounded-2xl flex items-center gap-3.5 hover:border-slate-300 dark:hover:border-white/20 transition-all">
          <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tighter">AQI Index</p>
            <h4 className="text-xl font-black text-slate-900 dark:text-white">
              {data.aqi}{' '}
              <span className={`text-xs font-normal uppercase ml-1 ${aqiBadge.text}`}>
                {data.aqiStatus}
              </span>
            </h4>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">PM2.5: {Math.round(data.aqi * 0.4)}</span>
          </div>
        </div>
      </div>

      {/* 24-Hour Timeline Scrubber */}
      <div className="bg-slate-100 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-slate-200 dark:border-white/10 shadow-lg">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">
            <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>24-Hour Synoptic Hourly Forecast</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">GFS 0.25° High-Res Run</span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
          {data.hourly.slice(0, 12).map((hour, idx) => (
            <div
              key={idx}
              className={`flex-shrink-0 w-20 p-3 rounded-2xl text-center border transition-all ${
                idx === 0
                  ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-800 dark:text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-200/50 dark:bg-black/30 backdrop-blur-md border-slate-300 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-white/20 hover:bg-slate-200 dark:hover:bg-white/5'
              }`}
            >
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{hour.time}</div>
              <div className="my-2 flex justify-center">
                {hour.rainProb > 50 ? (
                  <CloudRain className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                ) : (
                  <CloudSun className="w-5 h-5 text-amber-600 dark:text-amber-300" />
                )}
              </div>
              <div className="text-sm font-black text-slate-900 dark:text-white">{hour.temp}°</div>
              <div className="text-[10px] text-cyan-700 dark:text-cyan-300 font-mono mt-0.5">{hour.rainProb}% rain</div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Forecast Synoptic Cards */}
      <div className="bg-slate-100 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-slate-200 dark:border-white/10 shadow-lg">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>7-Day Agro & Disaster Outlook</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Panchayat / Block Level</span>
        </div>

        <div className="space-y-2">
          {data.daily.map((day, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-slate-200/50 dark:bg-black/20 hover:bg-slate-200 dark:hover:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 gap-2 transition-all"
            >
              <div className="flex items-center gap-3 w-36">
                <span className="font-bold text-xs text-slate-900 dark:text-white">{day.day}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{day.date}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 flex-1">
                {day.rainProb > 50 ? (
                  <CloudRain className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                ) : (
                  <CloudSun className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
                <span>{day.condition}</span>
                {day.rainMm > 0 && (
                  <span className="text-[11px] text-cyan-700 dark:text-cyan-400 font-mono">({day.rainMm} mm)</span>
                )}
              </div>

              {day.advisoryTag && (
                <div className="text-[11px] text-amber-800 dark:text-amber-300/90 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 max-w-xs truncate">
                  🌾 {day.advisoryTag}
                </div>
              )}

              <div className="flex items-center gap-2 text-xs font-mono font-bold justify-end min-w-[70px]">
                <span className="text-slate-900 dark:text-white">{day.maxTemp}°</span>
                <span className="text-slate-400">/</span>
                <span className="text-slate-500 dark:text-slate-400">{day.minTemp}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
