const fs = require('fs');

function patchFile(filePath) {
    let code = fs.readFileSync(filePath, 'utf8');
    
    // In InteractiveMapView.tsx, add a check for valid bounds and steps
    if (code.includes('const latStep = (bounds.getNorth() - bounds.getSouth()) / 6;')) {
        code = code.replace(
            'const latStep = (bounds.getNorth() - bounds.getSouth()) / 6;',
            'const latStep = (bounds.getNorth() - bounds.getSouth()) / 6;\n      if (isNaN(latStep) || isNaN(lngStep) || latStep === 0 || lngStep === 0) return;'
        );
    }
    
    // In GISMap.tsx
    if (code.includes('const radarCells = [')) {
        code = code.replace(
            'const radarCells = [',
            'if (isNaN(currentLocation.lat) || isNaN(currentLocation.lng)) return;\n      const radarCells = ['
        );
    }
    
    fs.writeFileSync(filePath, code);
}

patchFile('frontend/src/components/InteractiveMapView.tsx');
patchFile('frontend/src/components/GISMap.tsx');
