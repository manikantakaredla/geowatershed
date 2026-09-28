import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Layers, 
  Sliders, 
  Info, 
  ArrowRightLeft,
  CheckCircle2,
  ShieldAlert,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SplitCompareMap } from '../components/map/SplitCompareMap';

export const ChangeDetectionPage: React.FC = () => {
  const { watersheds, selectedWatershed, setSelectedWatershedId, navigate } = useApp();
  const [beforeYear, setBeforeYear] = useState<number>(2024);
  const [afterYear, setAfterYear] = useState<number>(2026);
  const [changeIndicator, setChangeIndicator] = useState<string>('Vegetation');

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Temporal Change Detection</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Split-screen swipe comparison between multi-temporal remote sensing scenes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/alerts')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Assign Field Verification</span>
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Watershed */}
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Watershed</span>
            <select
              value={selectedWatershed.id}
              onChange={(e) => setSelectedWatershedId(e.target.value)}
              className="bg-slate-50 text-slate-900 text-xs rounded-lg px-3 py-1.5 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
            >
              {watersheds.map(ws => (
                <option key={ws.id} value={ws.id}>{ws.code} &bull; {ws.name}</option>
              ))}
            </select>
          </div>

          {/* Before */}
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Before Scene</span>
            <select
              value={beforeYear}
              onChange={(e) => setBeforeYear(Number(e.target.value))}
              className="bg-slate-50 text-slate-900 text-xs rounded-lg px-3 py-1.5 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value={2024}>2024 (Pre-monsoon baseline)</option>
              <option value={2025}>2025 (Mid-term)</option>
            </select>
          </div>

          {/* After */}
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">After Scene</span>
            <select
              value={afterYear}
              onChange={(e) => setAfterYear(Number(e.target.value))}
              className="bg-slate-50 text-slate-900 text-xs rounded-lg px-3 py-1.5 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value={2026}>2026 (Post-intervention verified)</option>
              <option value={2025}>2025 (Mid-term)</option>
            </select>
          </div>

          {/* Indicator */}
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Indicator Focus</span>
            <select
              value={changeIndicator}
              onChange={(e) => setChangeIndicator(e.target.value)}
              className="bg-slate-50 text-slate-900 text-xs rounded-lg px-3 py-1.5 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="Vegetation">Vegetation (NDVI Biomass)</option>
              <option value="Water">Surface Water Extent (NDWI)</option>
              <option value="LandUse">Land-Use Transformation</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 w-full md:w-auto justify-end">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
            Interactive Swipe Active
          </span>
        </div>
      </div>

      {/* Swipe Comparison Component */}
      <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-xs border border-slate-200">
        <SplitCompareMap />
      </div>

      {/* Attribution Notice */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <span className="font-bold text-slate-900 uppercase tracking-wide font-mono block">
            Remote-Sensing Attribution Notice
          </span>
          <p className="text-slate-600 leading-relaxed">
            Satellite temporal change detection isolates pixel-level spectral reflectance deltas over time. 
            However, broad environmental factors (e.g. monsoonal precipitation variations) also influence vegetation greenness and surface ponding. 
            The platform strictly enforces ground-truth field verification before confirming causal attribution to structural interventions.
          </p>
        </div>
      </div>
    </div>
  );
};
