const fs = require('fs');

function fix(filePath) {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');
    
    // In LocationSearch.tsx
    code = code.replace(
        /onClick=\{\(\) => handleSelect\(\{ name: `\$\{r.name\}, \$\{r.admin1 \|\| r.country\}`\, lat: r.latitude, lng: r.longitude \}\)\}/g,
        "onClick={() => { if (r.latitude !== undefined && r.longitude !== undefined) handleSelect({ name: `${r.name}, ${r.admin1 || r.country}`, lat: r.latitude, lng: r.longitude }) }}"
    );
    
    // In InteractiveMapView.tsx
    code = code.replace(
        /onLocationSelect\(\{ name: `\$\{r.name\}, \$\{r.admin1 \|\| r.country\}`\, lat: r.latitude, lng: r.longitude \}\);/g,
        "if (r.latitude !== undefined && r.longitude !== undefined) onLocationSelect({ name: `${r.name}, ${r.admin1 || r.country}`, lat: r.latitude, lng: r.longitude });"
    );
    
    fs.writeFileSync(filePath, code);
}

fix('frontend/src/components/LocationSearch.tsx');
fix('frontend/src/components/InteractiveMapView.tsx');
