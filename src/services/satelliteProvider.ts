import { SatelliteLayerConfig } from '../types';

export interface SatelliteTileOptions {
  year?: number;
  indicator?: 'true_color' | 'ndvi' | 'ndwi' | 'water_extent' | 'lulc' | 'slope';
}

export interface SatelliteDataProvider {
  id: string;
  name: string;
  description: string;
  isSimulated: boolean;
  getTileUrl(options?: SatelliteTileOptions): string;
  getAttribution(): string;
  getConfig(): SatelliteLayerConfig;
}

class DemoSatelliteProvider implements SatelliteDataProvider {
  id = 'demo_satellite';
  name = 'Demo Satellite Layer (Sentinel-2 Simulated)';
  description = 'High-resolution multi-spectral synthetic imagery for simulated demonstration of watershed changes.';
  isSimulated = true;

  getTileUrl(options?: SatelliteTileOptions): string {
    // Esri World Imagery as high-res satellite base
    return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  }

  getAttribution(): string {
    return 'Tiles &copy; Esri &mdash; Demo Satellite Layer for Research & Prototype';
  }

  getConfig(): SatelliteLayerConfig {
    return {
      provider: 'demo',
      name: this.name,
      resolutionMeters: 10,
      lastUpdated: '2026-09-15',
      isSimulated: true
    };
  }
}

class SrishtiDrishtiProvider implements SatelliteDataProvider {
  id = 'srishti_drishti';
  name = 'SRISHTI-DRISHTI Geospatial Imagery';
  description = 'National Remote Sensing Centre (NRSC) / ISRO Bhuvan Watershed Monitoring Service.';
  isSimulated = false;

  private tileUrl: string;
  private apiUrl: string;

  constructor(tileUrl?: string, apiUrl?: string) {
    this.tileUrl = tileUrl || (import.meta as any).env?.VITE_SATELLITE_TILE_URL || '';
    this.apiUrl = apiUrl || (import.meta as any).env?.VITE_SATELLITE_API_URL || '';
  }

  getTileUrl(options?: SatelliteTileOptions): string {
    if (this.tileUrl) {
      return this.tileUrl;
    }
    // Fallback if env not provided
    return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  }

  getAttribution(): string {
    return 'ISRO / NRSC &mdash; Bhuvan SRISHTI-DRISHTI Watershed Monitoring Portal';
  }

  getConfig(): SatelliteLayerConfig {
    const isLive = Boolean(this.tileUrl);
    return {
      provider: 'srishti',
      name: isLive ? this.name : 'SRISHTI-DRISHTI (Endpoint unconfigured - using demo fallback)',
      resolutionMeters: 5,
      lastUpdated: '2026-09-01',
      isSimulated: !isLive
    };
  }
}

class PublicCopernicusProvider implements SatelliteDataProvider {
  id = 'copernicus';
  name = 'Copernicus Sentinel-2 L2A';
  description = 'ESA Copernicus Open Access multi-spectral imagery at 10m spatial resolution.';
  isSimulated = false;

  getTileUrl(options?: SatelliteTileOptions): string {
    return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  }

  getAttribution(): string {
    return 'Contains modified Copernicus Sentinel data [2026] / ESA';
  }

  getConfig(): SatelliteLayerConfig {
    return {
      provider: 'public_copernicus',
      name: this.name,
      resolutionMeters: 10,
      lastUpdated: '2026-09-10',
      isSimulated: false
    };
  }
}

export const availableSatelliteProviders: Record<string, SatelliteDataProvider> = {
  demo: new DemoSatelliteProvider(),
  srishti: new SrishtiDrishtiProvider(),
  copernicus: new PublicCopernicusProvider(),
};

export function getActiveSatelliteProvider(): SatelliteDataProvider {
  const configured = (import.meta as any).env?.VITE_SATELLITE_PROVIDER?.toLowerCase();
  if (configured && availableSatelliteProviders[configured]) {
    return availableSatelliteProviders[configured];
  }
  return availableSatelliteProviders.demo;
}
