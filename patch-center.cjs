const fs = require('fs');

function patch(file) {
    if(!fs.existsSync(file)) return;
    let code = fs.readFileSync(file, 'utf8');
    
    code = code.replace(
        /center:\s*\[([^,]+),\s*([^\]]+)\]/g,
        (match, lat, lng) => {
            return `center: [Number(${lat}) || 0, Number(${lng}) || 0]`;
        }
    );

    fs.writeFileSync(file, code);
    console.log("Patched", file);
}

patch('frontend/src/components/GISMap.tsx');

