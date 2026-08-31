const fs = require('fs');
let content = fs.readFileSync('src/components/GISMap.tsx', 'utf-8');
content = content.replaceAll(
  "'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'",
  "'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'"
);
fs.writeFileSync('src/components/GISMap.tsx', content);
