# Backend Architecture

The backend of WeatherGPT acts as a secure Backend-For-Frontend (BFF) layer, responsible for proxying requests, protecting secrets, and compiling production assets.

## 1. Tech Stack
*   **Runtime**: Node.js
*   **Web Framework**: Express.js (v4)
*   **Bundler**: Esbuild
*   **AI SDK**: `@google/genai`

## 2. Core Responsibilities
1.  **Secret Management**: The frontend NEVER communicates directly with the Google Gemini API. This prevents exposing the `GEMINI_API_KEY` to the client browser. The backend securely holds this key via `.env`.
2.  **API Routing**:
    *   Captures `/api/weather/*` requests to fetch or generate mock meteorological telemetry based on geo-coordinates.
    *   Captures `/api/chat/*` requests to handle the heavy prompt-engineering required before querying the LLM.
3.  **Production Asset Serving**: In production mode, the Express server statically serves the compiled React application (from the `/dist` folder) and handles SPA fallback routing (sending `index.html` for all non-API routes).

## 3. Build & Execution Flow
The `package.json` contains a specialized build script:
```json
"build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs"
```
*   **Step 1 (`vite build`)**: Compiles the React frontend into static HTML/JS/CSS inside the `dist` directory.
*   **Step 2 (`esbuild`)**: Transpiles the `server.ts` Express backend into a single CommonJS file (`dist/server.cjs`). It keeps external dependencies (like `express`) out of the bundle to ensure native CJS/ESM compatibility in Docker/Cloud Run environments.
*   **Step 3 (`start`)**: The container simply runs `node dist/server.cjs`.

## 4. Development Mode (Vite Middleware)
During development, the Express server mounts Vite dynamically via `createServer({ server: { middlewareMode: true } })`. This allows frontend HMR (Hot Module Replacement) to function flawlessly while still running through the custom Express backend.
