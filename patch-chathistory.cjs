const fs = require('fs');
let code = fs.readFileSync('backend/src/models/ChatHistory.ts', 'utf8');
code = code.replace("enum: ['user', 'model', 'assistant']", "enum: ['user', 'model', 'assistant', 'ai', 'system']");
fs.writeFileSync('backend/src/models/ChatHistory.ts', code);
