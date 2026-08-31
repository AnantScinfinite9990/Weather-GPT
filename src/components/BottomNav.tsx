import React from 'react';
import { Home, Crosshair, MessageSquare, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#182133] border-t border-white/5 pb-[env(safe-area-inset-bottom,16px)] pt-2 px-4 flex justify-around items-center z-50 h-16 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] shrink-0">
      <button 
        onClick={() => onTabChange('Forecast')}
        className={`flex flex-col items-center justify-center space-y-1 transition-colors group ${activeTab === 'Forecast' ? 'text-blue-500' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}
      >
        <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        <span className="text-[10px] font-medium">Forecast</span>
      </button>
      <button 
        onClick={() => onTabChange('Maps')}
        className={`flex flex-col items-center justify-center space-y-1 transition-colors group ${activeTab === 'Maps' ? 'text-blue-500' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}
      >
        <div className={`${activeTab === 'Maps' ? 'bg-blue-500/20' : ''} p-1.5 rounded-full group-hover:scale-110 transition-transform duration-200`}>
          <Crosshair className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-medium">Maps</span>
      </button>
      <button 
        onClick={() => onTabChange('Chat')}
        className={`flex flex-col items-center justify-center space-y-1 transition-colors group ${activeTab === 'Chat' ? 'text-blue-500' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}
      >
        <MessageSquare className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        <span className="text-[10px] font-medium">AI Chat</span>
      </button>
      <button 
        onClick={() => onTabChange('Settings')}
        className={`flex flex-col items-center justify-center space-y-1 transition-colors group ${activeTab === 'Settings' ? 'text-blue-500' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}
      >
        <Settings className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        <span className="text-[10px] font-medium">Settings</span>
      </button>
    </nav>
  );
};
