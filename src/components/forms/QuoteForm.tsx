
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Calculator, Trash2 } from "lucide-react";
import { Quote, QuoteItem } from "@/types/financial";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuoteFormProps {
  quote?: Quote;
  onSubmit?: (quoteData: any) => void;
  onCancel?: () => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function QuoteForm({ 
  quote, 
  onSubmit, 
  onCancel, 
  trigger, 
  open: controlledOpen,
  onOpenChange: setControlledOpen 
}: QuoteFormProps) {
  const { clients } = useApp();
  const { t } = useLanguage();
  const [internalOpen, setInternalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    projectName: "",
    status: "draft" as "draft" | "sent" | "approved" | "rejected" | "expired",
    validUntil: "",
    notes: "",
  });
  const [items, setItems] = useState<QuoteItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0, total: 0, category: "materials" }
  ]);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

  useEffect(() => {
    if (quote) {
      setFormData({
        clientId: quote.clientId,
        projectName: quote.projectName,
        status: quote.status,
        validUntil: quote.validUntil.split('T')[0],
        notes: quote.notes || "",
      });
      setItems(quote.items || []);
    }
  }, [quote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
      const submitData = {
        ...formData,
        totalAmount,
        items,
        createdDate: quote?.createdDate || new Date().toISOString(),
      };
      onSubmit(submitData);
    }
    setOpen(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setOpen(false);
  };

  const addItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
      category: "materials"
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientId">Cliente *</Label>
          <Select value={formData.clientId} onValueChange={(value) => handleChange("clientId", value)}>
            <SelectTrigger>
              <SelectValue placeholder={t('quotes.selectClient')} />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="projectName">{t('quotes.projectName')} *</Label>
          <Input
            id="projectName"
            value={formData.projectName}
            onChange={(e) => handleChange("projectName", e.target.value)}
            placeholder={t('quotes.projectName')}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">{t('common.status')}</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">{t('quotes.status.draft')}</SelectItem>
              <SelectItem value="sent">{t('quotes.status.sent')}</SelectItem>
              <SelectItem value="approved">{t('quotes.status.approved')}</SelectItem>
              <SelectItem value="rejected">{t('quotes.status.rejected')}</SelectItem>
              <SelectItem value="expired">{t('quotes.status.expired')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="validUntil">{t('quotes.validUntil')}</Label>
          <Input
            id="validUntil"
            type="date"
            value={formData.validUntil}
            onChange={(e) => handleChange("validUntil", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>{t('quotes.items')}</Label>
          <Button type="button" onClick={addItem} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            {t('quotes.addItem')}
          </Button>
        </div>

        {items.map((item, index) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
            <div className="col-span-4">
              <Label>{t('quotes.description')}</Label>
              <Input
                value={item.description}
                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                placeholder={t('quotes.description')}
              />
            </div>

            <div className="col-span-2">
              <Label>{t('quotes.category')}</Label>
              <Select 
                value={item.category} 
                onValueChange={(value) => updateItem(item.id, 'category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="materials">{t('quotes.category.materials')}</SelectItem>
                  <SelectItem value="labor">{t('quotes.category.labor')}</SelectItem>
                  <SelectItem value="equipment">{t('quotes.category.equipment')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1">
              <Label>{t('quotes.quantity')}</Label>
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="col-span-2">
              <Label>{t('quotes.unitPrice')}</Label>
              <Input
                type="number"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="col-span-2">
              <Label>{t('common.total')}</Label>
              <Input
                value={`R$ ${item.total.toFixed(2)}`}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="col-span-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                disabled={items.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="text-right">
          <p className="text-lg font-semibold">
            {t('quotes.grandTotal')}: R$ {items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">{t('common.notes')}</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder={t('common.notes')}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
        >
          {t('common.cancel')}
        </Button>
        <Button type="submit">
          {quote ? t('quotes.saveChanges') : t('quotes.createQuote')}
        </Button>
      </div>
    </form>
  );

  // If used as a dialog
  if (trigger || controlledOpen !== undefined) {
    return (
      <Dialog open={isOpen} onOpenChange={setOpen}>
        {trigger && (
          <DialogTrigger asChild>
            {trigger}
          </DialogTrigger>
        )}
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              {quote ? t('quotes.editQuote') : t('quotes.newQuote')}
            </DialogTitle>
            <DialogDescription>
              {quote ? t('quotes.editQuote') : t('quotes.newQuote')}
            </DialogDescription>
          </DialogHeader>
          {renderForm()}
        </DialogContent>
      </Dialog>
    );
  }

  // Direct form render (for edit pages)
  return (
    <div className="max-w-6xl mx-auto p-6 bg-card rounded-lg border animate-slide-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          {quote ? t('quotes.editQuote') : t('quotes.newQuote')}
        </h2>
        <p className="text-muted-foreground mt-1">
          {quote ? t('quotes.editQuote') : t('quotes.newQuote')}
        </p>
      </div>
      {renderForm()}
    </div>
  );
}
