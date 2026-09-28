import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ArrowLeft, 
  Layers, 
  Camera, 
  Droplet, 
  TrendingUp, 
  FileText, 
  Maximize2, 
  X,
  ExternalLink,
  ShieldCheck,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LeafletMap } from '../components/map/LeafletMap';
import { EvidenceChainBadge } from '../components/common/EvidenceChainBadge';
import { ConfidenceMeter } from '../components/common/ConfidenceMeter';
import { formatCoordinates } from '../utils/geo';

export const InterventionDetailPage: React.FC = () => {
  const { 
    interventions, 
    selectedInterventionId, 
    navigate,
    fieldObservations,
    timelineYear,
    setTimelineYear
  } = useApp();

  const [bufferRadius, setBufferRadius] = useState<number>(500);
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);

  const intervention = interventions.find(i => i.id === selectedInterventionId) || interventions[0];

  const activeMetrics = intervention.satelliteObservedChange;
  const currentMetrics = 
    timelineYear === 2024 
      ? activeMetrics.year2024 
      : timelineYear === 2025 
      ? activeMetrics.year2025 
      : activeMetrics.year2026;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <button
            onClick={() => navigate('/interventions')}
            className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-1 transition-colors cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Interventions
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
              {intervention.code}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {intervention.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {intervention.verificationStatus}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1.5 font-mono">
            <span>Location: <strong className="text-slate-800">{formatCoordinates(intervention.location.lat, intervention.location.lng)}</strong></span>
            <span>Catchment: <strong className="text-slate-800">{intervention.watershedCode}</strong></span>
            <span>Built: <strong className="text-slate-800">{intervention.implementationYear}</strong></span>
            <span>Village: <strong className="text-slate-800">{intervention.village}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/reports')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Export Dossier</span>
          </button>
          <button
            onClick={() => navigate('/alerts')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Field Verification</span>
          </button>
        </div>
      </div>

      {/* Primary Evidence Chain Banner */}
      <EvidenceChainBadge 
        hasPhoto={true}
        hasGps={true}
        hasWatershed={true}
        hasSatellite={true}
        hasTemporal={true}
        hasAnalysis={true}
        verificationStatus={intervention.verificationStatus}
      />

      {/* The 3-Column Evidence Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Ground Evidence */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-600" /> Ground Evidence (Photo)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                GPS EXIF LOCKED
              </span>
            </div>

            {/* Main Primary Photo */}
            <div 
              onClick={() => setFullscreenPhoto(intervention.primaryPhotoUrl)}
              className="relative w-full h-56 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group"
            >
              <img
                src={intervention.primaryPhotoUrl}
                alt={intervention.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                <span className="text-xs text-white flex items-center gap-1 font-semibold">
                  <Maximize2 className="w-3.5 h-3.5" /> Enlarge Photo
                </span>
                <span className="text-[11px] text-white font-mono">{intervention.lastInspectionDate}</span>
              </div>
            </div>

            {/* Additional Photos strip */}
            {intervention.additionalPhotos.length > 0 && (
              <div className="flex gap-2 mt-3">
                {intervention.additionalPhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    onClick={() => setFullscreenPhoto(photo)}
                    className="w-16 h-14 rounded-md overflow-hidden border border-slate-200 cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <img src={photo} alt={`additional-${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Ground Metadata */}
            <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Photo Date:</span>
                <span className="text-slate-800 font-semibold">{intervention.lastInspectionDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GPS Coordinates:</span>
                <span className="text-slate-800 font-semibold">{formatCoordinates(intervention.location.lat, intervention.location.lng)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Inspector:</span>
                <span className="text-slate-800">{intervention.inspectorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Structure Capacity:</span>
                <span className="text-slate-800 font-semibold">{intervention.capacityM3?.toLocaleString()} m³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Catchment Area:</span>
                <span className="text-slate-800">{intervention.catchmentAreaHa} hectares</span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-3">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Engineering Specification
              </span>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {intervention.description}
              </p>
            </div>
          </div>

          {/* Quality Matrix */}
          <ConfidenceMeter completenessPercent={94} />
        </div>

        {/* Column 2 & 3: GIS Location & Satellite Context */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-blue-50 text-blue-700">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    GIS Location & Satellite Context
                  </h3>
                  <p className="text-[11px] text-slate-500">Sentinel-2 multi-spectral scene around structure</p>
                </div>
              </div>

              {/* Buffer Radius Selector */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200 text-xs">
                <span className="text-[10px] font-mono text-slate-500 px-2 uppercase font-semibold">
                  Buffer Radius:
                </span>
                {[250, 500, 1000, 2000].map((rad) => (
                  <button
                    key={rad}
                    onClick={() => setBufferRadius(rad)}
                    className={`px-2.5 py-1 rounded-md font-mono font-medium transition-colors cursor-pointer ${
                      bufferRadius === rad
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {rad >= 1000 ? `${rad / 1000} km` : `${rad} m`}
                  </button>
                ))}
              </div>
            </div>

            {/* Map Canvas with dynamic buffer circle */}
            <div className="w-full h-[400px] rounded-lg overflow-hidden border border-slate-200 relative">
              <LeafletMap
                center={[intervention.location.lat, intervention.location.lng]}
                zoom={bufferRadius === 250 ? 16 : bufferRadius === 500 ? 15 : bufferRadius === 1000 ? 14 : 13}
                height="100%"
                selectedIntervention={intervention}
                bufferRadiusMeters={bufferRadius}
              />
            </div>

            {/* Environmental Indicators in Buffer */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Water Extent Card */}
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700 uppercase font-mono flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-blue-600" /> Water Extent ({bufferRadius}m Buffer)
                  </span>
                  <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 font-bold">
                    +50% Observed
                  </span>
                </div>
                <div className="flex items-baseline gap-3 my-1">
                  <div className="text-xs text-slate-500 font-mono">
                    2024: <span className="text-slate-800 font-bold">1.2 ha</span>
                  </div>
                  <span className="text-slate-400">→</span>
                  <div className="text-base text-blue-700 font-bold font-mono">
                    {currentMetrics.waterExtentHa} ha <span className="text-xs font-normal text-slate-500">({timelineYear})</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Satellite-derived surface water mask. Confirmed retention in impoundment.
                </p>
              </div>

              {/* Vegetation NDVI Card */}
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700 uppercase font-mono flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Vegetation NDVI ({bufferRadius}m Buffer)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-bold">
                    +0.15 Delta
                  </span>
                </div>
                <div className="flex items-baseline gap-3 my-1">
                  <div className="text-xs text-slate-500 font-mono">
                    2024: <span className="text-slate-800 font-bold">0.31</span>
                  </div>
                  <span className="text-slate-400">→</span>
                  <div className="text-base text-emerald-700 font-bold font-mono">
                    {currentMetrics.ndvi} <span className="text-xs font-normal text-slate-500">({timelineYear})</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Observed vegetation change. Note: indicates greenness inflection; field verification confirms cause.
                </p>
              </div>
            </div>

            {/* Timeline Controls */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Temporal Sequence Observation:
                </span>
              </div>

              <div className="flex items-center gap-2">
                {[2024, 2025, 2026].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setTimelineYear(yr)}
                    className={`px-4 py-1.5 rounded-lg font-mono text-xs font-bold transition-colors cursor-pointer ${
                      timelineYear === yr
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {yr} {yr === 2024 ? '(Baseline)' : yr === 2025 ? '(Built)' : '(Current)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {fullscreenPhoto && (
        <div 
          onClick={() => setFullscreenPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setFullscreenPhoto(null)}
              className="absolute top-3 right-3 p-1 rounded-full bg-white/90 text-slate-700 hover:bg-white cursor-pointer z-10 shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={fullscreenPhoto}
              alt="Evidence photo"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-700">
              <span className="font-bold">{intervention.code} &bull; {intervention.name}</span>
              <span className="text-slate-500">{formatCoordinates(intervention.location.lat, intervention.location.lng)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
