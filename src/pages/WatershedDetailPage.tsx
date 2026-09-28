import React, { useState } from 'react';
import { 
  Layers, 
  MapPin, 
  Building2, 
  Camera, 
  Droplet, 
  TrendingUp, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  ArrowLeft,
  Activity,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LeafletMap } from '../components/map/LeafletMap';
import { EvidenceChainBadge } from '../components/common/EvidenceChainBadge';
import { formatCoordinates } from '../utils/geo';

export const WatershedDetailPage: React.FC = () => {
  const { 
    selectedWatershed, 
    interventions, 
    fieldObservations, 
    navigate,
    setSelectedInterventionId,
    setSelectedObservationId
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'interventions' | 'evidence' | 'analysis' | 'changes' | 'reports'>('overview');

  const wsInterventions = interventions.filter(i => i.watershedId === selectedWatershed.id);
  const wsObservations = fieldObservations.filter(o => o.watershedId === selectedWatershed.id);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'map', label: 'GIS Catchment Map' },
    { id: 'interventions', label: `Interventions (${wsInterventions.length})` },
    { id: 'evidence', label: `Field Evidence (${wsObservations.length})` },
    { id: 'analysis', label: 'Satellite Analysis' },
    { id: 'changes', label: 'Changes' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <button
            onClick={() => navigate('/watersheds')}
            className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-1 transition-colors cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Catchments
          </button>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
              {selectedWatershed.code}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {selectedWatershed.name}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {selectedWatershed.basin} &bull; {selectedWatershed.district}, {selectedWatershed.state}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/reports')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Generate Report</span>
          </button>
          <button
            onClick={() => navigate('/explorer')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Open in GIS Explorer
          </button>
        </div>
      </div>

      {/* Watershed Sub-Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Explainable Metrics Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Area</span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">{selectedWatershed.areaKm2} km²</span>
              <span className="text-[11px] text-slate-500">Total catchment</span>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Villages</span>
              <span className="text-xl font-bold font-mono text-blue-700 mt-1 block">{selectedWatershed.villagesCount}</span>
              <span className="text-[11px] text-slate-500">Gram panchayats</span>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Interventions</span>
              <span className="text-xl font-bold font-mono text-emerald-700 mt-1 block">{selectedWatershed.interventionsCount}</span>
              <span className="text-[11px] text-slate-500">Total structures</span>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Field Evidence</span>
              <span className="text-xl font-bold font-mono text-indigo-700 mt-1 block">{selectedWatershed.observationsCount}</span>
              <span className="text-[11px] text-slate-500">Geotagged photos</span>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Water Bodies</span>
              <span className="text-xl font-bold font-mono text-blue-700 mt-1 block">{selectedWatershed.waterBodiesCount}</span>
              <span className="text-[11px] text-slate-500">Tanks & ponds</span>
            </div>

            <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Drainage Length</span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">{selectedWatershed.drainageLengthKm} km</span>
              <span className="text-[11px] text-slate-500">Stream channels</span>
            </div>
          </div>

          {/* Trend Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 uppercase font-mono block">Vegetation Trend</span>
                <span className="text-lg font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                  <TrendingUp className="w-5 h-5" /> Increasing (+0.15 NDVI)
                </span>
                <p className="text-xs text-slate-600 mt-1">Observed multi-spectral NIR gain in 2024–2026</p>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 uppercase font-mono block">Water Extent Trend</span>
                <span className="text-lg font-bold text-blue-700 mt-1 flex items-center gap-1.5">
                  <TrendingUp className="w-5 h-5" /> Increasing (+50%)
                </span>
                <p className="text-xs text-slate-600 mt-1">Surface water expanded from 1.2 to 1.8 ha</p>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 uppercase font-mono block">Field Verification</span>
                <span className="text-lg font-bold font-mono text-slate-900 mt-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" /> {selectedWatershed.verificationRatePercent}% Complete
                </span>
                <p className="text-xs text-slate-600 mt-1">Field officer ground inspections completed</p>
              </div>
            </div>
          </div>

          {/* Evidence Chain Component */}
          <EvidenceChainBadge verificationStatus="Verified" />

          {/* Embedded Map Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Spatial Catchment Overview & Interventions
            </h3>
            <div className="w-full h-[450px] rounded-xl overflow-hidden border border-slate-200">
              <LeafletMap height="100%" />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Map */}
      {activeTab === 'map' && (
        <div className="w-full h-[650px] rounded-xl overflow-hidden border border-slate-200 shadow-xs">
          <LeafletMap height="100%" />
        </div>
      )}

      {/* Tab: Interventions */}
      {activeTab === 'interventions' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Watershed Interventions in {selectedWatershed.code}
            </h3>
            <button
              onClick={() => navigate('/interventions')}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Open Complete Interventions Directory →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wsInterventions.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedInterventionId(item.id);
                  navigate(`/interventions/${item.id}`);
                }}
                className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 cursor-pointer group transition-colors"
              >
                <div className="w-full h-36 rounded-lg overflow-hidden bg-slate-200 mb-2.5">
                  <img
                    src={item.primaryPhotoUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-blue-700">{item.code}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {item.verificationStatus}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Field Evidence */}
      {activeTab === 'evidence' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Field Observations in {selectedWatershed.code}
            </h3>
            <button
              onClick={() => navigate('/evidence')}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Upload / View All Ground Evidence →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {wsObservations.map((obs) => (
              <div
                key={obs.id}
                onClick={() => {
                  setSelectedObservationId(obs.id);
                  navigate(`/evidence/${obs.id}`);
                }}
                className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 cursor-pointer group transition-colors"
              >
                <div className="w-full h-40 rounded-lg overflow-hidden bg-slate-200 mb-2.5">
                  <img
                    src={obs.photoUrl}
                    alt={obs.code}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-blue-700">{obs.code}</span>
                  <span className="text-[10px] font-mono text-slate-500">{obs.photoDate}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{obs.observationType}</h4>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  {formatCoordinates(obs.location.lat, obs.location.lng)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Satellite Analysis */}
      {activeTab === 'analysis' && (
        <div className="p-8 bg-white border border-slate-200 rounded-xl text-center space-y-4 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900">Dedicated Remote-Sensing Module</h3>
          <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
            Execute pixel-level multi-spectral comparisons (NDVI, NDWI, Water Extent, Land-Cover) with temporal baselines.
          </p>
          <button
            onClick={() => navigate('/satellite-analysis')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Launch Satellite Analysis Module
          </button>
        </div>
      )}

      {/* Tab: Changes */}
      {activeTab === 'changes' && (
        <div className="p-8 bg-white border border-slate-200 rounded-xl text-center space-y-4 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900">Temporal Change Detection</h3>
          <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
            Interactive dual-screen swipe comparison between 2024 baseline and 2026 post-intervention Sentinel-2 scenes.
          </p>
          <button
            onClick={() => navigate('/change-detection')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Open Change Detection Swipe Tool
          </button>
        </div>
      )}

      {/* Tab: Reports */}
      {activeTab === 'reports' && (
        <div className="p-8 bg-white border border-slate-200 rounded-xl text-center space-y-4 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900">Generate Watershed Dossier</h3>
          <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
            Compile executive summary, GeoJSON layers, ground photos, and satellite-derived indices into a printable government report.
          </p>
          <button
            onClick={() => navigate('/reports')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Open Watershed Report Generator
          </button>
        </div>
      )}
    </div>
  );
};
