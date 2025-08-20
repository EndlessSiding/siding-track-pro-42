
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "foreman" | "installer" | "apprentice" | "supervisor";
  skills: string[];
  hourlyRate: number;
  availability: "available" | "busy" | "off";
  currentProjects: string[];
  hireDate: string;
}

export interface Team {
  id: string;
  name: string;
  members: string[];
  specialties: string[];
  currentProject?: string;
  performance: {
    efficiency: number;
    quality: number;
    safety: number;
  };
}
