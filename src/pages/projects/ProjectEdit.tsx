
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProjectForm from "@/components/forms/ProjectForm";

export default function ProjectEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, updateProject } = useApp();

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-2">Projeto não encontrado</h1>
          <p className="text-muted-foreground mb-4">O projeto solicitado não existe ou foi removido.</p>
          <Button onClick={() => navigate('/projects')}>
            Voltar para Projetos
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (projectData: any) => {
    updateProject(project.id, projectData);
    navigate(`/projects/${project.id}`);
  };

  const handleCancel = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/projects/${project.id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Editar Projeto</h1>
          <p className="text-muted-foreground">
            Edite as informações do projeto "{project.name}"
          </p>
        </div>
      </div>

      <ProjectForm
        project={project}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
