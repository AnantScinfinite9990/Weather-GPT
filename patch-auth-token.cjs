const fs = require('fs');
let code = fs.readFileSync('backend/server.ts', 'utf8');

const registerTarget = "res.json({ success: true, userId: user._id });";
const registerPatch = "const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });\n    res.json({ success: true, userId: user._id, token, username });";

code = code.replace(registerTarget, registerPatch);
fs.writeFileSync('backend/server.ts', code);
