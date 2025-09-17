
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, MapPin, Calendar, Users, DollarSign, Clock, Trash2 } from "lucide-react";
import ProjectInvoiceSection from "@/components/invoice/ProjectInvoiceSection";
import ProjectChecklist from "@/components/project/ProjectChecklist";
import { useLanguage } from "@/contexts/LanguageContext";

const statusColors = {
  planning: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  "on-hold": "bg-red-100 text-red-800",
};

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, clients, deleteProject, updateProject } = useApp();
  const { t } = useLanguage();

  const project = projects.find(p => p.id === id);
  const client = clients.find(c => c.id === project?.clientId);

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('projects.projectNotFound')}</h1>
          <p className="text-muted-foreground mb-4">{t('projects.projectNotFoundDesc')}</p>
          <Button onClick={() => navigate('/projects')}>
            {t('projects.backToProjects')}
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(t('projects.confirmDelete'))) {
      deleteProject(project.id);
      navigate('/projects');
    }
  };

  const handleUpdateChecklist = (checklist: any[]) => {
    updateProject(project.id, { checklist });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            <p className="text-muted-foreground">
              {t('common.client')}: {client?.name || project.client}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/projects/${project.id}/edit`}>
            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              {t('common.edit')}
            </Button>
          </Link>
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('projects.projectInfo')}</span>
                <Badge className={statusColors[project.status]}>
                  {t(`projects.status.${project.status.replace('-', '')}`)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{project.address}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('projects.progress')}</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{t('projects.startDate')}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(project.startDate).toLocaleDateString('en-US')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{t('projects.dueDate')}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(project.dueDate).toLocaleDateString('en-US')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('projects.team')}</p>
                  <p className="text-sm text-muted-foreground">{project.team.join(", ")}</p>
                </div>
              </div>

              {project.sidingType && (
                <div>
                  <p className="text-sm font-medium">{t('projects.sidingType')}</p>
                  <p className="text-sm text-muted-foreground">{project.sidingType}</p>
                </div>
              )}

              {project.description && (
                <div>
                  <p className="text-sm font-medium">{t('projects.description')}</p>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Checklist Section */}
          <ProjectChecklist 
            checklist={project.checklist || []}
            onUpdateChecklist={handleUpdateChecklist}
          />

          {/* Invoice Documents Section */}
          <ProjectInvoiceSection projectId={project.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {t('financial.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">{t('projects.totalBudget')}</span>
                  <span className="font-medium">$ {project.budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{t('projects.spentSoFar')}</span>
                  <span className="font-medium">$ {project.spent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{t('projects.remaining')}</span>
                  <span className="font-medium text-green-600">
                    $ {(project.budget - project.spent).toLocaleString()}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('projects.financialProgress')}</span>
                  <span>{Math.round((project.spent / project.budget) * 100)}%</span>
                </div>
                <Progress value={(project.spent / project.budget) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('projects.clientInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium">{client?.name || project.client}</p>
                {client?.email && (
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                )}
                {client?.phone && (
                  <p className="text-sm text-muted-foreground">{client.phone}</p>
                )}
              </div>
              {client && (
                <Link to={`/clients/${client.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('projects.viewClientProfile')}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
