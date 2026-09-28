import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ArrowLeft, 
  Layers, 
  Satellite, 
  ShieldCheck, 
  Droplet, 
  TrendingUp, 
  User, 
  FileText, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LeafletMap } from '../components/map/LeafletMap';
import { EvidenceChainBadge } from '../components/common/EvidenceChainBadge';
import { ConfidenceMeter } from '../components/common/ConfidenceMeter';
import { formatCoordinates } from '../utils/geo';

export const EvidenceDetailPage: React.FC = () => {
  const { 
    fieldObservations, 
    selectedObservationId, 
    navigate,
    verifyObservation,
    setSelectedInterventionId
  } = useApp();

  const observation = fieldObservations.find(o => o.id === selectedObservationId) || fieldObservations[0];
  const [verifying, setVerifying] = useState(false);

  const handleVerify = (status: 'Verified' | 'Inconclusive' | 'Needs Review') => {
    setVerifying(true);
    setTimeout(() => {
      verifyObservation(observation.id, status);
      setVerifying(false);
    }, 400);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <button
            onClick={() => navigate('/evidence')}
            className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-1 transition-colors cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Evidence Repository
          </button>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
              {observation.code}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {observation.observationType} Field Record
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
              observation.verificationStatus === 'Verified'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {observation.verificationStatus}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            {formatCoordinates(observation.location.lat, observation.location.lng)} &bull; {observation.watershedCode}
          </p>
        </div>

        {/* Verification Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/explorer')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            View on Map
          </button>
          {observation.verificationStatus !== 'Verified' ? (
            <button
              onClick={() => handleVerify('Verified')}
              disabled={verifying}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{verifying ? 'Verifying...' : 'Mark Verified'}</span>
            </button>
          ) : (
            <button
              onClick={() => handleVerify('Needs Review')}
              className="px-3.5 py-2 bg-white text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Request Re-verification
            </button>
          )}
        </div>
      </div>

      {/* Prominent Evidence Chain */}
      <EvidenceChainBadge verificationStatus={observation.verificationStatus} />

      {/* Ground-Satellite Link Banner */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-800">
          <Satellite className="w-4 h-4 text-blue-600" />
          <span className="font-bold">GROUND → SATELLITE EVIDENCE LINK:</span>
          <span className="text-slate-600 hidden md:inline">
            Ground photo anchored at {formatCoordinates(observation.location.lat, observation.location.lng)} inside catchment {observation.watershedCode}
          </span>
        </div>
        <span className="text-emerald-700 font-bold">100% Geometry Matched</span>
      </div>

      {/* Two Column Layout: Photo & Evidence Details | Satellite Context & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Photo & Sensor Metadata */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="w-full h-72 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative">
              <img
                src={observation.photoUrl}
                alt={observation.code}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-white/90 text-[10px] font-mono font-semibold text-slate-800 shadow-xs">
                {observation.photoDate} &bull; {observation.observationType}
              </div>
            </div>

            {/* Notes */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Field Inspection Report
              </span>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{observation.notes}"
              </p>
              <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Officer: {observation.uploadedBy} ({observation.uploaderRole})</span>
                <span>Accuracy: ±{observation.locationAccuracyMeters}m</span>
              </div>
            </div>

            {/* EXIF Data Panel */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg space-y-1.5 text-xs font-mono">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                GNSS Hardware / EXIF Metadata
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Camera Device:</span>
                <span className="text-slate-900 font-semibold">{observation.exifData.cameraModel || 'Trimble TDC600'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Original Timestamp:</span>
                <span className="text-slate-900 font-semibold">{observation.exifData.dateTimeOriginal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Elevation:</span>
                <span className="text-slate-900 font-semibold">{observation.exifData.altitudeMeters} m ASL</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Heading:</span>
                <span className="text-slate-900 font-semibold">{observation.exifData.directionHeading}° SE</span>
              </div>
            </div>

            {/* Quality Matrix */}
            <ConfidenceMeter completenessPercent={observation.evidenceQuality.completenessPercent} />
          </div>
        </div>

        {/* Right Column: Satellite Context & Environmental Indicators */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Satellite className="w-4 h-4 text-blue-600" /> Satellite Environmental Context
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                10M MULTI-SPECTRAL
              </span>
            </div>

            {/* Interactive Map */}
            <div className="w-full h-80 rounded-lg overflow-hidden border border-slate-200">
              <LeafletMap
                center={[observation.location.lat, observation.location.lng]}
                zoom={16}
                height="100%"
                bufferRadiusMeters={500}
              />
            </div>

            {/* Environmental Indicators Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="flex items-center justify-between mb-1 text-slate-500">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Vegetation (NDVI)</span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-lg font-bold font-mono text-emerald-700">
                  {observation.satelliteContextSummary.ndviSurrounding}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Surrounding NIR/Red pixel ratio</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="flex items-center justify-between mb-1 text-slate-500">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Water Presence</span>
                  <Droplet className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-lg font-bold font-mono text-blue-700">
                  {observation.satelliteContextSummary.waterPresenceDetected ? 'Detected (+50%)' : 'None Detected'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Multi-spectral NDWI thresholding</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Land-Use / Land-Cover
                </div>
                <div className="font-semibold text-slate-800">
                  {observation.satelliteContextSummary.landCoverType}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Automated classification mask</div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Catchment Buffer Status
                </div>
                <div className="font-semibold text-slate-800 truncate">
                  {observation.satelliteContextSummary.bufferStatus}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">500m hydrological envelope</div>
              </div>
            </div>

            {/* Link to Parent Intervention if applicable */}
            {observation.interventionId && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
                    Linked Structure
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Check Dam #001 - Vangara Stream
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedInterventionId(observation.interventionId!);
                    navigate(`/interventions/${observation.interventionId}`);
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  View Intervention Intelligence →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
