const fs = require('fs');

function fix(filePath) {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');
    
    code = code.replace(
        /const handleLocationSelect = \(loc: Coordinates\) => \{\n    setCurrentLocation\(loc\);\n  \};/g,
        "const handleLocationSelect = (loc: Coordinates) => {\n    if (!loc || isNaN(loc.lat) || isNaN(loc.lng)) return;\n    setCurrentLocation(loc);\n  };"
    );
    
    fs.writeFileSync(filePath, code);
}

fix('frontend/src/App.tsx');
