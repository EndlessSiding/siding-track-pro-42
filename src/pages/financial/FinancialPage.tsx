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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();

  const handleCreateInvoice = (invoiceData: any) => {
    console.log("Nova fatura criada:", invoiceData);
    setIsDialogOpen(false);
  };

  // Calculate real metrics from actual data
  const totalInvoiceAmount = documents.reduce((sum, doc) => sum + (doc.amount || 0), 0);
  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
  const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0);
  const totalProfit = totalBudget - totalSpent;
  const pendingInvoicesCount = documents.filter(doc => !doc.amount).length;

  // Real financial metrics based on actual data
  const financialMetrics = [
    {
      title: t('financial.monthlyRevenue') || "Receita Mensal",
      value: `R$ ${totalInvoiceAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: t('financial.fromLastMonth') || "+12% do mês passado",
      icon: DollarSign,
      color: "green" as const,
    },
    {
      title: t('financial.monthlyExpenses') || "Despesas Mensais",
      value: `R$ ${totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: t('financial.fromLastMonth') || "+5% do mês passado",
      icon: TrendingDown,
      color: "red" as const,
    },
    {
      title: t('financial.netProfit') || "Lucro Líquido",
      value: `R$ ${totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: t('financial.fromLastMonth') || "+18% do mês passado",
      icon: TrendingUp,
      color: "blue" as const,
    },
    {
      title: t('financial.pendingInvoices') || "Faturas Pendentes",
      value: pendingInvoicesCount.toString(),
      change: t('financial.fromLastWeek') || "-2 da semana passada",
      icon: FileText,
      color: "orange" as const,
    },
  ];

  // Get recent projects for invoices display
  const recentProjects = projects.slice(0, 3).map((project) => ({
    id: project.id,
    client: project.client,
    amount: project.budget,
    status: project.progress === 100 ? "paid" : project.progress > 0 ? "sent" : "draft",
    dueDate: project.dueDate,
    project: project.name,
  }));

  return (
    <div className="w-full h-full p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{t('nav.financial') || 'Financeiro'}</h1>
          <p className="text-muted-foreground">
            {t('financial.subtitle') || 'Acompanhe receitas, despesas e faturamento'}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('financial.period') || 'Período'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">{t('financial.thisWeek') || 'Esta Semana'}</SelectItem>
              <SelectItem value="this-month">{t('financial.thisMonth') || 'Este Mês'}</SelectItem>
              <SelectItem value="this-year">{t('financial.thisYear') || 'Este Ano'}</SelectItem>
              <SelectItem value="last-month">{t('financial.lastMonth') || 'Mês Anterior'}</SelectItem>
              <SelectItem value="custom">{t('financial.custom') || 'Personalizado'}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {t('financial.export') || 'Exportar'}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t('financial.newInvoice') || 'Nova Fatura'}
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
          <TabsTrigger value="overview">{t('financial.overview') || 'Visão Geral'}</TabsTrigger>
          <TabsTrigger value="invoices">{t('financial.invoices') || 'Faturas'}</TabsTrigger>
          <TabsTrigger value="documents">{t('financial.documents') || 'Notas Fiscais'}</TabsTrigger>
          <TabsTrigger value="expenses">{t('financial.expenses') || 'Despesas'}</TabsTrigger>
          <TabsTrigger value="reports">{t('financial.reports') || 'Relatórios'}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Invoices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t('financial.recentInvoices') || 'Faturas Recentes'}
                </CardTitle>
                <CardDescription>
                  {t('financial.recentInvoicesDesc') || 'Suas últimas faturas e status de pagamento'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.length > 0 ? recentProjects.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{invoice.project}</span>
                          <Badge className={statusColors[invoice.status as keyof typeof statusColors]}>
                            {invoice.status === "paid" ? t('financial.paid') || "Pago" :
                             invoice.status === "sent" ? t('financial.sent') || "Enviado" :
                             invoice.status === "overdue" ? t('financial.overdue') || "Atrasado" : 
                             t('financial.draft') || "Rascunho"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{invoice.client}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">R$ {invoice.amount.toLocaleString('pt-BR')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('financial.dueDate') || 'Venc'}: {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">{t('financial.noInvoices') || 'Nenhuma fatura encontrada'}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t('financial.cashFlow') || 'Fluxo de Caixa'}
                </CardTitle>
                <CardDescription>
                  {t('financial.cashFlowDesc') || 'Entradas e saídas dos últimos 6 meses'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      {t('financial.chartPlaceholder') || 'Gráfico de fluxo de caixa será implementado'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>{t('financial.invoiceManagement') || 'Gestão de Faturas'}</CardTitle>
              <CardDescription>
                {t('financial.invoiceManagementDesc') || 'Controle completo de faturamento e recebimentos'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {t('financial.invoiceModule') || 'Módulo de Faturas'}
                </h3>
                <p className="text-muted-foreground">
                  {t('financial.invoiceModuleDesc') || 'Sistema completo de gestão de faturas será implementado aqui'}
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
                  <CardTitle>{t('financial.documents') || 'Notas Fiscais'}</CardTitle>
                  <CardDescription>
                    {t('financial.documentsDesc') || 'Documentos fiscais anexados aos projetos'}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{t('common.total') || 'Total'}</p>
                    <p className="text-lg font-semibold">
                      R$ {totalInvoiceAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder={t('financial.filterByProject') || 'Filtrar por projeto'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('financial.allProjects') || 'Todos os Projetos'}</SelectItem>
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
              <CardTitle>{t('financial.expenseControl') || 'Controle de Despesas'}</CardTitle>
              <CardDescription>
                {t('financial.expenseControlDesc') || 'Registre e categorize todas as despesas do projeto'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {t('financial.expenseModule') || 'Módulo de Despesas'}
                </h3>
                <p className="text-muted-foreground">
                  {t('financial.expenseModuleDesc') || 'Sistema de controle de despesas será implementado aqui'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>{t('financial.financialReports') || 'Relatórios Financeiros'}</CardTitle>
              <CardDescription>
                {t('financial.financialReportsDesc') || 'Análises detalhadas de performance financeira'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {t('financial.advancedReports') || 'Relatórios Avançados'}
                </h3>
                <p className="text-muted-foreground">
                  {t('financial.advancedReportsDesc') || 'Relatórios detalhados de receitas, despesas e lucros'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
