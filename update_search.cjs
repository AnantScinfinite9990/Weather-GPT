const fs = require('fs');

let code = fs.readFileSync('src/components/InteractiveMapView.tsx', 'utf8');

const searchState = `
  const [activeLayer, setActiveLayer] = useState<'radar' | 'wind' | 'temp'>('radar');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(\`https://geocoding-api.open-meteo.com/v1/search?name=\${encodeURIComponent(searchQuery)}&count=5&language=en&format=json\`);
        const data = await res.json();
        if (data.results) {
          setSearchResults(data.results);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Geocoding failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectResult = (r: any) => {
    onLocationSelect({ name: \`\${r.name}, \${r.admin1 || r.country}\`, lat: r.latitude, lng: r.longitude });
    setSearchQuery('');
    setSearchResults([]);
  };
`;

code = code.replace(
  "const [activeLayer, setActiveLayer] = useState<'radar' | 'wind' | 'temp'>('radar');",
  searchState
);

const searchUI = `
        {/* Search Bar Container */}
        <div className="absolute top-14 left-4 right-4 z-[1000]">
          <div className="glass-panel rounded-full flex items-center px-4 py-3 shadow-lg pointer-events-auto">
            <Search className="w-5 h-5 text-[#94A3B8] mr-3" />
            <input 
              type="text" 
              placeholder="Search location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-base flex-1 text-[#F8FAFC] placeholder-[#94A3B8] p-0 focus:outline-none" 
            />
            <button aria-label="Voice Search" className="ml-3 p-1 rounded-full hover:bg-white/10 transition-colors focus:outline-none">
              <Mic className="w-5 h-5 text-[#94A3B8]" />
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="mt-2 glass-panel rounded-2xl overflow-hidden shadow-2xl pointer-events-auto max-h-60 overflow-y-auto">
              {searchResults.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSelectResult(r)}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 flex flex-col transition-colors text-[#F8FAFC] border-b border-white/5 last:border-0"
                >
                  <span className="font-semibold text-sm">{r.name}</span>
                  <span className="text-[11px] text-[#94A3B8]">{r.admin1 ? \`\${r.admin1}, \` : ''}{r.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>
`;

code = code.replace(
  /{[\s\S]*?<LocationSearch[\s\S]*?}/m,
  searchUI
);

// We can safely remove the LocationSearch import
code = code.replace("import { LocationSearch } from './LocationSearch';", "");

fs.writeFileSync('src/components/InteractiveMapView.tsx', code);
