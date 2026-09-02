# Full-Stack Deployment Guide: Vercel (Frontend) + Render (Backend) + MongoDB

When moving from a local development environment to production, a common and highly scalable architecture is to split your app:
1. **Frontend (React/Vite)** hosted on **Vercel** (fast edge CDN for static assets).
2. **Backend (Node/Express)** hosted on **Render** (great for running Node servers).
3. **Database** hosted on **MongoDB Atlas**.

Here is the step-by-step guide to deploying and linking all three.

---

## Step 1: Prepare Your Code for Production

Before deploying, you need to ensure your frontend and backend can talk to each other across different domains.

### 1. Backend CORS Configuration (`backend/server.ts`)
Since your frontend and backend will be on different domains, you must configure CORS on the backend to accept requests from your future Vercel URL.

```typescript
import cors from 'cors';

// In production, you will change this to your Vercel URL
const allowedOrigins = [
  'http://localhost:3000', 
  process.env.FRONTEND_URL // e.g., https://my-weather-app.vercel.app
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### 2. Frontend API Calls (`frontend/src/`)
Instead of hardcoding `http://localhost:3001` or `/api` in your frontend `fetch` calls, use Vite environment variables so it dynamically points to Render in production.

Change your fetch calls from:
`fetch('/api/weather/current')`
To:
`fetch(`${import.meta.env.VITE_API_URL}/api/weather/current`)`

---

## Step 2: Push to GitHub
Both Vercel and Render work best by connecting to a Git repository.
1. Create a repository on GitHub.
2. Push your entire project (the root folder containing both `frontend` and `backend`).

---

## Step 3: Configure MongoDB Atlas for Production

1. Log into [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Network Access**.
3. Ensure you have an entry for `0.0.0.0/0` (Allow Access from Anywhere). Render's outgoing IPs change dynamically, so whitelisting all IPs is the standard approach unless you purchase a static IP addon.
4. Keep your **Connection String** handy.

---

## Step 4: Deploy the Backend to Render

1. Create an account at [Render.com](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your repository.
4. Configure the Web Service:
   - **Name**: `weather-backend`
   - **Root Directory**: `backend` (This tells Render to only look at the backend folder).
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build` (Depends on your setup, ensure it compiles TS to JS).
   - **Start Command**: `npm start` (or `node dist/server.cjs`).
5. **Environment Variables**:
   Scroll down and add your env variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `GEMINI_API_KEY`: Your Gemini key.
   - `FRONTEND_URL`: Leave blank for a moment (we will get this from Vercel in the next step, then come back here).
6. Click **Create Web Service**. 
7. Once it deploys, copy the Render URL (e.g., `https://weather-backend-xyz.onrender.com`).

---

## Step 5: Deploy the Frontend to Vercel

1. Create an account at [Vercel.com](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Configure the Project:
   - **Project Name**: `weather-frontend`
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and select `frontend`.
5. **Environment Variables**:
   - Add `VITE_API_URL` and set the value to your Render backend URL (e.g., `https://weather-backend-xyz.onrender.com`). *Do not include a trailing slash.*
6. Click **Deploy**.
7. Once finished, Vercel will give you a public URL (e.g., `https://weather-frontend.vercel.app`).

---

## Step 6: Final Wiring (The "Handshake")

Now that both are live, you just need to tell the backend to trust the Vercel frontend.

1. Copy your Vercel URL (e.g., `https://weather-frontend.vercel.app`).
2. Go back to your **Render** dashboard -> Select your Backend service -> Go to **Environment**.
3. Update/Add the `FRONTEND_URL` variable and paste your Vercel URL.
4. Render will automatically redeploy the backend with the new environment variable.

### 🎉 Success!
Your architecture is now fully linked:
1. User visits **Vercel** URL.
2. Vercel serves the React app.
3. React app makes an API request to the **Render** URL (`VITE_API_URL`).
4. Render handles the request, communicates with **MongoDB Atlas**, and sends data back to the user.
