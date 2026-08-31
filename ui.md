# User Interface (UI) Design Document

This document outlines the design principles, visual hierarchy, and component layout used in the WeatherGPT application.

## 1. Visual Language & Theming
*   **Design Trend (Glassmorphism)**: The UI extensively uses frosted glass effects (`backdrop-blur-xl`, `bg-white/5`, `bg-slate-900/90`) to create a deep, layered, and modern aesthetic that feels like a premium command center.
*   **Light/Dark Mode**: Fully supported via Tailwind CSS v4's `.dark` variant. The theme toggles seamlessly, altering background canvases, frosted panels, border opacities, and text contrasts without requiring page reloads.
*   **Color Palette**: 
    *   *Primary Accents*: Cyan and Emerald (tech-focused, meteorological feel).
    *   *Warnings/Alerts*: Red/Rose (SOS, severe alerts) and Amber/Orange (heat, warnings).
    *   *Neutrals*: Slate scales (`slate-50` to `slate-950`) for subtle depth and typography.

## 2. Layout Architecture
The application uses a responsive, grid-based layout that prioritizes mobile-first accessibility while maximizing screen real estate on desktop.

*   **Desktop Layout**: 
    *   *Top*: Sticky Navbar containing branding, real-time alert ticker, theme toggle, location selector, and SOS button.
    *   *Left Column (8/12)*: Contains the heavy data visualizations (GIS Map, Weather Dashboard Bento Grid, Analytics Chart).
    *   *Right Column (4/12)*: A sticky, fixed-height Chat Workbench allowing the user to converse with the AI while scrolling through data on the left.
*   **Mobile Layout**: 
    *   Stack-based (1 column). The user sees the Map, Dashboard, and Charts first.
    *   The Chat Workbench stacks at the bottom.
    *   A **Floating Chat Bubble** appears in the bottom right, allowing instant access to the AI from anywhere on the page without scrolling.

## 3. Key UI Components
*   **Bento Grid Dashboard**: Meteorological metrics (Thermal Sensation, Humidity, AQI, Wind) are displayed in a clean, card-based grid format for quick scannability.
*   **Interactive Maps & Charts**: High-contrast, specialized themes for Leaflet and Recharts ensure data remains legible in both light and dark modes.
*   **Emergency SOS Modal**: A high-priority overlay with aggressive red styling and pulsing icons to convey urgency, utilizing distinct checkbox grids for dissemination channels.
