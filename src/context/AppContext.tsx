import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  User, 
  UserRole, 
  WatershedBoundary, 
  Intervention, 
  FieldObservation, 
  VerificationTask, 
  AlertItem 
} from '../types';
import { 
  MOCK_USERS, 
  MOCK_WATERSHEDS, 
  MOCK_INTERVENTIONS, 
  MOCK_FIELD_OBSERVATIONS, 
  MOCK_VERIFICATION_TASKS, 
  MOCK_ALERTS 
} from '../data/mockData';

export interface AppLayerState {
  boundaries: boolean;
  evidence: boolean;
  interventions: boolean;
  waterBodies: boolean;
  drainage: boolean;
  ndvi: boolean;
  ndwi: boolean;
  lulc: boolean;
  slope: boolean;
}

interface AppContextType {
  currentUser: User;
  switchUserRole: (role: UserRole) => void;
  watersheds: WatershedBoundary[];
  selectedWatershedId: string;
  setSelectedWatershedId: (id: string) => void;
  selectedWatershed: WatershedBoundary;
  interventions: Intervention[];
  fieldObservations: FieldObservation[];
  verificationTasks: VerificationTask[];
  alerts: AlertItem[];
  currentRoute: string;
  navigate: (route: string) => void;
  selectedInterventionId: string | null;
  setSelectedInterventionId: (id: string | null) => void;
  selectedObservationId: string | null;
  setSelectedObservationId: (id: string | null) => void;
  timelineYear: number;
  setTimelineYear: (year: number) => void;
  activeBasemap: 'street' | 'satellite' | 'terrain';
  setActiveBasemap: (b: 'street' | 'satellite' | 'terrain') => void;
  activeLayers: AppLayerState;
  toggleLayer: (key: keyof AppLayerState) => void;
  addNewObservation: (obs: FieldObservation) => void;
  updateVerificationTask: (taskId: string, updates: Partial<VerificationTask>) => void;
  verifyObservation: (obsId: string, status: 'Verified' | 'Inconclusive' | 'Needs Review') => void;
  resolveAlert: (alertId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[1]); // Default to Officer Priya Sharma
  const [currentRoute, setCurrentRoute] = useState<string>('/dashboard');
  const [selectedWatershedId, setSelectedWatershedId] = useState<string>('ws-1');
  const [interventions, setInterventions] = useState<Intervention[]>(MOCK_INTERVENTIONS);
  const [fieldObservations, setFieldObservations] = useState<FieldObservation[]>(MOCK_FIELD_OBSERVATIONS);
  const [verificationTasks, setVerificationTasks] = useState<VerificationTask[]>(MOCK_VERIFICATION_TASKS);
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);
  const [selectedInterventionId, setSelectedInterventionId] = useState<string | null>('int-1');
  const [selectedObservationId, setSelectedObservationId] = useState<string | null>(null);
  const [timelineYear, setTimelineYear] = useState<number>(2026);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [activeBasemap, setActiveBasemap] = useState<'street' | 'satellite' | 'terrain'>('satellite');
  const [activeLayers, setActiveLayers] = useState<AppLayerState>({
    boundaries: true,
    evidence: true,
    interventions: true,
    waterBodies: true,
    drainage: true,
    ndvi: false,
    ndwi: false,
    lulc: false,
    slope: false
  });

  const selectedWatershed = useMemo(() => {
    return MOCK_WATERSHEDS.find(w => w.id === selectedWatershedId) || MOCK_WATERSHEDS[0];
  }, [selectedWatershedId]);

  const switchUserRole = (role: UserRole) => {
    const user = MOCK_USERS.find(u => u.role === role);
    if (user) setCurrentUser(user);
  };

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLayer = (key: keyof AppLayerState) => {
    setActiveLayers(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const addNewObservation = (obs: FieldObservation) => {
    setFieldObservations(prev => [obs, ...prev]);
  };

  const updateVerificationTask = (taskId: string, updates: Partial<VerificationTask>) => {
    setVerificationTasks(prev => 
      prev.map(t => (t.id === taskId ? { ...t, ...updates } : t))
    );
  };

  const verifyObservation = (obsId: string, status: 'Verified' | 'Inconclusive' | 'Needs Review') => {
    setFieldObservations(prev => 
      prev.map(o => (o.id === obsId ? { ...o, verificationStatus: status } : o))
    );
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true } : a));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUserRole,
        watersheds: MOCK_WATERSHEDS,
        selectedWatershedId,
        setSelectedWatershedId,
        selectedWatershed,
        interventions,
        fieldObservations,
        verificationTasks,
        alerts,
        currentRoute,
        navigate,
        selectedInterventionId,
        setSelectedInterventionId,
        selectedObservationId,
        setSelectedObservationId,
        timelineYear,
        setTimelineYear,
        activeBasemap,
        setActiveBasemap,
        activeLayers,
        toggleLayer,
        addNewObservation,
        updateVerificationTask,
        verifyObservation,
        resolveAlert,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
