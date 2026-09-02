const fs = require('fs');
let code = fs.readFileSync('backend/server.ts', 'utf8');

const importReplacement = `import { GoogleGenAI } from '@google/genai';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from './src/models/User';
import { ChatHistory } from './src/models/ChatHistory';`;

code = code.replace("import { GoogleGenAI } from '@google/genai';", importReplacement);

const dbSetup = `// -------------------------------------------------------------
// DATABASE SETUP (MongoDB)
// -------------------------------------------------------------
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));
} else {
  console.log('No MONGODB_URI found. Skipping database connection.');
}

// -------------------------------------------------------------
// AUTHENTICATION & CHAT ENDPOINTS
// -------------------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
  if (!process.env.MONGODB_URI) return res.status(503).json({ error: 'Database not configured' });
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });
    res.json({ success: true, userId: user._id });
  } catch (err: any) {
    if (err.code === 11000) return res.status(400).json({ error: 'User already exists' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  if (!process.env.MONGODB_URI) return res.status(503).json({ error: 'Database not configured' });
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const secret = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';
      const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '7d' });
      res.json({ token, email });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to verify JWT tokens
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const secret = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';
  jwt.verify(token, secret, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

app.get('/api/chat/history', authenticateToken, async (req: any, res: any) => {
  if (!process.env.MONGODB_URI) return res.status(503).json({ error: 'Database not configured' });
  try {
    const history = await ChatHistory.findOne({ userId: req.user.userId });
    res.json({ messages: history?.messages || [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

app.post('/api/chat/history', authenticateToken, async (req: any, res: any) => {
  if (!process.env.MONGODB_URI) return res.status(503).json({ error: 'Database not configured' });
  const { messages } = req.body;
  
  try {
    await ChatHistory.findOneAndUpdate(
      { userId: req.user.userId },
      { messages, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save history' });
  }
});

// -------------------------------------------------------------
// WEATHER DATA SERVICE & HEURISTIC NWP SIMULATOR`;

code = code.replace('// -------------------------------------------------------------\n// WEATHER DATA SERVICE & HEURISTIC NWP SIMULATOR', dbSetup);

fs.writeFileSync('backend/server.ts', code);
