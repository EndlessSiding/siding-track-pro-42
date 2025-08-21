
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.clients': 'Clientes',
    'nav.projects': 'Projetos',
    'nav.teams': 'Equipes',
    'nav.quotes': 'Orçamentos',
    'nav.financial': 'Financeiro',
    'nav.reports': 'Relatórios',
    'nav.map': 'Mapa',
    'nav.backup': 'Backup',
    'nav.settings': 'Configurações',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Visão geral dos seus projetos e negócios',
    'dashboard.totalProjects': 'Total de Projetos',
    'dashboard.activeProjects': 'Projetos Ativos',
    'dashboard.totalRevenue': 'Receita Total',
    'dashboard.totalClients': 'Total de Clientes',
    'dashboard.recentProjects': 'Projetos Recentes',
    'dashboard.viewDetails': 'Ver Detalhes',
    'dashboard.edit': 'Editar',
    'dashboard.quickActions': 'Ações Rápidas',
    'dashboard.newProject': 'Novo Projeto',
    'dashboard.newClient': 'Novo Cliente',
    'dashboard.newQuote': 'Novo Orçamento',
    'dashboard.recentActivity': 'Atividades Recentes',

    // Projects
    'projects.status.planning': 'Planejamento',
    'projects.status.in-progress': 'Em Andamento',
    'projects.status.completed': 'Concluído',
    'projects.status.on-hold': 'Pausado',
    'projects.progress': 'Progresso',

    // Financial
    'financial.monthlyRevenue': 'Receita Mensal',
    'financial.monthlyExpenses': 'Despesas Mensais',
    'financial.netProfit': 'Lucro Líquido',
    'financial.pendingInvoices': 'Faturas Pendentes',
    'financial.fromLastMonth': 'do mês passado',
    'financial.fromLastWeek': 'da semana passada',
    'financial.subtitle': 'Acompanhe receitas, despesas e faturamento',
    'financial.period': 'Período',
    'financial.thisWeek': 'Esta Semana',
    'financial.thisMonth': 'Este Mês',
    'financial.thisYear': 'Este Ano',
    'financial.lastMonth': 'Mês Anterior',
    'financial.custom': 'Personalizado',
    'financial.export': 'Exportar',
    'financial.newInvoice': 'Nova Fatura',
    'financial.overview': 'Visão Geral',
    'financial.invoices': 'Faturas',
    'financial.documents': 'Notas Fiscais',
    'financial.expenses': 'Despesas',
    'financial.reports': 'Relatórios',
    'financial.recentInvoices': 'Faturas Recentes',
    'financial.recentInvoicesDesc': 'Suas últimas faturas e status de pagamento',
    'financial.paid': 'Pago',
    'financial.sent': 'Enviado',
    'financial.overdue': 'Atrasado',
    'financial.draft': 'Rascunho',
    'financial.dueDate': 'Venc',
    'financial.noInvoices': 'Nenhuma fatura encontrada',
    'financial.cashFlow': 'Fluxo de Caixa',
    'financial.cashFlowDesc': 'Entradas e saídas dos últimos 6 meses',
    'financial.chartPlaceholder': 'Gráfico de fluxo de caixa será implementado',
    'financial.invoiceManagement': 'Gestão de Faturas',
    'financial.invoiceManagementDesc': 'Controle completo de faturamento e recebimentos',
    'financial.invoiceModule': 'Módulo de Faturas',
    'financial.invoiceModuleDesc': 'Sistema completo de gestão de faturas será implementado aqui',
    'financial.documentsDesc': 'Documentos fiscais anexados aos projetos',
    'financial.filterByProject': 'Filtrar por projeto',
    'financial.allProjects': 'Todos os Projetos',
    'financial.expenseControl': 'Controle de Despesas',
    'financial.expenseControlDesc': 'Registre e categorize todas as despesas do projeto',
    'financial.expenseModule': 'Módulo de Despesas',
    'financial.expenseModuleDesc': 'Sistema de controle de despesas será implementado aqui',
    'financial.financialReports': 'Relatórios Financeiros',
    'financial.financialReportsDesc': 'Análises detalhadas de performance financeira',
    'financial.advancedReports': 'Relatórios Avançados',
    'financial.advancedReportsDesc': 'Relatórios detalhados de receitas, despesas e lucros',

    // Settings
    'settings.title': 'Configurações',
    'settings.subtitle': 'Gerencie as configurações do sistema',
    'settings.saveChanges': 'Salvar Alterações',
    'settings.general': 'Geral',
    'settings.features': 'Recursos',
    'settings.language': 'Idioma',
    'settings.notifications': 'Notificações',
    'settings.security': 'Segurança',
    'settings.appearance': 'Aparência',
    'settings.company.title': 'Informações da Empresa',
    'settings.company.subtitle': 'Configure os dados da sua empresa',
    'settings.company.name': 'Nome da Empresa',
    'settings.company.cnpj': 'CNPJ',
    'settings.features.core': 'Recursos Principais',
    'settings.features.management': 'Gestão',
    'settings.features.tools': 'Ferramentas',
    'settings.features.configure': 'Configure quais recursos estão ativos',
    'settings.features.active': 'Ativo',
    'settings.features.inactive': 'Inativo',
    'settings.language.title': 'Configurações de Idioma',
    'settings.language.subtitle': 'Escolha o idioma do sistema',
    'settings.language.portuguese': 'Português',
    'settings.language.english': 'English',
    'settings.language.note': 'As alterações de idioma são aplicadas imediatamente em todo o sistema.',
    'settings.success': 'Sucesso',
    'settings.settingsSaved': 'Configurações salvas com sucesso!',
    'settings.languageChanged': 'Idioma alterado com sucesso!',

    // Common
    'common.total': 'Total',
    'common.email': 'Email',
    'common.phone': 'Telefone',
    'common.address': 'Endereço',
    'common.cancel': 'Cancelar',
    'common.save': 'Salvar',
    'common.edit': 'Editar',
    'common.delete': 'Excluir',
    'common.view': 'Visualizar',
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.clients': 'Clients',
    'nav.projects': 'Projects',
    'nav.teams': 'Teams',
    'nav.quotes': 'Quotes',
    'nav.financial': 'Financial',
    'nav.reports': 'Reports',
    'nav.map': 'Map',
    'nav.backup': 'Backup',
    'nav.settings': 'Settings',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Overview of your projects and business',
    'dashboard.totalProjects': 'Total Projects',
    'dashboard.activeProjects': 'Active Projects',
    'dashboard.totalRevenue': 'Total Revenue',
    'dashboard.totalClients': 'Total Clients',
    'dashboard.recentProjects': 'Recent Projects',
    'dashboard.viewDetails': 'View Details',
    'dashboard.edit': 'Edit',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.newProject': 'New Project',
    'dashboard.newClient': 'New Client',
    'dashboard.newQuote': 'New Quote',
    'dashboard.recentActivity': 'Recent Activity',

    // Projects
    'projects.status.planning': 'Planning',
    'projects.status.in-progress': 'In Progress',
    'projects.status.completed': 'Completed',
    'projects.status.on-hold': 'On Hold',
    'projects.progress': 'Progress',

    // Financial
    'financial.monthlyRevenue': 'Monthly Revenue',
    'financial.monthlyExpenses': 'Monthly Expenses',
    'financial.netProfit': 'Net Profit',
    'financial.pendingInvoices': 'Pending Invoices',
    'financial.fromLastMonth': 'from last month',
    'financial.fromLastWeek': 'from last week',
    'financial.subtitle': 'Track revenue, expenses and billing',
    'financial.period': 'Period',
    'financial.thisWeek': 'This Week',
    'financial.thisMonth': 'This Month',
    'financial.thisYear': 'This Year',
    'financial.lastMonth': 'Last Month',
    'financial.custom': 'Custom',
    'financial.export': 'Export',
    'financial.newInvoice': 'New Invoice',
    'financial.overview': 'Overview',
    'financial.invoices': 'Invoices',
    'financial.documents': 'Documents',
    'financial.expenses': 'Expenses',
    'financial.reports': 'Reports',
    'financial.recentInvoices': 'Recent Invoices',
    'financial.recentInvoicesDesc': 'Your latest invoices and payment status',
    'financial.paid': 'Paid',
    'financial.sent': 'Sent',
    'financial.overdue': 'Overdue',
    'financial.draft': 'Draft',
    'financial.dueDate': 'Due',
    'financial.noInvoices': 'No invoices found',
    'financial.cashFlow': 'Cash Flow',
    'financial.cashFlowDesc': 'Income and expenses from the last 6 months',
    'financial.chartPlaceholder': 'Cash flow chart will be implemented',
    'financial.invoiceManagement': 'Invoice Management',
    'financial.invoiceManagementDesc': 'Complete billing and collection control',
    'financial.invoiceModule': 'Invoice Module',
    'financial.invoiceModuleDesc': 'Complete invoice management system will be implemented here',
    'financial.documentsDesc': 'Tax documents attached to projects',
    'financial.filterByProject': 'Filter by project',
    'financial.allProjects': 'All Projects',
    'financial.expenseControl': 'Expense Control',
    'financial.expenseControlDesc': 'Record and categorize all project expenses',
    'financial.expenseModule': 'Expense Module',
    'financial.expenseModuleDesc': 'Expense control system will be implemented here',
    'financial.financialReports': 'Financial Reports',
    'financial.financialReportsDesc': 'Detailed financial performance analysis',
    'financial.advancedReports': 'Advanced Reports',
    'financial.advancedReportsDesc': 'Detailed reports on revenue, expenses and profits',

    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage system settings',
    'settings.saveChanges': 'Save Changes',
    'settings.general': 'General',
    'settings.features': 'Features',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    'settings.security': 'Security',
    'settings.appearance': 'Appearance',
    'settings.company.title': 'Company Information',
    'settings.company.subtitle': 'Configure your company data',
    'settings.company.name': 'Company Name',
    'settings.company.cnpj': 'Tax ID',
    'settings.features.core': 'Core Features',
    'settings.features.management': 'Management',
    'settings.features.tools': 'Tools',
    'settings.features.configure': 'Configure which features are active',
    'settings.features.active': 'Active',
    'settings.features.inactive': 'Inactive',
    'settings.language.title': 'Language Settings',
    'settings.language.subtitle': 'Choose the system language',
    'settings.language.portuguese': 'Português',
    'settings.language.english': 'English',
    'settings.language.note': 'Language changes are applied immediately throughout the system.',
    'settings.success': 'Success',
    'settings.settingsSaved': 'Settings saved successfully!',
    'settings.languageChanged': 'Language changed successfully!',

    // Common
    'common.total': 'Total',
    'common.email': 'Email',
    'common.phone': 'Phone',
    'common.address': 'Address',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  useEffect(() => {
    // Force re-render when language changes
    console.log('Language changed to:', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
