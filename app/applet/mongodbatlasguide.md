# MongoDB Atlas & Authentication Setup Guide

This guide explains step-by-step how to integrate a MongoDB Atlas database into WeatherGPT to support user authentication and chat history storage.

## Part 1: MongoDB Atlas Setup (The Website)

### 1. Create a Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up or log in.
2. Click **Build a Database**.
3. Choose the **M0 Free** (Shared) tier.
4. Select a cloud provider (e.g., AWS, GCP) and a region closest to your users.
5. Click **Create Cluster**.

### 2. Configure Database Access (User Credentials)
1. In the left sidebar, under **Security**, click **Database Access**.
2. Click **Add New Database User**.
3. Select **Password** for the authentication method.
4. Enter a username (e.g., `weather_admin`) and a strong password. **Save this password**, you will need it for your `.env` file later.
5. Under **Database User Privileges**, select **Read and write to any database** (or restrict it to a specific database name).
6. Click **Add User**.

### 3. Configure Network Access (IP Whitelist)
1. In the left sidebar, click **Network Access**.
2. Click **Add IP Address**.
3. To allow access from anywhere (highly recommended for serverless/cloud environments like the AI Studio preview environment), click **Allow Access From Anywhere** (which inserts `0.0.0.0/0`).
4. Click **Confirm**.

### 4. Get Your Connection String
1. Go back to **Database** (under Deployment in the sidebar).
2. Click the **Connect** button next to your cluster.
3. Choose **Drivers** (Connect your application).
4. Copy the connection string. It will look something like this:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
5. Replace `<username>` and `<password>` with the credentials you created in Step 2. (Also append a database name before the `?`, like `...mongodb.net/weathergpt?...`).

---

## Part 2: Backend Setup (WeatherGPT)

### 1. Install Dependencies
You will need `mongoose` (for MongoDB object modeling), `bcrypt` (for password hashing), and `jsonwebtoken` (for auth tokens). Run this in the terminal:

```bash
npm install mongoose bcrypt jsonwebtoken --prefix backend
npm install @types/bcrypt @types/jsonwebtoken -D --prefix backend
```

### 2. Environment Variables
Add your connection string and a secret key to your backend's `.env` file:
```env
MONGODB_URI=mongodb+srv://weather_admin:your_password@cluster0.mongodb.net/weathergpt?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Database Structure (Mongoose Schemas)
Create a new folder `backend/src/models` and create two files to structure your database:

**`backend/src/models/User.ts`**
```typescript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
```

**`backend/src/models/ChatHistory.ts`**
```typescript
import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{
    role: { type: String, enum: ['user', 'model', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  updatedAt: { type: Date, default: Date.now }
});

export const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
```

### 4. Connecting in `backend/server.ts`
Import mongoose and connect it at the top of your `server.ts` file:
```typescript
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));
```

---

## Part 3: Authentication & Chat APIs

Create routes in `backend/server.ts` to handle Login, Registration, and Chat history:

```typescript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from './models/User';
import { ChatHistory } from './models/ChatHistory';

// Registration Endpoint
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ email, passwordHash });
    res.json({ success: true, userId: user._id });
  } catch (err) {
    res.status(400).json({ error: 'User already exists' });
  }
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.passwordHash)) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.json({ token, email });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Middleware to verify JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Save Chat History Endpoint
app.post('/api/chat/history', authenticateToken, async (req, res) => {
  const { messages } = req.body;
  const userId = req.user.userId;
  
  await ChatHistory.findOneAndUpdate(
    { userId },
    { messages, updatedAt: new Date() },
    { upsert: true, new: true } // Creates document if it doesn't exist
  );
  res.json({ success: true });
});
```

---

## Part 4: Frontend Implementation

### 1. The UI (Login Button)
In your frontend, add a Login/Register button to your `Navbar.tsx` or `SettingsView.tsx`. When clicked, it should open a modal with an Email and Password input.

### 2. Storing the Token
When the user successfully logs in via the `/api/auth/login` endpoint, save their token to `localStorage`:
```typescript
const handleLogin = async () => {
  const res = await fetch('/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) {
     localStorage.setItem('auth_token', data.token);
     localStorage.setItem('user_email', data.email);
  }
};
```

### 3. Securing Requests
Whenever the frontend needs to fetch or save chat history, retrieve the token from local storage and include it in the headers:
```typescript
const saveChatHistory = async (messages) => {
  const token = localStorage.getItem('auth_token');
  if (!token) return; // User isn't logged in

  await fetch('/api/chat/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ messages })
  });
};
```
