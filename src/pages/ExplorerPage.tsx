import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  MapPin, 
  Compass, 
  Filter, 
  Building2, 
  Camera, 
  Droplet, 
  CheckCircle2, 
  X,
  ExternalLink,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LeafletMap } from '../components/map/LeafletMap';
import { formatCoordinates } from '../utils/geo';
import { WatershedBoundary, Intervention, FieldObservation } from '../types';

export const ExplorerPage: React.FC = () => {
  const { 
    watersheds, 
    selectedWatershed, 
    setSelectedWatershedId, 
    interventions, 
    fieldObservations,
    navigate,
    setSelectedInterventionId,
    setSelectedObservationId
  } = useApp();

  const [explorerSearch, setExplorerSearch] = useState('');
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [selectedObservation, setSelectedObservation] = useState<FieldObservation | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredWatersheds = watersheds.filter(ws => 
    ws.name.toLowerCase().includes(explorerSearch.toLowerCase()) || 
    ws.code.toLowerCase().includes(explorerSearch.toLowerCase()) ||
    ws.district.toLowerCase().includes(explorerSearch.toLowerCase())
  );

  const currentInterventions = interventions.filter(i => 
    i.watershedId === selectedWatershed.id &&
    (filterType === 'all' || i.type === filterType)
  );

  const currentObservations = fieldObservations.filter(o => 
    o.watershedId === selectedWatershed.id
  );

  const handleSelectWs = (ws: WatershedBoundary) => {
    setSelectedWatershedId(ws.id);
    setSelectedIntervention(null);
    setSelectedObservation(null);
  };

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col lg:flex-row overflow-hidden bg-slate-50">
      {/* Left GIS Workspace Control Panel */}
      <div className="w-full lg:w-80 lg:shrink-0 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden z-10 shadow-xs">
        {/* Search & Header */}
        <div className="p-3.5 border-b border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" /> Watershed Explorer
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              GIS WORKSPACE
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter Watershed / Basin..."
              value={explorerSearch}
              onChange={(e) => setExplorerSearch(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs rounded-lg pl-8 pr-3 py-1.5 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Watershed Selectors List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
            Configured Basins ({filteredWatersheds.length})
          </div>

          {filteredWatersheds.map((ws) => {
            const isSelected = ws.id === selectedWatershed.id;
            return (
              <div
                key={ws.id}
                onClick={() => handleSelectWs(ws)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-400 text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold font-mono text-blue-700">{ws.code}</span>
                  <span className="text-[10px] font-mono text-slate-500">{ws.areaKm2} km²</span>
                </div>
                <div className="font-semibold text-slate-900 text-xs">{ws.name}</div>
                <div className="text-[11px] text-slate-500">{ws.district}, {ws.state}</div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{ws.interventionsCount} Structures</span>
                  <span className="text-emerald-700 font-semibold">{ws.verificationRatePercent}% Verified</span>
                </div>
              </div>
            );
          })}

          {/* Filter by Intervention Type */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1.5 block">
              Filter Interventions in View
            </span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs rounded-lg px-2.5 py-1.5 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Intervention Types</option>
              <option value="Check Dam">Check Dam</option>
              <option value="Farm Pond">Farm Pond</option>
              <option value="Water Harvesting Structure">Water Harvesting Structure</option>
              <option value="Plantation">Plantation</option>
              <option value="Contour Structure">Contour Structure</option>
              <option value="Soil Conservation">Soil Conservation</option>
            </select>
          </div>
        </div>

        {/* Selected Watershed Quick Summary Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs">
          <div className="flex items-center justify-between text-slate-800 mb-1">
            <span className="font-mono text-blue-700 font-bold">{selectedWatershed.code}</span>
            <button
              onClick={() => navigate(`/watersheds/${selectedWatershed.id}`)}
              className="text-blue-600 hover:underline font-semibold"
            >
              Catchment Dossier →
            </button>
          </div>
          <div className="text-[11px] text-slate-500">
            {currentInterventions.length} matching structures &bull; {currentObservations.length} ground photos
          </div>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="flex-1 relative h-full">
        <LeafletMap
          height="100%"
          selectedIntervention={selectedIntervention}
          bufferRadiusMeters={selectedIntervention ? 500 : undefined}
          onSelectIntervention={(item) => {
            setSelectedIntervention(item);
            setSelectedObservation(null);
          }}
          onSelectObservation={(obs) => {
            setSelectedObservation(obs);
            setSelectedIntervention(null);
          }}
          onSelectWatershed={(ws) => setSelectedWatershedId(ws.id)}
        />

        {/* Floating Feature Inspector Drawer */}
        {(selectedIntervention || selectedObservation) && (
          <div className="absolute top-4 left-4 bottom-4 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl p-4 shadow-xl z-30 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                  {selectedIntervention ? 'Structure Inspector' : 'Observation Inspector'}
                </span>
                <button
                  onClick={() => {
                    setSelectedIntervention(null);
                    setSelectedObservation(null);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedIntervention && (
                <div className="space-y-3 text-xs">
                  <div className="w-full h-40 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={selectedIntervention.primaryPhotoUrl}
                      alt={selectedIntervention.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <span className="font-mono text-blue-700 font-bold">{selectedIntervention.code}</span>
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">{selectedIntervention.name}</h4>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">{selectedIntervention.description}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Coordinates:</span>
                      <span className="text-slate-800 font-semibold">
                        {formatCoordinates(selectedIntervention.location.lat, selectedIntervention.location.lng)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Built:</span>
                      <span className="text-slate-800">{selectedIntervention.implementationYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Capacity:</span>
                      <span className="text-slate-800">{selectedIntervention.capacityM3?.toLocaleString()} m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Verification:</span>
                      <span className="text-emerald-700 font-bold">{selectedIntervention.verificationStatus}</span>
                    </div>
                  </div>

                  {/* Buffer stats summary */}
                  <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200 text-xs">
                    <span className="font-bold text-slate-900 block mb-1">500m Buffer Environmental Delta</span>
                    <div className="text-slate-700">
                      Water Extent: <span className="font-mono text-blue-700 font-bold">1.2 ha → 1.8 ha (+50%)</span>
                    </div>
                    <div className="text-slate-700">
                      Vegetation NDVI: <span className="font-mono text-emerald-700 font-bold">0.31 → 0.46 (+0.15)</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedObservation && (
                <div className="space-y-3 text-xs">
                  <div className="w-full h-40 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={selectedObservation.photoUrl}
                      alt={selectedObservation.code}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <span className="font-mono text-blue-700 font-bold">{selectedObservation.code}</span>
                    <h4 className="font-bold text-slate-900">{selectedObservation.observationType}</h4>
                    <p className="text-slate-700 text-xs italic mt-1 bg-slate-50 p-2.5 rounded border border-slate-100">
                      "{selectedObservation.notes}"
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">GPS:</span>
                      <span className="text-slate-800 font-semibold">
                        {formatCoordinates(selectedObservation.location.lat, selectedObservation.location.lng)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date:</span>
                      <span className="text-slate-800">{selectedObservation.photoDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Officer:</span>
                      <span className="text-slate-800">{selectedObservation.uploadedBy}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 mt-3">
              {selectedIntervention ? (
                <button
                  onClick={() => {
                    setSelectedInterventionId(selectedIntervention.id);
                    navigate(`/interventions/${selectedIntervention.id}`);
                  }}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Open Full Intelligence View
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (selectedObservation) {
                      setSelectedObservationId(selectedObservation.id);
                      navigate(`/evidence/${selectedObservation.id}`);
                    }
                  }}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Open Full Evidence Dossier
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
