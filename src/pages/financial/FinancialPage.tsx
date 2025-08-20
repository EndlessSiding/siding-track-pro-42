
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Plus,
  Download,
  Calendar,
  CreditCard,
} from "lucide-react";
import MetricCard from "@/components/MetricCard";
import InvoiceForm from "@/components/forms/InvoiceForm";
import InvoiceDocumentsList from "@/components/invoice/InvoiceDocumentsList";
import { useInvoiceDocuments } from "@/hooks/useInvoiceDocuments";
import { useApp } from "@/contexts/AppContext";

// Mock data
const financialMetrics = [
  {
    title: "Receita Mensal",
    value: "$84,250",
    change: "+12% do mês passado",
    icon: DollarSign,
    color: "green" as const,
  },
  {
    title: "Despesas Mensais",
    value: "$52,180",
    change: "+5% do mês passado",
    icon: TrendingDown,
    color: "red" as const,
  },
  {
    title: "Lucro Líquido",
    value: "$32,070",
    change: "+18% do mês passado",
    icon: TrendingUp,
    color: "blue" as const,
  },
  {
    title: "Faturas Pendentes",
    value: "8",
    change: "-2 da semana passada",
    icon: FileText,
    color: "orange" as const,
  },
];

const recentInvoices = [
  {
    id: "INV-001",
    client: "John & Jane Smith",
    amount: 15000,
    status: "paid" as const,
    dueDate: "2024-01-15",
    project: "Smith Residence Vinyl Siding",
  },
  {
    id: "INV-002",
    client: "ABC Corporation",
    amount: 22500,
    status: "sent" as const,
    dueDate: "2024-01-20",
    project: "Downtown Office Building",
  },
  {
    id: "INV-003",
    client: "Robert Johnson",
    amount: 18750,
    status: "overdue" as const,
    dueDate: "2024-01-10",
    project: "Johnson Family Home",
  },
];

const statusColors = {
  paid: "bg-green-100 text-green-800",
  sent: "bg-blue-100 text-blue-800",
  draft: "bg-gray-100 text-gray-800",
  overdue: "bg-red-100 text-red-800",
};

export default function FinancialPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("this-month");
  const { projects } = useApp();
  const { documents, loading, deleteDocument } = useInvoiceDocuments(
    selectedProject === "all" ? undefined : selectedProject
  );

  const handleCreateInvoice = (invoiceData: any) => {
    console.log("Nova fatura criada:", invoiceData);
    setIsDialogOpen(false);
  };

  const totalInvoiceAmount = documents.reduce((sum, doc) => sum + (doc.amount || 0), 0);

  return (
    <div className="w-full h-full p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground">
            Acompanhe receitas, despesas e faturamento
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
            Exportar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Fatura
              </Button>
            </DialogTrigger>
            <InvoiceForm
              onSubmit={handleCreateInvoice}
              onCancel={() => setIsDialogOpen(false)}
            />
          </Dialog>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
          <TabsTrigger value="documents">Notas Fiscais</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Invoices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Faturas Recentes
                </CardTitle>
                <CardDescription>
                  Suas últimas faturas e status de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{invoice.id}</span>
                          <Badge className={statusColors[invoice.status]}>
                            {invoice.status === "paid" ? "Pago" :
                             invoice.status === "sent" ? "Enviado" :
                             invoice.status === "overdue" ? "Atrasado" : "Rascunho"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{invoice.client}</p>
                        <p className="text-xs text-muted-foreground">{invoice.project}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${invoice.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          Venc: {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Fluxo de Caixa
                </CardTitle>
                <CardDescription>
                  Entradas e saídas dos últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Gráfico de fluxo de caixa será implementado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Faturas</CardTitle>
              <CardDescription>
                Controle completo de faturamento e recebimentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Módulo de Faturas</h3>
                <p className="text-muted-foreground">
                  Sistema completo de gestão de faturas será implementado aqui
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Notas Fiscais</CardTitle>
                  <CardDescription>
                    Documentos fiscais anexados aos projetos
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-lg font-semibold">
                      R$ {totalInvoiceAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por projeto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Projetos</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <InvoiceDocumentsList 
                documents={documents}
                onDelete={deleteDocument}
                loading={loading}
                showProjectInfo={selectedProject === "all"}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Controle de Despesas</CardTitle>
              <CardDescription>
                Registre e categorize todas as despesas do projeto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Módulo de Despesas</h3>
                <p className="text-muted-foreground">
                  Sistema de controle de despesas será implementado aqui
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Financeiros</CardTitle>
              <CardDescription>
                Análises detalhadas de performance financeira
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Relatórios Avançados</h3>
                <p className="text-muted-foreground">
                  Relatórios detalhados de receitas, despesas e lucros
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
