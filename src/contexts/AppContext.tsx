
import { createContext, useContext, ReactNode } from 'react';
import { Project } from '@/types/project';
import { Client } from '@/types/client';
import { Quote } from '@/types/financial';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import { useTeams } from '@/hooks/useTeams';
import { useQuotes } from '@/hooks/useQuotes';

interface Team {
  id: string;
  name: string;
  members: Array<{ name: string; role: string }>;
  specialties: string[];
  currentProject?: string;
  availability: 'available' | 'busy' | 'off';
  performance: {
    efficiency: number;
    quality: number;
    safety: number;
  };
}

interface AppContextType {
  projects: Project[];
  clients: Client[];
  teams: Team[];
  quotes: Quote[];
  isLoading: boolean;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, team: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  addQuote: (quote: Omit<Quote, 'id'>) => void;
  updateQuote: (id: string, quote: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const {
    clients,
    isLoading: clientsLoading,
    addClient,
    updateClient,
    deleteClient,
  } = useClients();

  const {
    projects,
    isLoading: projectsLoading,
    addProject,
    updateProject,
    deleteProject,
  } = useProjects();

  const {
    teams,
    isLoading: teamsLoading,
    addTeam,
    updateTeam,
    deleteTeam,
  } = useTeams();

  const {
    quotes,
    isLoading: quotesLoading,
    addQuote,
    updateQuote,
    deleteQuote,
  } = useQuotes();

  const isLoading = clientsLoading || projectsLoading || teamsLoading || quotesLoading;

  return (
    <AppContext.Provider value={{
      projects,
      clients,
      teams,
      quotes,
      isLoading,
      addProject,
      updateProject,
      deleteProject,
      addClient,
      updateClient,
      deleteClient,
      addTeam,
      updateTeam,
      deleteTeam,
      addQuote,
      updateQuote,
      deleteQuote,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
