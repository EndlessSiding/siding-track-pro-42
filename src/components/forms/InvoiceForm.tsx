
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InvoiceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function InvoiceForm({ onSubmit, onCancel }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    client: "",
    project: "",
    amount: "",
    dueDate: "",
    description: "",
    status: "draft"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invoiceNumber = `INV-${String(Date.now()).slice(-6)}`;
    
    onSubmit({
      ...formData,
      id: invoiceNumber,
      amount: parseFloat(formData.amount) || 0,
      createdDate: new Date().toISOString().split('T')[0]
    });
    
    setFormData({
      client: "",
      project: "",
      amount: "",
      dueDate: "",
      description: "",
      status: "draft"
    });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Nova Fatura</DialogTitle>
        <DialogDescription>
          Crie uma nova fatura para cobrança. Preencha os dados abaixo.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="client">Cliente</Label>
          <Select
            value={formData.client}
            onValueChange={(value) => setFormData({ ...formData, client: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="John & Jane Smith">John & Jane Smith</SelectItem>
              <SelectItem value="ABC Corporation">ABC Corporation</SelectItem>
              <SelectItem value="Robert Johnson">Robert Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="project">Projeto</Label>
          <Input
            id="project"
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            placeholder="Nome do projeto relacionado"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="1500.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Vencimento</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status da fatura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="sent">Enviada</SelectItem>
              <SelectItem value="paid">Paga</SelectItem>
              <SelectItem value="overdue">Atrasada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição (Opcional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descrição dos serviços faturados..."
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Criar Fatura</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
