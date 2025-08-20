
import { createContext, useContext, useState, ReactNode } from 'react';

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
    'nav.projects': 'Projetos',
    'nav.clients': 'Clientes',
    'nav.teams': 'Equipes',
    'nav.quotes': 'Orçamentos',
    'nav.financial': 'Financeiro',
    'nav.reports': 'Relatórios',
    'nav.map': 'Mapa',
    'nav.settings': 'Configurações',
    'nav.mainMenu': 'Menu Principal',
    'nav.system': 'Sistema',

    // Common
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Excluir',
    'common.add': 'Adicionar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.loading': 'Carregando...',
    'common.actions': 'Ações',
    'common.status': 'Status',
    'common.date': 'Data',
    'common.total': 'Total',
    'common.name': 'Nome',
    'common.email': 'Email',
    'common.phone': 'Telefone',
    'common.address': 'Endereço',
    'common.notes': 'Observações',

    // Clients
    'clients.title': 'Clientes',
    'clients.subtitle': 'Gerencie seus clientes e relacionamentos',
    'clients.newClient': 'Novo Cliente',
    'clients.editClient': 'Editar Cliente',
    'clients.searchPlaceholder': 'Buscar clientes...',
    'clients.notFound': 'Cliente não encontrado',
    'clients.notFoundDesc': 'O cliente solicitado não existe ou foi removido.',
    'clients.backToClients': 'Voltar para Clientes',
    'clients.viewProfile': 'Ver Perfil',
    'clients.contact': 'Contatar',
    'clients.projects': 'Projetos',
    'clients.totalValue': 'Valor Total',
    'clients.lastContact': 'Último contato',
    'clients.company': 'Empresa',
    'clients.preferredContact': 'Contato Preferido',
    'clients.createClient': 'Criar Cliente',
    'clients.saveChanges': 'Salvar Alterações',

    // Client Status
    'clients.status.active': 'Ativo',
    'clients.status.inactive': 'Inativo',
    'clients.status.potential': 'Potencial',

    // Contact Methods
    'clients.contact.email': 'Email',
    'clients.contact.phone': 'Telefone',
    'clients.contact.text': 'WhatsApp',

    // Quotes
    'quotes.title': 'Orçamentos',
    'quotes.subtitle': 'Gerencie propostas e orçamentos para clientes',
    'quotes.newQuote': 'Novo Orçamento',
    'quotes.editQuote': 'Editar Orçamento',
    'quotes.searchPlaceholder': 'Buscar orçamentos...',
    'quotes.notFound': 'Orçamento não encontrado',
    'quotes.notFoundDesc': 'O orçamento solicitado não existe ou foi removido.',
    'quotes.backToQuotes': 'Voltar para Orçamentos',
    'quotes.viewDetails': 'Ver Detalhes',
    'quotes.projectName': 'Nome do Projeto',
    'quotes.selectClient': 'Selecionar cliente',
    'quotes.validUntil': 'Válido até',
    'quotes.items': 'Itens do Orçamento',
    'quotes.addItem': 'Adicionar Item',
    'quotes.description': 'Descrição',
    'quotes.category': 'Categoria',
    'quotes.quantity': 'Qtd',
    'quotes.unitPrice': 'Preço Unitário',
    'quotes.grandTotal': 'Total Geral',
    'quotes.createdOn': 'Criado em',
    'quotes.moreFilters': 'Mais Filtros',
    'quotes.allStatus': 'Todos os Status',
    'quotes.createQuote': 'Criar Orçamento',
    'quotes.saveChanges': 'Salvar Alterações',

    // Quote Status
    'quotes.status.draft': 'Rascunho',
    'quotes.status.sent': 'Enviado',
    'quotes.status.approved': 'Aprovado',
    'quotes.status.rejected': 'Rejeitado',
    'quotes.status.expired': 'Expirado',

    // Quote Categories
    'quotes.category.materials': 'Materiais',
    'quotes.category.labor': 'Mão de obra',
    'quotes.category.equipment': 'Equipamentos',

    // Settings
    'settings.title': 'Configurações',
    'settings.subtitle': 'Gerencie as configurações do sistema',
    'settings.saveChanges': 'Salvar Alterações',
    'settings.general': 'Geral',
    'settings.features': 'Funcionalidades',
    'settings.notifications': 'Notificações',
    'settings.security': 'Segurança',
    'settings.appearance': 'Aparência',
    'settings.language': 'Idioma',

    // Company Settings
    'settings.company.title': 'Informações da Empresa',
    'settings.company.subtitle': 'Configure as informações básicas da sua empresa',
    'settings.company.name': 'Nome da Empresa',
    'settings.company.cnpj': 'CNPJ',
    'settings.company.logo': 'Logo da Empresa',

    // Features
    'settings.features.core': 'Funcionalidades Principais',
    'settings.features.management': 'Gestão e Controle',
    'settings.features.tools': 'Ferramentas',
    'settings.features.configure': 'Configure quais funcionalidades deseja utilizar',
    'settings.features.active': 'Ativo',
    'settings.features.inactive': 'Inativo',

    // Language Settings
    'settings.language.title': 'Idioma do Sistema',
    'settings.language.subtitle': 'Selecione o idioma de preferência',
    'settings.language.portuguese': 'Português',
    'settings.language.english': 'English',

    // Header
    'header.search': 'Buscar projetos, clientes...',
    'header.newProject': 'Novo Projeto',
    'header.notifications': 'Notificações',
    'header.profile': 'Perfil',
    'header.account': 'Minha Conta',
    'header.logout': 'Sair',

    // Logo Upload
    'logo.title': 'Logo da Empresa',
    'logo.success': 'Logo carregado com sucesso',
    'logo.upload': 'Fazer Upload',
    'logo.urlPlaceholder': 'Cole a URL da imagem aqui',
    'logo.formats': 'Formatos aceitos: PNG, JPG, SVG. Tamanho recomendado: 200x200px',
    'logo.dragDrop': 'Faça upload do logo da sua empresa',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.projects': 'Projects',
    'nav.clients': 'Clients',
    'nav.teams': 'Teams',
    'nav.quotes': 'Quotes',
    'nav.financial': 'Financial',
    'nav.reports': 'Reports',
    'nav.map': 'Map',
    'nav.settings': 'Settings',
    'nav.mainMenu': 'Main Menu',
    'nav.system': 'System',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.loading': 'Loading...',
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.total': 'Total',
    'common.name': 'Name',
    'common.email': 'Email',
    'common.phone': 'Phone',
    'common.address': 'Address',
    'common.notes': 'Notes',

    // Clients
    'clients.title': 'Clients',
    'clients.subtitle': 'Manage your clients and relationships',
    'clients.newClient': 'New Client',
    'clients.editClient': 'Edit Client',
    'clients.searchPlaceholder': 'Search clients...',
    'clients.notFound': 'Client not found',
    'clients.notFoundDesc': 'The requested client does not exist or has been removed.',
    'clients.backToClients': 'Back to Clients',
    'clients.viewProfile': 'View Profile',
    'clients.contact': 'Contact',
    'clients.projects': 'Projects',
    'clients.totalValue': 'Total Value',
    'clients.lastContact': 'Last contact',
    'clients.company': 'Company',
    'clients.preferredContact': 'Preferred Contact',
    'clients.createClient': 'Create Client',
    'clients.saveChanges': 'Save Changes',

    // Client Status
    'clients.status.active': 'Active',
    'clients.status.inactive': 'Inactive',
    'clients.status.potential': 'Potential',

    // Contact Methods
    'clients.contact.email': 'Email',
    'clients.contact.phone': 'Phone',
    'clients.contact.text': 'WhatsApp',

    // Quotes
    'quotes.title': 'Quotes',
    'quotes.subtitle': 'Manage proposals and quotes for clients',
    'quotes.newQuote': 'New Quote',
    'quotes.editQuote': 'Edit Quote',
    'quotes.searchPlaceholder': 'Search quotes...',
    'quotes.notFound': 'Quote not found',
    'quotes.notFoundDesc': 'The requested quote does not exist or has been removed.',
    'quotes.backToQuotes': 'Back to Quotes',
    'quotes.viewDetails': 'View Details',
    'quotes.projectName': 'Project Name',
    'quotes.selectClient': 'Select client',
    'quotes.validUntil': 'Valid until',
    'quotes.items': 'Quote Items',
    'quotes.addItem': 'Add Item',
    'quotes.description': 'Description',
    'quotes.category': 'Category',
    'quotes.quantity': 'Qty',
    'quotes.unitPrice': 'Unit Price',
    'quotes.grandTotal': 'Grand Total',
    'quotes.createdOn': 'Created on',
    'quotes.moreFilters': 'More Filters',
    'quotes.allStatus': 'All Status',
    'quotes.createQuote': 'Create Quote',
    'quotes.saveChanges': 'Save Changes',

    // Quote Status
    'quotes.status.draft': 'Draft',
    'quotes.status.sent': 'Sent',
    'quotes.status.approved': 'Approved',
    'quotes.status.rejected': 'Rejected',
    'quotes.status.expired': 'Expired',

    // Quote Categories
    'quotes.category.materials': 'Materials',
    'quotes.category.labor': 'Labor',
    'quotes.category.equipment': 'Equipment',

    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage system settings',
    'settings.saveChanges': 'Save Changes',
    'settings.general': 'General',
    'settings.features': 'Features',
    'settings.notifications': 'Notifications',
    'settings.security': 'Security',
    'settings.appearance': 'Appearance',
    'settings.language': 'Language',

    // Company Settings
    'settings.company.title': 'Company Information',
    'settings.company.subtitle': 'Configure your company basic information',
    'settings.company.name': 'Company Name',
    'settings.company.cnpj': 'Tax ID',
    'settings.company.logo': 'Company Logo',

    // Features
    'settings.features.core': 'Core Features',
    'settings.features.management': 'Management & Control',
    'settings.features.tools': 'Tools',
    'settings.features.configure': 'Configure which features you want to use',
    'settings.features.active': 'Active',
    'settings.features.inactive': 'Inactive',

    // Language Settings
    'settings.language.title': 'System Language',
    'settings.language.subtitle': 'Select your preferred language',
    'settings.language.portuguese': 'Português',
    'settings.language.english': 'English',

    // Header
    'header.search': 'Search projects, clients...',
    'header.newProject': 'New Project',
    'header.notifications': 'Notifications',
    'header.profile': 'Profile',
    'header.account': 'My Account',
    'header.logout': 'Logout',

    // Logo Upload
    'logo.title': 'Company Logo',
    'logo.success': 'Logo uploaded successfully',
    'logo.upload': 'Upload',
    'logo.urlPlaceholder': 'Paste image URL here',
    'logo.formats': 'Accepted formats: PNG, JPG, SVG. Recommended size: 200x200px',
    'logo.dragDrop': 'Upload your company logo',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['pt']] || key;
  };

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
