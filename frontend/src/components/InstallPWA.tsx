import React, { useState, useEffect } from 'react';

// Define the BeforeInstallPromptEvent interface for TypeScript
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Update UI to notify the user they can add to home screen
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      // Hide the app-provided install promotion
      setShowInstallPrompt(false);
      // Clear the deferredPrompt so it can be garbage collected
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-[10000] w-[90%] sm:w-auto max-w-sm mx-auto bg-[#182133] border border-cyan-900/50 rounded-full shadow-2xl p-2 pr-3 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-8 fade-in duration-300">
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-cyan-950/50 flex items-center justify-center shrink-0 overflow-hidden border border-cyan-900/50">
           <img src="/icons/icon-48x48.png" alt="App Icon" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col pr-2">
          <span className="text-sm font-semibold text-white">Install App</span>
          <span className="text-[10px] text-slate-400">Add to home screen</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handleInstallClick}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold py-1.5 px-4 rounded-full transition-colors flex items-center gap-1"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors ml-1"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
