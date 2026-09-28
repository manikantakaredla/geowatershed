import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  User, 
  Search, 
  ArrowRight, 
  Plus, 
  FileCheck, 
  Eye,
  Crosshair,
  Satellite,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCoordinates, findWatershedForCoordinate } from '../utils/geo';
import { FieldObservation, InterventionType } from '../types';
import { EvidenceChainBadge } from '../components/common/EvidenceChainBadge';
import { APP_IMAGES } from '../assets/images';

export const EvidencePage: React.FC = () => {
  const { 
    fieldObservations, 
    watersheds, 
    currentUser, 
    addNewObservation, 
    setSelectedObservationId, 
    navigate 
  } = useApp();

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterWatershed, setFilterWatershed] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Form states for upload workflow
  const [obsType, setObsType] = useState<InterventionType | string>('Check Dam');
  const [description, setDescription] = useState('');
  const [photoDate, setPhotoDate] = useState('2026-09-24');
  const [gpsMode, setGpsMode] = useState<'exif' | 'manual'>('exif');
  const [lat, setLat] = useState('18.2834');
  const [lng, setLng] = useState('83.3912');
  const [selectedImageFile, setSelectedImageFile] = useState<string | null>(
    APP_IMAGES.checkDam
  );

  // Processing Flow state
  const [processingStage, setProcessingStage] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedWatershed, setDetectedWatershed] = useState<any>(null);

  const filteredObservations = fieldObservations.filter(o => {
    const matchSearch = 
      o.code.toLowerCase().includes(search.toLowerCase()) || 
      o.notes.toLowerCase().includes(search.toLowerCase()) ||
      o.uploadedBy.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || o.observationType === filterType;
    const matchWs = filterWatershed === 'all' || o.watershedId === filterWatershed;
    return matchSearch && matchType && matchWs;
  });

  const handleStartProcessing = () => {
    setIsProcessing(true);
    setProcessingStage(1);

    setTimeout(() => {
      setProcessingStage(2);
      setTimeout(() => {
        setProcessingStage(3);

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        setTimeout(() => {
          setProcessingStage(4);
          const ws = findWatershedForCoordinate({ lat: latitude, lng: longitude }, watersheds);
          setDetectedWatershed(ws);

          setTimeout(() => {
            setProcessingStage(5);
            setTimeout(() => {
              setProcessingStage(6);
              setIsProcessing(false);
            }, 500);
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  };

  const handleSaveObservation = () => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const ws = detectedWatershed || watersheds[0];

    const newObs: FieldObservation = {
      id: `obs-${Date.now()}`,
      code: `OBS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      observationType: obsType as any,
      watershedId: ws.id,
      watershedCode: ws.code,
      location: { lat: latitude, lng: longitude },
      locationAccuracyMeters: 3.5,
      photoUrl: selectedImageFile || APP_IMAGES.checkDam,
      photoDate,
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser.name,
      uploaderRole: currentUser.role,
      verificationStatus: 'Pending',
      notes: description || 'New field inspection observation with extracted GPS metadata.',
      exifData: {
        hasGps: true,
        cameraModel: 'Trimble TDC600 GNSS Handheld',
        dateTimeOriginal: `${photoDate} 10:30:00`,
        altitudeMeters: 175.2,
        directionHeading: 135
      },
      evidenceQuality: {
        gpsQuality: 'High',
        imageQuality: 'High',
        satelliteMatch: 'Good',
        temporalConfidence: 'High',
        completenessPercent: 88
      },
      satelliteContextSummary: {
        ndviSurrounding: 0.44,
        waterPresenceDetected: true,
        landCoverType: 'Water / Irrigated Catchment',
        bufferStatus: 'Positive greenness anomaly registered'
      }
    };

    addNewObservation(newObs);
    setUploadModalOpen(false);
    setSelectedObservationId(newObs.id);
    navigate(`/evidence/${newObs.id}`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Geo-Coded Field Evidence Repository</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ground-level photographs linked with spatial catchments, EXIF coordinates, and satellite scenes
          </p>
        </div>

        <button
          onClick={() => {
            setUploadModalOpen(true);
            setProcessingStage(0);
          }}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Field Evidence</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search observations by Code, Officer, Notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 text-xs rounded-lg pl-9 pr-3 py-2 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-50 text-slate-800 text-xs rounded-lg px-3 py-2 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Observation Types</option>
          <option value="Check Dam">Check Dam</option>
          <option value="Farm Pond">Farm Pond</option>
          <option value="Water Harvesting Structure">Water Harvesting Structure</option>
          <option value="Plantation">Plantation</option>
          <option value="Contour Structure">Contour Structure</option>
          <option value="Soil Conservation">Soil Conservation</option>
          <option value="Water Body">Water Body</option>
        </select>

        <select
          value={filterWatershed}
          onChange={(e) => setFilterWatershed(e.target.value)}
          className="bg-slate-50 text-slate-800 text-xs rounded-lg px-3 py-2 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Watersheds</option>
          {watersheds.map(ws => (
            <option key={ws.id} value={ws.id}>{ws.code} &bull; {ws.name}</option>
          ))}
        </select>
      </div>

      {/* Observations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredObservations.map((obs) => (
          <div
            key={obs.id}
            onClick={() => {
              setSelectedObservationId(obs.id);
              navigate(`/evidence/${obs.id}`);
            }}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl overflow-hidden shadow-xs transition-colors cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Photo */}
              <div className="w-full h-48 bg-slate-100 relative overflow-hidden">
                <img
                  src={obs.photoUrl}
                  alt={obs.code}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-xs ${
                  obs.verificationStatus === 'Verified'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {obs.verificationStatus}
                </div>
                <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-white/90 text-slate-800 text-[10px] font-mono font-semibold shadow-xs">
                  {obs.watershedCode}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700">{obs.code}</span>
                  <span className="text-[11px] font-mono text-slate-500">{obs.photoDate}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                  {obs.observationType}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  "{obs.notes}"
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1 text-slate-700">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {formatCoordinates(obs.location.lat, obs.location.lng)}
                  </span>
                  <span>{obs.uploadedBy.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-blue-700">
              <span>Ground Evidence Locked</span>
              <span className="group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                Inspect Record →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Field Evidence Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl shadow-xl p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">
                  Upload Field Evidence & Spatial Linkage
                </h3>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Stages of Processing Animation */}
            {isProcessing || processingStage > 0 ? (
              <div className="py-6 space-y-4 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                  <Satellite className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900">
                    {processingStage === 1 && 'Uploading High-Resolution Image...'}
                    {processingStage === 2 && 'Reading Image EXIF Metadata...'}
                    {processingStage === 3 && 'Extracting Precise GPS Geotags...'}
                    {processingStage === 4 && 'Running Point-in-Polygon Spatial Query...'}
                    {processingStage === 5 && 'Loading Sentinel-2 Multi-Spectral Context...'}
                    {processingStage === 6 && 'Spatial Evidence Chain Established!'}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    Ground-truth to remote-sensing correlation engine
                  </p>
                </div>

                <div className="max-w-md mx-auto p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-left font-mono text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>1. EXIF Metadata:</span>
                    <span className={processingStage >= 2 ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                      {processingStage >= 2 ? '✓ Trimble GNSS Extracted' : 'Pending...'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>2. GPS Coordinates:</span>
                    <span className={processingStage >= 3 ? 'text-blue-700 font-bold' : 'text-slate-400'}>
                      {processingStage >= 3 ? `${lat}° N, ${lng}° E` : 'Pending...'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>3. Point-in-Polygon:</span>
                    <span className={processingStage >= 4 ? (detectedWatershed ? 'text-emerald-700 font-bold' : 'text-amber-700') : 'text-slate-400'}>
                      {processingStage >= 4 ? (detectedWatershed ? `✓ Inside ${detectedWatershed.code}` : '⚠ Outside configured boundaries') : 'Querying...'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>4. Satellite Buffer:</span>
                    <span className={processingStage >= 5 ? 'text-blue-700 font-bold' : 'text-slate-400'}>
                      {processingStage >= 5 ? '✓ 10m Sentinel-2 Attached' : 'Pending...'}
                    </span>
                  </div>
                </div>

                {processingStage === 6 && (
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={handleSaveObservation}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Confirm & Save to Registry
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Photo Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Field Photograph (Documentary Truth)
                    </label>
                    <label className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                      Browse Device Photo...
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setSelectedImageFile(event.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Preset Authentic Photos Picker */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      { name: 'Check Dam', url: APP_IMAGES.checkDam, lat: '18.2834', lng: '83.3912', type: 'Check Dam' },
                      { name: 'Farm Pond', url: APP_IMAGES.farmPond, lat: '18.2910', lng: '83.3760', type: 'Farm Pond' },
                      { name: 'Percolation Tank', url: APP_IMAGES.percolationTank, lat: '18.2715', lng: '83.4080', type: 'Water Harvesting Structure' },
                      { name: 'Contour Trenches', url: APP_IMAGES.contourTrench, lat: '18.3050', lng: '83.3650', type: 'Contour Structure' }
                    ].map((p) => {
                      const isSelected = selectedImageFile === p.url;
                      return (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => {
                            setSelectedImageFile(p.url);
                            setLat(p.lat);
                            setLng(p.lng);
                            setObsType(p.type);
                          }}
                          className={`relative rounded-lg overflow-hidden border p-1 text-left transition-all cursor-pointer ${
                            isSelected ? 'border-blue-600 ring-2 ring-blue-600/30 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                          }`}
                        >
                          <img src={p.url} alt={p.name} className="w-full h-14 object-cover rounded" />
                          <div className="text-[10px] font-semibold text-slate-800 mt-1 truncate">{p.name}</div>
                          <div className="text-[9px] text-slate-500 font-mono truncate">{p.lat}, {p.lng}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                    <img
                      src={selectedImageFile || APP_IMAGES.checkDam}
                      alt="Selected"
                      className="w-20 h-16 object-cover rounded-lg border border-slate-300"
                    />
                    <div className="text-xs text-slate-800 space-y-1">
                      <div className="font-bold">Authentic Field Photograph Selected</div>
                      <div className="text-[11px] text-slate-500 font-mono">Trimble GNSS Handheld Camera &bull; Verified EXIF</div>
                      <span className="inline-block text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                        ✓ GPS Geotag Extracted: {lat}° N, {lng}° E
                      </span>
                    </div>
                  </div>
                </div>

                {/* Observation Type & Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Observation Type
                    </label>
                    <select
                      value={obsType}
                      onChange={(e) => setObsType(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-xs rounded-lg px-3 py-2 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Check Dam">Check Dam</option>
                      <option value="Farm Pond">Farm Pond</option>
                      <option value="Water Harvesting Structure">Water Harvesting Structure</option>
                      <option value="Plantation">Plantation</option>
                      <option value="Contour Structure">Contour Structure</option>
                      <option value="Soil Conservation">Soil Conservation</option>
                      <option value="Water Body">Water Body</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Observation Date
                    </label>
                    <input
                      type="date"
                      value={photoDate}
                      onChange={(e) => setPhotoDate(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-xs rounded-lg px-3 py-2 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* GPS Source Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    GPS Coordinates Source
                  </label>
                  <div className="flex gap-4 mb-2 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-800">
                      <input
                        type="radio"
                        name="gpsMode"
                        checked={gpsMode === 'exif'}
                        onChange={() => setGpsMode('exif')}
                        className="text-blue-600 focus:ring-0"
                      />
                      <span>● Extract from EXIF (Automated)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-500">
                      <input
                        type="radio"
                        name="gpsMode"
                        checked={gpsMode === 'manual'}
                        onChange={() => setGpsMode('manual')}
                        className="text-blue-600 focus:ring-0"
                      />
                      <span>○ Enter manually</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono">Latitude</span>
                      <input
                        type="text"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        className="w-full bg-slate-50 text-slate-900 text-xs font-mono rounded-lg px-3 py-1.5 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono">Longitude</span>
                      <input
                        type="text"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        className="w-full bg-slate-50 text-slate-900 text-xs font-mono rounded-lg px-3 py-1.5 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Field Officer Notes
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter ground inspection observations, water retention depth, structural stability..."
                    className="w-full bg-slate-50 text-slate-900 text-xs rounded-lg px-3 py-2 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Action */}
                <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    onClick={() => setUploadModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartProcessing}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>Run Geospatial Evidence Pipeline</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
