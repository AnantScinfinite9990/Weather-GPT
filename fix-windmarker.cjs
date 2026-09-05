const fs = require('fs');
const file = 'frontend/src/components/GISMap.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    /const windMarker = \(isNaN\(Number\(windLat\)\) \|\| isNaN\(Number\(windLng\)\)\) \? null : L\.marker\(\[Number\(windLat\), Number\(windLng\)\], \{ icon: windIcon \}\);\s*group\.addLayer\(windMarker\);/g,
    `if (!isNaN(Number(windLat)) && !isNaN(Number(windLng))) {
          const windMarker = L.marker([Number(windLat), Number(windLng)], { icon: windIcon });
          group.addLayer(windMarker);
        }`
);

fs.writeFileSync(file, code);
console.log("Patched GISMap.tsx");
