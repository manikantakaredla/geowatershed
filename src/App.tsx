import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ExplorerPage } from './pages/ExplorerPage';
import { WatershedListPage } from './pages/WatershedListPage';
import { WatershedDetailPage } from './pages/WatershedDetailPage';
import { InterventionsPage } from './pages/InterventionsPage';
import { InterventionDetailPage } from './pages/InterventionDetailPage';
import { EvidencePage } from './pages/EvidencePage';
import { EvidenceDetailPage } from './pages/EvidenceDetailPage';
import { SatelliteAnalysisPage } from './pages/SatelliteAnalysisPage';
import { ChangeDetectionPage } from './pages/ChangeDetectionPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { currentRoute } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // If on login route, render standalone login
  if (currentRoute === '/login') {
    return <LoginPage />;
  }

  // Routing Switcher
  const renderCurrentPage = () => {
    if (currentRoute === '/dashboard' || currentRoute === '/') {
      return <DashboardPage />;
    }
    if (currentRoute === '/explorer') {
      return <ExplorerPage />;
    }
    if (currentRoute === '/watersheds') {
      return <WatershedListPage />;
    }
    if (currentRoute.startsWith('/watersheds/')) {
      return <WatershedDetailPage />;
    }
    if (currentRoute === '/interventions') {
      return <InterventionsPage />;
    }
    if (currentRoute.startsWith('/interventions/')) {
      return <InterventionDetailPage />;
    }
    if (currentRoute === '/evidence') {
      return <EvidencePage />;
    }
    if (currentRoute.startsWith('/evidence/')) {
      return <EvidenceDetailPage />;
    }
    if (currentRoute === '/satellite-analysis') {
      return <SatelliteAnalysisPage />;
    }
    if (currentRoute === '/change-detection') {
      return <ChangeDetectionPage />;
    }
    if (currentRoute === '/alerts') {
      return <AlertsPage />;
    }
    if (currentRoute === '/analytics') {
      return <AnalyticsPage />;
    }
    if (currentRoute === '/reports') {
      return <ReportsPage />;
    }
    if (currentRoute === '/settings') {
      return <SettingsPage />;
    }

    return <DashboardPage />;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-6 bg-slate-50">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
