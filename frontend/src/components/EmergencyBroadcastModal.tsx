import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Send, 
  CheckCircle2, 
  Radio, 
  Users, 
  MessageSquare, 
  Smartphone, 
  BellRing,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { WeatherAlert, Coordinates } from '../types';

interface EmergencyBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: Coordinates;
  activeAlerts: WeatherAlert[];
  prefilledMessage?: string;
}

export const EmergencyBroadcastModal: React.FC<EmergencyBroadcastModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  activeAlerts,
  prefilledMessage
}) => {
  const [selectedAlertType, setSelectedAlertType] = useState('Flash Flood Warning');
  const [targetRegion, setTargetRegion] = useState(currentLocation.name);
  const [selectedPanchayats, setSelectedPanchayats] = useState<string[]>(['Haveli Block', 'Mulshi Tehsil', 'Zone 4 Lowland']);
  const [selectedChannels, setSelectedChannels] = useState<{ sms: boolean; whatsapp: boolean; sirens: boolean; cap: boolean }>({
    sms: true,
    whatsapp: true,
    sirens: true,
    cap: true
  });
  const [customText, setCustomText] = useState(
    prefilledMessage || `[URGENT WEATHER ADVISORY] Flash flood surge detected in ${currentLocation.name}. Low-lying riverbank residents to move to designated cyclone shelters immediately. Emergency Control: 1077.`
  );
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleDispatch = async () => {
    setIsDispatching(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/emergency/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertType: selectedAlertType,
          targetRegion,
          affectedPanchayats: selectedPanchayats,
          channels: Object.entries(selectedChannels).filter(([_, v]) => v).map(([k]) => k.toUpperCase()),
          customMessage: customText
        })
      });
      const data = await response.json();
      setDispatchResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleReset = () => {
    setDispatchResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900/90 backdrop-blur-2xl border border-red-500/40 rounded-3xl shadow-2xl dark:shadow-red-950/50 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-gradient-to-r dark:from-red-950/90 dark:via-slate-900/90 dark:to-slate-900/90 border-b border-slate-200 dark:border-red-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-100 dark:bg-red-600/20 border border-red-300 dark:border-red-500/50 text-red-600 dark:text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
                <span>Emergency Alert Broadcast Console</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/20 dark:border-red-500/40 font-bold uppercase">
                  Level 1 Protocol
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Direct integration with Block Disaster Management Cells & Panchayats
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {!dispatchResult ? (
            <>
              {/* Alert Severity & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider text-[10px]">
                    Emergency Threat Vector
                  </label>
                  <select
                    value={selectedAlertType}
                    onChange={(e) => setSelectedAlertType(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 rounded-2xl p-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-red-500 transition-all"
                  >
                    <option>Flash Flood / Inundation Warning</option>
                    <option>Severe Convective Lightning (Nowcast)</option>
                    <option>Cyclone Storm Surge & GFS Wind Squall</option>
                    <option>Extreme Heatwave / WBGT Critical Warning</option>
                    <option>Dam Discharge Inflow Spill Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider text-[10px]">
                    Target Administrative Sector
                  </label>
                  <input
                    type="text"
                    value={targetRegion}
                    onChange={(e) => setTargetRegion(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 rounded-2xl p-3 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              {/* Target Dissemination Channels */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wider text-[10px]">
                  Emergency Push Channels
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <label className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-black/30 backdrop-blur-md border border-slate-300 dark:border-white/10 cursor-pointer hover:border-slate-400 dark:hover:border-white/20 text-xs transition-all text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={selectedChannels.sms}
                      onChange={(e) => setSelectedChannels({ ...selectedChannels, sms: e.target.checked })}
                      className="rounded border-slate-300 dark:border-white/20 text-red-500 focus:ring-0"
                    />
                    <Smartphone className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>GSM Bulk SMS</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-black/30 backdrop-blur-md border border-slate-300 dark:border-white/10 cursor-pointer hover:border-slate-400 dark:hover:border-white/20 text-xs transition-all text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={selectedChannels.whatsapp}
                      onChange={(e) => setSelectedChannels({ ...selectedChannels, whatsapp: e.target.checked })}
                      className="rounded border-slate-300 dark:border-white/20 text-emerald-500 focus:ring-0"
                    />
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>WhatsApp Alert</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-black/30 backdrop-blur-md border border-slate-300 dark:border-white/10 cursor-pointer hover:border-slate-400 dark:hover:border-white/20 text-xs transition-all text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={selectedChannels.sirens}
                      onChange={(e) => setSelectedChannels({ ...selectedChannels, sirens: e.target.checked })}
                      className="rounded border-slate-300 dark:border-white/20 text-amber-500 focus:ring-0"
                    />
                    <BellRing className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Panchayat Sirens</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-black/30 backdrop-blur-md border border-slate-300 dark:border-white/10 cursor-pointer hover:border-slate-400 dark:hover:border-white/20 text-xs transition-all text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={selectedChannels.cap}
                      onChange={(e) => setSelectedChannels({ ...selectedChannels, cap: e.target.checked })}
                      className="rounded border-slate-300 dark:border-white/20 text-red-500 focus:ring-0"
                    />
                    <Radio className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                    <span>NDMA CAP Feed</span>
                  </label>
                </div>
              </div>

              {/* Message Payload Template */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider text-[10px]">
                  Broadcast Advisory Message (Multi-lingual GSM compliant)
                </label>
                <textarea
                  rows={4}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 rounded-2xl p-3.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-red-500 leading-relaxed font-mono transition-all"
                />
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  <span>Characters: {customText.length} | GSM 7-bit Encodable</span>
                  <span>Estimated Reach: ~35,000 citizens in target block</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-300 dark:border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDispatch}
                  disabled={isDispatching}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-red-950/60 active:scale-95 transition-all"
                >
                  {isDispatching ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Broadcasting to Gateways...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Authorize & Dispatch SOS Broadcast</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Dispatch Success Overview */
            <div className="py-6 px-4 text-center space-y-4">
              <div className="inline-flex p-3 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Emergency Broadcast Successfully Dispatched!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Batch Reference: <span className="text-cyan-700 dark:text-cyan-400">{dispatchResult.broadcastId}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left p-4 rounded-2xl bg-slate-100 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs">
                <div>
                  <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Estimated Reach</div>
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {dispatchResult.estimatedCitizensReached.toLocaleString()} Citizens
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Gateway Delivery Rate</div>
                  <div className="text-base font-black text-cyan-700 dark:text-cyan-400 font-mono">
                    {dispatchResult.deliveryRate}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Target Region</div>
                  <div className="text-slate-800 dark:text-slate-200 font-bold truncate">
                    {dispatchResult.targetRegion}
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl text-xs bg-slate-200 dark:bg-black/40 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 transition-colors"
                >
                  Send Another Advisory
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 hover:bg-cyan-500 dark:hover:bg-cyan-400 shadow-md shadow-cyan-500/30 transition-colors"
                >
                  Done & Return to Map
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
