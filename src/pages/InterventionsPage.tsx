import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Eye, 
  Plus, 
  ArrowUpRight,
  Droplet
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCoordinates } from '../utils/geo';
import { InterventionType, VerificationStatus } from '../types';

export const InterventionsPage: React.FC = () => {
  const { 
    interventions, 
    watersheds, 
    navigate, 
    setSelectedInterventionId,
    selectedWatershedId,
    setSelectedWatershedId
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedVerification, setSelectedVerification] = useState<string>('all');
  const [wsFilter, setWsFilter] = useState<string>('all');

  const filteredInterventions = interventions.filter(i => {
    const matchesSearch = 
      i.name.toLowerCase().includes(search.toLowerCase()) || 
      i.code.toLowerCase().includes(search.toLowerCase()) ||
      i.village.toLowerCase().includes(search.toLowerCase());

    const matchesType = selectedType === 'all' || i.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || i.status === selectedStatus;
    const matchesVerif = selectedVerification === 'all' || i.verificationStatus === selectedVerification;
    const matchesWs = wsFilter === 'all' || i.watershedId === wsFilter;

    return matchesSearch && matchesType && matchesStatus && matchesVerif && matchesWs;
  });

  const interventionTypes: InterventionType[] = [
    'Check Dam',
    'Farm Pond',
    'Water Harvesting Structure',
    'Plantation',
    'Contour Structure',
    'Soil Conservation',
    'Drainage Improvement'
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Watershed Interventions Directory</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Structural & vegetative interventions linked with ground photos, satellite buffers, and verification records
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedInterventionId('int-1');
            navigate('/interventions/int-1');
          }}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>Star Demo: Check Dam #001</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Code (e.g. CD-001), Name, Village..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 text-xs rounded-lg pl-9 pr-3 py-2 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 text-slate-800 text-xs rounded-lg px-3 py-2 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Intervention Types</option>
            {interventionTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Watershed Filter */}
          <select
            value={wsFilter}
            onChange={(e) => setWsFilter(e.target.value)}
            className="bg-slate-50 text-slate-800 text-xs rounded-lg px-3 py-2 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Watersheds</option>
            {watersheds.map(ws => (
              <option key={ws.id} value={ws.id}>{ws.code} &bull; {ws.name}</option>
            ))}
          </select>

          {/* Verification Status */}
          <select
            value={selectedVerification}
            onChange={(e) => setSelectedVerification(e.target.value)}
            className="bg-slate-50 text-slate-800 text-xs rounded-lg px-3 py-2 border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Verification Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Needs Review">Needs Review</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-1">
          <span>Showing {filteredInterventions.length} of {interventions.length} interventions</span>
          <span className="text-blue-700 font-semibold">Click any structure to open Intervention Intelligence View</span>
        </div>
      </div>

      {/* Interventions Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-mono tracking-wider text-slate-500">
              <tr>
                <th className="py-3 px-4">Evidence</th>
                <th className="py-3 px-4">Structure ID & Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Watershed</th>
                <th className="py-3 px-4">Location (GPS)</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredInterventions.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => {
                    setSelectedInterventionId(item.id);
                    navigate(`/interventions/${item.id}`);
                  }}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  {/* Photo thumbnail */}
                  <td className="py-3 px-4">
                    <div className="w-14 h-11 rounded overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={item.primaryPhotoUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  </td>

                  {/* ID & Name */}
                  <td className="py-3 px-4">
                    <div className="font-mono text-blue-700 font-bold">{item.code}</div>
                    <div className="font-bold text-slate-900 mt-0.5 group-hover:text-blue-700 transition-colors">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-slate-500">{item.village}</div>
                  </td>

                  {/* Type */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {item.type}
                    </span>
                  </td>

                  {/* Watershed */}
                  <td className="py-3 px-4 font-mono font-medium text-slate-700">
                    {item.watershedCode}
                  </td>

                  {/* Coordinates */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    {formatCoordinates(item.location.lat, item.location.lng)}
                  </td>

                  {/* Implementation Year */}
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {item.implementationYear}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600">
                      {item.status}
                    </span>
                  </td>

                  {/* Verification Status */}
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      item.verificationStatus === 'Verified'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : item.verificationStatus === 'Pending'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}>
                      {item.verificationStatus}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInterventionId(item.id);
                        navigate(`/interventions/${item.id}`);
                      }}
                      className="px-2.5 py-1 bg-slate-100 group-hover:bg-slate-900 text-slate-700 group-hover:text-white rounded text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Intelligence View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
