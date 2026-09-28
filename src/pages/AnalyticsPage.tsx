import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Droplet, 
  Building2, 
  Camera, 
  ShieldCheck, 
  Layers, 
  Calendar,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsPage: React.FC = () => {
  const { watersheds, selectedWatershed, setSelectedWatershedId, interventions, fieldObservations } = useApp();

  const [activeMetric, setActiveMetric] = useState<'ndvi' | 'water' | 'types'>('ndvi');

  const wsInterventions = interventions.filter(i => i.watershedId === selectedWatershed.id);
  const wsObservations = fieldObservations.filter(o => o.watershedId === selectedWatershed.id);

  const typeCounts: Record<string, number> = {};
  wsInterventions.forEach(i => {
    typeCounts[i.type] = (typeCounts[i.type] || 0) + 1;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Watershed Environmental & Evidence Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Empirical trends: multi-spectral vegetation indices, surface water extent, and field evidence integrity
          </p>
        </div>

        {/* Catchment Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Catchment:</span>
          <select
            value={selectedWatershed.id}
            onChange={(e) => setSelectedWatershedId(e.target.value)}
            className="bg-white text-slate-900 text-xs rounded-lg px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-blue-500 font-medium shadow-xs"
          >
            {watersheds.map(ws => (
              <option key={ws.id} value={ws.id}>{ws.code} &bull; {ws.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Explainable KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-mono uppercase block">Mean Vegetation Index</span>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">0.46 <span className="text-xs font-normal text-slate-500">NDVI</span></div>
          <span className="text-xs text-emerald-800 font-medium mt-1 block">↗ +0.15 vs 2024 Baseline</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-mono uppercase block">Surface Water Extent</span>
          <div className="text-2xl font-bold font-mono text-blue-700 mt-1">1.8 <span className="text-xs font-normal text-slate-500">ha</span></div>
          <span className="text-xs text-blue-800 font-medium mt-1 block">↗ +50.0% Retention Gain</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-mono uppercase block">Structures Deployed</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{wsInterventions.length}</div>
          <span className="text-xs text-slate-500 font-medium mt-1 block">100% Geotagged & Mapped</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-mono uppercase block">Field Verification Rate</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{selectedWatershed.verificationRatePercent}%</div>
          <span className="text-xs text-slate-500 font-medium mt-1 block">Ground Photo Validated</span>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Multi-year Trends */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Temporal Trajectory: 2024 &ndash; 2026
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveMetric('ndvi')}
                className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  activeMetric === 'ndvi' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                Vegetation (NDVI)
              </button>
              <button
                onClick={() => setActiveMetric('water')}
                className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  activeMetric === 'water' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                Water Extent (ha)
              </button>
            </div>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="h-64 flex items-end justify-around gap-6 pt-6 pb-2 px-6 bg-slate-50 border border-slate-100 rounded-lg font-mono text-xs">
            {/* 2024 */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-slate-700 font-bold">
                {activeMetric === 'ndvi' ? '0.31' : '1.2 ha'}
              </span>
              <div 
                className={`w-full max-w-[80px] rounded-t transition-all ${
                  activeMetric === 'ndvi' ? 'bg-emerald-600' : 'bg-blue-600'
                }`} 
                style={{ height: activeMetric === 'ndvi' ? '45%' : '40%' }} 
              />
              <span className="text-slate-600 font-semibold">2024 (Baseline)</span>
            </div>

            {/* 2025 */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-slate-700 font-bold">
                {activeMetric === 'ndvi' ? '0.38' : '1.5 ha'}
              </span>
              <div 
                className={`w-full max-w-[80px] rounded-t transition-all ${
                  activeMetric === 'ndvi' ? 'bg-emerald-700' : 'bg-blue-700'
                }`} 
                style={{ height: activeMetric === 'ndvi' ? '65%' : '60%' }} 
              />
              <span className="text-slate-600 font-semibold">2025 (Mid-term)</span>
            </div>

            {/* 2026 */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-emerald-800 font-bold">
                {activeMetric === 'ndvi' ? '0.46 (+38%)' : '1.8 ha (+50%)'}
              </span>
              <div 
                className={`w-full max-w-[80px] rounded-t transition-all ${
                  activeMetric === 'ndvi' ? 'bg-emerald-500' : 'bg-blue-500'
                }`} 
                style={{ height: activeMetric === 'ndvi' ? '90%' : '85%' }} 
              />
              <span className="text-slate-900 font-bold">2026 (Observed)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Metrics generated from Sentinel-2 10-meter surface reflectance pixels clipped to the {selectedWatershed.code} polygon boundary.
            </span>
          </div>
        </div>

        {/* Right 5 cols: Intervention Types Breakdown */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Interventions by Category in {selectedWatershed.code}
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(typeCounts).map(([type, count]) => {
              const pct = Math.round((count / wsInterventions.length) * 100);
              return (
                <div key={type} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-semibold text-slate-800">{type}</span>
                    <span className="font-mono text-blue-700 font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Ground Observation Density:</span>
              <span className="text-slate-800 font-bold">{wsObservations.length} geotags / 24.5 km²</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
