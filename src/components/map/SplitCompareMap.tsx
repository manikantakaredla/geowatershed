import React, { useState, useRef, useEffect } from 'react';
import { Sliders, Calendar, ArrowRightLeft, Layers } from 'lucide-react';
import { formatCoordinates } from '../../utils/geo';
import { useApp } from '../../context/AppContext';
import { APP_IMAGES } from '../../assets/images';

export const SplitCompareMap: React.FC = () => {
  const { selectedWatershed } = useApp();
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [indicator, setIndicator] = useState<'ndvi' | 'ndwi' | 'true_color'>('ndvi');
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPosition(percent);
  };

  useEffect(() => {
    const onGlobalMouseUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener('mouseup', onGlobalMouseUp);
    return () => window.removeEventListener('mouseup', onGlobalMouseUp);
  }, []);

  const rightImage = indicator === 'ndvi' ? APP_IMAGES.sentinelNdvi : APP_IMAGES.sentinelTrueColor;
  const leftImage = APP_IMAGES.sentinelTrueColor;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Top Controls Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-blue-50 text-blue-700">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Temporal Dual-Scene Swipe Compare
            </h3>
            <p className="text-[11px] text-slate-500">
              Sentinel-2 Surface Reflectance: 2024 Baseline vs. 2026 Observed
            </p>
          </div>
        </div>

        {/* Indicator Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Layer:</span>
          <div className="bg-white p-0.5 rounded-lg border border-slate-200 flex text-xs font-medium">
            <button
              onClick={() => setIndicator('ndvi')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                indicator === 'ndvi' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              NDVI (Vegetation)
            </button>
            <button
              onClick={() => setIndicator('ndwi')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                indicator === 'ndwi' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              NDWI (Moisture)
            </button>
            <button
              onClick={() => setIndicator('true_color')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                indicator === 'true_color' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Natural Color
            </button>
          </div>
        </div>
      </div>

      {/* Swipe Container */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative flex-1 min-h-[380px] w-full select-none cursor-ew-resize overflow-hidden bg-slate-100"
      >
        {/* Right side (2026 Post-Intervention) */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('${rightImage}')`,
          }}
        >
          <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-white/95 border border-slate-200 shadow-md text-right">
            <div className="text-xs font-mono font-bold text-slate-900">POST-INTERVENTION: 2026</div>
            <div className="text-[11px] text-emerald-700 font-mono font-semibold">Average NDVI: 0.46 (+0.15)</div>
            <div className="text-[11px] text-blue-700 font-mono font-semibold">Water Extent: 1.8 ha (+50%)</div>
          </div>
        </div>

        {/* Left side (2024 Baseline) */}
        <div 
          className="absolute inset-y-0 left-0 overflow-hidden z-10"
          style={{ width: `${sliderPosition}%` }}
        >
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw',
              backgroundImage: `url('${leftImage}')`,
            }}
          >
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-white/95 border border-slate-200 shadow-md">
              <div className="text-xs font-mono font-bold text-slate-900">BASELINE: 2024</div>
              <div className="text-[11px] text-slate-600 font-mono">Average NDVI: 0.31</div>
              <div className="text-[11px] text-slate-600 font-mono">Water Extent: 1.2 ha</div>
            </div>
          </div>
        </div>

        {/* Draggable Divider Handle */}
        <div 
          onMouseDown={handleMouseDown}
          className="absolute top-0 bottom-0 z-20 w-0.5 bg-blue-600 cursor-ew-resize flex items-center justify-center"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-7 h-7 rounded-full bg-white border border-slate-300 shadow-md flex items-center justify-center text-slate-700 text-xs font-bold hover:scale-110 transition-transform">
            ⇄
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-[11px] font-mono text-slate-600 shadow-xs">
          Drag slider to compare 2024 vs 2026 spectral reflectance
        </div>
      </div>

      {/* Change Statistics Card */}
      <div className="p-4 bg-white border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
          <div className="text-[11px] text-slate-500 font-medium uppercase">Observed Vegetation Delta</div>
          <div className="text-lg font-bold text-emerald-700 font-mono mt-0.5">+38.2% <span className="text-xs font-normal text-slate-500">(+0.15 NDVI)</span></div>
          <div className="text-[11px] text-slate-500 mt-1">Satellite NIR/Red reflectance gain</div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
          <div className="text-[11px] text-slate-500 font-medium uppercase">Water Extent Delta</div>
          <div className="text-lg font-bold text-blue-700 font-mono mt-0.5">+50.0% <span className="text-xs font-normal text-slate-500">(1.2 ha → 1.8 ha)</span></div>
          <div className="text-[11px] text-slate-500 mt-1">Satellite surface water mask estimate</div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
          <div className="text-[11px] text-slate-500 font-medium uppercase">Field Verification Status</div>
          <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">82% Verified</div>
          <div className="text-[11px] text-amber-700 mt-1">Observed change ≠ causal proof without ground verification</div>
        </div>
      </div>
    </div>
  );
};
