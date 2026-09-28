import React, { useState } from 'react';
import { 
  Satellite, 
  Layers, 
  Play, 
  TrendingUp, 
  Droplet, 
  Calendar, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  PieChart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LeafletMap } from '../components/map/LeafletMap';

export const SatelliteAnalysisPage: React.FC = () => {
  const { 
    watersheds, 
    selectedWatershed, 
    setSelectedWatershedId, 
    activeLayers, 
    toggleLayer
  } = useApp();

  const [indicator, setIndicator] = useState<'ndvi' | 'ndwi' | 'water' | 'lulc' | 'slope'>('ndvi');
  const [beforeYear, setBeforeYear] = useState<number>(2024);
  const [afterYear, setAfterYear] = useState<number>(2026);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisRunTime, setAnalysisRunTime] = useState<string>('2026-09-24 14:10 UTC');

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisRunTime(new Date().toLocaleTimeString());
      if (indicator === 'ndvi' && !activeLayers.ndvi) toggleLayer('ndvi');
      if (indicator === 'ndwi' && !activeLayers.ndwi) toggleLayer('ndwi');
    }, 600);
  };

  const lulcCategories = [
    { name: 'Agriculture (Irrigated & Rainfed)', areaKm2: 13.2, pct: 54, color: 'bg-emerald-600' },
    { name: 'Natural Forest & Shrub Canopy', areaKm2: 5.4, pct: 22, color: 'bg-emerald-800' },
    { name: 'Barren & Degraded Wasteland', areaKm2: 2.5, pct: 10, color: 'bg-amber-600' },
    { name: 'Surface Water Bodies & Reservoirs', areaKm2: 2.0, pct: 8, color: 'bg-blue-600' },
    { name: 'Settlement / Built-up Area', areaKm2: 1.4, pct: 6, color: 'bg-slate-500' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Satellite className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Satellite Environmental Analysis</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Multi-spectral earth observation indicators & temporal baseline comparison
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono">
          Principle: Observed change ≠ causal proof without ground verification
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-4">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" /> Multi-Spectral Indicator Controls
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Watershed */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Watershed
            </label>
            <select
              value={selectedWatershed.id}
              onChange={(e) => setSelectedWatershedId(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs rounded-lg px-3 py-2 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
            >
              {watersheds.map(ws => (
                <option key={ws.id} value={ws.id}>{ws.code} &bull; {ws.name}</option>
              ))}
            </select>
          </div>

          {/* Indicator */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Indicator
            </label>
            <select
              value={indicator}
              onChange={(e) => setIndicator(e.target.value as any)}
              className="w-full bg-slate-50 text-slate-900 text-xs rounded-lg px-3 py-2 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="ndvi">NDVI (Vegetation Index)</option>
              <option value="ndwi">NDWI (Water Index)</option>
              <option value="water">Surface Water Extent</option>
              <option value="lulc">Land Use / Land Cover</option>
              <option value="slope">Topographic Slope / DEM</option>
            </select>
          </div>

          {/* Before Year */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Before (Baseline)
            </label>
            <select
              value={beforeYear}
              onChange={(e) => setBeforeYear(Number(e.target.value))}
              className="w-full bg-slate-50 text-slate-900 text-xs rounded-lg px-3 py-2 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value={2024}>2024 (Pre-intervention)</option>
              <option value={2025}>2025 (Mid-term)</option>
            </select>
          </div>

          {/* After Year */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              After (Observed)
            </label>
            <select
              value={afterYear}
              onChange={(e) => setAfterYear(Number(e.target.value))}
              className="w-full bg-slate-50 text-slate-900 text-xs rounded-lg px-3 py-2 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value={2025}>2025 (Mid-term)</option>
              <option value={2026}>2026 (Current Sentinel-2)</option>
            </select>
          </div>

          {/* Run Analysis Button */}
          <div className="flex items-end">
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isAnalyzing ? 'Processing...' : 'RUN ANALYSIS'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Indicator Specific Results Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Analytics Card */}
        <div className="lg:col-span-5 space-y-4">
          {/* NDVI Results */}
          {indicator === 'ndvi' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Vegetation Condition (NDVI)
                </span>
                <span className="text-[10px] font-mono text-slate-500">Sentinel-2 10m L2A</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-0.5">Scientific Definition:</span>
                "NDVI is used as an indicator of vegetation condition, measuring near-infrared vs red light reflectance."
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="text-[10px] text-slate-500 uppercase">{beforeYear} Baseline</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">0.31</div>
                  <div className="text-[10px] text-slate-500">Mean Catchment NDVI</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="text-[10px] text-slate-500 uppercase">{afterYear} Observed</div>
                  <div className="text-lg font-bold text-emerald-700 mt-1">0.46</div>
                  <div className="text-[10px] text-slate-500">Mean Catchment NDVI</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-mono">Observed vegetation change:</span>
                  <span className="text-base font-bold font-mono text-emerald-700">+0.15 (+38%)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-800 pt-1 border-t border-slate-200 font-mono">
                  <Info className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>Clearly labeled: Observed vegetation change. Causal link requires field inspection.</span>
                </div>
              </div>
            </div>
          )}

          {/* Water Analysis */}
          {(indicator === 'water' || indicator === 'ndwi') && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Surface Water Extent Analysis
                </span>
                <span className="text-[10px] font-mono text-slate-500">Multi-temporal NDWI</span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="text-[10px] text-slate-500 uppercase">{beforeYear} Baseline</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">1.2 km²</div>
                  <div className="text-[10px] text-slate-500">Surface Water Spread</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="text-[10px] text-slate-500 uppercase">{afterYear} Observed</div>
                  <div className="text-lg font-bold text-blue-700 mt-1">1.8 km²</div>
                  <div className="text-[10px] text-slate-500">Surface Water Spread</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-mono">Observed Change:</span>
                  <span className="text-base font-bold font-mono text-blue-700">+50.0% (+0.6 km²)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-blue-800 pt-1 border-t border-slate-200 font-mono">
                  <Info className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                  <span>Clearly labeled: Satellite-derived water extent estimate.</span>
                </div>
              </div>
            </div>
          )}

          {/* Land Use / Land Cover */}
          {indicator === 'lulc' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Land Use / Land Cover Breakdown
                </span>
                <span className="text-[10px] font-mono text-slate-500">{selectedWatershed.code}</span>
              </div>

              <div className="space-y-2 text-xs">
                {lulcCategories.map((c) => (
                  <div key={c.name} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-xs ${c.color}`} />
                        <span className="text-slate-800 font-medium">{c.name}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">{c.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{c.areaKm2} km² area</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Topographic Slope */}
          {indicator === 'slope' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Topographic Relief & Slope Gradient
              </span>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Elevation Range:</span>
                  <span className="text-slate-800 font-bold">{selectedWatershed.elevationMinM}m &ndash; {selectedWatershed.elevationMaxM}m ASL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Catchment Ridge Slope:</span>
                  <span className="text-slate-800">4% &ndash; 12% Grade</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Soil Drainage Group:</span>
                  <span className="text-slate-800">{selectedWatershed.soilType}</span>
                </div>
              </div>
            </div>
          )}

          {/* Data Provenance & Metadata */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Platform / Sensor:</span>
              <span className="text-slate-900 font-bold">Sentinel-2 MSI Level-2A</span>
            </div>
            <div className="flex justify-between">
              <span>Spatial Resolution:</span>
              <span className="text-slate-900 font-bold">10m GSD</span>
            </div>
            <div className="flex justify-between">
              <span>Correction:</span>
              <span className="text-slate-900">Sen2Cor Surface Reflectance</span>
            </div>
            <div className="flex justify-between">
              <span>Analysis Timestamp:</span>
              <span className="text-blue-700 font-semibold">{analysisRunTime}</span>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Spatial Analysis Map */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Spatial Raster Visualization ({indicator.toUpperCase()})
            </span>
            <span className="text-xs font-mono text-blue-700 font-bold">
              {afterYear} Layer Active
            </span>
          </div>

          <div className="w-full h-[520px] rounded-lg overflow-hidden border border-slate-200">
            <LeafletMap height="100%" />
          </div>
        </div>
      </div>
    </div>
  );
};
