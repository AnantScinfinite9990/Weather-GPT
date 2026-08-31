# Frontend Architecture

WeatherGPT's frontend is built for performance, modularity, and real-time interaction.

## 1. Tech Stack
*   **Core Framework**: React 19 (Functional Components, Hooks).
*   **Build Tool**: Vite (Extremely fast HMR and optimized production builds).
*   **Language**: TypeScript (Strict typing for meteorological data structures and chat payloads).
*   **Styling**: Tailwind CSS v4 (Utility-first CSS, configured for custom variants and custom animations).
*   **Icons**: Lucide React (Consistent, clean SVG iconography).

## 2. State Management Strategy
Instead of relying on heavy third-party state managers (like Redux), the application utilizes **Lifting State Up**:
*   The `App.tsx` file acts as the global state orchestrator.
*   It manages core states: `currentLocation`, `currentPersona`, `weatherData`, `messages`, and `currentLang`.
*   These states are passed down via props to specialized child components (`Navbar`, `GISMap`, `WeatherDashboard`, `WeatherChatWorkbench`).

## 3. Component Modularity
The codebase is strictly modular to avoid bloated files and ensure maintainability:
*   **`/components/`**:
    *   `AnalyticsChart.tsx`: Encapsulates Recharts rendering.
    *   `GISMap.tsx`: Encapsulates Leaflet map instances and custom overlays.
    *   `WeatherDashboard.tsx`: Pure presentational component for weather metrics.
    *   `ChatBubble.tsx` & `WeatherChatWorkbench.tsx`: Handles complex chat UI and voice states.

## 4. Accessibility & Web APIs
*   **Web Speech API**: Custom hook (`useVoiceAssistant.ts`) interfaces with the browser's native `SpeechRecognition` and `SpeechSynthesis` APIs. This allows for multi-lingual Voice-to-Text and Text-to-Voice capabilities without requiring external paid APIs.
*   **Responsive Design**: Fluid typography and spacing using Tailwind's `sm:`, `md:`, and `lg:` prefixes.
