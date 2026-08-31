const fs = require('fs');
let content = fs.readFileSync('src/components/GISMap.tsx', 'utf-8');
content = content.replace(
  ">              Dark Matter            </button>",
  ">              OSM Map            </button>"
);
fs.writeFileSync('src/components/GISMap.tsx', content);
