export interface Activity {
  id: string;
  type: string;
  title: string;
  description?: string;
  project_id?: string;
  client_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type ActivityType = 
  | 'project_created'
  | 'project_updated' 
  | 'project_progress'
  | 'project_completed'
  | 'client_created'
  | 'client_updated'
  | 'quote_created'
  | 'quote_sent'
  | 'quote_approved'
  | 'team_assigned'
  | 'payment_received'
  | 'document_uploaded'
  | 'checklist_updated';

export interface CreateActivityData {
  type: ActivityType;
  title: string;
  description?: string;
  project_id?: string;
  client_id?: string;
  metadata?: Record<string, any>;
}