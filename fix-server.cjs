const fs = require('fs');
let code = fs.readFileSync('backend/server.ts', 'utf8');

if (!code.includes('express.static')) {
    code = code.replace(
        '// Start the server',
        `// Serve static files from frontend/dist
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// Start the server`
    );
    fs.writeFileSync('backend/server.ts', code);
}
