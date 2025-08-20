
export interface Project {
  id: string;
  name: string;
  client: string;
  clientId: string;
  address: string;
  status: "planning" | "in-progress" | "completed" | "on-hold";
  progress: number;
  budget: number;
  spent: number;
  dueDate: string;
  startDate: string;
  team: string[];
  description?: string;
  sidingType?: string;
  photos?: string[];
  documents?: string[];
  notes?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  assignedTo: string[];
  dueDate: string;
  priority: "low" | "medium" | "high";
}
