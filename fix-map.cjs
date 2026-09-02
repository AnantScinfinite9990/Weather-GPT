const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/InteractiveMapView.tsx', 'utf8');

code = code.replace(
    '      if (isNaN(latStep) || isNaN(lngStep) || latStep === 0 || lngStep === 0) return;\n\n',
    '      const lngStep = (bounds.getEast() - bounds.getWest()) / 6;\n      if (isNaN(latStep) || isNaN(lngStep) || latStep === 0 || lngStep === 0) return;\n'
);

fs.writeFileSync('frontend/src/components/InteractiveMapView.tsx', code);
