
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, FileText, Image } from "lucide-react";
import { InvoiceDocumentUpload } from "@/types/invoice-document";

interface InvoiceUploadProps {
  projectId: string;
  onUpload: (data: InvoiceDocumentUpload) => Promise<boolean>;
  loading?: boolean;
}

export default function InvoiceUpload({ projectId, onUpload, loading }: InvoiceUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState("");
  const [vendor, setVendor] = useState("");
  const [description, setDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
    if (validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert('Por favor, selecione um arquivo PDF ou JPG');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const uploadData: InvoiceDocumentUpload = {
      project_id: projectId,
      file,
      amount: amount ? parseFloat(amount) : undefined,
      vendor: vendor || undefined,
      description: description || undefined,
    };

    const success = await onUpload(uploadData);
    if (success) {
      setFile(null);
      setAmount("");
      setVendor("");
      setDescription("");
      setDialogOpen(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setAmount("");
    setVendor("");
    setDescription("");
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Anexar Nota Fiscal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Anexar Nota Fiscal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/10'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  {file.type === 'application/pdf' ? (
                    <FileText className="h-12 w-12 text-red-500" />
                  ) : (
                    <Image className="h-12 w-12 text-blue-500" />
                  )}
                </div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  Remover
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm">
                  Arraste um arquivo aqui ou{' '}
                  <label className="text-primary cursor-pointer hover:underline">
                    clique para selecionar
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-xs text-muted-foreground">
                  Apenas PDF e JPG até 10MB
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Valor (opcional)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="vendor">Fornecedor (opcional)</Label>
              <Input
                id="vendor"
                placeholder="Nome do fornecedor"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Descrição do documento"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                resetForm();
                setDialogOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!file || loading}
              className="flex-1"
            >
              {loading ? "Enviando..." : "Anexar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
