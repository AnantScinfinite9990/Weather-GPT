import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Bot, 
  Sparkles, 
  RefreshCw,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { PersonaType, LanguageCode, ChatMessage, WeatherMetrics } from '../types';

interface ChatBubbleProps {
  currentPersona: PersonaType;
  currentLang: LanguageCode;
  weatherData: WeatherMetrics | null;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onSpeak: (text: string) => void;
}


import { formatMarkdown } from '../utils/formatMarkdown';

const formatMessage = formatMarkdown;

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  currentPersona,
  currentLang,
  weatherData,
  messages,
  onSendMessage,
  isLoading,
  isListening,
  onStartListening,
  onStopListening,
  onSpeak,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    const text = inputVal.trim();
    setInputVal('');
    await onSendMessage(text);
  };

  return (
    <div className="fixed bottom-24 right-5 z-50">
      {/* Floating Trigger Bubble Button */}
      {!isOpen && (
        <button
          id="floating-chat-bubble-btn"
          onClick={() => setIsOpen(true)}
          className="group relative w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-cyan-500/20 hover:bg-cyan-200 dark:hover:bg-cyan-500/30 backdrop-blur-xl border border-cyan-400/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all"
          title="Open WeatherGPT Floating Assistant"
        >
          <Bot className="w-7 h-7 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 dark:bg-emerald-400 rounded-full ring-2 ring-white dark:ring-slate-950 pulse-glow" />
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block whitespace-nowrap bg-white dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-slate-200 text-xs px-3 py-1 rounded-xl border border-slate-200 dark:border-white/10 shadow-xl">
            Ask WeatherGPT
          </div>
        </button>
      )}

      {/* Floating Chat Modal Box */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[500px] flex flex-col rounded-3xl bg-white/90 dark:bg-slate-950/85 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in">
          {/* Header */}
          <div className="p-3.5 bg-slate-100 dark:bg-black/40 backdrop-blur-md border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wide">
                  <span>WeatherGPT Assistant</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 font-mono">
                    {currentPersona}
                  </span>
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                  {weatherData?.location || 'Live NWP Sounding'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
            {messages.slice(-6).map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-cyan-900/20'
                      : 'bg-slate-200 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line">{formatMessage(msg.content)}</div>
                  {msg.role === 'ai' && (
                    <div className="mt-2 pt-1.5 border-t border-slate-300 dark:border-white/10 flex justify-end">
                      <button
                        onClick={() => onSpeak(msg.content)}
                        className="text-[10px] text-cyan-700 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 flex items-center gap-1 p-0.5"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-[11px] p-2.5 bg-slate-200 dark:bg-black/40 backdrop-blur-md border border-slate-300 dark:border-white/10 rounded-2xl">
                <RefreshCw className="w-3 h-3 animate-spin text-cyan-600 dark:text-cyan-400" />
                <span>Parsing atmospheric model...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-slate-100 dark:bg-black/40 border-t border-slate-200 dark:border-white/10 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => onSendMessage(`Will it rain in ${weatherData?.location || 'my region'} in the next 12 hours?`)}
              className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-black/30 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 border border-slate-300 dark:border-white/5 truncate transition-all"
            >
              🌧️ Rain Forecast
            </button>
            <button
              onClick={() => onSendMessage(`What is the agro and crop advisory for today?`)}
              className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-black/30 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 border border-slate-300 dark:border-white/5 truncate transition-all"
            >
              🌾 Crop Advisory
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-2.5 bg-slate-100 dark:bg-black/40 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 flex items-center gap-1.5">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask weather question..."
              className="flex-1 bg-white dark:bg-black/40 text-xs text-slate-900 dark:text-white placeholder-slate-500 rounded-xl py-2 px-3 border border-slate-300 dark:border-white/10 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="button"
              onClick={isListening ? onStopListening : onStartListening}
              className={`p-2 rounded-xl transition-all ${
                isListening ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/40' : 'text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-200 dark:hover:bg-white/5'
              }`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
            <button
              type="submit"
              disabled={!inputVal.trim() || isLoading}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-all active:scale-95 shadow-md shadow-cyan-500/20"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
