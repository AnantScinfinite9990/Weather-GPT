# WeatherGPT: AI-Powered Meteorological & Disaster Response Core

WeatherGPT is a sophisticated, full-stack web application designed to synthesize complex Numerical Weather Prediction (NWP) models, live GIS telemetry, and generative AI into actionable intelligence. 

It provides hyper-localized insights customized for various personas, including farmers, disaster management officials, aviation dispatchers, and researchers.

## Core Features

- **Interactive GIS Synoptic Map**: Live radar reflectivity simulation, wind vectors, and severe weather alert polygons powered by Leaflet.
- **Multilingual AI Assistant**: Context-aware chat powered by Gemini AI, featuring text-to-speech (TTS) and speech-to-text (STT) for regional languages.
- **Persona-Driven Contexts**: Dynamic system prompts customized for specific use cases (Agro-Advisory, Aviation Briefings, Disaster Early Warnings).
- **Decadal Climate Analytics**: Visualizations of 10-year baseline deviations and climate anomalies using Recharts.
- **Emergency SOS Broadcast**: A simulated multi-channel disaster dispatch system (GSM SMS, WhatsApp, Sirens, CAP Feed).
- **Responsive & Accessible UI**: Light/Dark theme toggling, frosted glass UI, and mobile-first responsive design using Tailwind CSS v4.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React (Icons)
- **Mapping & Charts**: Leaflet (react-leaflet), Recharts
- **Backend/AI Integration**: Node.js/Express (server-side wrapper for API proxying), Google Gemini API
- **Deployment**: Configured for containerized cloud deployment (Cloud Run).

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Architecture

The application is built on a modular React architecture, separating concerns into:
- **`App.tsx`**: Main state controller (Location, Persona, Language, AI Chat History).
- **`GISMap.tsx`**: Encapsulates Leaflet logic and map layers.
- **`WeatherChatWorkbench.tsx`**: Manages the AI chat interface, voice interactions, and persona switching.
- **`WeatherDashboard.tsx`**: Displays NWP telemetry, CAPE index, and agro-advisories.
- **`EmergencyBroadcastModal.tsx`**: Handles the SOS dispatch flow.
