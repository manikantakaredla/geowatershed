import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  Maximize2, 
  Minimize2, 
  Compass, 
  MapPin, 
  Eye, 
  Camera, 
  Building2, 
  Droplet, 
  Calendar,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  Intervention, 
  FieldObservation, 
  WatershedBoundary,
  GeoPoint 
} from '../../types';
import { 
  MOCK_WATER_BODIES, 
  MOCK_DRAINAGE_NETWORKS 
} from '../../data/mockData';
import { formatCoordinates, generateBufferCircleCoords } from '../../utils/geo';
import { getActiveSatelliteProvider } from '../../services/satelliteProvider';

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
  selectedIntervention?: Intervention | null;
  bufferRadiusMeters?: number;
  showLayersControl?: boolean;
  showTimelineControl?: boolean;
  onSelectIntervention?: (int: Intervention) => void;
  onSelectObservation?: (obs: FieldObservation) => void;
  onSelectWatershed?: (ws: WatershedBoundary) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom,
  height = '100%',
  selectedIntervention,
  bufferRadiusMeters,
  showLayersControl = true,
  showTimelineControl = true,
  onSelectIntervention,
  onSelectObservation,
  onSelectWatershed
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const overlaysGroupRef = useRef<L.LayerGroup | null>(null);

  const { 
    watersheds, 
    selectedWatershed, 
    interventions, 
    fieldObservations, 
    timelineYear, 
    setTimelineYear,
    activeBasemap, 
    setActiveBasemap, 
    activeLayers, 
    toggleLayer,
    navigate
  } = useApp();

  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [layersPanelOpen, setLayersPanelOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const satelliteProvider = getActiveSatelliteProvider();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter: [number, number] = center || selectedWatershed?.center || [18.2834, 83.3912];
    const initialZoom = zoom || selectedWatershed?.zoom || 13;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map);

    tileLayerGroupRef.current = L.layerGroup().addTo(map);
    overlaysGroupRef.current = L.layerGroup().addTo(map);

    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setMouseCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center when watershed or center prop changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (center) {
      mapInstanceRef.current.flyTo(center, zoom || 14, { duration: 1.2 });
    } else if (selectedWatershed) {
      mapInstanceRef.current.flyTo(selectedWatershed.center, selectedWatershed.zoom || 13, { duration: 1.2 });
    }
  }, [center, zoom, selectedWatershed]);

  // Update Basemaps
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerGroupRef.current) return;
    tileLayerGroupRef.current.clearLayers();

    if (activeBasemap === 'satellite') {
      const satLayer = L.tileLayer(
        satelliteProvider.getTileUrl(),
        { maxZoom: 19, attribution: satelliteProvider.getAttribution() }
      );
      satLayer.addTo(tileLayerGroupRef.current);
    } else if (activeBasemap === 'street') {
      const streetLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19, attribution: '&copy; OpenStreetMap' }
      );
      streetLayer.addTo(tileLayerGroupRef.current);
    } else if (activeBasemap === 'terrain') {
      const terrainLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18, attribution: 'Tiles &copy; Esri World Topo' }
      );
      terrainLayer.addTo(tileLayerGroupRef.current);
    }
  }, [activeBasemap]);

  // Render GeoJSON and Operational Layers
  useEffect(() => {
    if (!mapInstanceRef.current || !overlaysGroupRef.current) return;
    const group = overlaysGroupRef.current;
    group.clearLayers();

    // 1. Watershed Boundary Polygons
    if (activeLayers.boundaries) {
      watersheds.forEach(ws => {
        const isSelected = selectedWatershed?.id === ws.id;
        const polygon = L.polygon(ws.polygon, {
          color: isSelected ? '#0284c7' : '#0369a1',
          weight: isSelected ? 3 : 2,
          dashArray: isSelected ? undefined : '5, 5',
          fillColor: isSelected ? '#0284c7' : '#38bdf8',
          fillOpacity: isSelected ? 0.12 : 0.04
        });

        polygon.bindTooltip(
          `<div class="p-1 font-sans text-xs">
            <div class="font-bold text-slate-900">${ws.code} &bull; ${ws.name}</div>
            <div class="text-[11px] text-slate-600">Area: ${ws.areaKm2} km² | Interventions: ${ws.interventionsCount}</div>
           </div>`,
          { sticky: true }
        );

        polygon.on('click', () => {
          if (onSelectWatershed) onSelectWatershed(ws);
        });

        polygon.addTo(group);
      });
    }

    // 2. Drainage Networks
    if (activeLayers.drainage) {
      MOCK_DRAINAGE_NETWORKS.forEach(drain => {
        const weight = drain.order === 3 ? 3 : drain.order === 2 ? 2 : 1.5;
        const color = '#0284c7';

        const polyline = L.polyline(drain.coordinates, {
          color,
          weight,
          opacity: 0.9
        });

        polyline.bindTooltip(
          `<div class="text-xs font-mono font-medium text-slate-800">Order ${drain.order} Drainage Channel</div>`,
          { sticky: true }
        );

        polyline.addTo(group);
      });
    }

    // 3. Water Bodies
    if (activeLayers.waterBodies) {
      MOCK_WATER_BODIES.forEach(wb => {
        const polygon = L.polygon(wb.polygon, {
          color: '#0284c7',
          weight: 2,
          fillColor: '#38bdf8',
          fillOpacity: 0.5
        });

        const currentArea = timelineYear === 2024 ? wb.areaHa2024 : wb.areaHa2026;

        polygon.bindPopup(
          `<div class="p-3 bg-white text-slate-900 rounded-lg text-xs font-sans min-w-[200px]">
            <div class="font-bold text-slate-900 mb-1 flex items-center gap-1">
              <span>💧 ${wb.name}</span>
            </div>
            <div class="text-[11px] text-slate-600">Type: <span class="font-semibold text-slate-800">${wb.type}</span></div>
            <div class="text-[11px] text-slate-600">Water Extent (${timelineYear}): <span class="font-bold text-blue-700">${currentArea} ha</span></div>
            <div class="mt-2 text-[10px] text-slate-400 font-mono">Satellite-derived surface water mask</div>
          </div>`
        );

        polygon.addTo(group);
      });
    }

    // 4. Interventions Markers
    if (activeLayers.interventions) {
      interventions.forEach(item => {
        if (item.implementationYear > timelineYear) return;
        const isCurrentSelected = selectedIntervention?.id === item.id;

        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div class="relative cursor-pointer">
              <div class="w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 border-white transition-transform ${
                isCurrentSelected 
                  ? 'bg-amber-500 scale-125 ring-2 ring-amber-400' 
                  : 'bg-slate-900 hover:scale-110'
              }">
                <span class="text-white text-[11px]">${item.type === 'Check Dam' ? '🏗️' : item.type === 'Farm Pond' ? '💧' : '🌱'}</span>
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -16]
        });

        const marker = L.marker([item.location.lat, item.location.lng], { icon: customIcon });

        marker.on('click', () => {
          if (onSelectIntervention) onSelectIntervention(item);
        });

        marker.bindPopup(
          `<div class="p-3 bg-white text-slate-900 rounded-lg text-xs font-sans min-w-[220px]">
            <div class="flex items-center justify-between mb-1 pb-1 border-b border-slate-100">
              <span class="font-bold text-blue-700 font-mono">${item.code}</span>
              <span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">${item.verificationStatus}</span>
            </div>
            <div class="font-semibold text-slate-900 text-sm mb-1">${item.name}</div>
            <div class="text-[11px] text-slate-500 mb-0.5">Type: <span class="text-slate-700 font-medium">${item.type}</span></div>
            <div class="text-[11px] text-slate-500 mb-2">Location: <span class="font-mono text-slate-700">${formatCoordinates(item.location.lat, item.location.lng)}</span></div>
            <button id="view-int-btn-${item.id}" class="w-full py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer">
              View Intelligence View
            </button>
          </div>`
        );

        marker.on('popupopen', () => {
          const btn = document.getElementById(`view-int-btn-${item.id}`);
          if (btn) {
            btn.onclick = () => navigate(`/interventions/${item.id}`);
          }
        });

        marker.addTo(group);
      });
    }

    // 5. Field Evidence Markers (Camera Icons)
    if (activeLayers.evidence) {
      fieldObservations.forEach(obs => {
        const isVerified = obs.verificationStatus === 'Verified';

        const customIcon = L.divIcon({
          className: 'custom-photo-marker',
          html: `
            <div class="relative cursor-pointer">
              <div class="w-6 h-6 rounded-md flex items-center justify-center shadow-md border-2 border-white transition-transform ${
                isVerified 
                  ? 'bg-blue-600 text-white hover:scale-110' 
                  : 'bg-amber-600 text-white hover:scale-110'
              }">
                <span class="text-[10px]">📸</span>
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -14]
        });

        const marker = L.marker([obs.location.lat, obs.location.lng], { icon: customIcon });

        marker.on('click', () => {
          if (onSelectObservation) onSelectObservation(obs);
        });

        marker.bindPopup(
          `<div class="p-2.5 bg-white text-slate-900 rounded-lg text-xs font-sans min-w-[220px]">
            <div class="flex items-center justify-between mb-1.5">
              <span class="font-bold text-blue-700 font-mono">${obs.code}</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded font-mono ${
                isVerified ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
              }">${obs.verificationStatus}</span>
            </div>
            <div class="w-full h-24 rounded overflow-hidden mb-2 bg-slate-100">
              <img src="${obs.photoUrl}" alt="${obs.code}" class="w-full h-full object-cover" />
            </div>
            <div class="text-[11px] text-slate-700 font-medium mb-1">${obs.observationType} &bull; ${obs.photoDate}</div>
            <button id="view-obs-btn-${obs.id}" class="w-full py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded text-xs font-semibold cursor-pointer">
              Inspect Evidence
            </button>
          </div>`
        );

        marker.on('popupopen', () => {
          const btn = document.getElementById(`view-obs-btn-${obs.id}`);
          if (btn) {
            btn.onclick = () => navigate(`/evidence/${obs.id}`);
          }
        });

        marker.addTo(group);
      });
    }

    // 6. Buffer Analysis Circle
    if (selectedIntervention && bufferRadiusMeters) {
      const circleCoords = generateBufferCircleCoords(selectedIntervention.location, bufferRadiusMeters);
      const bufferPoly = L.polygon(circleCoords, {
        color: '#d97706',
        weight: 2,
        dashArray: '5, 5',
        fillColor: '#f59e0b',
        fillOpacity: 0.12
      });

      bufferPoly.bindTooltip(
        `<div class="text-xs font-mono font-bold text-amber-800">${bufferRadiusMeters}m Buffer Analysis</div>`,
        { sticky: true }
      );

      bufferPoly.addTo(group);
    }

    // 7. NDVI Overlay
    if (activeLayers.ndvi && selectedWatershed) {
      const ndviPoly = L.polygon(selectedWatershed.polygon, {
        color: '#16a34a',
        weight: 1.5,
        fillColor: '#22c55e',
        fillOpacity: timelineYear === 2026 ? 0.32 : (timelineYear === 2025 ? 0.22 : 0.14)
      });
      ndviPoly.bindTooltip(
        `<div class="text-xs font-mono font-bold text-emerald-800">Sentinel-2 NDVI (${timelineYear}): ${timelineYear === 2026 ? '0.46' : timelineYear === 2025 ? '0.38' : '0.31'}</div>`,
        { sticky: true }
      );
      ndviPoly.addTo(group);
    }

    // 8. NDWI Overlay
    if (activeLayers.ndwi && selectedWatershed) {
      const ndwiPoly = L.polygon(selectedWatershed.polygon, {
        color: '#0284c7',
        weight: 1.5,
        fillColor: '#0ea5e9',
        fillOpacity: 0.25
      });
      ndwiPoly.bindTooltip(
        `<div class="text-xs font-mono font-bold text-blue-800">Sentinel-2 NDWI Moisture Mask (${timelineYear})</div>`,
        { sticky: true }
      );
      ndwiPoly.addTo(group);
    }

  }, [
    activeLayers, 
    watersheds, 
    selectedWatershed, 
    interventions, 
    fieldObservations, 
    selectedIntervention, 
    bufferRadiusMeters, 
    timelineYear
  ]);

  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-xs" style={{ height }}>
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Top-Left: Coords & Satellite Badge */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/95 border border-slate-200 shadow-sm text-xs font-mono text-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{activeBasemap.toUpperCase()}: {satelliteProvider.name.split('(')[0]}</span>
          {satelliteProvider.isSimulated && (
            <span className="text-[10px] px-1 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
              Demo Layer
            </span>
          )}
        </div>

        {mouseCoords && (
          <div className="pointer-events-auto px-2 py-0.5 rounded bg-white/90 border border-slate-200 text-[10px] font-mono text-slate-700 shadow-xs">
            {formatCoordinates(mouseCoords.lat, mouseCoords.lng)}
          </div>
        )}
      </div>

      {/* Floating Top-Right: Controls */}
      {showLayersControl && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          {/* Basemap switcher */}
          <div className="flex bg-white/95 border border-slate-200 rounded-lg p-0.5 shadow-sm text-xs font-medium">
            <button
              onClick={() => setActiveBasemap('satellite')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeBasemap === 'satellite' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setActiveBasemap('terrain')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeBasemap === 'terrain' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Terrain
            </button>
            <button
              onClick={() => setActiveBasemap('street')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeBasemap === 'street' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Street
            </button>
          </div>

          {/* Layers Toggle */}
          <button
            onClick={() => setLayersPanelOpen(!layersPanelOpen)}
            className="p-1.5 rounded-lg bg-white/95 hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-colors cursor-pointer"
            title="Layer visibility"
          >
            <Layers className="w-4 h-4 text-blue-600" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-white/95 hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-colors cursor-pointer"
            title="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Layer Selector Panel */}
      {layersPanelOpen && (
        <div className="absolute top-14 right-3 z-30 w-64 bg-white/98 border border-slate-200 rounded-xl p-3.5 shadow-xl text-xs text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" /> Map Layers
            </span>
            <button
              onClick={() => setLayersPanelOpen(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mb-3 space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Operational Layers
            </span>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                checked={activeLayers.boundaries}
                onChange={() => toggleLayer('boundaries')}
                className="rounded border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Watershed Boundaries</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                checked={activeLayers.evidence}
                onChange={() => toggleLayer('evidence')}
                className="rounded border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Field Evidence (Photos)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                checked={activeLayers.interventions}
                onChange={() => toggleLayer('interventions')}
                className="rounded border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Interventions</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                checked={activeLayers.waterBodies}
                onChange={() => toggleLayer('waterBodies')}
                className="rounded border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Water Bodies</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                checked={activeLayers.drainage}
                onChange={() => toggleLayer('drainage')}
                className="rounded border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Drainage Networks</span>
            </label>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Remote-Sensing Layers
            </span>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                checked={activeLayers.ndvi}
                onChange={() => toggleLayer('ndvi')}
                className="rounded border-slate-300 text-emerald-600 focus:ring-0"
              />
              <span>NDVI (Vegetation Index)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                checked={activeLayers.ndwi}
                onChange={() => toggleLayer('ndwi')}
                className="rounded border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>NDWI (Water Index)</span>
            </label>
          </div>
        </div>
      )}

      {/* Floating Bottom Center: Timeline Controls */}
      {showTimelineControl && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-3.5 py-1.5 bg-white/95 border border-slate-200 rounded-xl shadow-md text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-mono uppercase text-[10px] tracking-wider text-slate-500">Timeline:</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 font-mono text-xs">
            {[2024, 2025, 2026].map(year => (
              <button
                key={year}
                onClick={() => setTimelineYear(year)}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer font-bold ${
                  timelineYear === year
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          <span className="text-[10px] text-slate-500 hidden sm:inline font-mono">
            {timelineYear === 2024 ? 'Pre-intervention baseline' : timelineYear === 2025 ? 'Construction period' : 'Current verified state'}
          </span>
        </div>
      )}
    </div>
  );
};
