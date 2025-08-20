
import { createContext, useContext, useState, ReactNode } from 'react';
import { Project } from '@/types/project';
import { Client } from '@/types/client';
import { Quote } from '@/types/financial';

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

// Initial mock data
const initialProjects: Project[] = [
  {
    id: "1",
    name: "Smith Residence Vinyl Siding",
    client: "John & Jane Smith",
    clientId: "1",
    address: "123 Oak Street, Springfield, IL",
    status: "in-progress",
    progress: 65,
    budget: 15000,
    spent: 9750,
    dueDate: "2024-08-15",
    startDate: "2024-06-01",
    team: ["Mike Johnson", "Sarah Davis"],
    sidingType: "Vinyl",
  },
  {
    id: "2",
    name: "Downtown Office Building",
    client: "ABC Corporation",
    clientId: "2",
    address: "456 Main St, Springfield, IL",
    status: "planning",
    progress: 25,
    budget: 45000,
    spent: 11250,
    dueDate: "2024-09-30",
    startDate: "2024-07-01",
    team: ["Tom Wilson", "Lisa Brown"],
    sidingType: "Metal",
  },
];

const initialClients: Client[] = [
  {
    id: "1",
    name: "John & Jane Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    address: "123 Oak Street, Springfield, IL",
    status: "active",
    totalProjectsValue: 15000,
    projects: ["1"],
    createdAt: "2024-01-01",
    preferredContact: "email",
    lastContact: "2024-01-15",
  },
  {
    id: "2",
    name: "ABC Corporation",
    email: "contact@abccorp.com",
    phone: "(555) 987-6543",
    address: "456 Main St, Springfield, IL",
    status: "active",
    totalProjectsValue: 45000,
    projects: ["2"],
    createdAt: "2024-01-02",
    preferredContact: "email",
    lastContact: "2024-01-10",
  },
];

const initialTeams: Team[] = [
  {
    id: "1",
    name: "Equipe Alpha",
    members: [
      { name: "Mike Johnson", role: "Supervisor" },
      { name: "Sarah Davis", role: "Instaladora" },
    ],
    specialties: ["Vinyl Siding", "Fiber Cement"],
    currentProject: "Smith Residence Vinyl Siding",
    availability: "busy",
    performance: {
      efficiency: 95,
      quality: 98,
      safety: 100,
    },
  },
];

const initialQuotes: Quote[] = [
  {
    id: "QT-001",
    clientId: "1",
    projectName: "Smith Residence Vinyl Siding",
    status: "sent",
    totalAmount: 15000,
    validUntil: "2024-02-15",
    createdDate: "2024-01-15",
    items: [
      { id: "1", description: "Vinyl Siding Installation", quantity: 1, unitPrice: 12000, total: 12000, category: "materials" },
      { id: "2", description: "Labor", quantity: 1, unitPrice: 3000, total: 3000, category: "labor" },
    ],
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, projectData: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, ...projectData } : project
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const addClient = (clientData: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === id ? { ...client, ...clientData } : client
    ));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  const addTeam = (teamData: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      ...teamData,
      id: Date.now().toString(),
    };
    setTeams(prev => [...prev, newTeam]);
  };

  const updateTeam = (id: string, teamData: Partial<Team>) => {
    setTeams(prev => prev.map(team => 
      team.id === id ? { ...team, ...teamData } : team
    ));
  };

  const deleteTeam = (id: string) => {
    setTeams(prev => prev.filter(team => team.id !== id));
  };

  const addQuote = (quoteData: Omit<Quote, 'id'>) => {
    const newQuote: Quote = {
      ...quoteData,
      id: `QT-${Date.now()}`,
    };
    setQuotes(prev => [...prev, newQuote]);
  };

  const updateQuote = (id: string, quoteData: Partial<Quote>) => {
    setQuotes(prev => prev.map(quote => 
      quote.id === id ? { ...quote, ...quoteData } : quote
    ));
  };

  const deleteQuote = (id: string) => {
    setQuotes(prev => prev.filter(quote => quote.id !== id));
  };

  return (
    <AppContext.Provider value={{
      projects,
      clients,
      teams,
      quotes,
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
