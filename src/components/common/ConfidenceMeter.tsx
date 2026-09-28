import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface ConfidenceMeterProps {
  gpsQuality?: 'High' | 'Good' | 'Moderate' | 'Poor';
  imageQuality?: 'High' | 'Good' | 'Fair' | 'Poor';
  satelliteMatch?: 'High' | 'Good' | 'Moderate' | 'Pending';
  temporalConfidence?: 'High' | 'Moderate' | 'Low';
  completenessPercent?: number;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  gpsQuality = 'High',
  imageQuality = 'Good',
  satelliteMatch = 'Good',
  temporalConfidence = 'Moderate',
  completenessPercent = 86
}) => {
  const getBadge = (val: string) => {
    if (val === 'High') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (val === 'Good') return 'bg-blue-50 text-blue-800 border-blue-200';
    if (val === 'Moderate' || val === 'Fair') return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-red-50 text-red-800 border-red-200';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-blue-600" /> Evidence Quality Matrix
        </div>
        <span className="text-xs font-mono font-bold text-slate-900">
          {completenessPercent}% Completeness
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
          <span className="text-slate-600 text-[11px] font-medium">GPS Accuracy</span>
          <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded border ${getBadge(gpsQuality)}`}>
            {gpsQuality}
          </span>
        </div>

        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
          <span className="text-slate-600 text-[11px] font-medium">Image Quality</span>
          <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded border ${getBadge(imageQuality)}`}>
            {imageQuality}
          </span>
        </div>

        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
          <span className="text-slate-600 text-[11px] font-medium">Satellite Match</span>
          <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded border ${getBadge(satelliteMatch)}`}>
            {satelliteMatch}
          </span>
        </div>

        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
          <span className="text-slate-600 text-[11px] font-medium">Temporal Match</span>
          <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded border ${getBadge(temporalConfidence)}`}>
            {temporalConfidence}
          </span>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] text-slate-500">
        <Info className="w-3 h-3 text-blue-600 shrink-0" />
        <span>Calculated deterministically from camera hardware EXIF and temporal proximity.</span>
      </div>
    </div>
  );
};
