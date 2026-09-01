const fs = require('fs');

function fix(filePath) {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');
    
    // In InteractiveMapView.tsx
    if (code.includes('const bounds = map.getBounds();')) {
        code = code.replace(
            'const bounds = map.getBounds();',
            'const bounds = map.getBounds();\n      if (!bounds || !bounds.isValid() || isNaN(bounds.getSouth())) return;'
        );
    }
    
    fs.writeFileSync(filePath, code);
}

fix('frontend/src/components/InteractiveMapView.tsx');
fix('frontend/src/components/GISMap.tsx');
