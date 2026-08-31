# AI Model & Synoptic Weather

WeatherGPT leverages Large Language Models (LLMs) not just as chatbots, but as **meteorological translation engines**.

## 1. The Model
The application utilizes Google's **Gemini AI** (via `gemini-2.5-flash` or similar rapid-inference models). Flash models are prioritized due to the need for low-latency conversational responses during critical, time-sensitive disaster scenarios.

## 2. Handling Synoptic Weather Data
Synoptic weather refers to large-scale weather systems (cyclones, high-pressure zones). Modern forecasting uses NWP (Numerical Weather Prediction) grids that output highly technical variables:
*   **CAPE (Convective Available Potential Energy)**: Measures atmospheric instability.
*   **Cloud Base AGL (Above Ground Level)**: Critical for aviation.
*   **Soil Moisture & Precipitation Rates**.

**The Challenge**: A farmer or local official does not know how to interpret "CAPE of 2500 J/kg". 

**The AI Solution**:
The backend intercepts these raw JSON metrics from the weather API and feeds them into Gemini's `systemInstruction`. The LLM acts as a translator.

## 3. Persona-Driven Prompt Engineering
To prevent the AI from generating generic answers, the system employs **Dynamic Personas**:

1.  **Farmer (Agro-Advisory)**: The prompt instructs the LLM to analyze soil moisture and precipitation to generate advice on irrigation, harvest windows, and pesticide spraying.
2.  **Aviator**: The LLM is instructed to format responses like METAR/TAF briefings, analyzing wind shear and cloud ceilings for flight safety.
3.  **Disaster Manager**: The LLM focuses strictly on CAPE indices, rain accumulation, and flash flood risks, generating evacuation perimeters and emergency broadcast payloads.

## 4. Grounding and Hallucination Prevention
To prevent the LLM from inventing weather forecasts (hallucination):
*   The `weatherContext` is explicitly provided in the API payload.
*   The system prompt explicitly commands: *"Rely ONLY on the provided meteorological JSON data to answer the user. Do not invent weather metrics."*
*   If data is missing, the LLM is instructed to state that the telemetry is unavailable.
