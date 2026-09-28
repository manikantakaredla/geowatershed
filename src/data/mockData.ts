import { 
  WatershedBoundary, 
  Intervention, 
  FieldObservation, 
  VerificationTask, 
  WaterBodyFeature, 
  DrainageFeature, 
  AlertItem, 
  User 
} from '../types';
import { APP_IMAGES } from '../assets/images';

export const MOCK_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Dr. Ramesh Babu',
    email: 'ramesh.babu@waterscope.gov.in',
    role: 'Admin',
    department: 'State Watershed Mission & Remote Sensing Directorate',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-2',
    name: 'Smt. Priya Sharma',
    email: 'priya.sharma@waterscope.gov.in',
    role: 'Officer',
    department: 'District Water Resources & Watershed Cell',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-3',
    name: 'K. Venkatesh',
    email: 'k.venkatesh@waterscope.gov.in',
    role: 'Field Officer',
    department: 'Sub-divisional Watershed Inspection Unit',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-4',
    name: 'Ananya Rao',
    email: 'ananya.rao@geo-research.ac.in',
    role: 'Researcher',
    department: 'Hydrological Modeling & Remote Sensing Lab',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'u-5',
    name: 'G. Suresh Kumar',
    email: 'viewer@public-water.org',
    role: 'Viewer',
    department: 'Panchayat Community Observer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
  }
];

export const MOCK_WATERSHEDS: WatershedBoundary[] = [
  {
    id: 'ws-1',
    code: 'WS-001',
    name: 'Nagavali Upper Catchment',
    basin: 'Nagavali River Basin',
    district: 'Vizianagaram',
    state: 'Andhra Pradesh',
    areaKm2: 24.5,
    villagesCount: 8,
    interventionsCount: 32,
    observationsCount: 186,
    waterBodiesCount: 14,
    drainageLengthKm: 42.8,
    vegetationTrend: 'Increasing',
    waterExtentTrend: 'Increasing',
    verificationRatePercent: 82,
    center: [18.2834, 83.3912],
    zoom: 13,
    polygon: [
      [18.3150, 83.3500],
      [18.3200, 83.3850],
      [18.3050, 83.4250],
      [18.2700, 83.4350],
      [18.2500, 83.4100],
      [18.2520, 83.3650],
      [18.2800, 83.3400],
      [18.3150, 83.3500]
    ],
    elevationMinM: 140,
    elevationMaxM: 520,
    annualRainfallMm: 1120,
    soilType: 'Red Loamy & Clayey Alluvial'
  },
  {
    id: 'ws-2',
    code: 'WS-002',
    name: 'Gosthani Micro-Watershed',
    basin: 'Gosthani River Basin',
    district: 'Anakapalli',
    state: 'Andhra Pradesh',
    areaKm2: 18.2,
    villagesCount: 6,
    interventionsCount: 24,
    observationsCount: 142,
    waterBodiesCount: 9,
    drainageLengthKm: 31.4,
    vegetationTrend: 'Increasing',
    waterExtentTrend: 'Stable',
    verificationRatePercent: 78,
    center: [18.0650, 83.1850],
    zoom: 13,
    polygon: [
      [18.0900, 83.1550],
      [18.0950, 83.1950],
      [18.0750, 83.2200],
      [18.0450, 83.2100],
      [18.0380, 83.1700],
      [18.0600, 83.1450],
      [18.0900, 83.1550]
    ],
    elevationMinM: 85,
    elevationMaxM: 340,
    annualRainfallMm: 980,
    soilType: 'Lateritic & Red Sandy'
  },
  {
    id: 'ws-3',
    code: 'WS-003',
    name: 'Champavathi Sub-basin',
    basin: 'Champavathi Basin',
    district: 'Srikakulam',
    state: 'Andhra Pradesh',
    areaKm2: 31.0,
    villagesCount: 11,
    interventionsCount: 45,
    observationsCount: 230,
    waterBodiesCount: 19,
    drainageLengthKm: 56.2,
    vegetationTrend: 'Stable',
    waterExtentTrend: 'Increasing',
    verificationRatePercent: 88,
    center: [18.3650, 83.5250],
    zoom: 13,
    polygon: [
      [18.4000, 83.4850],
      [18.4050, 83.5450],
      [18.3750, 83.5700],
      [18.3350, 83.5500],
      [18.3280, 83.5000],
      [18.3550, 83.4700],
      [18.4000, 83.4850]
    ],
    elevationMinM: 110,
    elevationMaxM: 410,
    annualRainfallMm: 1040,
    soilType: 'Sandy Clay Loam'
  },
  {
    id: 'ws-4',
    code: 'WS-004',
    name: 'Sarada River Catchment',
    basin: 'Sarada Basin',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    areaKm2: 19.8,
    villagesCount: 7,
    interventionsCount: 28,
    observationsCount: 154,
    waterBodiesCount: 11,
    drainageLengthKm: 34.6,
    vegetationTrend: 'Increasing',
    waterExtentTrend: 'Increasing',
    verificationRatePercent: 85,
    center: [17.8450, 82.9850],
    zoom: 13,
    polygon: [
      [17.8750, 82.9550],
      [17.8800, 83.0150],
      [17.8500, 83.0300],
      [17.8200, 83.0100],
      [17.8150, 82.9650],
      [17.8400, 82.9400],
      [17.8750, 82.9550]
    ],
    elevationMinM: 60,
    elevationMaxM: 280,
    annualRainfallMm: 950,
    soilType: 'Deep Coastal Alluvium & Loam'
  }
];

