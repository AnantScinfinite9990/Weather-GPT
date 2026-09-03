import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-4 left-1/2 -translate-x-1/2 sm:left-4 sm:-translate-x-0 z-[100] flex items-center gap-2 rounded-xl bg-amber-500/90 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold text-white shadow-lg shadow-amber-500/20 border border-amber-400">
      <WifiOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
      <span>Offline Mode — Using cached data.</span>
    </div>
  );
};
