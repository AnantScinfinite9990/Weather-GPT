# Deployment Guide

This project has been split into a dedicated frontend and backend to allow for separate hosting platforms (e.g., Frontend on Vercel, Backend on Render).

## 1. Directory Structure

- **`/frontend`**: Contains the React + Vite application. It should be deployed to **Vercel**.
- **`/backend`**: Contains the Node.js + Express application. It should be deployed to **Render** (or any other Node.js hosting provider).

---

## 2. Deploying the Backend (Render)

1. Create an account on [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Provide the following settings:
   - **Name**: `weather-backend` (or whatever you prefer)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. **Environment Variables**: 
   - Add `GEMINI_API_KEY` and set it to your Google Gemini API Key.
   - (Optional) Add `PORT` and set it to `3000` or `10000` (Render will default this).
6. Click **Create Web Service**.
7. Once deployed, Render will give you a URL (e.g., `https://weather-backend-xyz.onrender.com`). **Copy this URL**, you will need it for the frontend!

---

## 3. Deploying the Frontend (Vercel)

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** -> **Project**.
3. Import this exact same GitHub repository.
4. **Important configuration steps**:
   - Under **Root Directory**, click "Edit" and select `frontend`.
   - Vercel should auto-detect the **Vite** framework. 
   - Leave the build commands as default (`npm run build` / `dist`).
5. **Environment Variables**:
   - Add a new variable named `VITE_API_URL`
   - Paste the Render backend URL you copied earlier as the value (e.g., `https://weather-backend-xyz.onrender.com`). *Make sure there is no trailing slash (`/`) at the end of the URL!*
6. Click **Deploy**.

## Summary

The frontend will now be securely hosted on Vercel and will make API calls directly to your Render-hosted backend. The backend will handle the Open-Meteo logic and securely interact with the Gemini API.
