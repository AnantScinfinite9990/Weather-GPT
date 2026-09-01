const fs = require('fs');
function patch(file) {
    if(!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');
    
    // Replace L.marker([...]) with a safe wrapper or just add a check
    code = code.replace(/L\.marker\(\[([^,]+),\s*([^\]]+)\]/g, (match, lat, lng) => {
        return `(isNaN(${lat}) || isNaN(${lng}) ? null : L.marker([${lat}, ${lng}]`;
    });
    
    // For object based coordinates like L.marker(alert.coordinates
    // Let's just do a global try-catch around setView and marker
    
    fs.writeFileSync(file, code);
}
