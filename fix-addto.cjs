const fs = require('fs');
const file = 'frontend/src/components/InteractiveMapView.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    /\(isNaN\(Number\(lat \+ latStep\/2\)\) \|\| isNaN\(Number\(lng \+ lngStep\/2\)\)\) \? null : L\.marker\(\[Number\(lat \+ latStep\/2\), Number\(lng \+ lngStep\/2\)\], \{ icon: ([a-zA-Z]+), interactive: false \}\)\.addTo\(group\);/g,
    (match, iconName) => {
        return `if (!isNaN(Number(lat + latStep/2)) && !isNaN(Number(lng + lngStep/2))) { L.marker([Number(lat + latStep/2), Number(lng + lngStep/2)], { icon: ${iconName}, interactive: false }).addTo(group); }`;
    }
);

code = code.replace(
    /markerRef\.current = \(isNaN\(Number\(currentLocation\.lat\)\) \|\| isNaN\(Number\(currentLocation\.lng\)\)\) \? null : L\.marker\(\[Number\(currentLocation\.lat\), Number\(currentLocation\.lng\)\], \{ icon: customIcon \}\)\.addTo\(mapInstanceRef\.current\);/g,
    `if (!isNaN(Number(currentLocation.lat)) && !isNaN(Number(currentLocation.lng))) { markerRef.current = L.marker([Number(currentLocation.lat), Number(currentLocation.lng)], { icon: customIcon }).addTo(mapInstanceRef.current); } else { markerRef.current = null; }`
);

fs.writeFileSync(file, code);
console.log("Patched InteractiveMapView.tsx");
