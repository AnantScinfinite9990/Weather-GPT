const fs = require('fs');

function patch(file) {
    if(!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');
    
    // Fix GISMap.tsx user marker
    code = code.replace(
        /const marker = \(isNaN\(Number\(currentLocation\.lat\)\) \|\| isNaN\(Number\(currentLocation\.lng\)\)\) \? null : L\.marker\(\[Number\(currentLocation\.lat\), Number\(currentLocation\.lng\)\], \{ icon: pinIcon \}\)\s*\.bindPopup\([\s\S]*?\);\s*if \(marker\) \{[^}]*\}\s*/g,
        ''
    ); // Delete it and I will rewrite it below? No, it doesn't have an `if (marker)` check currently.
    
    fs.writeFileSync(file, code);
    console.log("Patched", file);
}

patch('frontend/src/components/GISMap.tsx');

