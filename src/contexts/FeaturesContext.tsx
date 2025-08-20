
import { createContext, useContext, useState, ReactNode } from 'react';

interface FeatureConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'core' | 'business' | 'reports' | 'integrations';
}

interface FeaturesContextType {
  features: Record<string, boolean>;
  toggleFeature: (featureId: string) => void;
  isFeatureEnabled: (featureId: string) => boolean;
  getFeaturesByCategory: (category: string) => FeatureConfig[];
  allFeatures: FeatureConfig[];
}

const defaultFeatures: FeatureConfig[] = [
  // Core Features
  { id: 'projects', name: 'Projetos', description: 'Gerenciar projetos de siding', enabled: true, category: 'core' },
  { id: 'clients', name: 'Clientes', description: 'Cadastro e gestão de clientes', enabled: true, category: 'core' },
  { id: 'teams', name: 'Equipes', description: 'Gerenciar equipes de trabalho', enabled: true, category: 'core' },
  
  // Business Features
  { id: 'quotes', name: 'Orçamentos', description: 'Criar e gerenciar orçamentos', enabled: true, category: 'business' },
  { id: 'financial', name: 'Financeiro', description: 'Controle financeiro e faturamento', enabled: true, category: 'business' },
  { id: 'invoices', name: 'Faturas', description: 'Gerenciamento de faturas', enabled: true, category: 'business' },
  
  // Reports
  { id: 'reports', name: 'Relatórios', description: 'Relatórios e análises', enabled: true, category: 'reports' },
  { id: 'analytics', name: 'Analytics', description: 'Análises avançadas de performance', enabled: false, category: 'reports' },
  
  // Integrations
  { id: 'map', name: 'Mapa', description: 'Visualização de projetos no mapa', enabled: false, category: 'integrations' },
  { id: 'calendar', name: 'Calendário', description: 'Integração com calendário', enabled: false, category: 'integrations' },
  { id: 'notifications', name: 'Notificações', description: 'Sistema de notificações', enabled: true, category: 'integrations' },
];

const FeaturesContext = createContext<FeaturesContextType | undefined>(undefined);

export function FeaturesProvider({ children }: { children: ReactNode }) {
  const [allFeatures, setAllFeatures] = useState<FeatureConfig[]>(defaultFeatures);

  // Criar o objeto features para compatibilidade com SettingsPage
  const features = allFeatures.reduce((acc, feature) => {
    acc[feature.id] = feature.enabled;
    return acc;
  }, {} as Record<string, boolean>);

  const toggleFeature = (featureId: string) => {
    setAllFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, enabled: !feature.enabled }
        : feature
    ));
  };

  const isFeatureEnabled = (featureId: string) => {
    const feature = allFeatures.find(f => f.id === featureId);
    return feature?.enabled ?? false;
  };

  const getFeaturesByCategory = (category: string) => {
    return allFeatures.filter(feature => feature.category === category);
  };

  return (
    <FeaturesContext.Provider value={{
      features,
      toggleFeature,
      isFeatureEnabled,
      getFeaturesByCategory,
      allFeatures,
    }}>
      {children}
    </FeaturesContext.Provider>
  );
}

export function useFeatures() {
  const context = useContext(FeaturesContext);
  if (context === undefined) {
    throw new Error('useFeatures must be used within a FeaturesProvider');
  }
  return context;
}
