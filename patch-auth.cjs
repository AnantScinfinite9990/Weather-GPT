const fs = require('fs');
let userCode = fs.readFileSync('backend/src/models/User.ts', 'utf8');
userCode = userCode.replace('email: {', 'username: {');
fs.writeFileSync('backend/src/models/User.ts', userCode);

let serverCode = fs.readFileSync('backend/server.ts', 'utf8');
serverCode = serverCode.replace(/const \{ email, password \} = req\.body;/g, 'const { username, password } = req.body;');
serverCode = serverCode.replace(/if \(!email \|\| !password\) return res\.status\(400\)\.json\(\{ error: 'Missing email or password' \}\);/g, "if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });");
serverCode = serverCode.replace(/const user = await User\.create\(\{ email, passwordHash \}\);/g, 'const user = await User.create({ username, passwordHash });');
serverCode = serverCode.replace(/const user = await User\.findOne\(\{ email \}\);/g, 'const user = await User.findOne({ username });');
serverCode = serverCode.replace(/res\.json\(\{ token, email \}\);/g, 'res.json({ token, username });');
fs.writeFileSync('backend/server.ts', serverCode);
