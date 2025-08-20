
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
import { useApp } from "@/contexts/AppContext";
import { ClientForm } from "@/components/forms/ClientForm";
import ProjectForm from "@/components/forms/ProjectForm";
import { Plus } from "lucide-react";

interface InvoiceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function InvoiceForm({ onSubmit, onCancel }: InvoiceFormProps) {
  const { clients, projects, addClient, addProject } = useApp();
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    clientId: "",
    projectId: "",
    amount: "",
    dueDate: "",
    description: "",
    status: "draft"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invoiceNumber = `INV-${String(Date.now()).slice(-6)}`;
    
    const selectedClient = clients.find(c => c.id === formData.clientId);
    const selectedProject = projects.find(p => p.id === formData.projectId);
    
    onSubmit({
      ...formData,
      id: invoiceNumber,
      client: selectedClient?.name || "",
      project: selectedProject?.name || "",
      amount: parseFloat(formData.amount) || 0,
      createdDate: new Date().toISOString().split('T')[0]
    });
    
    setFormData({
      clientId: "",
      projectId: "",
      amount: "",
      dueDate: "",
      description: "",
      status: "draft"
    });
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

  const handleCreateProject = (projectData: any) => {
    addProject(projectData);
    setIsProjectDialogOpen(false);
    // Auto-select the new project
    setTimeout(() => {
      const newProject = projects[0];
      if (newProject) {
        setFormData({ ...formData, projectId: newProject.id });
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

  const handleProjectChange = (projectId: string) => {
    if (projectId === "new") {
      setIsProjectDialogOpen(true);
      return;
    }
    setFormData({ ...formData, projectId });
  };

  // Filter projects by selected client
  const filteredProjects = formData.clientId 
    ? projects.filter(p => p.clientId === formData.clientId)
    : projects;

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
          <Label htmlFor="project">Projeto</Label>
          <Select
            value={formData.projectId}
            onValueChange={handleProjectChange}
            disabled={!formData.clientId}
          >
            <SelectTrigger>
              <SelectValue 
                placeholder={
                  !formData.clientId 
                    ? "Selecione um cliente primeiro" 
                    : "Selecione um projeto"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new" className="text-blue-600 font-medium">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Projeto
                </div>
              </SelectItem>
              {filteredProjects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

      {/* Dialog para criar novo cliente */}
      <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
        <ClientForm
          onSubmit={handleCreateClient}
          onCancel={() => setIsClientDialogOpen(false)}
        />
      </Dialog>

      {/* Dialog para criar novo projeto */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setIsProjectDialogOpen(false)}
        />
      </Dialog>
    </DialogContent>
  );
}
