# Core Functions Definition

Below are the names and basic working definitions of the primary functions powering the WeatherGPT application.

## `App.tsx` (Main Controller)
*   **`fetchWeather(loc: Coordinates)`**: Asynchronously fetches live or mocked meteorological data from the backend based on latitude and longitude. Updates `weatherData` state.
*   **`handleLocationSelect(loc: Coordinates)`**: Updates the global location state and implicitly triggers a new weather fetch via `useEffect`.
*   **`handlePersonaChange(persona: PersonaType)`**: Updates the active AI persona (e.g., Farmer, Aviator) and injects an automated system welcome message into the chat history reflecting the new context.
*   **`handleSendMessage(text: string)`**: Packages the user's chat message with the current system state (language, persona, weather context) and POSTs it to the AI backend. Handles UI loading states and auto-triggers TTS upon response.
*   **`handleOpenSOSModalWithContext(text: string)`**: Intercepts high-severity AI responses (e.g., flood warnings) and opens the Emergency Broadcast modal, pre-filling the payload text with a truncated version of the AI's warning.

## `WeatherChatWorkbench.tsx` & `ChatBubble.tsx`
*   **`handleSubmit(e: React.FormEvent)`**: Prevents default form submission, extracts input text, clears the input field, and delegates to the parent `onSendMessage` prop.

## `GISMap.tsx`
*   **`toggleLayer(layer: 'radar' | 'wind' | 'alerts')`**: Toggles boolean states in the `activeLayers` object to show/hide specific Leaflet tile or vector layers.
*   **`useEffect (Map Initialization & Radar Loop)`**: 
    1.  Initializes the Leaflet map instance and attaches it to the DOM ref.
    2.  Manages a `setInterval` that cycles the `radarFrame` state (0-4) every 1000ms if `isRadarPlaying` is true, creating the animated Doppler radar effect.

## `EmergencyBroadcastModal.tsx`
*   **`handleDispatch()`**: Simulates a network request to an emergency gateway. Sets `isDispatching` to true, waits 2.5 seconds, and then generates a randomized `dispatchResult` object containing delivery metrics and a fake batch ID.
*   **`handleReset()`**: Clears the dispatch success state and resets the form to allow sending another emergency advisory.

## `Navbar.tsx`
*   **`onToggleTheme()`**: Triggers the global light/dark mode switch, updating the DOM and persisting user preference.
*   **`onLanguageChange(lang: LanguageCode)`**: Selects the active regional language, impacting UI translations and TTS/STT configuration.

## `useVoiceAssistant.ts` (Custom Hook)
*   **`startListening()`**: Initializes the Web Speech API `SpeechRecognition` interface, capturing microphone input and converting it to text.
*   **`stopListening()`**: Halts the microphone capture.
*   **`speak(text: string)`**: Initializes the `SpeechSynthesisUtterance` API, applying the selected language's voice profile, and reads the provided text aloud.
*   **`stopSpeaking()`**: Immediately cancels any ongoing TTS audio output.
