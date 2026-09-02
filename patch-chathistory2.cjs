const fs = require('fs');
let code = fs.readFileSync('backend/src/models/ChatHistory.ts', 'utf8');
code = code.replace("timestamp: { type: Date, default: Date.now }", "timestamp: { type: String }");
code = code.replace(/content: \{ type: String, required: true \}/g, "content: { type: String, required: true },\n    id: String,\n    persona: String,\n    lang: String");
fs.writeFileSync('backend/src/models/ChatHistory.ts', code);
