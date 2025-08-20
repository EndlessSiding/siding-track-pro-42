
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InvoiceDocument, InvoiceDocumentUpload } from "@/types/invoice-document";
import { useToast } from "@/hooks/use-toast";

export const useInvoiceDocuments = (projectId?: string) => {
  const [documents, setDocuments] = useState<InvoiceDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('invoice_documents')
        .select('*')
        .order('upload_date', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Type assertion to ensure file_type matches our expected union type
      const typedData = (data || []).map(doc => ({
        ...doc,
        file_type: doc.file_type as 'pdf' | 'jpg' | 'jpeg'
      }));
      
      setDocuments(typedData);
    } catch (error) {
      console.error('Error fetching invoice documents:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os documentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (uploadData: InvoiceDocumentUpload): Promise<boolean> => {
    try {
      setLoading(true);

      // Upload file to storage
      const fileExt = uploadData.file.name.split('.').pop();
      const fileName = `${uploadData.project_id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('invoice-documents')
        .upload(fileName, uploadData.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('invoice-documents')
        .getPublicUrl(fileName);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('invoice_documents')
        .insert({
          project_id: uploadData.project_id,
          file_name: uploadData.file.name,
          file_type: fileExt?.toLowerCase() || 'pdf',
          file_url: publicUrl,
          file_size: uploadData.file.size,
          amount: uploadData.amount,
          vendor: uploadData.vendor,
          description: uploadData.description,
        });

      if (dbError) throw dbError;

      toast({
        title: "Sucesso",
        description: "Documento anexado com sucesso",
      });

      await fetchDocuments();
      return true;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Erro",
        description: "Não foi possível anexar o documento",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId: string): Promise<boolean> => {
    try {
      const document = documents.find(d => d.id === documentId);
      if (!document) return false;

      // Delete from storage
      const fileName = document.file_url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('invoice-documents')
          .remove([`${document.project_id}/${fileName}`]);
      }

      // Delete from database
      const { error } = await supabase
        .from('invoice_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Documento removido com sucesso",
      });

      await fetchDocuments();
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o documento",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [projectId]);

  return {
    documents,
    loading,
    uploadDocument,
    deleteDocument,
    refetch: fetchDocuments,
  };
};
