
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
import { Project } from "@/types/project";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ClientForm } from "@/components/forms/ClientForm";
import { Plus } from "lucide-react";

interface ProjectFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  project?: Project;
}

export default function ProjectForm({ onSubmit, onCancel, project }: ProjectFormProps) {
  const { clients, addClient } = useApp();
  const { t } = useLanguage();
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: project?.name || "",
    clientId: project?.clientId || "",
    client: project?.client || "",
    address: project?.address || "",
    budget: project?.budget?.toString() || "",
    dueDate: project?.dueDate || "",
    description: project?.description || "",
    status: project?.status || "planning" as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find selected client info
    const selectedClient = clients.find(c => c.id === formData.clientId);
    
    onSubmit({
      ...formData,
      client: selectedClient?.name || formData.client,
      clientId: formData.clientId || "temp-client-id",
      budget: parseFloat(formData.budget) || 0,
      progress: project?.progress || 0,
      spent: project?.spent || 0,
      team: project?.team || [],
      startDate: project?.startDate || new Date().toISOString().split('T')[0]
    });
    setFormData({
      name: "",
      clientId: "",
      client: "",
      address: "",
      budget: "",
      dueDate: "",
      description: "",
      status: "planning" as const
    });
  };

  const handleCreateClient = (clientData: any) => {
    const newClient = addClient(clientData);
    setIsClientDialogOpen(false);
    // Auto-select the new client
    setTimeout(() => {
      const latestClient = clients.find(c => c.name === clientData.name);
      if (latestClient) {
        setFormData({ ...formData, clientId: latestClient.id, client: latestClient.name });
      }
    }, 100);
  };

  const handleClientChange = (clientId: string) => {
    if (clientId === "new") {
      setIsClientDialogOpen(true);
      return;
    }
    
    const selectedClient = clients.find(c => c.id === clientId);
    setFormData({ 
      ...formData, 
      clientId, 
      client: selectedClient?.name || ""
    });
  };

  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{project ? t('projects.editProject') : t('projects.newProject')}</DialogTitle>
          <DialogDescription>
            {project ? t('projects.editProjectDesc') : t('projects.createProjectDesc')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('projects.projectName')}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Smith House - Siding"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">{t('common.client')}</Label>
            <Select
              value={formData.clientId}
              onValueChange={handleClientChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('projects.selectClient')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new" className="text-blue-600 font-medium">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {t('clients.newClient')}
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
            <Label htmlFor="address">{t('common.address')}</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St, City, State 12345"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">{t('projects.budget')} ($)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="15000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">{t('projects.dueDate')}</Label>
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
            <Label htmlFor="status">{t('common.status')}</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "planning" | "in-progress" | "completed" | "on-hold") => 
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t('projects.selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">{t('projects.status.planning')}</SelectItem>
                <SelectItem value="in-progress">{t('projects.status.inProgress')}</SelectItem>
                <SelectItem value="completed">{t('projects.status.completed')}</SelectItem>
                <SelectItem value="on-hold">{t('projects.status.onHold')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('projects.description')} ({t('common.optional')})</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t('projects.descriptionPlaceholder')}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">{project ? t('common.saveChanges') : t('projects.createProject')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Dialog para criar novo cliente */}
      {isClientDialogOpen && (
        <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
          <ClientForm
            onSubmit={handleCreateClient}
            onCancel={() => setIsClientDialogOpen(false)}
          />
        </Dialog>
      )}
    </>
  );
}
