const fs = require('fs');
let code = fs.readFileSync('frontend/src/App.tsx', 'utf8');

// Imports
code = code.replace("import { Navbar } from './components/Navbar';", "import { Navbar } from './components/Navbar';\nimport { AuthModal } from './components/AuthModal';");

// States
const stateAnchor = "const [isDarkMode, setIsDarkMode] = useState(true);";
const authStates = `const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);`;
code = code.replace(stateAnchor, authStates);

// Pass props to Navbar
code = code.replace(/<Navbar/g, `<Navbar\n            currentUser={currentUser}\n            onOpenAuth={() => setIsAuthModalOpen(true)}\n            onLogout={() => { localStorage.removeItem('token'); setCurrentUser(null); }}`);

// Add AuthModal component inside the main return wrapper
const appContainerAnchor = 'return (\n    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${isDarkMode ? \'dark bg-[#0B1121]\' : \'bg-slate-50\'}`}>';
const modalInject = `return (
    <div className={\`min-h-screen font-sans antialiased transition-colors duration-300 \${isDarkMode ? 'dark bg-[#0B1121]' : 'bg-slate-50'}\`}>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={(username) => setCurrentUser(username)} 
      />`;
code = code.replace(appContainerAnchor, modalInject);

fs.writeFileSync('frontend/src/App.tsx', code);
