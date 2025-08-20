
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { X } from "lucide-react";

interface TeamFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function TeamForm({ onSubmit, onCancel }: TeamFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    availability: "available"
  });
  
  const [members, setMembers] = useState<Array<{ name: string; role: string }>>([]);
  const [newMember, setNewMember] = useState({ name: "", role: "" });
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState("");

  const addMember = () => {
    if (newMember.name && newMember.role) {
      setMembers([...members, newMember]);
      setNewMember({ name: "", role: "" });
    }
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const addSpecialty = () => {
    if (newSpecialty && !specialties.includes(newSpecialty)) {
      setSpecialties([...specialties, newSpecialty]);
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (members.length === 0) {
      alert("Adicione pelo menos um membro à equipe");
      return;
    }
    
    onSubmit({
      ...formData,
      members,
      specialties,
      currentProject: null,
      performance: {
        efficiency: 90,
        quality: 90,
        safety: 95
      }
    });
    
    // Reset form
    setFormData({ name: "", availability: "available" });
    setMembers([]);
    setSpecialties([]);
  };

  return (
    <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Nova Equipe</DialogTitle>
        <DialogDescription>
          Crie uma nova equipe de trabalho. Adicione membros e suas especialidades.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Equipe</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Equipe Alpha"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="availability">Disponibilidade</Label>
          <Select
            value={formData.availability}
            onValueChange={(value) => setFormData({ ...formData, availability: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status da equipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponível</SelectItem>
              <SelectItem value="busy">Ocupada</SelectItem>
              <SelectItem value="off">Ausente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Membros */}
        <div className="space-y-2">
          <Label>Membros da Equipe</Label>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Nome"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              />
              <Select
                value={newMember.role}
                onValueChange={(value) => setNewMember({ ...newMember, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Instalador">Instalador</SelectItem>
                  <SelectItem value="Ajudante">Ajudante</SelectItem>
                </SelectContent>
              </Select>
              <Button type="button" onClick={addMember} size="sm">
                Adicionar
              </Button>
            </div>
            
            <div className="space-y-1">
              {members.map((member, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                  <span className="text-sm">
                    <strong>{member.name}</strong> - {member.role}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMember(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Especialidades */}
        <div className="space-y-2">
          <Label>Especialidades</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Ex: Vinyl Siding"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
              />
              <Button type="button" onClick={addSpecialty} size="sm">
                Adicionar
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                  <button
                    type="button"
                    onClick={() => removeSpecialty(specialty)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Criar Equipe</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
