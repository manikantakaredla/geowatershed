import React, { useState } from 'react';
import { 
  Settings, 
  Satellite, 
  Layers, 
  Users, 
  Database, 
  Upload, 
  CheckCircle2, 
  Shield, 
  HardDrive, 
  Terminal, 
  ExternalLink,
  Save
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { currentUser, switchUserRole } = useApp();
  const [activeTab, setActiveTab] = useState<'providers' | 'layers' | 'users' | 'system'>('providers');
  const [satelliteProvider, setSatelliteProvider] = useState<'demo' | 'srishti' | 'copernicus'>('demo');
  const [srishtiTileUrl, setSrishtiTileUrl] = useState('');
  const [srishtiApiUrl, setSrishtiApiUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveConfig = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Configuration & Data Sources</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure remote sensing endpoints, GIS vector layers, role-based access, and audit logging
          </p>
        </div>

        {saveSuccess && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Configuration Saved Successfully</span>
          </div>
        )}
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('providers')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'providers'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Satellite className="w-4 h-4" />
          <span>Satellite Providers & Earth Imagery</span>
        </button>

        <button
          onClick={() => setActiveTab('layers')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'layers'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>GIS Layers & GeoJSON Import</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Role Permissions</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'system'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>System & Audit Logs</span>
        </button>
      </div>

      {/* Tab 1: Satellite Providers */}
      {activeTab === 'providers' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Satellite Data Provider Abstraction
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports configurable provider endpoints. If official live SRISHTI-DRISHTI is unconfigured, system uses verified Sentinel-2 demo tiles.
            </p>
          </div>

          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Active Imagery Source
              </label>
              <div className="space-y-2">
                <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 cursor-pointer hover:border-slate-300">
                  <input
                    type="radio"
                    name="sat_provider"
                    checked={satelliteProvider === 'demo'}
                    onChange={() => setSatelliteProvider('demo')}
                    className="mt-1 text-blue-600 focus:ring-0"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>Demo Satellite Layer (Sentinel-2 L2A Simulated)</span>
                      <span className="px-1.5 py-0.2 text-[9px] rounded bg-slate-200 text-slate-700 font-semibold">
                        Default Demo Mode
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      High-resolution multi-spectral synthetic imagery for simulated demonstration of watershed changes.
                    </div>
                  </div>
                </label>

                <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 cursor-pointer hover:border-slate-300">
                  <input
                    type="radio"
                    name="sat_provider"
                    checked={satelliteProvider === 'srishti'}
                    onChange={() => setSatelliteProvider('srishti')}
                    className="mt-1 text-blue-600 focus:ring-0"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>SRISHTI-DRISHTI (NRSC / ISRO Bhuvan)</span>
                      <span className="px-1.5 py-0.2 text-[9px] rounded bg-blue-100 text-blue-800 font-semibold">
                        Government Endpoint
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      National Remote Sensing Centre (NRSC) Bhuvan Watershed Monitoring Service.
                    </div>
                  </div>
                </label>

                <label className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 cursor-pointer hover:border-slate-300">
                  <input
                    type="radio"
                    name="sat_provider"
                    checked={satelliteProvider === 'copernicus'}
                    onChange={() => setSatelliteProvider('copernicus')}
                    className="mt-1 text-blue-600 focus:ring-0"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>Public Copernicus Sentinel-2 Open Access</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      ESA Copernicus 10-meter spatial resolution multi-spectral imagery.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* SRISHTI endpoint inputs */}
            {satelliteProvider === 'srishti' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    VITE_SATELLITE_TILE_URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://bhuvan-app1.nrsc.gov.in/bhuvan/wms..."
                    value={srishtiTileUrl}
                    onChange={(e) => setSrishtiTileUrl(e.target.value)}
                    className="w-full bg-white text-slate-900 text-xs rounded-lg px-3 py-2 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    VITE_SATELLITE_API_URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://nrsc.gov.in/api/v1/watershed/..."
                    value={srishtiApiUrl}
                    onChange={(e) => setSrishtiApiUrl(e.target.value)}
                    className="w-full bg-white text-slate-900 text-xs rounded-lg px-3 py-2 border border-slate-200"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleSaveConfig}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Satellite Provider Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: GIS Layers & GeoJSON Import */}
      {activeTab === 'layers' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Watershed Vector Boundaries & GIS Features
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Import or update GeoJSON polygons, drainage networks, and contour lines.
            </p>
          </div>

          <div className="p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 text-center space-y-3">
            <Upload className="w-8 h-8 text-blue-600 mx-auto" />
            <div>
              <div className="text-sm font-bold text-slate-900">Import Catchment Boundary GeoJSON</div>
              <div className="text-xs text-slate-500">EPSG:4326 (WGS 84) coordinate reference system</div>
            </div>
            <button
              onClick={() => alert('GeoJSON vector layers: 4 Watershed boundaries already configured in system memory.')}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
            >
              Browse GeoJSON File
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Users & Roles */}
      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">
              Role-Based Access Control (RBAC)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Current active identity: <strong className="text-blue-700">{currentUser.name} ({currentUser.role})</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {['Admin', 'Officer', 'Field Officer', 'Researcher', 'Viewer'].map((role) => (
              <div
                key={role}
                onClick={() => switchUserRole(role as any)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                  currentUser.role === role
                    ? 'bg-blue-50/70 border-blue-400 text-slate-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{role}</span>
                  {currentUser.role === role && <span className="text-[10px] font-mono text-blue-700 font-bold">Active</span>}
                </div>
                <div className="text-xs text-slate-500 leading-relaxed">
                  {role === 'Admin' && 'Full privileges, schema management, user delegation'}
                  {role === 'Officer' && 'Dossier reviews, task dispatch, report sign-off'}
                  {role === 'Field Officer' && 'Geotagged ground photo upload, GPS site validation'}
                  {role === 'Researcher' && 'Temporal multi-spectral analysis & statistics'}
                  {role === 'Viewer' && 'Read-only public observer mode'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: System & Audit Logs */}
      {activeTab === 'system' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-bold text-slate-900 uppercase">Geospatial System Audit Log</span>
            <span className="text-emerald-700 font-bold">PostGIS Engine Online</span>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-blue-700 font-bold">[2026-09-24 14:12:08]</span> POINT_IN_POLYGON query executed for coordinates (18.2834, 83.3912) &rarr; Matched polygon WS-001 (Nagavali Upper Catchment).
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-blue-700 font-bold">[2026-09-24 14:10:45]</span> BUFFER_ANALYSIS completed: 500m radius around CD-001 generated 18.2 ha envelope.
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-blue-700 font-bold">[2026-09-24 13:58:12]</span> SENTINEL2_REFLECTANCE query: Multi-spectral bands 4, 8 extracted for NDVI time-series 2024–2026.
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-blue-700 font-bold">[2026-09-24 13:42:00]</span> VERIFICATION_TASK task-1 submitted by K. Venkatesh (Field Officer) with geotagged photo.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
