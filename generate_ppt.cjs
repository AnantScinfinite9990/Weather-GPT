const pptxgen = require('pptxgenjs');
const fs = require('fs');

async function createPresentation() {
  const pptx = new pptxgen();

  // Define Master Slide matching the SIH Template
  pptx.defineSlideMaster({
    title: 'MASTER_SLIDE',
    background: { color: 'FFFFFF' },
    objects: [
      // Top Header text
      { 
        text: { 
          text: 'SMART INDIA HACKATHON 2026', 
          options: { x: 0.5, y: 0.2, w: 6, h: 0.5, fontSize: 18, bold: true, color: '1f4e79', fontFace: 'Arial' } 
        } 
      },
      // Bottom Blue Bar
      { 
        rect: { x: 0, y: '92%', w: '100%', h: '8%', fill: { color: '1f4e79' } } 
      },
      // Bottom Bar Text
      { 
        text: { 
          text: '@SIH Idea submission- Template', 
          options: { x: 0.5, y: '93%', w: 5, h: 0.3, fontSize: 10, color: 'FFFFFF', fontFace: 'Arial' } 
        } 
      },
      // Slide Number
      { 
        text: { 
          text: 'Slide ', 
          options: { x: '90%', y: '93%', w: 1, h: 0.3, fontSize: 10, color: 'FFFFFF', fontFace: 'Arial' } 
        } 
      }
    ]
  });

  // Slide 1: Title Page
  let slide1 = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  slide1.addText('TITLE PAGE', { x: 0, y: 1.0, w: '100%', h: 0.5, align: 'center', fontSize: 24, bold: true, color: '000000', fontFace: 'Arial' });
  slide1.addText([
    { text: 'Problem Statement ID: ', options: { bold: true } }, { text: '26068\n' },
    { text: 'Problem Statement Title: ', options: { bold: true } }, { text: 'WeatherGPT: Conversational AI for Weather Forecasting...\n' },
    { text: 'Theme: ', options: { bold: true } }, { text: 'Disaster Management\n' },
    { text: 'PS Category: ', options: { bold: true } }, { text: 'Software\n' },
    { text: 'Organization: ', options: { bold: true } }, { text: 'Ministry of Earth Sciences (MoES) - IMD\n' },
    { text: 'Team ID: ', options: { bold: true } }, { text: '[Insert Team ID]\n' },
    { text: 'Team Name: ', options: { bold: true } }, { text: '[Insert Team Name]' }
  ], { x: 0.5, y: 2.0, w: 9, h: 3, fontSize: 14, fontFace: 'Arial', bullet: true, color: '000000' });

  // Slide 2: Idea Title
  let slide2 = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  slide2.addText('IDEA TITLE', { x: 0, y: 0.8, w: '100%', h: 0.5, align: 'center', fontSize: 20, bold: true, color: '000000', fontFace: 'Arial' });
  slide2.addText('WeatherGPT: Multilingual, Persona-Driven AI Meteorological Core', { x: 0.5, y: 1.4, w: 9, h: 0.4, fontSize: 16, bold: true, color: '1f4e79', fontFace: 'Arial' });
  slide2.addText([
    { text: 'Proposed Solution:', options: { bold: true } },
    { text: ' An intelligent, mobile-first conversational AI platform that aggregates fragmented meteorological datasets into a unified interface.\n' },
    { text: 'Detailed Explanation:', options: { bold: true } },
    { text: ' Integrates live NWP models (GFS/WRF) with real-time radar telemetry. Utilizes Gemini LLMs augmented with RAG to parse complex queries and dynamically routes responses based on user profiles (Farmers, Disaster Managers, Aviators).\n' },
    { text: 'Innovation & Uniqueness:', options: { bold: true } },
    { text: ' Voice-first rural accessibility (Web Speech API), automated early warning SOS dissemination, and historical climate analytics via natural language.' }
  ], { x: 0.5, y: 2.0, w: 9, h: 3, fontSize: 14, fontFace: 'Arial', bullet: true, color: '000000' });

  // Slide 3: Technical Approach
  let slide3 = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  slide3.addText('TECHNICAL APPROACH', { x: 0, y: 0.8, w: '100%', h: 0.5, align: 'center', fontSize: 20, bold: true, color: '000000', fontFace: 'Arial' });
  slide3.addText([
    { text: 'Technologies to be used:', options: { bold: true } },
    { text: ' React 19 / Vite / Tailwind CSS (PWA)\n' },
    { text: 'Node.js & FastAPI (Backend)\n' },
    { text: 'Google Gemini API / LangChain / RAG (AI Core)\n' },
    { text: 'PostgreSQL with PostGIS / Redis (Database & Caching)\n' },
    { text: 'Docker containerization & Kubernetes (Infrastructure)\n' },
    { text: 'Methodology & Process:', options: { bold: true } },
    { text: ' Phase 1: Real-Time Data Ingestion (IMD, GFS/WRF via WIS 2.0)\n' },
    { text: 'Phase 2: Spatial & Contextual Processing (GPS bounding boxes)\n' },
    { text: 'Phase 3: AI Inference (RAG grounding to prevent hallucinations)\n' },
    { text: 'Phase 4: Dissemination & UI (Intuitive Chat with TTS Voice Output)' }
  ], { x: 0.5, y: 1.4, w: 9, h: 3.5, fontSize: 13, fontFace: 'Arial', bullet: true, color: '000000' });

  // Slide 4: Feasibility and Viability
  let slide4 = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  slide4.addText('FEASIBILITY AND VIABILITY', { x: 0, y: 0.8, w: '100%', h: 0.5, align: 'center', fontSize: 20, bold: true, color: '000000', fontFace: 'Arial' });
  slide4.addText([
    { text: 'Feasibility Analysis:', options: { bold: true } },
    { text: ' High technical feasibility using proven open-source frameworks. RAG architecture avoids expensive foundational model training. Cloud Run auto-scaling ensures economic viability.\n' },
    { text: 'Potential Challenges & Risks:', options: { bold: true } },
    { text: ' AI Hallucinations (inventing forecasts)\n' },
    { text: 'Response Latency during complex LLM hops\n' },
    { text: 'Infrastructure overload during cyclones/floods\n' },
    { text: 'Strategies for Overcoming Challenges:', options: { bold: true } },
    { text: ' Strict RAG Grounding: Confines LLM strictly to IMD JSON data.\n' },
    { text: 'Edge Caching: Redis caches common queries; Gemini Flash for low-latency.\n' },
    { text: 'Stateless Architecture: Instant horizontal scaling via Kubernetes.\n' }
  ], { x: 0.5, y: 1.4, w: 9, h: 3.5, fontSize: 13, fontFace: 'Arial', bullet: true, color: '000000' });

  // Slide 5: Impact and Benefits
  let slide5 = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  slide5.addText('IMPACT AND BENEFITS', { x: 0, y: 0.8, w: '100%', h: 0.5, align: 'center', fontSize: 20, bold: true, color: '000000', fontFace: 'Arial' });
  slide5.addText([
    { text: 'Potential Impact:', options: { bold: true } },
    { text: ' Transforms passive weather consumption into an active, intelligent decision-support system, empowering citizens and mitigating financial losses.\n' },
    { text: 'Benefits of the Solution:', options: { bold: true } },
    { text: ' Faster Disaster Preparedness: Instant conversational access to flood tracking enables rapid location-based early warnings.\n' },
    { text: 'Intelligent Agriculture: Hyper-local, voice-guided crop advisories protect livelihoods.\n' },
    { text: 'Aviation & Marine Safety: Instant plain-language briefings reduce dispatch delays.\n' },
    { text: 'Public Accessibility: Zero-literacy support in 10+ Indian languages via voice AI.\n' }
  ], { x: 0.5, y: 1.4, w: 9, h: 3.5, fontSize: 13, fontFace: 'Arial', bullet: true, color: '000000' });

  // Slide 6: App Demo Screenshots (New Slide as requested)
  let slide6 = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  slide6.addText('APP DEMONSTRATION & UI', { x: 0, y: 0.8, w: '100%', h: 0.5, align: 'center', fontSize: 20, bold: true, color: '000000', fontFace: 'Arial' });
  
  // Create placeholders for screenshots
  slide6.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.5, w: 4, h: 3.2, fill: { color: 'f1f5f9' }, line: { color: 'cbd5e1' } });
  slide6.addText('Insert Dashboard Screenshot Here\n(Right Click -> Change Image)', { x: 0.5, y: 1.5, w: 4, h: 3.2, align: 'center', color: '64748b', fontSize: 12 });
  
  slide6.addShape(pptx.ShapeType.rect, { x: 4.8, y: 1.5, w: 4, h: 3.2, fill: { color: 'f1f5f9' }, line: { color: 'cbd5e1' } });
  slide6.addText('Insert GIS Map / Chat Screenshot Here\n(Right Click -> Change Image)', { x: 4.8, y: 1.5, w: 4, h: 3.2, align: 'center', color: '64748b', fontSize: 12 });

  // Slide 7: Research and References
  let slide7 = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
  slide7.addText('RESEARCH AND REFERENCES', { x: 0, y: 0.8, w: '100%', h: 0.5, align: 'center', fontSize: 20, bold: true, color: '000000', fontFace: 'Arial' });
  slide7.addText([
    { text: 'MoES & IMD Datasets:', options: { bold: true } },
    { text: ' Documentation on utilizing Indian GFS/WRF models and National Framework for Early Warning Systems.\n' },
    { text: 'WMO WIS 2.0 Architecture:', options: { bold: true } },
    { text: ' Standards set by the World Meteorological Organization for real-time data exchange.\n' },
    { text: 'LLM in Meteorology:', options: { bold: true } },
    { text: ' Research on RAG to translate complex spatio-temporal weather data without hallucination.\n' },
    { text: 'NDMA Common Alerting Protocol (CAP):', options: { bold: true } },
    { text: ' Guidelines for standardizing extreme weather alerts.\n' },
    { text: 'Web Speech API:', options: { bold: true } },
    { text: ' W3C standards for robust cross-browser STT and TTS.\n' }
  ], { x: 0.5, y: 1.4, w: 9, h: 3.5, fontSize: 13, fontFace: 'Arial', bullet: true, color: '000000' });

  // Save the presentation
  await pptx.writeFile({ fileName: 'WeatherGPT_SIH2026.pptx' });
  console.log("Successfully generated WeatherGPT_SIH2026.pptx");
}

createPresentation().catch(console.error);
