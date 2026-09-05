const fs = require('fs');

function patch(file) {
    if(!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');
    
    // Replace alert.coordinates
    code = code.replace(/L\.marker\(alert\.coordinates/g, "(isNaN(Number(alert.coordinates[0])) || isNaN(Number(alert.coordinates[1]))) ? null : L.marker([Number(alert.coordinates[0]), Number(alert.coordinates[1])]");
    code = code.replace(/L\.circle\(alert\.coordinates/g, "L.circle([Number(alert.coordinates[0]) || 0, Number(alert.coordinates[1]) || 0]");

    fs.writeFileSync(file, code);
    console.log("Patched", file);
}

patch('frontend/src/components/GISMap.tsx');

