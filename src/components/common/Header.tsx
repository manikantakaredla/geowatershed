import React, { useState } from 'react';
import { 
  Waves, 
  Search, 
  Layers, 
  Bell, 
  UserCheck, 
  Satellite, 
  ChevronDown, 
  Upload, 
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { getActiveSatelliteProvider } from '../../services/satelliteProvider';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    switchUserRole, 
    watersheds, 
    selectedWatershedId, 
    setSelectedWatershedId, 
    alerts, 
    navigate,
    searchQuery,
    setSearchQuery,
    interventions,
    setSelectedInterventionId
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const satelliteProvider = getActiveSatelliteProvider();
  const unresolvedAlertsCount = alerts.filter(a => !a.resolved).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if coordinates format
    const coordMatch = searchQuery.match(/(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);
    if (coordMatch) {
      navigate('/explorer');
      return;
    }

    // Check if matched intervention
    const matchedInt = interventions.find(i => 
      i.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
      i.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchedInt) {
      setSelectedInterventionId(matchedInt.id);
      navigate(`/interventions/${matchedInt.id}`);
      return;
    }

    navigate('/explorer');
  };

  const roles: UserRole[] = ['Admin', 'Officer', 'Field Officer', 'Researcher', 'Viewer'];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-4">
      {/* Brand & Catchment Context */}
      <div className="flex items-center gap-3 min-w-max">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold tracking-tight text-base text-slate-900">WATERSCOPE</span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase bg-slate-100 text-slate-700 rounded border border-slate-200">
                Evidence Core
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 hidden sm:block">
              Watershed Intelligence & Field Verification Platform
            </p>
          </div>
        </button>

        {/* Current Watershed Selector */}
        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200">
          <Layers className="w-4 h-4 text-blue-600" />
          <span className="text-xs text-slate-500 font-medium">Catchment:</span>
          <select
            value={selectedWatershedId}
            onChange={(e) => setSelectedWatershedId(e.target.value)}
            className="bg-slate-50 text-slate-800 border border-slate-200 rounded-md text-xs px-2.5 py-1 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer hover:bg-slate-100"
          >
            {watersheds.map(ws => (
              <option key={ws.id} value={ws.id}>
                {ws.code} &bull; {ws.name} ({ws.district})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md mx-2 relative">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Watershed, Structure (e.g. CD-001), or Coordinates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-lg pl-9 pr-4 py-1.5 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
        </form>

        {/* Search quick preview dropdown */}
        {searchFocused && searchQuery.length > 1 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-50 text-xs">
            <div className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
              Quick Suggestions
            </div>
            {interventions
              .filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.code.toLowerCase().includes(searchQuery.toLowerCase()))
              .slice(0, 3)
              .map(i => (
                <button
                  key={i.id}
                  onClick={() => {
                    setSelectedInterventionId(i.id);
                    navigate(`/interventions/${i.id}`);
                  }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-md flex items-center justify-between text-slate-800 cursor-pointer"
                >
                  <span className="font-medium">{i.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">{i.watershedCode}</span>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Satellite Provider Status Badge */}
        <div 
          onClick={() => navigate('/settings')}
          className="hidden xl:flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md cursor-pointer hover:border-slate-300"
          title="Satellite imagery configuration"
        >
          <Satellite className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs text-slate-600 font-medium">
            {satelliteProvider.name.split('(')[0]}
          </span>
          <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase bg-slate-200 text-slate-700 rounded">
            DEMO
          </span>
        </div>

        {/* Quick Upload Evidence Button */}
        <button
          onClick={() => navigate('/evidence')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload Evidence</span>
        </button>

        {/* Alert Bell */}
        <button
          onClick={() => navigate('/alerts')}
          className="relative p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 cursor-pointer transition-colors"
          title="Alerts and Verification Queue"
        >
          <Bell className="w-4 h-4" />
          {unresolvedAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unresolvedAlertsCount}
            </span>
          )}
        </button>

        {/* Role Switcher & User Profile */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover border border-slate-300"
            />
            <div className="text-left hidden lg:block leading-tight pr-1">
              <div className="text-xs font-semibold text-slate-800">{currentUser.name.split(' ')[0]}</div>
              <div className="text-[10px] text-blue-600 font-medium">{currentUser.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Role Dropdown */}
          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-50">
              <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
                <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                <div className="text-[10px] text-blue-600 font-medium mt-0.5">{currentUser.department}</div>
              </div>

              <div className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Switch Role (Demo)
              </div>
              {roles.map(role => (
                <button
                  key={role}
                  onClick={() => {
                    switchUserRole(role);
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md flex items-center justify-between transition-colors ${
                    currentUser.role === role 
                      ? 'bg-blue-50 text-blue-700 font-semibold' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{role}</span>
                  {currentUser.role === role && <span className="text-[10px] text-blue-600 font-medium">Active</span>}
                </button>
              ))}

              <div className="border-t border-slate-100 mt-1.5 pt-1.5">
                <button
                  onClick={() => {
                    navigate('/login');
                    setRoleMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
