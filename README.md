# Geowatershed

Geowatershed is a comprehensive web application for managing, analyzing, and visualizing watershed data. It empowers users to track interventions, manage evidence, perform satellite-based analysis, and monitor environmental change detection using modern web technologies and AI capabilities.

## Features

- **Dashboard & Analytics:** Overview of key metrics, alerts, and watershed status.
- **Watershed Management:** Detailed tracking and visualization of watershed areas.
- **Intervention Tracking:** Record and monitor the progress and impact of environmental interventions.
- **Evidence Management:** Upload and manage field evidence related to interventions.
- **Satellite Analysis & Change Detection:** Leverage satellite imagery to monitor geographical and environmental changes over time.
- **AI Integration:** Uses Gemini AI for advanced data interpretation and analysis.
- **Interactive Maps:** Geospatial data visualization using Leaflet.

## Technology Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS, Framer Motion for animations
- **Mapping:** Leaflet
- **Build Tool:** Vite
- **AI Integration:** Google Gen AI SDK (`@google/genai`)

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000` (or another port if 3000 is occupied).

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Locally preview the production build.
- `npm run lint`: Run TypeScript type checking.

## View App

View the original AI Studio template here: https://ai.studio/apps/f7862c4d-3f48-49e4-93c4-9f08b3f53fbe
