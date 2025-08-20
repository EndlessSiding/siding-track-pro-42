
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
  Dialog,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { ClientForm } from "@/components/forms/ClientForm";
import { Plus, X } from "lucide-react";
import { QuoteItem } from "@/types/financial";

interface QuoteFormWithClientsProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function QuoteFormWithClients({ onSubmit, onCancel }: QuoteFormWithClientsProps) {
  const { clients, addClient } = useApp();
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    clientId: "",
    projectName: "",
    validUntil: "",
    status: "draft" as const,
    notes: ""
  });

  const [items, setItems] = useState<QuoteItem[]>([]);
  const [newItem, setNewItem] = useState({
    description: "",
    quantity: "",
    unitPrice: "",
    category: "materials" as const
  });

  const addItem = () => {
    if (newItem.description && newItem.quantity && newItem.unitPrice) {
      const quantity = parseFloat(newItem.quantity);
      const unitPrice = parseFloat(newItem.unitPrice);
      const total = quantity * unitPrice;

      const item: QuoteItem = {
        id: `item-${Date.now()}`,
        description: newItem.description,
        quantity,
        unitPrice,
        total,
        category: newItem.category
      };

      setItems([...items, item]);
      setNewItem({
        description: "",
        quantity: "",
        unitPrice: "",
        category: "materials"
      });
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Adicione pelo menos um item ao orçamento");
      return;
    }

    onSubmit({
      ...formData,
      items,
      totalAmount,
      createdDate: new Date().toISOString().split('T')[0]
    });

    // Reset form
    setFormData({
      clientId: "",
      projectName: "",
      validUntil: "",
      status: "draft",
      notes: ""
    });
    setItems([]);
  };

  const handleCreateClient = (clientData: any) => {
    addClient(clientData);
    setIsClientDialogOpen(false);
    // Auto-select the new client
    setTimeout(() => {
      const newClient = clients[0];
      if (newClient) {
        setFormData({ ...formData, clientId: newClient.id });
      }
    }, 100);
  };

  const handleClientChange = (clientId: string) => {
    if (clientId === "new") {
      setIsClientDialogOpen(true);
      return;
    }
    setFormData({ ...formData, clientId });
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Novo Orçamento</DialogTitle>
        <DialogDescription>
          Crie um novo orçamento para um cliente. Adicione itens e defina os valores.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientId">Cliente</Label>
          <Select
            value={formData.clientId}
            onValueChange={handleClientChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new" className="text-blue-600 font-medium">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Cliente
                </div>
              </SelectItem>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectName">Nome do Projeto</Label>
          <Input
            id="projectName"
            value={formData.projectName}
            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            placeholder="Ex: Revestimento Casa Silva"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="validUntil">Válido Até</Label>
            <Input
              id="validUntil"
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => 
                setFormData({ ...formData, status: value as "draft" | "sent" | "approved" | "rejected" | "expired" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status do orçamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="sent">Enviado</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
                <SelectItem value="expired">Expirado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Adicionar itens */}
        <div className="space-y-3">
          <Label>Itens do Orçamento</Label>
          <div className="border rounded-lg p-3 space-y-3">
            <div className="grid grid-cols-4 gap-2">
              <Input
                placeholder="Descrição"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Qtd"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Preço"
                value={newItem.unitPrice}
                onChange={(e) => setNewItem({ ...newItem, unitPrice: e.target.value })}
              />
              <Select
                value={newItem.category}
                onValueChange={(value) => 
                  setNewItem({ ...newItem, category: value as "materials" | "labor" | "equipment" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="materials">Materiais</SelectItem>
                  <SelectItem value="labor">Mão de obra</SelectItem>
                  <SelectItem value="equipment">Equipamentos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="button" onClick={addItem} size="sm" className="w-full">
              Adicionar Item
            </Button>
          </div>

          {/* Lista de itens */}
          {items.length > 0 && (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-muted p-2 rounded">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.description}</span>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.quantity}x R$ {item.unitPrice.toFixed(2)} = R$ {item.total.toFixed(2)}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="text-right font-bold">
                Total: R$ {totalAmount.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observações (Opcional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Observações adicionais..."
            rows={2}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Criar Orçamento</Button>
        </DialogFooter>
      </form>

      {/* Dialog para criar novo cliente */}
      <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
        <ClientForm
          onSubmit={handleCreateClient}
          onCancel={() => setIsClientDialogOpen(false)}
        />
      </Dialog>
    </DialogContent>
  );
}
