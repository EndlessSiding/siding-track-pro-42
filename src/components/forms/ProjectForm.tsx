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
import { Project } from "@/types/project";

interface ProjectFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  project?: Project;
}

export default function ProjectForm({ onSubmit, onCancel, project }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    client: project?.client || "",
    address: project?.address || "",
    budget: project?.budget?.toString() || "",
    dueDate: project?.dueDate || "",
    description: project?.description || "",
    status: project?.status || "planning" as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      budget: parseFloat(formData.budget) || 0,
      progress: project?.progress || 0,
      spent: project?.spent || 0,
      team: project?.team || [],
      clientId: project?.clientId || "temp-client-id",
      startDate: project?.startDate || new Date().toISOString().split('T')[0]
    });
    setFormData({
      name: "",
      client: "",
      address: "",
      budget: "",
      dueDate: "",
      description: "",
      status: "planning" as const
    });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{project ? "Editar Projeto" : "Novo Projeto"}</DialogTitle>
        <DialogDescription>
          {project ? "Edite as informações do projeto." : "Crie um novo projeto de revestimento. Clique em salvar quando terminar."}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Projeto</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Casa da Silva - Siding"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="client">Cliente</Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            placeholder="Nome do cliente"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Endereço completo"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Orçamento ($)</Label>
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
            <Label htmlFor="dueDate">Data de Entrega</Label>
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
            onValueChange={(value: "planning" | "in-progress" | "completed" | "on-hold") => 
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planejamento</SelectItem>
              <SelectItem value="in-progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="on-hold">Pausado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição (Opcional)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detalhes adicionais do projeto..."
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{project ? "Salvar Alterações" : "Criar Projeto"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
