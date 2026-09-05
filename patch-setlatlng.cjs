const fs = require('fs');

function patch(file) {
    if(!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');
    
    code = code.replace(
        /\.setLatLng\(\[([^,]+),\s*([^\]]+)\]\)/g,
        (match, lat, lng) => {
            return `.setLatLng([Number(${lat}) || 0, Number(${lng}) || 0])`;
        }
    );

    fs.writeFileSync(file, code);
    console.log("Patched", file);
}

patch('frontend/src/components/InteractiveMapView.tsx');