export const MOCK_INTERVENTIONS: Intervention[] = [
  {
    id: 'int-1',
    code: 'CD-001',
    name: 'Check Dam #001 - Vangara Stream',
    type: 'Check Dam',
    watershedId: 'ws-1',
    watershedCode: 'WS-001',
    location: { lat: 18.2834, lng: 83.3912 },
    village: 'Vangara',
    implementationYear: 2025,
    status: 'Completed',
    verificationStatus: 'Verified',
    primaryPhotoUrl: APP_IMAGES.checkDam,
    additionalPhotos: [
      APP_IMAGES.percolationTank,
      APP_IMAGES.farmPond
    ],
    costInr: 450000,
    capacityM3: 18500,
    catchmentAreaHa: 142,
    description: 'R.C.C. masonry check dam constructed across 2nd order stream to recharge upstream dug wells, stabilize stream bed, and provide livestock drinking water.',
    contractor: 'Vangara Watershed Committee',
    createdDate: '2025-03-12',
    lastInspectionDate: '2026-09-20',
    inspectorName: 'K. Venkatesh (Field Officer)',
    satelliteObservedChange: {
      year2024: { ndvi: 0.31, waterExtentHa: 1.2 },
      year2025: { ndvi: 0.38, waterExtentHa: 1.5 },
      year2026: { ndvi: 0.46, waterExtentHa: 1.8 }
    }
  },
  {
    id: 'int-2',
    code: 'FP-002',
    name: 'Farm Pond #002 - Chennuru Cluster',
    type: 'Farm Pond',
    watershedId: 'ws-1',
    watershedCode: 'WS-001',
    location: { lat: 18.2910, lng: 83.3760 },
    village: 'Chennuru',
    implementationYear: 2024,
    status: 'Completed',
    verificationStatus: 'Verified',
    primaryPhotoUrl: APP_IMAGES.farmPond,
    additionalPhotos: [
      APP_IMAGES.checkDam
    ],
    costInr: 120000,
    capacityM3: 4200,
    catchmentAreaHa: 18,
    description: 'Excavated farm pond with stone pitching for surface runoff retention and supplemental protective irrigation for pulses and groundnut.',
    contractor: 'Rythu Seva Sangham',
    createdDate: '2024-06-18',
    lastInspectionDate: '2026-08-14',
    inspectorName: 'K. Venkatesh',
    satelliteObservedChange: {
      year2024: { ndvi: 0.28, waterExtentHa: 0.4 },
      year2025: { ndvi: 0.35, waterExtentHa: 0.7 },
      year2026: { ndvi: 0.42, waterExtentHa: 0.9 }
    }
  },
  {
    id: 'int-3',
    code: 'WHS-003',
    name: 'Percolation Tank #003 - Garugubilli',
    type: 'Water Harvesting Structure',
    watershedId: 'ws-1',
    watershedCode: 'WS-001',
    location: { lat: 18.2715, lng: 83.4080 },
    village: 'Garugubilli',
    implementationYear: 2024,
    status: 'Completed',
    verificationStatus: 'Verified',
    primaryPhotoUrl: APP_IMAGES.percolationTank,
    additionalPhotos: [],
    costInr: 850000,
    capacityM3: 32000,
    catchmentAreaHa: 280,
    description: 'Earthen bund percolation structure with surplus escape waste weir to augment deep groundwater aquifer recharge.',
    contractor: 'Irrigation & CAD Dept Sub-unit',
    createdDate: '2024-02-10',
    lastInspectionDate: '2026-07-22',
    inspectorName: 'Priya Sharma (Officer)',
    satelliteObservedChange: {
      year2024: { ndvi: 0.33, waterExtentHa: 2.1 },
      year2025: { ndvi: 0.41, waterExtentHa: 2.8 },
      year2026: { ndvi: 0.49, waterExtentHa: 3.4 }
    }
  },
  {
    id: 'int-4',
    code: 'PLN-004',
    name: 'Horticultural Plantation #004',
    type: 'Plantation',
    watershedId: 'ws-1',
    watershedCode: 'WS-001',
    location: { lat: 18.2980, lng: 83.3980 },
    village: 'Kotturu',
    implementationYear: 2025,
    status: 'Completed',
    verificationStatus: 'Verified',
    primaryPhotoUrl: APP_IMAGES.contourTrench,
    additionalPhotos: [],
    costInr: 320000,
    catchmentAreaHa: 45,
    description: 'Mixed cashew and mango afforestation with staggered trenching on degraded foothill slopes for soil stabilization.',
    contractor: 'Horticulture Department',
    createdDate: '2025-08-05',
    lastInspectionDate: '2026-09-02',
    inspectorName: 'K. Venkatesh',
    satelliteObservedChange: {
      year2024: { ndvi: 0.22, waterExtentHa: 0.1 },
      year2025: { ndvi: 0.34, waterExtentHa: 0.2 },
      year2026: { ndvi: 0.48, waterExtentHa: 0.3 }
    }
  },
  {
    id: 'int-5',
    code: 'CCT-005',
    name: 'Continuous Contour Trenching #005',
    type: 'Contour Structure',
    watershedId: 'ws-1',
    watershedCode: 'WS-001',
    location: { lat: 18.3050, lng: 83.3650 },
    village: 'Gollapeta',
    implementationYear: 2025,
    status: 'Completed',
    verificationStatus: 'Pending',
    primaryPhotoUrl: APP_IMAGES.contourTrench,
    additionalPhotos: [],
    costInr: 280000,
    capacityM3: 7500,
    catchmentAreaHa: 60,
    description: '1,200 running meters of continuous contour trenches along 4% slope ridge line to prevent sheet erosion.',
    contractor: 'Gollapeta Gram Panchayat',
    createdDate: '2025-11-14',
    lastInspectionDate: '2026-05-10',
    inspectorName: 'K. Venkatesh',
    satelliteObservedChange: {
      year2024: { ndvi: 0.25, waterExtentHa: 0.1 },
      year2025: { ndvi: 0.30, waterExtentHa: 0.2 },
      year2026: { ndvi: 0.39, waterExtentHa: 0.3 }
    }
  },
  {
    id: 'int-6',
    code: 'CD-006',
    name: 'Check Dam #006 - Tatipudi Nala',
    type: 'Check Dam',
    watershedId: 'ws-2',
    watershedCode: 'WS-002',
    location: { lat: 18.0680, lng: 83.1810 },
    village: 'Tatipudi',
    implementationYear: 2024,
    status: 'Completed',
    verificationStatus: 'Verified',
    primaryPhotoUrl: APP_IMAGES.checkDam,
    additionalPhotos: [],
    costInr: 520000,
    capacityM3: 21000,
    catchmentAreaHa: 195,
    description: 'Masonry gully control structure with upstream silt trap to reduce reservoir siltation and improve recharge.',
    contractor: 'Tatipudi Water Users Association',
    createdDate: '2024-04-20',
    lastInspectionDate: '2026-08-30',
    inspectorName: 'Smt. Priya Sharma',
    satelliteObservedChange: {
      year2024: { ndvi: 0.34, waterExtentHa: 1.5 },
      year2025: { ndvi: 0.40, waterExtentHa: 1.9 },
      year2026: { ndvi: 0.47, waterExtentHa: 2.2 }
    }
  },
  {
    id: 'int-7',
    code: 'FP-007',
    name: 'Community Farm Pond #007',
    type: 'Farm Pond',
    watershedId: 'ws-2',
    watershedCode: 'WS-002',
    location: { lat: 18.0550, lng: 83.1950 },
    village: 'Kothavalasa Outskirts',
    implementationYear: 2025,
    status: 'Completed',
    verificationStatus: 'Needs Review',
    primaryPhotoUrl: APP_IMAGES.farmPond,
    additionalPhotos: [],
    costInr: 160000,
    capacityM3: 5800,
    catchmentAreaHa: 24,
    description: 'Excavated pond with geo-membrane lining to support dry season micro-irrigation for vegetable cultivators.',
    contractor: 'Micro-Irrigation Cell',
    createdDate: '2025-02-18',
    lastInspectionDate: '2026-09-12',
    inspectorName: 'K. Venkatesh',
    satelliteObservedChange: {
      year2024: { ndvi: 0.29, waterExtentHa: 0.5 },
      year2025: { ndvi: 0.33, waterExtentHa: 0.8 },
      year2026: { ndvi: 0.41, waterExtentHa: 1.1 }
    }
  },
  {
    id: 'int-8',
    code: 'SC-008',
    name: 'Loose Boulder Check Dam #008',
    type: 'Soil Conservation',
    watershedId: 'ws-3',
    watershedCode: 'WS-003',
    location: { lat: 18.3680, lng: 83.5210 },
    village: 'Gajapathinagaram',
    implementationYear: 2024,
    status: 'Completed',
    verificationStatus: 'Verified',
    primaryPhotoUrl: APP_IMAGES.checkDam,
    additionalPhotos: [],
    costInr: 85000,
    capacityM3: 2400,
    catchmentAreaHa: 35,
    description: 'Series of 4 loose stone boulder checks installed across high-velocity runoff gully to trap silt and break hydraulic velocity.',
    contractor: 'Local MGNREGS Group',
    createdDate: '2024-09-10',
    lastInspectionDate: '2026-08-05',
    inspectorName: 'Priya Sharma',
    satelliteObservedChange: {
      year2024: { ndvi: 0.32, waterExtentHa: 0.6 },
      year2025: { ndvi: 0.37, waterExtentHa: 0.9 },
      year2026: { ndvi: 0.44, waterExtentHa: 1.2 }
    }
  },
  {
    id: 'int-9',
    code: 'CD-009',
    name: 'Check Dam #009 - Sarada Tributary',
    type: 'Check Dam',
    watershedId: 'ws-4',
    watershedCode: 'WS-004',
    location: { lat: 17.8420, lng: 82.9810 },
    village: 'Kasimkota Rural',
    implementationYear: 2025,
    status: 'Completed',
    verificationStatus: 'Verified',
    primaryPhotoUrl: APP_IMAGES.checkDam,
    additionalPhotos: [],
    costInr: 490000,
    capacityM3: 19800,
    catchmentAreaHa: 160,
    description: 'Concrete gravity check dam with side training walls and energy dissipating apron.',
    contractor: 'Kasimkota Watershed Committee',
    createdDate: '2025-05-19',
    lastInspectionDate: '2026-09-18',
    inspectorName: 'K. Venkatesh',
    satelliteObservedChange: {
      year2024: { ndvi: 0.30, waterExtentHa: 1.1 },
      year2025: { ndvi: 0.38, waterExtentHa: 1.6 },
      year2026: { ndvi: 0.45, waterExtentHa: 2.0 }
    }
  }
];

