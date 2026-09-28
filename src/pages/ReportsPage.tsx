import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckSquare, 
  Square, 
  Calendar, 
  Layers, 
  ShieldCheck, 
  MapPin, 
  Droplet, 
  TrendingUp,
  Camera,
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCoordinates } from '../utils/geo';
import { EvidenceChainBadge } from '../components/common/EvidenceChainBadge';

export const ReportsPage: React.FC = () => {
  const { selectedWatershed, setSelectedWatershedId, watersheds, interventions, fieldObservations } = useApp();

  const [dateRange, setDateRange] = useState('2024-01-01 to 2026-09-24');
  const [sections, setSections] = useState({
    overview: true,
    map: true,
    evidence: true,
    interventions: true,
    satelliteAnalysis: true,
    vegetation: true,
    water: true,
    landUse: true,
    changeDetection: true,
    verification: true
  });

  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const wsInterventions = interventions.filter(i => i.watershedId === selectedWatershed.id);
  const wsObservations = fieldObservations.filter(o => o.watershedId === selectedWatershed.id);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Configuration Header */}
      <div className="no-print bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Watershed Comprehensive Evidence Dossier
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select thematic modules to compile a verified government/research report
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export PDF Report</span>
          </button>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Watershed Catchment
            </label>
            <select
              value={selectedWatershed.id}
              onChange={(e) => setSelectedWatershedId(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs rounded-lg px-3 py-2 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
            >
              {watersheds.map(ws => (
                <option key={ws.id} value={ws.id}>{ws.code} &bull; {ws.name} ({ws.district})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Evaluation Temporal Window
            </label>
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs rounded-lg px-3 py-2 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        {/* Section Selectors Checkboxes */}
        <div>
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2 font-mono">
            Included Report Sections:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
            {Object.entries(sections).map(([key, val]) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleSection(key as any)}
                className={`p-2 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition-colors ${
                  val 
                    ? 'bg-blue-50 border-blue-300 text-blue-800 font-semibold' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {val ? <CheckSquare className="w-3.5 h-3.5 text-blue-600 shrink-0" /> : <Square className="w-3.5 h-3.5 shrink-0 text-slate-400" />}
                <span className="truncate capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* The Printable Report Document */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs text-slate-900 space-y-8 font-sans print:p-0 print:border-none">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-slate-600 font-bold">
              GOVERNMENT OF ANDHRA PRADESH &bull; WATERSHED DEVELOPMENT DIRECTORATE
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
              WATERSHED INTELLIGENCE & SPATIAL EVIDENCE REPORT
            </h2>
            <div className="text-xs font-mono text-slate-600 mt-1">
              Catchment: <strong>{selectedWatershed.name} ({selectedWatershed.code})</strong> &bull; District: {selectedWatershed.district} &bull; Basin: {selectedWatershed.basin}
            </div>
          </div>
          <div className="text-right text-xs font-mono text-slate-600">
            <div>Ref: WS-REP-2026-0924</div>
            <div>Date: 24 Sep 2026</div>
            <div className="text-emerald-700 font-bold">Status: Field Verified (82%)</div>
          </div>
        </div>

        {/* Section: Overview */}
        {sections.overview && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono border-b border-slate-200 pb-1">
              1. Catchment Physiography & Baseline Metrics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase block">Total Area</span>
                <span className="text-base font-bold text-slate-900">{selectedWatershed.areaKm2} km²</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase block">Villages</span>
                <span className="text-base font-bold text-slate-900">{selectedWatershed.villagesCount} Panchayats</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase block">Annual Rainfall</span>
                <span className="text-base font-bold text-slate-900">{selectedWatershed.annualRainfallMm} mm</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase block">Drainage Network</span>
                <span className="text-base font-bold text-slate-900">{selectedWatershed.drainageLengthKm} km</span>
              </div>
            </div>
          </div>
        )}

        {/* Section: Evidence Chain Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono border-b border-slate-200 pb-1">
            2. Spatial Evidence Chain Verification
          </h3>
          <EvidenceChainBadge verificationStatus="Verified" />
        </div>

        {/* Section: Satellite Analysis */}
        {sections.satelliteAnalysis && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono border-b border-slate-200 pb-1">
              3. Remote-Sensing Environmental Indicators (2024 &ndash; 2026)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="font-bold text-emerald-800">VEGETATION CONDITION (NDVI)</div>
                <div>2024 Baseline Mean: 0.31</div>
                <div>2026 Observed Mean: 0.46</div>
                <div className="text-emerald-700 font-bold">Observed Delta: +0.15 (+38.2%)</div>
                <p className="text-[11px] text-slate-600 pt-1 font-sans">
                  Sentinel-2 10m NIR/Red reflectance ratio indicates positive canopy and green biomass response.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div className="font-bold text-blue-800">SURFACE WATER EXTENT (NDWI)</div>
                <div>2024 Baseline: 1.2 ha</div>
                <div>2026 Observed: 1.8 ha</div>
                <div className="text-blue-700 font-bold">Observed Delta: +50.0% (+0.6 ha)</div>
                <p className="text-[11px] text-slate-600 pt-1 font-sans">
                  Satellite-derived surface water mask confirms enhanced post-monsoon retention in Check Dam #001 impoundment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section: Interventions Inventory */}
        {sections.interventions && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono border-b border-slate-200 pb-1">
              4. Watershed Structures Inventory ({wsInterventions.length} Units)
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs font-mono text-slate-800">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="py-2 px-3">Code</th>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Village</th>
                    <th className="py-2 px-3">Coordinates</th>
                    <th className="py-2 px-3">Year</th>
                    <th className="py-2 px-3">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {wsInterventions.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 px-3 font-bold text-blue-700">{item.code}</td>
                      <td className="py-2 px-3 font-medium">{item.name}</td>
                      <td className="py-2 px-3">{item.type}</td>
                      <td className="py-2 px-3">{item.village}</td>
                      <td className="py-2 px-3">{formatCoordinates(item.location.lat, item.location.lng)}</td>
                      <td className="py-2 px-3">{item.implementationYear}</td>
                      <td className="py-2 px-3 text-emerald-700 font-bold">{item.verificationStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section: Ground Evidence Photos */}
        {sections.evidence && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-mono border-b border-slate-200 pb-1">
              5. Field Observation Photographs & Geotags
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {wsObservations.slice(0, 3).map((obs) => (
                <div key={obs.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="w-full h-32 rounded overflow-hidden bg-slate-200 mb-2 border border-slate-200">
                    <img src={obs.photoUrl} alt={obs.code} className="w-full h-full object-cover" />
                  </div>
                  <div className="font-bold text-blue-700 font-mono">{obs.code}</div>
                  <div className="text-[11px] font-semibold text-slate-800">{obs.observationType}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{obs.photoDate} &bull; {formatCoordinates(obs.location.lat, obs.location.lng)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sign-Off Footer */}
        <div className="pt-6 border-t-2 border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs font-mono">
          <div>
            <div className="text-slate-500 uppercase text-[10px]">Inspecting Officer</div>
            <div className="font-bold text-slate-900 mt-1">K. Venkatesh</div>
            <div className="text-slate-500">Sub-divisional Watershed Inspection Unit</div>
          </div>

          <div>
            <div className="text-slate-500 uppercase text-[10px]">Reviewing Authority</div>
            <div className="font-bold text-slate-900 mt-1">Dr. Ramesh Babu, Ph.D.</div>
            <div className="text-slate-500">Director, Remote Sensing & Watershed Mission</div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-mono text-emerald-800 font-bold">DIGITALLY SIGNED & VERIFIED</div>
            <div className="text-[10px] text-slate-500">Waterscope Geodatabase v2.4</div>
          </div>
        </div>
      </div>
    </div>
  );
};
