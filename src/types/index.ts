export type UserRole = 'Admin' | 'Officer' | 'Field Officer' | 'Researcher' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
}

export type InterventionType = 
  | 'Check Dam'
  | 'Farm Pond'
  | 'Water Harvesting Structure'
  | 'Plantation'
  | 'Contour Structure'
  | 'Soil Conservation'
  | 'Drainage Improvement'
  | 'Other';

export type VerificationStatus = 'Verified' | 'Pending' | 'Needs Review' | 'Inconclusive' | 'Rejected';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface WatershedBoundary {
  id: string;
  code: string;
  name: string;
  basin: string;
  district: string;
  state: string;
  areaKm2: number;
  villagesCount: number;
  interventionsCount: number;
  observationsCount: number;
  waterBodiesCount: number;
  drainageLengthKm: number;
  vegetationTrend: 'Increasing' | 'Stable' | 'Declining';
  waterExtentTrend: 'Increasing' | 'Stable' | 'Declining';
  verificationRatePercent: number;
  center: [number, number]; // [lat, lng]
  zoom: number;
  polygon: [number, number][]; // Array of [lat, lng]
  elevationMinM: number;
  elevationMaxM: number;
  annualRainfallMm: number;
  soilType: string;
}

export interface Intervention {
  id: string;
  code: string;
  name: string;
  type: InterventionType;
  watershedId: string;
  watershedCode: string;
  location: GeoPoint;
  village: string;
  implementationYear: number;
  status: 'Completed' | 'Under Construction' | 'Proposed' | 'Maintenance Required';
  verificationStatus: VerificationStatus;
  primaryPhotoUrl: string;
  additionalPhotos: string[];
  costInr: number;
  capacityM3?: number;
  catchmentAreaHa?: number;
  description: string;
  contractor: string;
  createdDate: string;
  lastInspectionDate: string;
  inspectorName: string;
  satelliteObservedChange: {
    year2024: { ndvi: number; waterExtentHa: number };
    year2025: { ndvi: number; waterExtentHa: number };
    year2026: { ndvi: number; waterExtentHa: number };
  };
}

export interface FieldObservation {
  id: string;
  code: string;
  observationType: InterventionType | 'Water Body' | 'Erosion Site' | 'Vegetation Patch' | 'General';
  watershedId: string;
  watershedCode: string;
  interventionId?: string;
  location: GeoPoint;
  locationAccuracyMeters: number;
  photoUrl: string;
  photoDate: string;
  uploadedAt: string;
  uploadedBy: string;
  uploaderRole: UserRole;
  verificationStatus: VerificationStatus;
  notes: string;
  exifData: {
    hasGps: boolean;
    cameraModel?: string;
    dateTimeOriginal?: string;
    altitudeMeters?: number;
    directionHeading?: number;
  };
  evidenceQuality: {
    gpsQuality: 'High' | 'Good' | 'Moderate' | 'Poor';
    imageQuality: 'High' | 'Good' | 'Fair' | 'Poor';
    satelliteMatch: 'High' | 'Good' | 'Moderate' | 'Pending';
    temporalConfidence: 'High' | 'Moderate' | 'Low';
    completenessPercent: number;
  };
  satelliteContextSummary: {
    ndviSurrounding: number;
    waterPresenceDetected: boolean;
    landCoverType: string;
    bufferStatus: string;
  };
}

export interface VerificationTask {
  id: string;
  title: string;
  watershedId: string;
  watershedCode: string;
  location: GeoPoint;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Assigned' | 'Field Submitted' | 'Approved' | 'Closed';
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  dueDate: string;
  associatedObservationId?: string;
  associatedInterventionId?: string;
  remoteAnomalyDescription: string;
  fieldResponseNotes?: string;
  fieldResponsePhotoUrl?: string;
  reviewDecision?: 'Confirmed' | 'Not Confirmed' | 'Inconclusive';
}

export interface WaterBodyFeature {
  id: string;
  name: string;
  watershedId: string;
  type: 'Percolation Tank' | 'Irrigation Tank' | 'Natural Pond' | 'Reservoir';
  center: GeoPoint;
  areaHa2024: number;
  areaHa2026: number;
  polygon: [number, number][];
}

export interface DrainageFeature {
  id: string;
  order: 1 | 2 | 3 | 4; // Strahler stream order
  watershedId: string;
  coordinates: [number, number][];
}

export interface SatelliteLayerConfig {
  provider: 'srishti' | 'public_copernicus' | 'demo';
  name: string;
  resolutionMeters: number;
  lastUpdated: string;
  isSimulated: boolean;
}

export interface AlertItem {
  id: string;
  type: 'vegetation_change' | 'water_change' | 'missing_verification' | 'gps_mismatch' | 'data_anomaly';
  severity: 'high' | 'warning' | 'info';
  title: string;
  description: string;
  watershedId: string;
  watershedCode: string;
  location: GeoPoint;
  date: string;
  resolved: boolean;
  relatedInterventionId?: string;
  relatedObservationId?: string;
}