export const MOCK_FIELD_OBSERVATIONS: FieldObservation[] = [
  {
    id: 'obs-1',
    code: 'OBS-2026-0891',
    observationType: 'Check Dam',
    watershedId: 'ws-1',
    watershedCode: 'WS-001',
    interventionId: 'int-1',
    location: { lat: 18.2834, lng: 83.3912 },
    locationAccuracyMeters: 3.2,
    photoUrl: APP_IMAGES.checkDam,
    photoDate: '2026-09-20',
    uploadedAt: '2026-09-20T10:14:00Z',
    uploadedBy: 'K. Venkatesh',
    uploaderRole: 'Field Officer',
    verificationStatus: 'Verified',
    notes: 'Check Dam #001 post-monsoon inspection. Storage pool at full spillway level. Zero structural seepage observed. Upstream silt deposition is within permissible threshold.',
    exifData: {
      hasGps: true,
      cameraModel: 'Trimble TDC600 GNSS Handheld',
      dateTimeOriginal: '2026-09-20 09:42:15',
      altitudeMeters: 168.4,
      directionHeading: 142
    },
    evidenceQuality: {
      gpsQuality: 'High',
      imageQuality: 'High',
      satelliteMatch: 'High',
      temporalConfidence: 'High',
      completenessPercent: 96
    },
    satelliteContextSummary: {
      ndviSurrounding: 0.46,
      waterPresenceDetected: true,
      landCoverType: 'Water Body / Dense Green Riparian Buffer',
      bufferStatus: 'Substantial moisture index rise within 500m radius'
    }
  },
  {
    id: 'obs-2',
    code: 'OBS-2026-0842',
    observationType: 'Farm Pond',
    watershedId: 'ws-1',
    watershedCode: 'WS-001',
    interventionId: 'int-2',
    location: { lat: 18.2910, lng: 83.3760 },
    locationAccuracyMeters: 4.8,
    photoUrl: APP_IMAGES.farmPond,
    photoDate: '2026-08-14',
    uploadedAt: '2026-08-14T14:32:00Z',
    uploadedBy: 'K. Venkatesh',
    uploaderRole: 'Field Officer',
    verificationStatus: 'Verified',
    notes: 'Chennuru farm pond retaining good water head after early monsoon showers. Beneficiary farmer actively pumping for pulse crop seedlings.',
    exifData: {
      hasGps: true,
      cameraModel: 'Samsung Galaxy XCover Pro',
      dateTimeOriginal: '2026-08-14 13:10:44',
      altitudeMeters: 172.0,
      directionHeading: 88
    },
    evidenceQuality: {
      gpsQuality: 'Good',
      imageQuality: 'High',
      satelliteMatch: 'High',
      temporalConfidence: 'High',
      completenessPercent: 92
    },
    satelliteContextSummary: {
      ndviSurrounding: 0.42,
      waterPresenceDetected: true,
      landCoverType: 'Active Irrigated Cropland',
      bufferStatus: 'Positive greenness anomaly in 250m buffer'
    }
  },
  {
    id: 'obs-3',
    code: 'OBS-2026-0914',
    observationType: 'Water Harvesting Structure',
    watershedId: 'ws-1',
    watershedCode: 'WS-001',
    interventionId: 'int-3',
    location: { lat: 18.2715, lng: 83.4080 },
    locationAccuracyMeters: 2.8,
    photoUrl: APP_IMAGES.percolationTank,
    photoDate: '2026-07-22',
    uploadedAt: '2026-07-22T16:05:00Z',
    uploadedBy: 'Priya Sharma',
    uploaderRole: 'Officer',
    verificationStatus: 'Verified',
    notes: 'Garugubilli percolation tank inspection during high monsoon influx. Water spread covers approximately 3.4 hectares as visible in satellite scene.',
    exifData: {
      hasGps: true,
      cameraModel: 'Garmin Montana 700i',
      dateTimeOriginal: '2026-07-22 15:30:11',
      altitudeMeters: 155.3,
      directionHeading: 220
    },
    evidenceQuality: {
      gpsQuality: 'High',
      imageQuality: 'High',
      satelliteMatch: 'High',
      temporalConfidence: 'High',
      completenessPercent: 98
    },
    satelliteContextSummary: {
      ndviSurrounding: 0.49,
      waterPresenceDetected: true,
      landCoverType: 'Surface Water / Wet Wetland',
      bufferStatus: 'Full water body spread confirms Sentinel-2 NDWI reading'
    }
  },
  {
    id: 'obs-4',
    code: 'OBS-2026-0955',
    observationType: 'Contour Structure',
    watershedId: 'ws-1',
    watershedCode: 'WS-001',
    interventionId: 'int-5',
    location: { lat: 18.3050, lng: 83.3650 },
    locationAccuracyMeters: 6.5,
    photoUrl: APP_IMAGES.contourTrench,
    photoDate: '2026-05-10',
    uploadedAt: '2026-05-11T09:20:00Z',
    uploadedBy: 'K. Venkatesh',
    uploaderRole: 'Field Officer',
    verificationStatus: 'Pending',
    notes: 'Pre-monsoon maintenance check of contour trenches. Minor silt accumulation in sector 3 trenches requires desiltation prior to peak rains.',
    exifData: {
      hasGps: true,
      cameraModel: 'Motorola Defy Rugged',
      dateTimeOriginal: '2026-05-10 11:15:00',
      altitudeMeters: 245.0,
      directionHeading: 15
    },
    evidenceQuality: {
      gpsQuality: 'Good',
      imageQuality: 'Good',
      satelliteMatch: 'Moderate',
      temporalConfidence: 'Moderate',
      completenessPercent: 78
    },
    satelliteContextSummary: {
      ndviSurrounding: 0.39,
      waterPresenceDetected: false,
      landCoverType: 'Scrub & Contour Slopes',
      bufferStatus: 'Moderate soil moisture retention'
    }
  },
  {
    id: 'obs-5',
    code: 'OBS-2026-0992',
    observationType: 'Water Body',
    watershedId: 'ws-1',
    watershedCode: 'WS-001',
    location: { lat: 18.2880, lng: 83.3850 },
    locationAccuracyMeters: 8.0,
    photoUrl: APP_IMAGES.percolationTank,
    photoDate: '2026-09-18',
    uploadedAt: '2026-09-18T11:45:00Z',
    uploadedBy: 'G. Suresh Kumar',
    uploaderRole: 'Viewer',
    verificationStatus: 'Needs Review',
    notes: 'Local community observation of newly formed wetland ponding along natural depression 400m downstream of Check Dam #001.',
    exifData: {
      hasGps: true,
      cameraModel: 'Xiaomi Redmi Note 12',
      dateTimeOriginal: '2026-09-18 10:50:33',
      altitudeMeters: 161.0,
      directionHeading: 195
    },
    evidenceQuality: {
      gpsQuality: 'Moderate',
      imageQuality: 'Good',
      satelliteMatch: 'Moderate',
      temporalConfidence: 'Moderate',
      completenessPercent: 72
    },
    satelliteContextSummary: {
      ndviSurrounding: 0.44,
      waterPresenceDetected: true,
      landCoverType: 'Moist Depression / Water Body',
      bufferStatus: 'Downstream seepage accumulation detected'
    }
  },
  {
    id: 'obs-6',
    code: 'OBS-2026-0740',
    observationType: 'Plantation',
    watershedId: 'ws-1',
    watershedCode: 'WS-001',
    interventionId: 'int-4',
    location: { lat: 18.2980, lng: 83.3980 },
    locationAccuracyMeters: 3.5,
    photoUrl: APP_IMAGES.contourTrench,
    photoDate: '2026-09-02',
    uploadedAt: '2026-09-02T15:10:00Z',
    uploadedBy: 'K. Venkatesh',
    uploaderRole: 'Field Officer',
    verificationStatus: 'Verified',
    notes: 'Sapling survival rate recorded at 89%. Canopy closure beginning to register prominently on 10m Sentinel-2 NDVI imagery.',
    exifData: {
      hasGps: true,
      cameraModel: 'Trimble TDC600',
      dateTimeOriginal: '2026-09-02 14:22:10',
      altitudeMeters: 210.5,
      directionHeading: 310
    },
    evidenceQuality: {
      gpsQuality: 'High',
      imageQuality: 'High',
      satelliteMatch: 'High',
      temporalConfidence: 'High',
      completenessPercent: 95
    },
    satelliteContextSummary: {
      ndviSurrounding: 0.48,
      waterPresenceDetected: false,
      landCoverType: 'Dense Plantation Canopy',
      bufferStatus: 'NDVI change of +0.14 observed compared to 2024'
    }
  },
  {
    id: 'obs-7',
    code: 'OBS-2026-0680',
    observationType: 'Check Dam',
    watershedId: 'ws-2',
    watershedCode: 'WS-002',
    interventionId: 'int-6',
    location: { lat: 18.0680, lng: 83.1810 },
    locationAccuracyMeters: 4.1,
    photoUrl: APP_IMAGES.checkDam,
    photoDate: '2026-08-30',
    uploadedAt: '2026-08-30T17:00:00Z',
    uploadedBy: 'Priya Sharma',
    uploaderRole: 'Officer',
    verificationStatus: 'Verified',
    notes: 'Tatipudi nala check dam retaining 2.2 ha water spread. Upstream groundwater table reported +1.8m higher by local village well monitor.',
    exifData: {
      hasGps: true,
      cameraModel: 'Samsung Galaxy S22',
      dateTimeOriginal: '2026-08-30 16:15:00',
      altitudeMeters: 112.0,
      directionHeading: 75
    },
    evidenceQuality: {
      gpsQuality: 'High',
      imageQuality: 'High',
      satelliteMatch: 'High',
      temporalConfidence: 'High',
      completenessPercent: 94
    },
    satelliteContextSummary: {
      ndviSurrounding: 0.47,
      waterPresenceDetected: true,
      landCoverType: 'Water Body / Irrigated Paddy',
      bufferStatus: 'Significant water retention in 1km buffer'
    }
  },
  {
    id: 'obs-8',
    code: 'OBS-2026-0612',
    observationType: 'Soil Conservation',
    watershedId: 'ws-3',
    watershedCode: 'WS-003',
    interventionId: 'int-8',
    location: { lat: 18.3680, lng: 83.5210 },
    locationAccuracyMeters: 5.0,
    photoUrl: APP_IMAGES.contourTrench,
    photoDate: '2026-08-05',
    uploadedAt: '2026-08-05T12:30:00Z',
    uploadedBy: 'Priya Sharma',
    uploaderRole: 'Officer',
    verificationStatus: 'Verified',
    notes: 'Boulder checks performing well. No severe soil scouring downstream. Local grasses establishing on trapped sediment benches.',
    exifData: {
      hasGps: true,
      cameraModel: 'Garmin Montana',
      dateTimeOriginal: '2026-08-05 11:45:00',
      altitudeMeters: 185.0,
      directionHeading: 120
    },
    evidenceQuality: {
      gpsQuality: 'High',
      imageQuality: 'High',
      satelliteMatch: 'Good',
      temporalConfidence: 'High',
      completenessPercent: 91
    },
    satelliteContextSummary: {
      ndviSurrounding: 0.44,
      waterPresenceDetected: false,
      landCoverType: 'Stabilized Ravine / Grassland',
      bufferStatus: 'Soil erosion mitigation confirmed'
    }
  }
];

