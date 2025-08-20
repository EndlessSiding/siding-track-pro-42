
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
          .single();
        // Settings pode não existir, então ignoramos o erro
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

      // Deletar dados existentes e inserir novos dados baseado nas tabelas incluídas
      if (backup.included_tables.includes('clients') && backupData.data.clients) {
        await supabase.from('clients').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (backupData.data.clients.length > 0) {
          const { error } = await supabase.from('clients').insert(backupData.data.clients);
          if (error) throw error;
        }
      }

      if (backup.included_tables.includes('projects') && backupData.data.projects) {
        await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (backupData.data.projects.length > 0) {
          const { error } = await supabase.from('projects').insert(backupData.data.projects);
          if (error) throw error;
        }
      }

      if (backup.included_tables.includes('teams') && backupData.data.teams) {
        await supabase.from('teams').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (backupData.data.teams.length > 0) {
          const { error } = await supabase.from('teams').insert(backupData.data.teams);
          if (error) throw error;
        }
      }

      if (backup.included_tables.includes('quotes') && backupData.data.quotes) {
        await supabase.from('quotes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (backupData.data.quotes.length > 0) {
          const { error } = await supabase.from('quotes').insert(backupData.data.quotes);
          if (error) throw error;
        }
      }

      if (backup.included_tables.includes('company_settings') && backupData.data.companySettings) {
        await supabase.from('company_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        const { error } = await supabase.from('company_settings').insert(backupData.data.companySettings);
        if (error) throw error;
      }

      toast({
        title: "Backup restaurado com sucesso",
        description: "Todos os dados foram restaurados do backup",
      });

      // Recarregar a página para atualizar todos os dados
      window.location.reload();
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      toast({
        title: "Erro ao restaurar backup",
        description: "Não foi possível restaurar o backup",
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
        throw new Error('Arquivo de backup inválido');
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

      // Importar dados (substituir todos os dados existentes)
      await supabase.from('clients').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('teams').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('quotes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // Inserir novos dados
      if (backupData.data.clients && backupData.data.clients.length > 0) {
        const { error } = await supabase.from('clients').insert(backupData.data.clients);
        if (error) throw error;
      }

      if (backupData.data.projects && backupData.data.projects.length > 0) {
        const { error } = await supabase.from('projects').insert(backupData.data.projects);
        if (error) throw error;
      }

      if (backupData.data.teams && backupData.data.teams.length > 0) {
        const { error } = await supabase.from('teams').insert(backupData.data.teams);
        if (error) throw error;
      }

      if (backupData.data.quotes && backupData.data.quotes.length > 0) {
        const { error } = await supabase.from('quotes').insert(backupData.data.quotes);
        if (error) throw error;
      }

      // Importar configurações da empresa se existirem
      if (backupData.data.companySettings) {
        await supabase.from('company_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        const { error } = await supabase.from('company_settings').insert(backupData.data.companySettings);
        if (error) throw error;
      }

      toast({
        title: "Backup importado com sucesso",
        description: "Todos os dados foram restaurados do backup",
      });

      // Recarregar a página para atualizar todos os dados
      window.location.reload();
    } catch (error) {
      console.error('Erro ao importar backup:', error);
      toast({
        title: "Erro ao importar backup",
        description: "Não foi possível importar o backup. Verifique se o arquivo é válido.",
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
