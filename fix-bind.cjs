const fs = require('fs');

const file = 'frontend/src/components/GISMap.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Fix user marker bindPopup
const userMarkerRegex = /const marker = \(isNaN\(Number\(currentLocation\.lat\)\) \|\| isNaN\(Number\(currentLocation\.lng\)\)\) \? null : L\.marker\(\[Number\(currentLocation\.lat\), Number\(currentLocation\.lng\)\], \{ icon: pinIcon \}\)\s*\.bindPopup\(`([\s\S]*?)`\);\s*group\.addLayer\(marker\);/m;

code = code.replace(userMarkerRegex, (match, popupContent) => {
    return `const marker = (isNaN(Number(currentLocation.lat)) || isNaN(Number(currentLocation.lng))) ? null : L.marker([Number(currentLocation.lat), Number(currentLocation.lng)], { icon: pinIcon });
    if (marker) {
      marker.bindPopup(\`${popupContent}\`);
      group.addLayer(marker);
    }`;
});

// 2. Fix alert marker bindPopup
const alertMarkerRegex = /circle\.bindPopup\(popupContent\);\s*alertMarker\.bindPopup\(popupContent\);\s*group\.addLayer\(circle\);\s*group\.addLayer\(alertMarker\);/m;

code = code.replace(alertMarkerRegex, `
        circle.bindPopup(popupContent);
        group.addLayer(circle);
        if (alertMarker) {
            alertMarker.bindPopup(popupContent);
            group.addLayer(alertMarker);
        }
`);

fs.writeFileSync(file, code);
console.log("Patched GISMap.tsx");
