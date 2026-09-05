const fs = require('fs');

function patch(file) {
    if(!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');
    
    code = code.replace(
        /const handleLocationSelect = \(loc: Coordinates\) => \{[\s\S]*?setCurrentLocation\(loc\);\s*\};/m,
        `const handleLocationSelect = (loc: Coordinates) => {
    if (!loc || isNaN(Number(loc.lat)) || isNaN(Number(loc.lng))) return;
    setCurrentLocation({ ...loc, lat: Number(loc.lat), lng: Number(loc.lng) });
  };`
    );

    fs.writeFileSync(file, code);
    console.log("Patched", file);
}

patch('frontend/src/App.tsx');

