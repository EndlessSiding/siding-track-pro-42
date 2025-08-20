
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Image, Download, Trash2, Eye } from "lucide-react";
import { InvoiceDocument } from "@/types/invoice-document";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface InvoiceDocumentsListProps {
  documents: InvoiceDocument[];
  onDelete: (documentId: string) => Promise<boolean>;
  loading?: boolean;
  showProjectInfo?: boolean;
}

export default function InvoiceDocumentsList({ 
  documents, 
  onDelete, 
  loading,
  showProjectInfo = false 
}: InvoiceDocumentsListProps) {
  const handleDownload = (document: InvoiceDocument) => {
    window.open(document.file_url, '_blank');
  };

  const handleDelete = async (documentId: string) => {
    if (window.confirm('Tem certeza que deseja remover este documento?')) {
      await onDelete(documentId);
    }
  };

  const getFileIcon = (fileType: string) => {
    return fileType === 'pdf' ? FileText : Image;
  };

  const getFileTypeColor = (fileType: string) => {
    return fileType === 'pdf' ? 'text-red-500' : 'text-blue-500';
  };

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhum documento anexado</h3>
          <p className="text-muted-foreground">
            Anexe notas fiscais para manter um controle financeiro completo
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((document) => {
        const FileIcon = getFileIcon(document.file_type);
        
        return (
          <Card key={document.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <FileIcon className={`h-8 w-8 ${getFileTypeColor(document.file_type)} flex-shrink-0 mt-1`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground truncate">{document.file_name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {document.file_type.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Enviado em {new Date(document.upload_date).toLocaleDateString('pt-BR')}</p>
                      {document.file_size && (
                        <p>Tamanho: {(document.file_size / 1024 / 1024).toFixed(2)} MB</p>
                      )}
                      {document.vendor && <p>Fornecedor: {document.vendor}</p>}
                      {document.amount && (
                        <p>Valor: R$ {document.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      )}
                      {document.description && <p>Descrição: {document.description}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh]">
                      <div className="w-full h-[80vh]">
                        {document.file_type === 'pdf' ? (
                          <iframe
                            src={document.file_url}
                            className="w-full h-full"
                            title={document.file_name}
                          />
                        ) : (
                          <img
                            src={document.file_url}
                            alt={document.file_name}
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(document)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(document.id)}
                    className="text-destructive hover:text-destructive"
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
