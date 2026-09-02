const fs = require('fs');
let code = fs.readFileSync('backend/server.ts', 'utf8');

code = code.replace(
    'import { fileURLToPath } from \'url\';\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname = path.dirname(__filename);\nconst frontendDist = path.join(__dirname, \'../../frontend/dist\');',
    `const frontendDist = path.join(process.cwd(), 'frontend/dist');`
);

fs.writeFileSync('backend/server.ts', code);
