import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check, 
  ShieldAlert, 
  Radio, 
  AlertTriangle,
  FileText,
  HelpCircle,
  Wheat,
  Plane,
  Flame,
  Binary,
  Compass
} from 'lucide-react';
import { PersonaType, LanguageCode, ChatMessage, WeatherMetrics } from '../types';
import { PERSONA_PROMPTS, UI_TRANSLATIONS } from '../data/mockWeatherData';

interface WeatherChatWorkbenchProps {
  currentPersona: PersonaType;
  onPersonaChange: (persona: PersonaType) => void;
  currentLang: LanguageCode;
  weatherData: WeatherMetrics | null;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  transcript: string;
  onSpeak: (text: string) => void;
  onOpenSOSModalWithContext?: (text: string) => void;
}


import { formatMarkdown } from '../utils/formatMarkdown';

const formatMessage = formatMarkdown;

export const WeatherChatWorkbench: React.FC<WeatherChatWorkbenchProps> = ({
  currentPersona,
  onPersonaChange,
  currentLang,
  weatherData,
  messages,
  onSendMessage,
  isLoading,
  isListening,
  onStartListening,
  onStopListening,
  transcript,
  onSpeak,
  onOpenSOSModalWithContext
}) => {
  const [inputVal, setInputVal] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS['en'];

  // Sync speech transcript to input
  useEffect(() => {
    if (transcript) {
      setInputVal(transcript);
    }
  }, [transcript]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    const text = inputVal.trim();
    setInputVal('');
    if (isListening) onStopListening();
    await onSendMessage(text);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const personas: { id: PersonaType; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'Farmer', label: 'Farmer (Agro)', icon: <Wheat className="w-3.5 h-3.5" />, color: 'hover:text-emerald-400' },
    { id: 'Aviator', label: 'Aviator (METAR)', icon: <Plane className="w-3.5 h-3.5" />, color: 'hover:text-sky-400' },
    { id: 'Disaster Manager', label: 'Disaster Lead', icon: <Flame className="w-3.5 h-3.5" />, color: 'hover:text-red-400' },
    { id: 'Researcher', label: 'Researcher', icon: <Binary className="w-3.5 h-3.5" />, color: 'hover:text-purple-400' },
    { id: 'Citizen', label: 'Citizen', icon: <Compass className="w-3.5 h-3.5" />, color: 'hover:text-amber-400' },
  ];

  const currentPrompts = PERSONA_PROMPTS[currentPersona] || PERSONA_PROMPTS['Farmer'];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl">
      {/* Top Header & Persona Selector Bar */}
      <div className="p-3.5 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-md flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-700 dark:text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
                  WeatherGPT Master Agent
                </h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 font-mono font-bold">
                  Gemini 3.7 + NWP
                </span>
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400">
                Contextualized for <span className="text-cyan-700 dark:text-cyan-300 font-semibold">{weatherData?.location || 'Regional Grid'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Persona Tabs Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => onPersonaChange(p.id)}
              className={`flex-shrink-0 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                currentPersona === p.id
                  ? 'bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'bg-slate-200 dark:bg-black/30 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-300 dark:border-white/5'
              }`}
            >
              {p.icon}
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-3.5 py-2 bg-slate-200/50 dark:bg-black/30 border-b border-slate-200 dark:border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold flex-shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-600 dark:text-cyan-400" /> Prompts:
        </span>
        {currentPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(prompt)}
            className="flex-shrink-0 text-[11px] px-3 py-1 rounded-lg bg-slate-200 dark:bg-black/40 hover:bg-slate-300 dark:hover:bg-white/10 hover:text-cyan-700 dark:hover:text-cyan-300 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/5 hover:border-slate-400 dark:hover:border-white/20 transition-all truncate max-w-[260px]"
            title={prompt}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Stream Container */}
      <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1`}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1 font-mono">
              {msg.role === 'user' ? (
                <>
                  <span>You</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              ) : (
                <>
                  <span className="text-cyan-400 font-bold">WeatherGPT ({msg.persona})</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              )}
            </div>

            <div
              className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed transition-all shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-cyan-900/30'
                  : 'bg-slate-200 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-200 rounded-tl-none space-y-2'
              }`}
            >
              {/* Message text with basic markdown formatting support */}
              <div className="whitespace-pre-line space-y-1.5">
                {formatMessage(msg.content)}
              </div>

              {/* Action buttons on AI responses */}
              {msg.role === 'ai' && (
                <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-2 text-[11px]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSpeak(msg.content)}
                      className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors p-1 rounded hover:bg-slate-300/50 dark:hover:bg-white/5"
                      title="Read Aloud in Selected Regional Voice"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>Listen</span>
                    </button>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors p-1 rounded hover:bg-slate-300/50 dark:hover:bg-white/5"
                      title="Copy Advisory"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* If the response looks like an emergency alert, offer direct SOS broadcast trigger */}
                  {(msg.content.includes('ALERT') || msg.content.includes('CRITICAL') || msg.content.includes('Evacuation') || currentPersona === 'Disaster Manager') && onOpenSOSModalWithContext && (
                    <button
                      onClick={() => onOpenSOSModalWithContext(msg.content)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-red-100 dark:bg-red-600/20 hover:bg-red-200 dark:hover:bg-red-600/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-500/40 transition-all shadow-[0_0_8px_rgba(239,68,68,0.1)] dark:shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                    >
                      <Radio className="w-3 h-3 text-red-700 dark:text-red-400 animate-ping" />
                      <span>Broadcast This</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-200 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-300 dark:border-white/10 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-600 dark:text-cyan-400" />
              <span>Synthesizing NWP models & agro-meteorological indices...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form & Voice Recognition Bar */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-100 dark:bg-black/30 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 space-y-2">
        {/* Live Mic Listening Waveform Indicator */}
        {isListening && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-950/70 border border-cyan-300 dark:border-cyan-500/50 text-xs text-cyan-700 dark:text-cyan-300 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-semibold">Recording voice query in {currentLang.toUpperCase()}...</span>
            </div>
            <button
              type="button"
              onClick={onStopListening}
              className="text-[10px] font-bold text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 underline"
            >
              Stop
            </button>
          </div>
        )}

        <div className="relative flex items-center">
          <input
            type="text"
            id="weather-query-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={isListening ? "Listening to your voice..." : t.chatPlaceholder}
            className="w-full bg-white dark:bg-black/40 backdrop-blur-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm rounded-xl py-3 pl-3.5 pr-24 border border-slate-300 dark:border-white/10 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
          />

          <div className="absolute right-1.5 flex items-center gap-1">
            {/* Voice Input Mic Button */}
            <button
              type="button"
              id="voice-mic-btn"
              onClick={isListening ? onStopListening : onStartListening}
              className={`p-2 rounded-xl transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-200 dark:hover:bg-white/5'
              }`}
              title={isListening ? "Stop Voice Input" : "Speak Query in Regional Language"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              id="submit-query-btn"
              disabled={!inputVal.trim() || isLoading}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-bold transition-all active:scale-95 shadow-md shadow-cyan-500/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
          <span>Powered by Gemini 3.7 Flash + GFS 0.25° NWP Data</span>
          <span className="font-mono">{currentPersona} Mode Active</span>
        </div>
      </form>
    </div>
  );
};
