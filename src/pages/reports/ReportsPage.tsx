import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Calendar,
  Download,
  Eye,
  Filter,
  PieChart,
  LineChart,
  Activity,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart as RechartsLineChart, Line, Pie } from 'recharts';

// Mock data for charts
const monthlyRevenue = [
  { month: 'Jan', receita: 45000, despesas: 30000 },
  { month: 'Fev', receita: 52000, despesas: 35000 },
  { month: 'Mar', receita: 48000, despesas: 32000 },
  { month: 'Abr', receita: 61000, despesas: 40000 },
  { month: 'Mai', receita: 55000, despesas: 38000 },
  { month: 'Jun', receita: 67000, despesas: 42000 },
];

const projectsByStatus = [
  { name: 'Concluídos', value: 15, color: '#10B981' },
  { name: 'Em Andamento', value: 8, color: '#3B82F6' },
  { name: 'Planejamento', value: 5, color: '#F59E0B' },
  { name: 'Pausados', value: 2, color: '#EF4444' },
];

const teamPerformance = [
  { team: 'Equipe Alpha', projetos: 8, eficiencia: 95 },
  { team: 'Equipe Beta', projetos: 6, eficiencia: 88 },
  { team: 'Equipe Gamma', projetos: 4, eficiencia: 92 },
];

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("this-month");

  const reports = [
    {
      title: "Relatório de Receitas",
      description: "Análise detalhada de receitas por período",
      type: "financial",
      lastGenerated: "2024-01-15",
      status: "updated",
    },
    {
      title: "Performance de Equipes",
      description: "Produtividade e eficiência das equipes",
      type: "team",
      lastGenerated: "2024-01-14",
      status: "updated",
    },
    {
      title: "Satisfação do Cliente",
      description: "Feedback e avaliações dos clientes",
      type: "customer",
      lastGenerated: "2024-01-10",
      status: "outdated",
    },
    {
      title: "Relatório de Projetos",
      description: "Status e progresso dos projetos",
      type: "project",
      lastGenerated: "2024-01-12",
      status: "updated",
    },
  ];

  return (
    <div className="w-full h-full p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Análises e insights do seu negócio
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">Esta Semana</SelectItem>
              <SelectItem value="this-month">Este Mês</SelectItem>
              <SelectItem value="this-year">Este Ano</SelectItem>
              <SelectItem value="last-month">Mês Anterior</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Todos
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="teams">Equipes</TabsTrigger>
          <TabsTrigger value="custom">Personalizados</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Receita vs Despesas
                </CardTitle>
                <CardDescription>Comparação mensal dos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="receita" fill="#3B82F6" name="Receita" />
                    <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Projects by Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Projetos por Status
                </CardTitle>
                <CardDescription>Distribuição atual dos projetos</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={projectsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {projectsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-4">
                  {projectsByStatus.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span>{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Performance das Equipes
              </CardTitle>
              <CardDescription>Produtividade e eficiência por equipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamPerformance.map((team, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{team.team}</p>
                        <p className="text-sm text-muted-foreground">{team.projetos} projetos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{team.eficiencia}%</p>
                      <p className="text-sm text-muted-foreground">Eficiência</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Financeiros</CardTitle>
              <CardDescription>Análises detalhadas de receitas, despesas e lucros</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Relatórios Financeiros</h3>
                <p className="text-muted-foreground">
                  Fluxo de caixa, margem de lucro, ROI por projeto
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Projetos</CardTitle>
              <CardDescription>Status, progresso e performance dos projetos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Relatórios de Projetos</h3>
                <p className="text-muted-foreground">
                  Timeline, atrasos, custos por projeto
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Equipes</CardTitle>
              <CardDescription>Produtividade e performance das equipes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Relatórios de Equipes</h3>
                <p className="text-muted-foreground">
                  Horas trabalhadas, eficiência, qualidade
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reports.map((report, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription>{report.description}</CardDescription>
                    </div>
                    <Badge variant={report.status === "updated" ? "default" : "secondary"}>
                      {report.status === "updated" ? "Atualizado" : "Desatualizado"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Última atualização: {new Date(report.lastGenerated).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Visualizar
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Baixar PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
