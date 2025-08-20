
export interface InvoiceDocument {
  id: string;
  project_id: string;
  file_name: string;
  file_type: 'pdf' | 'jpg' | 'jpeg';
  file_url: string;
  file_size?: number;
  amount?: number;
  vendor?: string;
  description?: string;
  upload_date: string;
  created_at: string;
}

export interface InvoiceDocumentUpload {
  project_id: string;
  file: File;
  amount?: number;
  vendor?: string;
  description?: string;
}
