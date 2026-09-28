import { GeoPoint, WatershedBoundary } from '../types';

/**
 * Standard Ray-casting algorithm for Point-in-Polygon detection.
 * point: [lat, lng]
 * polygon: [[lat, lng], ...]
 */
export function isPointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
  const [lat, lng] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect = ((yi > lng) !== (yj > lng)) &&
      (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Finds which watershed contains a given GeoPoint.
 */
export function findWatershedForCoordinate(
  coords: GeoPoint, 
  watersheds: WatershedBoundary[]
): WatershedBoundary | null {
  for (const ws of watersheds) {
    if (isPointInPolygon([coords.lat, coords.lng], ws.polygon)) {
      return ws;
    }
  }
  return null;
}

/**
 * Haversine formula to compute great-circle distance between two points in meters.
 */
export function calculateDistanceMeters(p1: GeoPoint, p2: GeoPoint): number {
  const R = 6371000; // Earth radius in meters
  const dLat = (p2.lat - p1.lat) * (Math.PI / 180);
  const dLng = (p2.lng - p1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat * (Math.PI / 180)) *
      Math.cos(p2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Formats coordinates for clean government GIS display.
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(5)}° ${latDir}, ${Math.abs(lng).toFixed(5)}° ${lngDir}`;
}

/**
 * Creates approximate circle coordinates around a center point for Leaflet display.
 */
export function generateBufferCircleCoords(center: GeoPoint, radiusMeters: number, points: number = 32): [number, number][] {
  const coords: [number, number][] = [];
  const earthRadius = 6378137; // meters
  const latRad = (center.lat * Math.PI) / 180;
  const lngRad = (center.lng * Math.PI) / 180;
  const dRad = radiusMeters / earthRadius;

  for (let i = 0; i < points; i++) {
    const bearing = (i * 2 * Math.PI) / points;
    const pLatRad = Math.asin(
      Math.sin(latRad) * Math.cos(dRad) +
      Math.cos(latRad) * Math.sin(dRad) * Math.cos(bearing)
    );
    const pLngRad = lngRad + Math.atan2(
      Math.sin(bearing) * Math.sin(dRad) * Math.cos(latRad),
      Math.cos(dRad) - Math.sin(latRad) * Math.sin(pLatRad)
    );
    coords.push([(pLatRad * 180) / Math.PI, (pLngRad * 180) / Math.PI]);
  }
  return coords;
}
