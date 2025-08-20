
import { createContext, useContext, ReactNode } from 'react';
import { useCompanySettings } from '@/hooks/useCompanySettings';

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
  isLoading: boolean;
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
  const { data: companySettings, updateCompanySettings, isLoading } = useCompanySettings();

  // Garantir que sempre temos um objeto de settings válido
  const settings = companySettings ? {
    name: companySettings.name || defaultSettings.name,
    logo: companySettings.logo || '',
    darkLogo: companySettings.dark_logo || '',
    cnpj: companySettings.cnpj || '',
    phone: companySettings.phone || '',
    email: companySettings.email || '',
    address: companySettings.address || ''
  } : defaultSettings;

  const updateSettings = (newSettings: Partial<CompanySettings>) => {
    const mappedSettings = {
      name: newSettings.name,
      logo: newSettings.logo,
      dark_logo: newSettings.darkLogo,
      cnpj: newSettings.cnpj,
      phone: newSettings.phone,
      email: newSettings.email,
      address: newSettings.address
    };
    
    // Remove propriedades undefined
    const filteredSettings = Object.fromEntries(
      Object.entries(mappedSettings).filter(([_, value]) => value !== undefined)
    );
    
    updateCompanySettings(filteredSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
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
