# API Integrations & Endpoints

This document outlines the internal REST APIs exposed by the Express backend, as well as the external integrations.

## 1. Internal Endpoints

### `GET /api/weather/current`
*   **Purpose**: Retrieves live or simulated meteorological telemetry for a specific location.
*   **Query Parameters**:
    *   `lat` (number): Latitude.
    *   `lon` (number): Longitude.
    *   `name` (string): Region name.
*   **Response Structure (JSON)**:
    ```json
    {
      "temp": 34,
      "feelsLike": 38,
      "humidity": 65,
      "condition": "Partly Cloudy",
      "nwpModel": {
        "cape": 1850,
        "cloudBaseAGL": 1200
      }
      // ... extended metrics
    }
    ```

### `POST /api/chat/intelligence`
*   **Purpose**: Processes user queries against the Gemini AI model, injected with real-time weather context.
*   **Request Payload (JSON)**:
    ```json
    {
      "prompt": "Is it safe to spray pesticides today?",
      "history": [...previous messages...],
      "persona": "Farmer",
      "lang": "en",
      "weatherContext": { ...data from /api/weather/current... }
    }
    ```
*   **Response Structure (JSON)**:
    ```json
    {
      "text": "Based on the current wind speed of 12 km/h and 30% chance of rain, it is generally safe to spray, but complete it before 4 PM when wind gusts are forecasted to increase."
    }
    ```

## 2. External Integrations
*   **Google Gemini API**: Utilized via the `@google/genai` Node SDK. The backend structures the system instructions dynamically based on the requested `persona` and attaches the `weatherContext` as a structured data string, grounding the LLM's answers in real meteorological facts.
*   *(Future/Mocked)* **IMD / Open-Meteo**: The `/api/weather/current` route is designed to easily swap out its internal mock generator for real live REST calls to open meteorological services.