export const MOCK_VERIFICATION_TASKS: VerificationTask[] = [
  {
    id: 'task-1',
    title: 'Verify sudden vegetation greenness surge in WS-001 Sector 4',
    watershedId: 'ws-1',
    watershedCode: 'WS-001',
    location: { lat: 18.2834, lng: 83.3912 },
    reason: 'Remote sensing indicates +0.15 NDVI jump near Check Dam #001. Requires ground confirmation of crop establishment vs invasive weed spread.',
    priority: 'High',
    status: 'Field Submitted',
    assignedTo: 'u-3',
    assignedToName: 'K. Venkatesh (Field Officer)',
    createdAt: '2026-09-12',
    dueDate: '2026-09-25',
    associatedObservationId: 'obs-1',
    associatedInterventionId: 'int-1',
    remoteAnomalyDescription: 'Sentinel-2 band 8/4 ratio detected rapid green biomass spike (+38%) over 60 days.',
    fieldResponseNotes: 'Ground inspection confirms double-cropped irrigated paddy enabled by Check Dam #001 backwater lift irrigation. Not weed proliferation.',
    fieldResponsePhotoUrl: APP_IMAGES.checkDam,
    reviewDecision: 'Confirmed'
  },
  {
    id: 'task-2',
    title: 'Inspect contour trenches integrity at WS-001 Gollapeta',
    watershedId: 'ws-1',
    watershedCode: 'WS-001',
    location: { lat: 18.3050, lng: 83.3650 },
    reason: 'Soil moisture signal lower than predicted after 45mm rainfall event.',
    priority: 'Medium',
    status: 'Assigned',
    assignedTo: 'u-3',
    assignedToName: 'K. Venkatesh (Field Officer)',
    createdAt: '2026-09-16',
    dueDate: '2026-10-02',
    associatedInterventionId: 'int-5',
    remoteAnomalyDescription: 'Thermal infrared anomaly indicates faster dry-out than surrounding catchment slopes.',
    fieldResponseNotes: undefined,
    fieldResponsePhotoUrl: undefined,
    reviewDecision: undefined
  },
  {
    id: 'task-3',
    title: 'Validate water body expansion reported at Kothavalasa',
    watershedId: 'ws-2',
    watershedCode: 'WS-002',
    location: { lat: 18.0550, lng: 83.1950 },
    reason: 'Water surface anomaly detected by SAR / NDWI thresholding.',
    priority: 'Medium',
    status: 'Open',
    createdAt: '2026-09-22',
    dueDate: '2026-10-05',
    associatedInterventionId: 'int-7',
    remoteAnomalyDescription: 'Water index pixel count expanded from 0.5 ha to 1.1 ha.',
    fieldResponseNotes: undefined,
    fieldResponsePhotoUrl: undefined,
    reviewDecision: undefined
  },
  {
    id: 'task-4',
    title: 'Address missing GPS metadata on community observation OBS-0992',
    watershedId: 'ws-1',
    watershedCode: 'WS-001',
    location: { lat: 18.2880, lng: 83.3850 },
    reason: 'Observation submitted with estimated manual location requiring high-precision differential GPS lock.',
    priority: 'Low',
    status: 'Open',
    createdAt: '2026-09-24',
    dueDate: '2026-10-10',
    associatedObservationId: 'obs-5',
    remoteAnomalyDescription: 'Potential location drift relative to digital drainage centerline.',
    fieldResponseNotes: undefined,
    fieldResponsePhotoUrl: undefined,
    reviewDecision: undefined
  }
];

