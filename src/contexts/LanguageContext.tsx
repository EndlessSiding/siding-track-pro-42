
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
    'projects.title': 'Projetos',
    'projects.status.planning': 'Planejamento',
    'projects.status.inprogress': 'Em Andamento',
    'projects.status.completed': 'Concluído',
    'projects.status.onhold': 'Pausado',
    'projects.progress': 'Progresso',
    'projects.newProject': 'Novo Projeto',
    'projects.editProject': 'Editar Projeto',
    'projects.projectName': 'Nome do Projeto',
    'projects.selectClient': 'Selecionar Cliente',
    'projects.budget': 'Orçamento',
    'projects.dueDate': 'Data de Entrega',
    'projects.selectStatus': 'Selecionar Status',
    'projects.description': 'Descrição',
    'projects.createProject': 'Criar Projeto',
    'projects.projectInfo': 'Informações do Projeto',
    'projects.startDate': 'Data de Início',
    'projects.team': 'Equipe',
    'projects.sidingType': 'Tipo de Revestimento',
    'projects.totalBudget': 'Orçamento Total',
    'projects.spentSoFar': 'Gasto até agora',
    'projects.remaining': 'Restante',
    'projects.financialProgress': 'Progresso Financeiro',
    'projects.clientInfo': 'Informações do Cliente',
    'projects.viewClientProfile': 'Ver Perfil do Cliente',
    'projects.projectNotFound': 'Projeto não encontrado',
    'projects.projectNotFoundDesc': 'O projeto solicitado não existe ou foi removido.',
    'projects.backToProjects': 'Voltar para Projetos',
    'projects.confirmDelete': 'Tem certeza que deseja excluir este projeto?',
    'projects.createProjectDesc': 'Preencha as informações para criar um novo projeto',
    'projects.editProjectDesc': 'Edite as informações do projeto',
    'projects.descriptionPlaceholder': 'Descreva os detalhes e especificações do projeto...',

    // Financial
    'financial.title': 'Financeiro',
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

    // Clients
    'clients.title': 'Clientes',
    'clients.newClient': 'Novo Cliente',

    // Teams
    'teams.title': 'Equipes',

    // Quotes
    'quotes.title': 'Orçamentos',

    // Reports
    'reports.title': 'Relatórios',

    // Map
    'map.title': 'Mapa',

    // Backup
    'backup.title': 'Backup',

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
    'common.client': 'Cliente',
    'common.status': 'Status',
    'common.optional': 'opcional',
    'common.saveChanges': 'Salvar Alterações',
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
    'projects.title': 'Projects',
    'projects.status.planning': 'Planning',
    'projects.status.inprogress': 'In Progress',
    'projects.status.completed': 'Completed',
    'projects.status.onhold': 'On Hold',
    'projects.progress': 'Progress',
    'projects.newProject': 'New Project',
    'projects.editProject': 'Edit Project',
    'projects.projectName': 'Project Name',
    'projects.selectClient': 'Select Client',
    'projects.budget': 'Budget',
    'projects.dueDate': 'Due Date',
    'projects.selectStatus': 'Select Status',
    'projects.description': 'Description',
    'projects.createProject': 'Create Project',
    'projects.projectInfo': 'Project Information',
    'projects.startDate': 'Start Date',
    'projects.team': 'Team',
    'projects.sidingType': 'Siding Type',
    'projects.totalBudget': 'Total Budget',
    'projects.spentSoFar': 'Spent So Far',
    'projects.remaining': 'Remaining',
    'projects.financialProgress': 'Financial Progress',
    'projects.clientInfo': 'Client Information',
    'projects.viewClientProfile': 'View Client Profile',
    'projects.projectNotFound': 'Project not found',
    'projects.projectNotFoundDesc': 'The requested project does not exist or has been removed.',
    'projects.backToProjects': 'Back to Projects',
    'projects.confirmDelete': 'Are you sure you want to delete this project?',
    'projects.createProjectDesc': 'Fill in the information to create a new project',
    'projects.editProjectDesc': 'Edit the project information',
    'projects.descriptionPlaceholder': 'Describe the project details and specifications...',

    // Financial
    'financial.title': 'Financial',
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

    // Clients
    'clients.title': 'Clients',
    'clients.newClient': 'New Client',

    // Teams
    'teams.title': 'Teams',

    // Quotes
    'quotes.title': 'Quotes',

    // Reports
    'reports.title': 'Reports',

    // Map
    'map.title': 'Map',

    // Backup
    'backup.title': 'Backup',

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
    'common.client': 'Client',
    'common.status': 'Status',
    'common.optional': 'optional',
    'common.saveChanges': 'Save Changes',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'pt';
  });

  const setLanguage = (lang: Language) => {
    console.log('Changing language to:', lang);
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Force a complete re-render by dispatching a custom event
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
  };

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations[Language]];
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }
    return translation;
  };

  // Listen for language changes to force re-render
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      console.log('Language change event received:', event.detail);
      // Force re-render by updating state
      setLanguageState(event.detail);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

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
