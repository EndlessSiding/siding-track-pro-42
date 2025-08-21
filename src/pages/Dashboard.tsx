
import { useState } from "react";
import { ModernCard, ModernCardContent, ModernCardDescription, ModernCardHeader, ModernCardTitle } from "@/components/ui/modern-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { 
  Building2, 
  Users, 
  DollarSign, 
  Plus,
  CheckCircle,
  AlertCircle,
  Activity,
  Clock,
  Target,
  TrendingUp
} from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import MetricCard from "@/components/MetricCard";
import MetricCardMobile from "@/components/MetricCardMobile";
import RecentActivity from "@/components/RecentActivity";
import ProjectsMap from "@/components/ProjectsMap";
import ProjectForm from "@/components/forms/ProjectForm";
import QuickActions from "@/components/QuickActions";
import { useApp } from "@/contexts/AppContext";
import { useMobileDetection } from "@/hooks/use-mobile-detection";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const { projects, addProject } = useApp();
  const { isMobile } = useMobileDetection();

  const handleCreateProject = (projectData: any) => {
    addProject(projectData);
    setIsProjectDialogOpen(false);
  };

  const metrics = [
    {
      title: "Projetos Ativos",
      value: projects.filter(p => p.status === "in-progress").length.toString(),
      change: "+2 este mês",
      icon: Building2,
      color: "blue" as const
    },
    {
      title: "Total de Clientes",
      value: "45",
      change: "+5 este mês", 
      icon: Users,
      color: "green" as const
    },
    {
      title: "Receita do Mês",
      value: isMobile ? "R$ 84K" : "R$ 84.250",
      change: "+12% vs mês anterior",
      icon: DollarSign,
      color: "purple" as const
    },
    {
      title: "Taxa de Conclusão",
      value: "94%",
      change: "+3% vs mês anterior",
      icon: Target,
      color: "orange" as const
    }
  ];

  const quickStats = [
    { label: "Concluídos", value: projects.filter(p => p.status === "completed").length, icon: CheckCircle, color: "text-green-600" },
    { label: "Em Andamento", value: projects.filter(p => p.status === "in-progress").length, icon: Activity, color: "text-blue-600" },
    { label: "Planejamento", value: projects.filter(p => p.status === "planning").length, icon: Clock, color: "text-yellow-600" },
    { label: "Atrasados", value: 2, icon: AlertCircle, color: "text-red-600" }
  ];

  return (
    <div className="w-full h-full space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className={`font-bold tracking-tight ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
          Dashboard
        </h1>
        {!isMobile && (
          <p className="text-muted-foreground">
            Bem-vindo de volta! Aqui está o resumo dos seus projetos.
          </p>
        )}
      </div>

      {/* Quick Actions */}
      {!isMobile && <QuickActions />}

      {/* Quick Stats */}
      <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
        {quickStats.map((stat, index) => (
          <ModernCard key={stat.label} className="p-3">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg bg-muted ${stat.color} flex-shrink-0`}>
                <stat.icon className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`font-semibold ${isMobile ? 'text-sm' : 'text-xl'}`}>
                  {stat.value}
                </p>
                <p className={`text-muted-foreground truncate ${isMobile ? 'text-xs' : 'text-xs'}`}>
                  {stat.label}
                </p>
              </div>
            </div>
          </ModernCard>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
        {metrics.map((metric, index) => (
          isMobile ? (
            <MetricCardMobile key={index} {...metric} />
          ) : (
            <MetricCard key={index} {...metric} index={index} />
          )
        ))}
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full mb-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
          <TabsTrigger value="overview" className={isMobile ? "text-xs" : ""}>
            {isMobile ? "Resumo" : "Overview"}
          </TabsTrigger>
          <TabsTrigger value="projects" className={isMobile ? "text-xs" : ""}>
            Projetos
          </TabsTrigger>
          {!isMobile && (
            <>
              <TabsTrigger value="map">Mapa</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="overview" className="w-full">
          <div className={`grid gap-4 w-full ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
            <ModernCard className={isMobile ? "" : "lg:col-span-2"}>
              <ModernCardHeader>
                <ModernCardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Projetos Recentes
                </ModernCardTitle>
                {!isMobile && (
                  <ModernCardDescription>
                    Suas últimas atualizações e progresso dos projetos
                  </ModernCardDescription>
                )}
              </ModernCardHeader>
              <ModernCardContent>
                <div className="space-y-3">
                  {projects.slice(0, isMobile ? 2 : 3).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </ModernCardContent>
            </ModernCard>

            {!isMobile && <RecentActivity />}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'}`}>
              Todos os Projetos
            </h3>
            <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
              <DialogTrigger asChild>
                <Button size={isMobile ? "sm" : "default"}>
                  <Plus className="h-4 w-4 mr-2" />
                  {isMobile ? "Novo" : "Novo Projeto"}
                </Button>
              </DialogTrigger>
              <ProjectForm
                onSubmit={handleCreateProject}
                onCancel={() => setIsProjectDialogOpen(false)}
              />
            </Dialog>
          </div>
          
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} detailed />
            ))}
          </div>
        </TabsContent>

        {!isMobile && (
          <>
            <TabsContent value="map" className="w-full h-[600px]">
              <ProjectsMap projects={projects} />
            </TabsContent>

            <TabsContent value="reports" className="w-full">
              <ModernCard>
                <ModernCardHeader>
                  <ModernCardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Relatórios & Analytics
                  </ModernCardTitle>
                  <ModernCardDescription>
                    Insights abrangentes sobre o desempenho do seu negócio
                  </ModernCardDescription>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Relatórios em Breve</h3>
                    <p className="text-muted-foreground mb-4">
                      Recursos avançados de relatórios e análises estarão disponíveis na próxima atualização.
                    </p>
                    <Button variant="outline">Notificar</Button>
                  </div>
                </ModernCardContent>
              </ModernCard>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Dashboard;
