import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppSettingsContextType {
  appleWatchIntegration: boolean;
  appleWatchModel: string;
  criticalAlertsOnly: boolean;
  teamsIntegration: boolean;
  soundAlerts: boolean;
  refreshInterval: string;
  autoRefresh: boolean;
  setAppleWatchIntegration: (value: boolean) => void;
  setAppleWatchModel: (value: string) => void;
  setCriticalAlertsOnly: (value: boolean) => void;
  setTeamsIntegration: (value: boolean) => void;
  setSoundAlerts: (value: boolean) => void;
  setRefreshInterval: (value: string) => void;
  setAutoRefresh: (value: boolean) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};

interface AppSettingsProviderProps {
  children: ReactNode;
}

export const AppSettingsProvider: React.FC<AppSettingsProviderProps> = ({ children }) => {
  // Apple Watch settings
  const [appleWatchIntegration, setAppleWatchIntegration] = useState(false);
  const [appleWatchModel, setAppleWatchModel] = useState('series9');
  const [criticalAlertsOnly, setCriticalAlertsOnly] = useState(true);
  
  // General settings
  const [teamsIntegration, setTeamsIntegration] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('30');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const value = {
    appleWatchIntegration,
    appleWatchModel,
    criticalAlertsOnly,
    teamsIntegration,
    soundAlerts,
    refreshInterval,
    autoRefresh,
    setAppleWatchIntegration,
    setAppleWatchModel,
    setCriticalAlertsOnly,
    setTeamsIntegration,
    setSoundAlerts,
    setRefreshInterval,
    setAutoRefresh
  };

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};