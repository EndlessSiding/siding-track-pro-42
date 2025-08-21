
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MetricCard from "@/components/MetricCard";
import MetricCardMobile from "@/components/MetricCardMobile";
import ProjectCard from "@/components/ProjectCard";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMobileDetection } from "@/hooks/use-mobile-detection";
import { Plus, Users, FolderOpen, DollarSign, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const { projects, clients } = useApp();
  const { t } = useLanguage();
  const { isMobile } = useMobileDetection();

  // Calculate real metrics from actual data
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === "in-progress").length;
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const totalRevenue = projects.reduce((sum, project) => sum + project.budget, 0);
  const totalClients = clients.length;

  // Progress is calculated based on project completion percentage
  const averageProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length)
    : 0;

  const metrics = [
    {
      title: t('dashboard.totalProjects'),
      value: totalProjects.toString(),
      change: `${completedProjects} ${t('projects.status.completed').toLowerCase()}`,
      icon: FolderOpen,
      color: "blue" as const,
    },
    {
      title: t('dashboard.activeProjects'),
      value: activeProjects.toString(),
      change: `${averageProgress}% ${t('projects.progress').toLowerCase()}`,
      icon: BarChart3,
      color: "green" as const,
    },
    {
      title: t('dashboard.totalRevenue'),
      value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`,
      change: "+15% do mês passado",
      icon: DollarSign,
      color: "purple" as const,
    },
    {
      title: t('dashboard.totalClients'),
      value: totalClients.toString(),
      change: "+3 novos este mês",
      icon: Users,
      color: "orange" as const,
    },
  ];

  const recentProjects = projects.slice(0, 3);

  return (
    <div className="w-full h-full p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            {t('dashboard.title')}
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <Button size={isMobile ? "sm" : "default"} className="gap-2">
          <Plus className="h-4 w-4" />
          {!isMobile && t('dashboard.newProject')}
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {metrics.map((metric, index) => 
          isMobile ? (
            <MetricCardMobile key={index} {...metric} />
          ) : (
            <MetricCard key={index} {...metric} />
          )
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.recentProjects')}</CardTitle>
              <CardDescription>
                Projetos em andamento e recentemente concluídos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {recentProjects.length > 0 ? (
                  recentProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum projeto encontrado</p>
                    <Button className="mt-4" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('dashboard.newProject')}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
