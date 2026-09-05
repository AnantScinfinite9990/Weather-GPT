const fs = require('fs');

function patch(file) {
    if(!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');
    
    // Replace L.marker with safety wrapper
    code = code.replace(/L\.marker\(\[([^,]+),\s*([^\]]+)\]/g, (match, lat, lng) => {
        return `(isNaN(Number(${lat})) || isNaN(Number(${lng}))) ? null : L.marker([Number(${lat}), Number(${lng})]`;
    });

    // Replace mapInstanceRef.current.setView([..., ...])
    code = code.replace(/\.setView\(\[([^,]+),\s*([^\]]+)\]/g, (match, lat, lng) => {
        return `.setView([Number(${lat}) || 0, Number(${lng}) || 0]`;
    });

    // Replace L.circle([cell.lat, cell.lng]
    code = code.replace(/L\.circle\(\[([^,]+),\s*([^\]]+)\]/g, (match, lat, lng) => {
        return `L.circle([Number(${lat}) || 0, Number(${lng}) || 0]`;
    });
    
    // Replace L.rectangle
    code = code.replace(/L\.rectangle\(\[\s*\[([^,]+),\s*([^\]]+)\],\s*\[([^,]+),\s*([^\]]+)\]\s*\]/g, (match, lat1, lng1, lat2, lng2) => {
        return `L.rectangle([[Number(${lat1}) || 0, Number(${lng1}) || 0], [Number(${lat2}) || 0, Number(${lng2}) || 0]]`;
    });

    fs.writeFileSync(file, code);
    console.log("Patched", file);
}

patch('frontend/src/components/InteractiveMapView.tsx');
patch('frontend/src/components/GISMap.tsx');

