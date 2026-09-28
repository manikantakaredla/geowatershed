import React, { useState } from 'react';
import { 
  Layers, 
  Building2, 
  Camera, 
  AlertTriangle, 
  ArrowUpRight, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Droplets,
  Clock,
  ChevronRight,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LeafletMap } from '../components/map/LeafletMap';
import { EvidenceChainBadge } from '../components/common/EvidenceChainBadge';
import { formatCoordinates } from '../utils/geo';
import { FieldObservation, Intervention } from '../types';

export const DashboardPage: React.FC = () => {
  const { 
    watersheds, 
    selectedWatershed, 
    interventions, 
    fieldObservations, 
    alerts, 
    navigate,
    setSelectedInterventionId,
    setSelectedObservationId
  } = useApp();

  const [activeDrawerItem, setActiveDrawerItem] = useState<{
    type: 'observation' | 'intervention';
    item: FieldObservation | Intervention;
  } | null>({
    type: 'observation',
    item: fieldObservations[0]
  });

  const unresolvedAlerts = alerts.filter(a => !a.resolved);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Evidence Chain Core Philosophy Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                Geospatial Evidence Architecture
              </span>
              <span className="text-xs text-slate-500 font-medium">Ground-Truth Verification</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              From Passive Documentation to Spatial Evidence
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Linking every field observation with hydrological catchments, Sentinel-2 multi-spectral buffers, 
              temporal indicators, and ground-verification workflows.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate('/explorer')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>GIS Explorer</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/evidence')}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Upload Observation
            </button>
          </div>
        </div>

        {/* Evidence Pathway Breadcrumb */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center overflow-x-auto gap-2 text-xs font-mono text-slate-500">
          <span className="text-slate-900 font-bold">CHAIN:</span>
          <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">GROUND PHOTO</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">GPS EXIF</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">WATERSHED POLYGON</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">SATELLITE 10M BUFFER</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">TEMPORAL ANALYSIS</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold">
            FIELD VERIFICATION
          </span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div 
          onClick={() => navigate('/watersheds')}
          className="bg-white border border-slate-200 hover:border-slate-300 p-4 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Watersheds
            </span>
            <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">12</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between font-mono">
            <span>4 Configured in GIS</span>
            <span className="text-blue-700 font-medium">93.5 km²</span>
          </div>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => navigate('/interventions')}
          className="bg-white border border-slate-200 hover:border-slate-300 p-4 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Interventions
            </span>
            <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">148</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between font-mono">
            <span>32 in Active WS</span>
            <span className="text-emerald-700 font-medium">89% Operational</span>
          </div>
        </div>

        {/* Card 3 */}
        <div 
          onClick={() => navigate('/evidence')}
          className="bg-white border border-slate-200 hover:border-slate-300 p-4 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Field Observations
            </span>
            <div className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">1,284</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between font-mono">
            <span>186 in {selectedWatershed.code}</span>
            <span className="text-indigo-700 font-medium">100% Geotagged</span>
          </div>
        </div>

        {/* Card 4 */}
        <div 
          onClick={() => navigate('/alerts')}
          className="bg-white border border-slate-200 hover:border-slate-300 p-4 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Verification
            </span>
            <div className="p-1.5 rounded-md bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700">17</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between font-mono">
            <span>4 High Priority</span>
            <span className="text-amber-700 font-medium">Action Needed</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Section + Side Drawer */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Hydrological Catchment Map: {selectedWatershed.name} ({selectedWatershed.code})
            </h3>
            <span className="text-xs font-mono text-slate-500 hidden md:inline">
              &bull; {selectedWatershed.district}, AP
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Ground Verified
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Verification Pending
            </span>
          </div>
        </div>

        {/* Map and Detail Drawer Container */}
        <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-200">
          <LeafletMap
            height="100%"
            selectedIntervention={activeDrawerItem?.type === 'intervention' ? (activeDrawerItem.item as Intervention) : null}
            bufferRadiusMeters={activeDrawerItem ? 500 : undefined}
            onSelectObservation={(obs) => setActiveDrawerItem({ type: 'observation', item: obs })}
            onSelectIntervention={(int) => setActiveDrawerItem({ type: 'intervention', item: int })}
          />

          {/* Right-Side Interactive Drawer */}
          {activeDrawerItem && (
            <div className="absolute top-3 right-3 bottom-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-30 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-mono font-bold uppercase">
                      {activeDrawerItem.type === 'observation' ? 'FIELD OBSERVATION' : 'INTERVENTION RECORD'}
                    </span>
                    <span className="text-xs font-mono text-slate-800 font-semibold">
                      {activeDrawerItem.item.code}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveDrawerItem(null)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Photo Viewer */}
                <div className="w-full h-44 rounded-lg overflow-hidden bg-slate-100 relative border border-slate-200 mb-3 group">
                  <img
                    src={
                      activeDrawerItem.type === 'observation'
                        ? (activeDrawerItem.item as FieldObservation).photoUrl
                        : (activeDrawerItem.item as Intervention).primaryPhotoUrl
                    }
                    alt={activeDrawerItem.item.code}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/90 rounded text-[10px] font-mono font-semibold text-slate-800 shadow-xs">
                    {activeDrawerItem.type === 'observation'
                      ? (activeDrawerItem.item as FieldObservation).observationType
                      : (activeDrawerItem.item as Intervention).type}
                  </div>
                </div>

                {/* Metadata Fields */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Watershed:</span>
                    <span className="font-mono text-slate-900 font-semibold">{activeDrawerItem.item.watershedCode}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Coordinates:</span>
                    <span className="font-mono text-slate-900 font-semibold">
                      {formatCoordinates(activeDrawerItem.item.location.lat, activeDrawerItem.item.location.lng)}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Date:</span>
                    <span className="font-mono text-slate-800">
                      {activeDrawerItem.type === 'observation'
                        ? (activeDrawerItem.item as FieldObservation).photoDate
                        : (activeDrawerItem.item as Intervention).lastInspectionDate}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Verification:</span>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {activeDrawerItem.item.verificationStatus}
                    </span>
                  </div>

                  {activeDrawerItem.type === 'observation' && (
                    <div className="py-1">
                      <span className="text-slate-500 text-[11px] block mb-0.5">Field Inspection Notes:</span>
                      <p className="text-slate-700 text-xs leading-relaxed italic bg-slate-50 p-2.5 rounded border border-slate-100">
                        "{(activeDrawerItem.item as FieldObservation).notes}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2 mt-3">
                {activeDrawerItem.type === 'observation' ? (
                  <>
                    <button
                      onClick={() => {
                        setSelectedObservationId(activeDrawerItem.item.id);
                        navigate(`/evidence/${activeDrawerItem.item.id}`);
                      }}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      View Full Evidence
                    </button>
                    {(activeDrawerItem.item as FieldObservation).interventionId && (
                      <button
                        onClick={() => {
                          const intId = (activeDrawerItem.item as FieldObservation).interventionId!;
                          setSelectedInterventionId(intId);
                          navigate(`/interventions/${intId}`);
                        }}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      >
                        View Intervention Intelligence
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedInterventionId(activeDrawerItem.item.id);
                      navigate(`/interventions/${activeDrawerItem.item.id}`);
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    View Intervention Intelligence
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Two Column Layout: Recent Evidence & Verification Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Field Observations Grid */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                Recent Geo-Coded Field Evidence
              </h3>
              <p className="text-xs text-slate-500">Ground observations linked with satellite coordinates</p>
            </div>
            <button
              onClick={() => navigate('/evidence')}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
            >
              View all observations <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {fieldObservations.slice(0, 4).map((obs) => (
              <div
                key={obs.id}
                onClick={() => {
                  setSelectedObservationId(obs.id);
                  navigate(`/evidence/${obs.id}`);
                }}
                className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-3 flex gap-3 cursor-pointer group transition-colors"
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                  <img
                    src={obs.photoUrl}
                    alt={obs.code}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono text-xs font-bold text-blue-700 truncate">{obs.code}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {obs.verificationStatus}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 truncate">{obs.observationType}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {formatCoordinates(obs.location.lat, obs.location.lng)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    <span>{obs.uploadedBy}</span>
                    <span>{obs.photoDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Verification Queue & Anomaly Alerts */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Alerts & Action Queue
                </h3>
                <p className="text-xs text-slate-500">Remote anomalies requiring ground check</p>
              </div>
              <button
                onClick={() => navigate('/alerts')}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {unresolvedAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => navigate('/alerts')}
                  className="p-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-800">
                      {alert.type.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{alert.date}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 leading-snug">{alert.title}</div>
                  <div className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{alert.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-mono font-medium">Verification Rate: 82%</span>
            <button
              onClick={() => navigate('/alerts')}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Assign Field Officer <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