export const MOCK_ALERTS: AlertItem[] = [
  {
    id: 'alt-1',
    type: 'vegetation_change',
    severity: 'warning',
    title: 'Potential Vegetation Change Detected (+38%)',
    description: 'NDVI time-series in 500m buffer of Check Dam #001 indicates significant upward greenness inflection. Verify whether due to second-season cropping.',
    watershedId: 'ws-1',
    watershedCode: 'WS-001',
    location: { lat: 18.2834, lng: 83.3912 },
    date: '2026-09-18',
    resolved: false,
    relatedInterventionId: 'int-1',
    relatedObservationId: 'obs-1'
  },
  {
    id: 'alt-2',
    type: 'water_change',
    severity: 'info',
    title: 'Surface Water Extent Increased (+50%)',
    description: 'Post-monsoon satellite-derived water extent reached 1.8 ha compared to 1.2 ha baseline at Vangara stream catchment.',
    watershedId: 'ws-1',
    watershedCode: 'WS-001',
    location: { lat: 18.2834, lng: 83.3912 },
    date: '2026-09-15',
    resolved: false,
    relatedInterventionId: 'int-1'
  },
  {
    id: 'alt-3',
    type: 'missing_verification',
    severity: 'high',
    title: 'Pending Field Verification: Continuous Contour Trenching #005',
    description: 'Structure has been completed for 10 months without mandatory post-monsoon geotagged verification photograph.',
    watershedId: 'ws-1',
    watershedCode: 'WS-001',
    location: { lat: 18.3050, lng: 83.3650 },
    date: '2026-09-10',
    resolved: false,
    relatedInterventionId: 'int-5'
  },
  {
    id: 'alt-4',
    type: 'gps_mismatch',
    severity: 'warning',
    title: 'Moderate GPS Spatial Offset on OBS-2026-0992',
    description: 'Exif GPS coordinate indicates 42m offset from mapped drainage line. Field re-survey recommended.',
    watershedId: 'ws-1',
    watershedCode: 'WS-001',
    location: { lat: 18.2880, lng: 83.3850 },
    date: '2026-09-22',
    resolved: false,
    relatedObservationId: 'obs-5'
  }
];

