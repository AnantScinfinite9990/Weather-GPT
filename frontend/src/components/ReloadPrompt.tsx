import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-36 sm:bottom-40 right-4 z-[10000] w-[90%] sm:w-auto max-w-sm bg-[#182133] border border-cyan-900/50 rounded-xl shadow-2xl p-4 flex flex-col gap-3 animate-in slide-in-from-bottom-8 fade-in duration-300">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-cyan-950/50 flex items-center justify-center shrink-0 border border-cyan-900/50">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div className="flex flex-col pr-2">
          <span className="text-sm font-semibold text-white">
            {offlineReady ? 'App ready to work offline' : 'New update available'}
          </span>
          <span className="text-xs text-slate-400 mt-1 leading-relaxed">
            {offlineReady 
              ? 'You can now use Weather GPT without an internet connection.'
              : 'A new version of Weather GPT is available. Refresh to update and get the latest features.'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-end mt-1">
        <button
          onClick={close}
          className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          Close
        </button>
        {needRefresh && (
          <button
            onClick={() => updateServiceWorker(true)}
            className="px-4 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
          >
            Reload App
          </button>
        )}
      </div>
    </div>
  );
}
