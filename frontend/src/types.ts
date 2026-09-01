export type PersonaType = 'Farmer' | 'Aviator' | 'Disaster Manager' | 'Researcher' | 'Citizen';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn' | 'gu';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  speechCode: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
  name: string;
  state?: string;
  country?: string;
}

export interface WeatherMetrics {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windDirectionText: string;
  pressure: number;
  uvIndex: number;
  aqi: number;
  aqiStatus: 'Good' | 'Moderate' | 'Poor' | 'Unhealthy' | 'Hazardous';
  soilMoisture: number; // in percentage
  dewPoint: number;
  visibility: number; // in km
  cloudCover: number; // in percentage
  condition: string;
  conditionIcon: string;
  precipitation: number; // in mm
  precipitationProbability: number;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  nwpModel: {
    modelName: string;
    resolution: string;
    updateCycle: string;
    cape: number; // J/kg (Convective Available Potential Energy)
    cin: number; // J/kg
    liftedIndex: number;
    cloudBaseAGL: number; // meters
    verticalWindShear: string;
  };
}

export interface HourlyForecast {
  time: string;
  temp: number;
  rainProb: number;
  windSpeed: number;
  condition: string;
}

export interface DailyForecast {
  day: string;
  date: string;
  minTemp: number;
  maxTemp: number;
  rainMm: number;
  rainProb: number;
  condition: string;
  icon: string;
  advisoryTag?: string;
}

export interface WeatherAlert {
  id: string;
  type: 'Flash Flood' | 'Cyclone / Storm Surge' | 'Lightning Nowcast' | 'Severe Heatwave' | 'High Wind Shear' | 'Heavy Monsoon Downpour';
  severity: 'Critical' | 'Severe' | 'Moderate' | 'Watch';
  severityColor: 'red' | 'orange' | 'yellow';
  location: string;
  coordinates: [number, number];
  radiusKm: number;
  polygon?: [number, number][];
  issuedAt: string;
  validUntil: string;
  message: string;
  actionRequired: string;
  affectedBlocks: string[];
}

export interface DecadalClimatePoint {
  period: string;
  currentValue: number;
  historic10YrMean: number;
  anomalyPercent: number;
  rainfallMm: number;
  historicRainfallMm: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  persona: PersonaType;
  lang?: LanguageCode;
  structuredData?: {
    category: 'agro' | 'aviation' | 'disaster' | 'research' | 'general';
    actionItems?: string[];
    riskScore?: number; // 0 - 100
    nwpInsight?: string;
    broadcastEligible?: boolean;
    suggestedCoordinates?: [number, number];
  };
}

export interface EmergencyBroadcastPayload {
  id: string;
  alertType: string;
  severity: string;
  targetRegion: string;
  targetChannels: ('SMS' | 'WhatsApp' | 'Sirens' | 'CAP-Alert')[];
  affectedPanchayats: string[];
  estimatedCitizens: number;
  broadcastTemplate: string;
  dispatchedAt: string;
  status: 'Draft' | 'Queued' | 'Dispatched' | 'Delivered';
}
