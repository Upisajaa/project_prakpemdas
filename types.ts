
export interface SensorData {
  id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  pumpStatus: boolean;
  lightStatus: boolean;
  isAutoMode: boolean;
  plantId: string;
}

export interface PlantProfile {
  id: string;
  name: string;
  species: string;
  idealTemp: [number, number];
  idealHumidity: [number, number];
  idealSoilMoisture: [number, number];
  image: string;
}

export interface AIAdvice {
  status: 'Healthy' | 'Warning' | 'Critical';
  summary: string;
  recommendations: string[];
}
