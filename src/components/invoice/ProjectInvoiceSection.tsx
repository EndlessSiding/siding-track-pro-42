
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import InvoiceUpload from "./InvoiceUpload";
import InvoiceDocumentsList from "./InvoiceDocumentsList";
import { useInvoiceDocuments } from "@/hooks/useInvoiceDocuments";

interface ProjectInvoiceSectionProps {
  projectId: string;
}

export default function ProjectInvoiceSection({ projectId }: ProjectInvoiceSectionProps) {
  const { documents, loading, uploadDocument, deleteDocument } = useInvoiceDocuments(projectId);

  const totalAmount = documents.reduce((sum, doc) => sum + (doc.amount || 0), 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notas Fiscais
            {documents.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({documents.length} documento{documents.length !== 1 ? 's' : ''})
              </span>
            )}
          </CardTitle>
          <InvoiceUpload 
            projectId={projectId} 
            onUpload={uploadDocument}
            loading={loading}
          />
        </div>
        {totalAmount > 0 && (
          <div className="text-sm text-muted-foreground">
            Total Value: $ {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <InvoiceDocumentsList 
          documents={documents}
          onDelete={deleteDocument}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
}
