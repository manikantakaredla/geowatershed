import React from 'react';
import { CheckCircle2, AlertTriangle, Clock, MapPin, Satellite, Calendar, ShieldCheck, Camera, Layers } from 'lucide-react';
import { VerificationStatus } from '../../types';

interface EvidenceChainBadgeProps {
  hasPhoto?: boolean;
  hasGps?: boolean;
  hasWatershed?: boolean;
  hasSatellite?: boolean;
  hasTemporal?: boolean;
  hasAnalysis?: boolean;
  verificationStatus?: VerificationStatus;
  compact?: boolean;
}

export const EvidenceChainBadge: React.FC<EvidenceChainBadgeProps> = ({
  hasPhoto = true,
  hasGps = true,
  hasWatershed = true,
  hasSatellite = true,
  hasTemporal = true,
  hasAnalysis = true,
  verificationStatus = 'Verified',
  compact = false
}) => {
  const steps = [
    {
      id: 'photo',
      label: 'Ground Photo',
      icon: Camera,
      status: hasPhoto ? 'verified' : 'missing',
      desc: 'Geo-coded inspection photo'
    },
    {
      id: 'gps',
      label: 'GPS Location',
      icon: MapPin,
      status: hasGps ? 'verified' : 'warning',
      desc: 'Extracted EXIF coordinate'
    },
    {
      id: 'watershed',
      label: 'Watershed',
      icon: Layers,
      status: hasWatershed ? 'verified' : 'missing',
      desc: 'Catchment polygon bound'
    },
    {
      id: 'satellite',
      label: 'Satellite Context',
      icon: Satellite,
      status: hasSatellite ? 'verified' : 'pending',
      desc: 'Sentinel-2 10m buffer'
    },
    {
      id: 'temporal',
      label: 'Temporal Data',
      icon: Calendar,
      status: hasTemporal ? 'verified' : 'pending',
      desc: 'Multi-year (2024–2026) series'
    },
    {
      id: 'analysis',
      label: 'Analysis',
      icon: CheckCircle2,
      status: hasAnalysis ? 'verified' : 'pending',
      desc: 'NDVI / NDWI spectral delta'
    },
    {
      id: 'verification',
      label: 'Field Verification',
      icon: ShieldCheck,
      status: verificationStatus === 'Verified' ? 'verified' : (verificationStatus === 'Pending' ? 'warning' : 'info'),
      desc: `Officer status: ${verificationStatus}`
    }
  ];

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-mono text-slate-700">
        <span className="font-semibold text-[10px] uppercase text-slate-500 mr-1">Evidence Chain:</span>
        {steps.map((s, idx) => {
          const isOk = s.status === 'verified';
          const isWarn = s.status === 'warning';
          return (
            <span
              key={s.id}
              title={`${s.label}: ${s.desc}`}
              className={`inline-flex items-center text-xs font-medium ${
                isOk ? 'text-emerald-700' : isWarn ? 'text-amber-700' : 'text-slate-400'
              }`}
            >
              {isOk ? '✓' : isWarn ? '!' : '○'}
              <span className="ml-0.5 hidden xl:inline">{s.label.split(' ')[0]}</span>
              {idx < steps.length - 1 && <span className="mx-1 text-slate-300">→</span>}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-blue-50 text-blue-700">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Spatial Evidence Verification Chain
            </h4>
            <p className="text-[11px] text-slate-500">Ground truth to remote sensing link verification</p>
          </div>
        </div>
        <span className={`px-2.5 py-0.5 text-xs font-mono font-semibold rounded-md border ${
          verificationStatus === 'Verified'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-amber-50 text-amber-800 border-amber-200'
        }`}>
          {verificationStatus === 'Verified' ? 'Complete Chain (100%)' : 'Verification In-Progress'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {steps.map((step, index) => {
          const isOk = step.status === 'verified';
          const isWarn = step.status === 'warning';
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`relative flex flex-col items-center text-center p-2.5 rounded-lg border transition-colors ${
                isOk
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : isWarn
                  ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center mb-1.5 ${
                  isOk
                    ? 'bg-emerald-100 text-emerald-700'
                    : isWarn
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isOk ? <CheckCircle2 className="w-3.5 h-3.5" /> : isWarn ? <AlertTriangle className="w-3.5 h-3.5" /> : <Icon className="w-3 h-3" />}
              </div>

              <span className="text-[11px] font-semibold tracking-tight">{step.label}</span>
              <span className="text-[10px] text-slate-500 mt-0.5 capitalize">{step.status}</span>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300 font-mono text-xs">
                  ›
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
