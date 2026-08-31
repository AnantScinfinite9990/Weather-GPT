const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add imports
const importsToAdd = `
import { InteractiveMapView } from './components/InteractiveMapView';
`;
code = code.replace(
  "import { EmergencyBroadcastModal } from './components/EmergencyBroadcastModal';", 
  "import { EmergencyBroadcastModal } from './components/EmergencyBroadcastModal';\n" + importsToAdd
);

// 2. Add activeTab state
code = code.replace(
  "const [currentLocation, setCurrentLocation] = useState<Coordinates>(PRESET_REGIONS[0]);",
  "const [currentLocation, setCurrentLocation] = useState<Coordinates>(PRESET_REGIONS[0]);\n  const [activeTab, setActiveTab] = useState<'Forecast' | 'Maps' | 'Chat' | 'Settings'>('Maps');"
);

// 3. Conditional rendering in return
// The return block starts at: return ( \n <div className="min-h-screen...
const returnBlockStart = code.indexOf('return (');
const beforeReturn = code.slice(0, returnBlockStart);

const newReturnBlock = `  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {activeTab === 'Maps' ? (
        <InteractiveMapView 
          currentLocation={currentLocation} 
          onLocationSelect={handleLocationSelect}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      ) : (
        <>
          <Navbar
            currentLang={currentLang}
            onLanguageChange={setCurrentLang}
            activeAlerts={activeAlerts}
            currentLocation={currentLocation}
            onLocationSelect={handleLocationSelect}
            onOpenSOSModal={() => {
              setSosPrefillText(undefined);
              setIsSOSModalOpen(true);
            }}
            isSpeaking={isSpeaking}
            onStopSpeaking={stopSpeaking}
            isDarkMode={isDarkMode}
            onToggleTheme={toggleTheme}
          />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 space-y-6">
                <section aria-label="Interactive GIS Meteorological Map">
                  <GISMap
                    currentLocation={currentLocation}
                    onLocationSelect={handleLocationSelect}
                    activeAlerts={activeAlerts}
                    weatherData={weatherData}
                  />
                </section>
                <section aria-label="Atmospheric Metrics & Forecasts">
                  <WeatherDashboard
                    data={weatherData}
                    currentLang={currentLang}
                    isLoading={isLoadingWeather}
                  />
                </section>
                <section aria-label="Decadal Climate Trends">
                  <AnalyticsChart />
                </section>
              </div>
              <div className="lg:col-span-4 lg:sticky lg:top-24 h-[650px] sm:h-[720px]">
                <WeatherChatWorkbench
                  currentPersona={currentPersona}
                  onPersonaChange={handlePersonaChange}
                  currentLang={currentLang}
                  weatherData={weatherData}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isGeneratingAI}
                  isListening={isListening}
                  onStartListening={startListening}
                  onStopListening={stopListening}
                  transcript={transcript}
                  onSpeak={speak}
                  onOpenSOSModalWithContext={handleOpenSOSModalWithContext}
                />
              </div>
            </div>
          </main>
          
          <ChatBubble
            currentPersona={currentPersona}
            currentLang={currentLang}
            weatherData={weatherData}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isGeneratingAI}
            isListening={isListening}
            onStartListening={startListening}
            onStopListening={stopListening}
            onSpeak={speak}
          />
          
          <EmergencyBroadcastModal
            isOpen={isSOSModalOpen}
            onClose={() => setIsSOSModalOpen(false)}
            currentLocation={currentLocation}
            activeAlerts={activeAlerts}
            prefilledMessage={sosPrefillText}
          />
          
          {/* Include BottomNav in original view for navigation back to Maps */}
          <nav className="fixed bottom-0 left-0 right-0 bg-[#182133] border-t border-white/5 pb-[env(safe-area-inset-bottom,16px)] pt-2 px-4 flex justify-around items-center z-50 h-16 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] shrink-0">
            <button 
              onClick={() => setActiveTab('Forecast')}
              className={\`flex flex-col items-center justify-center space-y-1 transition-colors group \${activeTab === 'Forecast' ? 'text-blue-500' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}\`}
            >
              <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              <span className="text-[10px] font-medium">Forecast</span>
            </button>
            <button 
              onClick={() => setActiveTab('Maps')}
              className={\`flex flex-col items-center justify-center space-y-1 transition-colors group \${activeTab === 'Maps' ? 'text-blue-500' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}\`}
            >
              <div className={\`\${activeTab === 'Maps' ? 'bg-blue-500/20' : ''} p-1.5 rounded-full group-hover:scale-110 transition-transform duration-200\`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              </div>
              <span className="text-[10px] font-medium">Maps</span>
            </button>
            <button 
              onClick={() => setActiveTab('Chat')}
              className={\`flex flex-col items-center justify-center space-y-1 transition-colors group \${activeTab === 'Chat' ? 'text-blue-500' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}\`}
            >
              <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              <span className="text-[10px] font-medium">AI Chat</span>
            </button>
            <button 
              onClick={() => setActiveTab('Settings')}
              className={\`flex flex-col items-center justify-center space-y-1 transition-colors group \${activeTab === 'Settings' ? 'text-blue-500' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}\`}
            >
              <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span className="text-[10px] font-medium">Settings</span>
            </button>
          </nav>
        </>
      )}
    </div>
  );
}
`;

fs.writeFileSync('src/App.tsx', beforeReturn + newReturnBlock);
