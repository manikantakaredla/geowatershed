import React from 'react';
import { Layers, ArrowRight, MapPin, Building2, Camera, Droplets, TrendingUp, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WatershedBoundary } from '../types';

export const WatershedListPage: React.FC = () => {
  const { watersheds, setSelectedWatershedId, navigate } = useApp();

  const handleSelect = (ws: WatershedBoundary) => {
    setSelectedWatershedId(ws.id);
    navigate(`/watersheds/${ws.id}`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Watershed Catchment Directory</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hydrological spatial units configured for remote-sensing & field evidence monitoring
          </p>
        </div>

        <button
          onClick={() => navigate('/explorer')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
        >
          <span>Open in GIS Explorer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Watersheds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {watersheds.map((ws) => (
          <div
            key={ws.id}
            onClick={() => handleSelect(ws)}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs transition-colors cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                  {ws.code}
                </span>
                <span className="text-xs font-mono text-slate-500">{ws.district}, {ws.state}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                {ws.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">{ws.basin}</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2.5 my-4">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Catchment Area</div>
                  <div className="text-base font-bold font-mono text-slate-900">{ws.areaKm2} km²</div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Structures</div>
                  <div className="text-base font-bold font-mono text-blue-700">{ws.interventionsCount}</div>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-center">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Ground Photos</div>
                  <div className="text-base font-bold font-mono text-emerald-700">{ws.observationsCount}</div>
                </div>
              </div>

              {/* Trends */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[11px] block">Vegetation Trend:</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> {ws.vegetationTrend}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Water Extent Trend:</span>
                  <span className="font-semibold text-blue-700 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5" /> {ws.waterExtentTrend}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Verification Rate:</span>
                  <span className="font-semibold font-mono text-slate-800">
                    {ws.verificationRatePercent}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-700 group-hover:text-blue-800 font-semibold">
              <span>Open Catchment Dossier</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
