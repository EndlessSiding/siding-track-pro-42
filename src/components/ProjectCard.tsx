
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, Users, Eye, Edit, Trash2 } from "lucide-react";
import { Project } from "@/types/project";
import { useApp } from "@/contexts/AppContext";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ProjectForm from "@/components/forms/ProjectForm";

interface ProjectCardProps {
  project: Project;
  detailed?: boolean;
}

const ProjectCard = ({ project, detailed = false }: ProjectCardProps) => {
  const { updateProject, deleteProject } = useApp();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "planning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "on-hold": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Concluído";
      case "in-progress": return "Em Andamento";
      case "planning": return "Planejamento";
      case "on-hold": return "Pausado";
      default: return status;
    }
  };

  const handleEdit = (projectData: any) => {
    updateProject(project.id, projectData);
    setIsEditDialogOpen(false);
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      deleteProject(project.id);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-1">{project.name}</CardTitle>
          <Badge variant="secondary" className={getStatusColor(project.status)}>
            {getStatusText(project.status)}
          </Badge>
        </div>
        {detailed && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{project.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{project.client}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Prazo: {new Date(project.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Orçamento</p>
            <p className="font-medium">R$ {project.budget.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Gasto</p>
            <p className="font-medium">R$ {project.spent.toLocaleString()}</p>
          </div>
        </div>

        {detailed && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Tipo de Revestimento</p>
            <Badge variant="outline">{project.sidingType}</Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalhes
        </Button>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <ProjectForm
            project={project}
            onSubmit={handleEdit}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </Dialog>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDelete}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
