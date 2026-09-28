import React from 'react';
import { 
  Home, 
  Map, 
  Camera, 
  Building2, 
  Satellite, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { currentRoute, navigate, alerts } = useApp();
  const unresolvedAlerts = alerts.filter(a => !a.resolved).length;

  const navItems = [
    { id: '/dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: '/explorer', label: 'Watershed Explorer', icon: Map, badge: 'GIS' },
    { id: '/evidence', label: 'Field Evidence', icon: Camera, badge: null },
    { id: '/interventions', label: 'Interventions', icon: Building2, badge: null },
    { id: '/satellite-analysis', label: 'Satellite Analysis', icon: Satellite, badge: null },
    { id: '/change-detection', label: 'Change Detection', icon: TrendingUp, badge: null },
    { 
      id: '/alerts', 
      label: 'Alerts & Queue', 
      icon: AlertTriangle, 
      badge: unresolvedAlerts > 0 ? `${unresolvedAlerts}` : null,
      badgeColor: 'bg-red-100 text-red-700 border border-red-200'
    },
    { id: '/analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: '/reports', label: 'Reports', icon: FileText, badge: null },
    { id: '/settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-200 z-30 select-none ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id || (item.id !== '/dashboard' && currentRoute.startsWith(item.id));

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-xs transition-colors cursor-pointer relative ${
                  isActive
                    ? 'bg-slate-100 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-blue-600' : 'text-slate-500'
                  }`}
                />

                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}

                {/* Badges */}
                {!collapsed && item.badge && (
                  <span
                    className={`ml-auto px-1.5 py-0.2 text-[10px] font-mono rounded font-semibold ${
                      item.badgeColor || 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed dot badge */}
                {collapsed && item.badge && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* Evidence Chain Status Info Card (if expanded) */}
        {!collapsed && (
          <div className="mx-2 mb-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Evidence Chain
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Every field observation links to watershed polygons, satellite rasters, and verification tasks.
            </p>
          </div>
        )}

        {/* Collapse toggle footer */}
        <div className="p-2 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full py-1.5 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded text-xs transition-colors cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <div className="flex items-center gap-2"><ChevronLeft className="w-4 h-4" /><span className="text-xs">Collapse</span></div>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex items-center justify-around py-2 px-1 shadow-md">
        <button
          onClick={() => navigate('/dashboard')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] ${
            currentRoute === '/dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => navigate('/explorer')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] ${
            currentRoute === '/explorer' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>Map</span>
        </button>

        <button
          onClick={() => navigate('/evidence')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] ${
            currentRoute === '/evidence' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Evidence</span>
        </button>

        <button
          onClick={() => navigate('/alerts')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] relative ${
            currentRoute === '/alerts' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Alerts</span>
          {unresolvedAlerts > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-red-600" />
          )}
        </button>

        <button
          onClick={() => navigate('/reports')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] ${
            currentRoute === '/reports' ? 'text-blue-600 font-bold' : 'text-slate-500'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Reports</span>
        </button>
      </nav>
    </>
  );
};
