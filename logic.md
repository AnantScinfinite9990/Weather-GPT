# Application Logic & Flow

This document explains the core knowledge domains, architectural approaches, data flows, and algorithms utilized in WeatherGPT.

## 1. Domain Knowledge Utilized
- **Meteorology & NWP (Numerical Weather Prediction)**: Concepts like CAPE (Convective Available Potential Energy), Cloud Base AGL (Above Ground Level), WRF-India 3km grid, and GFS 0.25° high-res runs are simulated and presented to provide authoritative weather contexts.
- **Geographic Information Systems (GIS)**: Use of bounding boxes, geospatial coordinates (Lat/Lng), base map tiles (Satellite vs. Dark Matter), and overlay layering (Doppler Radar, Wind Vectors).
- **Generative AI Contextualization**: Prompt engineering techniques that combine structured system contexts (e.g., "Act as an Aviation Dispatcher") with live dynamic variables (current temperature, wind speed, severe alerts) before sending to the LLM.

## 2. Architectural Approaches
- **Single Source of Truth (Lifting State Up)**: The `App.tsx` component acts as the global state orchestrator. It holds the `currentLocation`, `currentPersona`, `weatherData`, and `messages` array. It passes these down as props to the Dashboard, Map, and Chat Workbench.
- **Separation of Concerns**: UI components are strictly presentational or handle localized UI state (like the SOS Modal dispatch status), while complex logic (like fetching weather or contacting the Gemini AI) happens at the top level or via custom hooks (e.g., `useVoiceAssistant`).
- **Frosted Glass / Glassmorphism**: Achieved via Tailwind's `backdrop-blur-*` and semi-transparent background colors (`bg-slate-900/90` or `bg-white/5`), layered over absolute positioned background gradients. Theme states are managed via the `.dark` class dynamically applied to the `<body>` or `<html>` tag.

## 3. Data & Interaction Flow
1. **Location Selection**: User changes location via `Navbar.tsx`.
2. **Telemetry Fetch**: `App.tsx` triggers `fetchWeather()` which queries the backend API to retrieve meteorological data for the new coordinates.
3. **Context Update**: The fetched `weatherData` updates the `WeatherDashboard` and is injected into the AI context memory.
4. **User Query**: User speaks or types a query in `WeatherChatWorkbench.tsx`.
5. **AI Processing**: 
   - The message, along with the `currentPersona`, `currentLang`, and `weatherData` context, is sent to `/api/chat/intelligence`.
   - The backend structures a prompt combining the persona instructions, live telemetry, and the user's prompt.
   - The backend queries the Gemini API.
6. **Response & TTS**: The AI response is appended to the chat. If the user used Voice input, the `speak()` function automatically reads the response aloud.

## 4. Key Algorithms & Simulations
- **Radar Loop Animation Algorithm (GISMap.tsx)**:
  - *Logic*: Simulates a time-series Doppler radar playback.
  - *Implementation*: A `setInterval` cycles a state variable `radarFrame` from 0 to 4. Each frame alters the radius and opacity of the Leaflet circles to mimic storm cell movement and intensification over a T-60 minute window.
- **SOS Delivery Calculation (EmergencyBroadcastModal.tsx)**:
  - *Logic*: Calculates estimated reach and delivery probability based on selected dissemination channels.
  - *Implementation*: Base citizens reached (~35,000) is multiplied by a weighted coefficient depending on which checkboxes are active (SMS=0.8, WhatsApp=0.6, Sirens=0.9). A mock asynchronous dispatch delay `setTimeout` simulates network latency before resolving the success state.
- **Theme Propagation (Tailwind v4)**:
  - *Logic*: Ensures dynamic switching without flash-of-unstyled-content.
  - *Implementation*: React state toggles a `.dark` class on the DOM root, which triggers Tailwind's `@custom-variant dark` rules defined in `index.css`, instantly flipping all `dark:bg-*` and `dark:text-*` classes across the component tree.
