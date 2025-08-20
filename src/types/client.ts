
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  projects: string[];
  notes?: string[];
  status: "active" | "inactive" | "potential";
  company?: string;
  preferredContact: "email" | "phone" | "text";
  totalProjectsValue: number;
  lastContact?: string;
}

export interface ClientCommunication {
  id: string;
  clientId: string;
  type: "email" | "phone" | "meeting" | "text";
  subject: string;
  content: string;
  date: string;
  followUpRequired: boolean;
  followUpDate?: string;
}
