
import { createContext, useContext, useState, ReactNode } from 'react';

interface CompanySettings {
  name: string;
  logo: string;
  darkLogo: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
}

interface SettingsContextType {
  settings: CompanySettings;
  updateSettings: (settings: Partial<CompanySettings>) => void;
}

const defaultSettings: CompanySettings = {
  name: 'SidingTrack',
  logo: '',
  darkLogo: '',
  cnpj: '',
  phone: '',
  email: '',
  address: ''
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);

  const updateSettings = (newSettings: Partial<CompanySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
