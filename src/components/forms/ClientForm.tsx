
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
import { User } from "lucide-react";
import { Client } from "@/types/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface ClientFormProps {
  client?: Client;
  onSubmit?: (clientData: any) => void;
  onCancel?: () => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ClientForm({ 
  client, 
  onSubmit, 
  onCancel, 
  trigger, 
  open: controlledOpen,
  onOpenChange: setControlledOpen 
}: ClientFormProps) {
  const { t } = useLanguage();
  const [internalOpen, setInternalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "", 
    address: "",
    notes: "",
    status: "potential" as "active" | "inactive" | "potential",
    preferredContact: "email" as "email" | "phone" | "text",
  });

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

  // Initialize form data when client prop changes
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
        company: client.company || "",
        address: client.address || "",
        notes: client.notes?.join("\n") || "",
        status: client.status || "potential",
        preferredContact: client.preferredContact || "email",
      });
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      const submitData = {
        ...formData,
        notes: formData.notes ? [formData.notes] : [],
      };
      onSubmit(submitData);
    }
    setOpen(false);
    if (!client) {
      // Reset form only if creating new client
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        notes: "",
        status: "potential",
        preferredContact: "email",
      });
    }
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

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('common.name')} *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder={t('common.name')}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">{t('common.email')} *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="email@exemplo.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">{t('common.phone')}</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">{t('clients.company')}</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => handleChange("company", e.target.value)}
            placeholder={t('clients.company')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">{t('common.address')}</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder={t('common.address')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">{t('common.status')}</Label>
          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{t('clients.status.active')}</SelectItem>
              <SelectItem value="inactive">{t('clients.status.inactive')}</SelectItem>
              <SelectItem value="potential">{t('clients.status.potential')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredContact">{t('clients.preferredContact')}</Label>
          <Select value={formData.preferredContact} onValueChange={(value) => handleChange("preferredContact", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">{t('clients.contact.email')}</SelectItem>
              <SelectItem value="phone">{t('clients.contact.phone')}</SelectItem>
              <SelectItem value="text">{t('clients.contact.text')}</SelectItem>
            </SelectContent>
          </Select>
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
          {client ? t('clients.saveChanges') : t('clients.createClient')}
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
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {client ? t('clients.editClient') : t('clients.newClient')}
            </DialogTitle>
            <DialogDescription>
              {client ? t('clients.editClient') : t('clients.newClient')}
            </DialogDescription>
          </DialogHeader>
          {renderForm()}
        </DialogContent>
      </Dialog>
    );
  }

  // Direct form render (for edit pages)
  return (
    <div className="max-w-4xl mx-auto p-6 bg-card rounded-lg border animate-slide-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <User className="h-6 w-6" />
          {client ? t('clients.editClient') : t('clients.newClient')}
        </h2>
        <p className="text-muted-foreground mt-1">
          {client ? t('clients.editClient') : t('clients.newClient')}
        </p>
      </div>
      {renderForm()}
    </div>
  );
}
