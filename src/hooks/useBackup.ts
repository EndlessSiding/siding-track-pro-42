
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types/client";
import { Project } from "@/types/project";
import { Quote } from "@/types/financial";

interface BackupData {
  version: string;
  timestamp: string;
  data: {
    clients?: Client[];
    projects?: Project[];
    teams?: any[];
    quotes?: Quote[];
    companySettings?: any;
  };
}

interface BackupHistoryItem {
  id: string;
  name: string;
  created_at: string;
  file_size: number;
  backup_data: BackupData;
  included_tables: string[];
  version: string;
}

export const useBackup = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [backupHistory, setBackupHistory] = useState<BackupHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const { toast } = useToast();

  const fetchBackupHistory = async (): Promise<void> => {
    try {
      setIsLoadingHistory(true);
      const { data, error } = await supabase
        .from('backup_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setBackupHistory(data || []);
    } catch (error) {
      console.error('Erro ao carregar histórico de backups:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico de backups",
        variant: "destructive",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const exportBackup = async (includedTables: string[]): Promise<void> => {
    try {
      setIsExporting(true);
      
      const backupData: BackupData = {
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        data: {}
      };

      // Buscar dados conforme as tabelas selecionadas
      if (includedTables.includes('clients')) {
        const { data: clientsData, error: clientsError } = await supabase.from('clients').select('*');
        if (clientsError) throw clientsError;
        backupData.data.clients = clientsData || [];
      }

      if (includedTables.includes('projects')) {
        const { data: projectsData, error: projectsError } = await supabase.from('projects').select('*');
        if (projectsError) throw projectsError;
        backupData.data.projects = projectsData || [];
      }

      if (includedTables.includes('teams')) {
        const { data: teamsData, error: teamsError } = await supabase.from('teams').select('*');
        if (teamsError) throw teamsError;
        backupData.data.teams = teamsData || [];
      }

      if (includedTables.includes('quotes')) {
        const { data: quotesData, error: quotesError } = await supabase.from('quotes').select('*');
        if (quotesError) throw quotesError;
        backupData.data.quotes = quotesData || [];
      }

      if (includedTables.includes('company_settings')) {
        const { data: settingsData, error: settingsError } = await supabase
          .from('company_settings')
          .select('*')
          .limit(1)
          .maybeSingle();
        backupData.data.companySettings = settingsData || null;
      }

      const dataStr = JSON.stringify(backupData, null, 2);
      const fileSize = new Blob([dataStr]).size;
      const fileName = `backup-sidingtrack-${new Date().toISOString().split('T')[0]}`;

      // Salvar no histórico interno
      const { error: saveError } = await supabase
        .from('backup_history')
        .insert({
          name: fileName,
          file_size: fileSize,
          backup_data: backupData,
          included_tables: includedTables,
          version: backupData.version
        });

      if (saveError) throw saveError;

      toast({
        title: "Backup criado com sucesso",
        description: "O backup foi salvo no histórico interno",
      });

      // Atualizar o histórico
      await fetchBackupHistory();
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      toast({
        title: "Erro ao criar backup",
        description: "Não foi possível criar o backup dos dados",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const downloadBackup = async (backupId: string): Promise<void> => {
    try {
      const backup = backupHistory.find(b => b.id === backupId);
      if (!backup) {
        throw new Error('Backup não encontrado');
      }

      const dataStr = JSON.stringify(backup.backup_data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${backup.name}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download iniciado",
        description: "O arquivo de backup está sendo baixado",
      });
    } catch (error) {
      console.error('Erro ao baixar backup:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o backup",
        variant: "destructive",
      });
    }
  };

  const deleteBackup = async (backupId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('backup_history')
        .delete()
        .eq('id', backupId);

      if (error) throw error;

      toast({
        title: "Backup deletado",
        description: "O backup foi removido do histórico",
      });

      // Atualizar o histórico
      await fetchBackupHistory();
    } catch (error) {
      console.error('Erro ao deletar backup:', error);
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível deletar o backup",
        variant: "destructive",
      });
    }
  };

  const processDataForInsert = (data: any[], tableName: string) => {
    return data.map(item => {
      const processedItem = { ...item };
      
      // Remove campos que podem causar conflito
      delete processedItem.created_at;
      delete processedItem.updated_at;
      
      // Gera novo UUID se necessário
      if (!processedItem.id) {
        processedItem.id = crypto.randomUUID();
      }
      
      // Validações específicas por tabela
      if (tableName === 'clients') {
        processedItem.status = processedItem.status || 'active';
        processedItem.preferred_contact = processedItem.preferred_contact || 'email';
        processedItem.total_projects_value = processedItem.total_projects_value || 0;
      }
      
      if (tableName === 'projects') {
        processedItem.status = processedItem.status || 'planning';
        processedItem.progress = processedItem.progress || 0;
        processedItem.spent = processedItem.spent || 0;
        processedItem.budget = processedItem.budget || 0;
        processedItem.team = processedItem.team || [];
      }
      
      if (tableName === 'quotes') {
        processedItem.status = processedItem.status || 'draft';
        processedItem.total_amount = processedItem.total_amount || 0;
        processedItem.items = processedItem.items || [];
      }
      
      if (tableName === 'teams') {
        processedItem.availability = processedItem.availability || 'available';
        processedItem.specialties = processedItem.specialties || [];
        processedItem.members = processedItem.members || [];
        processedItem.safety = processedItem.safety || 0;
        processedItem.quality = processedItem.quality || 0;
        processedItem.efficiency = processedItem.efficiency || 0;
      }
      
      return processedItem;
    });
  };

  const restoreBackup = async (backupId: string): Promise<void> => {
    try {
      setIsImporting(true);
      
      const backup = backupHistory.find(b => b.id === backupId);
      if (!backup) {
        throw new Error('Backup não encontrado');
      }

      const confirmImport = window.confirm(
        `Tem certeza que deseja restaurar este backup?\n\n` +
        `Data do backup: ${new Date(backup.created_at).toLocaleString()}\n` +
        `Versão: ${backup.version}\n\n` +
        `ATENÇÃO: Isso irá substituir todos os dados atuais!`
      );

      if (!confirmImport) {
        setIsImporting(false);
        return;
      }

      const backupData = backup.backup_data;

      // Restaurar dados baseado nas tabelas incluídas
      for (const tableName of backup.included_tables) {
        console.log(`Restaurando tabela: ${tableName}`);
        
        try {
          // Limpar dados existentes
          const { error: deleteError } = await supabase
            .from(tableName)
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');
          
          if (deleteError) {
            console.error(`Erro ao limpar ${tableName}:`, deleteError);
          }

          // Inserir novos dados se existirem
          const tableData = backupData.data[tableName as keyof typeof backupData.data];
          if (tableData && Array.isArray(tableData) && tableData.length > 0) {
            const processedData = processDataForInsert(tableData, tableName);
            
            console.log(`Inserindo ${processedData.length} registros em ${tableName}`);
            
            const { error: insertError } = await supabase
              .from(tableName)
              .insert(processedData);
            
            if (insertError) {
              console.error(`Erro ao inserir em ${tableName}:`, insertError);
              throw insertError;
            }
          }
        } catch (tableError) {
          console.error(`Erro ao processar tabela ${tableName}:`, tableError);
          // Continua com as outras tabelas
        }
      }

      // Tratar configurações da empresa separadamente
      if (backup.included_tables.includes('company_settings') && backupData.data.companySettings) {
        try {
          await supabase.from('company_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
          
          const settingsData = { ...backupData.data.companySettings };
          delete settingsData.created_at;
          delete settingsData.updated_at;
          
          const { error } = await supabase.from('company_settings').insert(settingsData);
          if (error) throw error;
        } catch (settingsError) {
          console.error('Erro ao restaurar configurações:', settingsError);
        }
      }

      toast({
        title: "Backup restaurado com sucesso",
        description: "Todos os dados foram restaurados do backup",
      });

      // Recarregar a página para atualizar todos os dados
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      toast({
        title: "Erro ao restaurar backup",
        description: `Não foi possível restaurar o backup: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const importBackup = async (file: File): Promise<void> => {
    try {
      setIsImporting(true);
      
      const fileContent = await file.text();
      const backupData: BackupData = JSON.parse(fileContent);
      
      // Validar estrutura do backup
      if (!backupData.version || !backupData.data) {
        throw new Error('Arquivo de backup inválido - estrutura incorreta');
      }

      // Confirmar antes de importar
      const confirmImport = window.confirm(
        `Tem certeza que deseja importar este backup?\n\n` +
        `Data do backup: ${new Date(backupData.timestamp).toLocaleString()}\n` +
        `Versão: ${backupData.version}\n\n` +
        `ATENÇÃO: Isso irá substituir todos os dados atuais!`
      );

      if (!confirmImport) {
        setIsImporting(false);
        return;
      }

      // Determinar quais tabelas importar baseado nos dados disponíveis
      const tablesToImport = [];
      if (backupData.data.clients) tablesToImport.push('clients');
      if (backupData.data.projects) tablesToImport.push('projects');
      if (backupData.data.teams) tablesToImport.push('teams');
      if (backupData.data.quotes) tablesToImport.push('quotes');

      // Importar dados das tabelas
      for (const tableName of tablesToImport) {
        try {
          console.log(`Importando tabela: ${tableName}`);
          
          // Limpar dados existentes
          const { error: deleteError } = await supabase
            .from(tableName)
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');
          
          if (deleteError) {
            console.error(`Erro ao limpar ${tableName}:`, deleteError);
          }

          // Inserir novos dados
          const tableData = backupData.data[tableName as keyof typeof backupData.data];
          if (tableData && Array.isArray(tableData) && tableData.length > 0) {
            const processedData = processDataForInsert(tableData, tableName);
            
            console.log(`Inserindo ${processedData.length} registros em ${tableName}`);
            
            const { error: insertError } = await supabase
              .from(tableName)
              .insert(processedData);
            
            if (insertError) {
              console.error(`Erro ao inserir em ${tableName}:`, insertError);
              throw insertError;
            }
          }
        } catch (tableError) {
          console.error(`Erro ao processar tabela ${tableName}:`, tableError);
          // Continua com as outras tabelas
        }
      }

      // Importar configurações da empresa se existirem
      if (backupData.data.companySettings) {
        try {
          await supabase.from('company_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
          
          const settingsData = { ...backupData.data.companySettings };
          delete settingsData.created_at;
          delete settingsData.updated_at;
          
          const { error } = await supabase.from('company_settings').insert(settingsData);
          if (error) throw error;
        } catch (settingsError) {
          console.error('Erro ao importar configurações:', settingsError);
        }
      }

      toast({
        title: "Backup importado com sucesso",
        description: "Todos os dados foram restaurados do backup",
      });

      // Recarregar a página para atualizar todos os dados
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Erro ao importar backup:', error);
      toast({
        title: "Erro ao importar backup",
        description: `Não foi possível importar o backup: ${error instanceof Error ? error.message : 'Verifique se o arquivo é válido'}`,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return {
    exportBackup,
    importBackup,
    downloadBackup,
    deleteBackup,
    restoreBackup,
    fetchBackupHistory,
    backupHistory,
    isExporting,
    isImporting,
    isLoadingHistory,
  };
};
