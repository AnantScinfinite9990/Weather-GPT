const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/Navbar.tsx', 'utf8');

const interfaceReplacement = `interface NavbarProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  activeAlerts: WeatherAlert[];
  currentLocation: Coordinates;
  onLocationSelect: (loc: Coordinates) => void;
  onOpenSOSModal: () => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  presetRegions?: Coordinates[];
  currentUser?: string | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}`;
code = code.replace(/interface NavbarProps \{[\s\S]*?presetRegions\?: Coordinates\[\];\n\}/, interfaceReplacement);

const propsReplacement = `export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeAlerts,
  currentLocation,
  onLocationSelect,
  onOpenSOSModal,
  isSpeaking,
  onStopSpeaking,
  isDarkMode,
  onToggleTheme,
  presetRegions,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {`;
code = code.replace(/export const Navbar: React\.FC<NavbarProps> = \(\{[\s\S]*?presetRegions,\n\}\) => \{/, propsReplacement);

const buttonAnchor = `{/* SOS Broadcast Button with Frosted Red Glass Style */}`;
const authButtons = `{/* Auth Controls */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Hi, {currentUser}
              </span>
              <button
                onClick={onLogout}
                className="text-xs font-medium bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="text-xs font-semibold bg-cyan-600 hover:bg-cyan-700 text-white px-3 sm:px-4 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                Log In
              </button>
            </div>
          )}

          {/* SOS Broadcast Button with Frosted Red Glass Style */}`;
code = code.replace(buttonAnchor, authButtons);

fs.writeFileSync('frontend/src/components/Navbar.tsx', code);