export const MOCK_WATER_BODIES: WaterBodyFeature[] = [
  {
    id: 'wb-1',
    name: 'Vangara Check Dam Impoundment',
    watershedId: 'ws-1',
    type: 'Percolation Tank',
    center: { lat: 18.2834, lng: 83.3912 },
    areaHa2024: 1.2,
    areaHa2026: 1.8,
    polygon: [
      [18.2845, 83.3900],
      [18.2850, 83.3925],
      [18.2835, 83.3930],
      [18.2825, 83.3915],
      [18.2830, 83.3895],
      [18.2845, 83.3900]
    ]
  },
  {
    id: 'wb-2',
    name: 'Garugubilli Percolation Reservoir',
    watershedId: 'ws-1',
    type: 'Irrigation Tank',
    center: { lat: 18.2715, lng: 83.4080 },
    areaHa2024: 2.1,
    areaHa2026: 3.4,
    polygon: [
      [18.2740, 83.4060],
      [18.2750, 83.4110],
      [18.2710, 83.4130],
      [18.2680, 83.4090],
      [18.2700, 83.4050],
      [18.2740, 83.4060]
    ]
  },
  {
    id: 'wb-3',
    name: 'Tatipudi Storage Reservoir',
    watershedId: 'ws-2',
    type: 'Reservoir',
    center: { lat: 18.0680, lng: 83.1810 },
    areaHa2024: 1.5,
    areaHa2026: 2.2,
    polygon: [
      [18.0710, 83.1780],
      [18.0720, 83.1840],
      [18.0660, 83.1850],
      [18.0640, 83.1800],
      [18.0680, 83.1760],
      [18.0710, 83.1780]
    ]
  }
];

export const MOCK_DRAINAGE_NETWORKS: DrainageFeature[] = [
  {
    id: 'dr-1',
    order: 3,
    watershedId: 'ws-1',
    coordinates: [
      [18.3150, 83.3550],
      [18.3050, 83.3700],
      [18.2910, 83.3760],
      [18.2834, 83.3912],
      [18.2715, 83.4080],
      [18.2520, 83.4200]
    ]
  },
  {
    id: 'dr-2',
    order: 2,
    watershedId: 'ws-1',
    coordinates: [
      [18.3100, 83.4100],
      [18.2980, 83.3980],
      [18.2834, 83.3912]
    ]
  },
  {
    id: 'dr-3',
    order: 1,
    watershedId: 'ws-1',
    coordinates: [
      [18.3050, 83.3650],
      [18.2980, 83.3710],
      [18.2910, 83.3760]
    ]
  },
  {
    id: 'dr-4',
    order: 3,
    watershedId: 'ws-2',
    coordinates: [
      [18.0900, 83.1650],
      [18.0780, 83.1720],
      [18.0680, 83.1810],
      [18.0550, 83.1950],
      [18.0400, 83.2050]
    ]
  }
];
