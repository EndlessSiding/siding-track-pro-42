
-- Create storage bucket for invoice documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoice-documents', 'invoice-documents', true);

-- Create table for invoice documents metadata
CREATE TABLE public.invoice_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'jpg', 'jpeg')),
  file_url TEXT NOT NULL,
  file_size INTEGER,
  amount DECIMAL(10,2),
  vendor TEXT,
  description TEXT,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on invoice_documents table
ALTER TABLE public.invoice_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invoice_documents
CREATE POLICY "Anyone can view invoice documents" 
  ON public.invoice_documents 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert invoice documents" 
  ON public.invoice_documents 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update invoice documents" 
  ON public.invoice_documents 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete invoice documents" 
  ON public.invoice_documents 
  FOR DELETE 
  USING (true);

-- Create storage policies for invoice-documents bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'invoice-documents');

CREATE POLICY "Public Upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'invoice-documents');

CREATE POLICY "Public Update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'invoice-documents');

CREATE POLICY "Public Delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'invoice-documents');
