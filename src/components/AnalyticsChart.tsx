import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { History, CloudRain, Thermometer } from 'lucide-react';
import { DECADAL_TREND_DATA } from '../data/mockWeatherData';

export const AnalyticsChart: React.FC = () => {
  const [metricMode, setMetricMode] = useState<'rainfall' | 'temp'>('rainfall');

  return (
    <div className="bg-slate-100 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
      {/* Header & Metric Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              NWP Climate Intelligence & Decadal Deviations
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              10-Year Baseline (2015 - 2026) compared with IMD/ECMWF ERA5 Reanalysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-200 dark:bg-black/40 p-1 rounded-xl border border-slate-300 dark:border-white/10 text-xs backdrop-blur-md">
          <button
            onClick={() => setMetricMode('rainfall')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1 transition-all ${
              metricMode === 'rainfall'
                ? 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Rainfall (mm)</span>
          </button>
          <button
            onClick={() => setMetricMode('temp')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1 transition-all ${
              metricMode === 'temp'
                ? 'bg-amber-500 text-white dark:text-slate-950 font-bold shadow-md shadow-amber-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temp Anomaly (°C)</span>
          </button>
        </div>
      </div>

      {/* Climate Key Metrics Bar */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-slate-200/50 dark:bg-black/20 border border-slate-300 dark:border-white/5">
          <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider">Cumulative Rain Anomaly</div>
          <div className="text-sm font-black text-cyan-700 dark:text-cyan-400 font-mono mt-0.5">+14.2% Above Mean</div>
        </div>
        <div className="p-3 rounded-2xl bg-slate-200/50 dark:bg-black/20 border border-slate-300 dark:border-white/5">
          <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider">10-Yr Mean Temp Rise</div>
          <div className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5">+1.85°C Warming</div>
        </div>
        <div className="p-3 rounded-2xl bg-slate-200/50 dark:bg-black/20 border border-slate-300 dark:border-white/5">
          <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider">Extreme Rain Days</div>
          <div className="text-sm font-black text-rose-600 dark:text-rose-400 font-mono mt-0.5">3.2x Frequency</div>
        </div>
      </div>

      {/* Recharts Chart Canvas */}
      <div className="h-[220px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {metricMode === 'rainfall' ? (
            <AreaChart data={DECADAL_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rainCurrentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="rainHistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#64748B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-300 dark:text-white/10" strokeOpacity={0.2} />
              <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} unit="mm" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tw-colors-slate-900, #0f172a)', 
                  borderColor: '#334155', 
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: '#f8fafc'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
              <Area 
                type="monotone" 
                name="Recorded Annual Rain (mm)" 
                dataKey="rainfallMm" 
                stroke="#06B6D4" 
                strokeWidth={2.5} 
                fill="url(#rainCurrentGrad)" 
              />
              <Area 
                type="monotone" 
                name="10-Yr Historical Mean (mm)" 
                dataKey="historicRainfallMm" 
                stroke="#94A3B8" 
                strokeDasharray="4 4" 
                strokeWidth={1.5} 
                fill="url(#rainHistGrad)" 
              />
            </AreaChart>
          ) : (
            <AreaChart data={DECADAL_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-300 dark:text-white/10" strokeOpacity={0.2} />
              <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} unit="°C" domain={[28, 36]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tw-colors-slate-900, #0f172a)', 
                  borderColor: '#334155', 
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: '#f8fafc'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
              <Area 
                type="monotone" 
                name="Mean Summer Max Temp (°C)" 
                dataKey="currentValue" 
                stroke="#F59E0B" 
                strokeWidth={2.5} 
                fill="url(#tempGrad)" 
              />
              <Area 
                type="monotone" 
                name="10-Year Decadal Baseline (°C)" 
                dataKey="historic10YrMean" 
                stroke="#64748B" 
                strokeDasharray="3 3" 
                strokeWidth={1.5} 
                fill="transparent" 
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
