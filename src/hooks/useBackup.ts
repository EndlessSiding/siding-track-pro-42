
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types/client";
import { Project } from "@/types/project";
import { Quote } from "@/types/financial";
import { normalizeTableData, type TableName } from "@/utils/backupNormalizer";

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

  // Define ordem de dependências para evitar violação de FKs:
  // - Deletar: filhos primeiro, depois pais
  // - Inserir: pais primeiro, depois filhos
  const getTableOrders = (tables: string[]) => {
    const deletePriority = ['projects', 'quotes', 'teams', 'clients', 'company_settings'];
    const insertPriority = ['clients', 'projects', 'quotes', 'teams']; // company_settings tratado separadamente
    return {
      deleteOrder: deletePriority.filter((t) => tables.includes(t)),
      insertOrder: insertPriority.filter((t) => tables.includes(t)),
    };
  };

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
    const normalized = normalizeTableData(data, tableName as TableName).map((item) => {
      const processed = { ...item };
      // Remover campos que podem conflitar com defaults do banco
      delete (processed as any).created_at;
      delete (processed as any).updated_at;

      // Garantir um ID quando aplicável
      if (!processed.id) {
        (processed as any).id = crypto.randomUUID();
      }

      return processed;
    });

    return normalized;
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
      const included = backup.included_tables || [];
      const { deleteOrder, insertOrder } = getTableOrders(included);
      const insertedCounts: Record<string, number> = {};

      console.info('[Backup] Ordem de deleção:', deleteOrder);
      // 1) Deletar filhos -> pais
      for (const tableName of deleteOrder) {
        try {
          console.info(`[Backup] Limpando tabela: ${tableName}`);
          const { error: deleteError } = await supabase
            .from(tableName)
            .delete()
            .not('id', 'is', null); // apaga todas as linhas

          if (deleteError) {
            console.error(`Erro ao limpar ${tableName}:`, deleteError);
          } else {
            console.info(`[Backup] Tabela ${tableName} limpa`);
          }
        } catch (tableError) {
          console.error(`Erro ao limpar tabela ${tableName}:`, tableError);
        }
      }

      console.info('[Backup] Ordem de inserção:', insertOrder);
      // 2) Inserir pais -> filhos
      for (const tableName of insertOrder) {
        try {
          const tableData = backupData.data[tableName as keyof typeof backupData.data];
          if (tableData && Array.isArray(tableData) && tableData.length > 0) {
            const processedData = processDataForInsert(tableData, tableName);
            console.info(`[Backup] Inserindo ${processedData.length} registros em ${tableName}`);
            const { error: insertError } = await supabase
              .from(tableName)
              .insert(processedData);

            if (insertError) {
              console.error(`Erro ao inserir em ${tableName}:`, insertError);
              throw insertError;
            }

            const { count } = await supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true });

            insertedCounts[tableName] = count ?? 0;
            console.info(`[Backup] Tabela ${tableName} agora possui ${insertedCounts[tableName]} registros`);
          } else {
            insertedCounts[tableName] = 0;
            console.info(`[Backup] Nenhum dado encontrado para ${tableName} no backup`);
          }
        } catch (tableError) {
          console.error(`Erro ao processar inserção da tabela ${tableName}:`, tableError);
        }
      }

      // 3) company_settings (objeto único)
      if (included.includes('company_settings') && backupData.data.companySettings) {
        try {
          console.info('[Backup] Restaurando company_settings');
          await supabase.from('company_settings').delete().not('id', 'is', null);

          const settingsData = { ...backupData.data.companySettings };
          delete (settingsData as any).created_at;
          delete (settingsData as any).updated_at;

          const { error } = await supabase.from('company_settings').insert(settingsData);
          if (error) throw error;
          console.info('[Backup] company_settings restaurado');
        } catch (settingsError) {
          console.error('Erro ao restaurar configurações:', settingsError);
        }
      }

      toast({
        title: "Backup restaurado com sucesso",
        description: "Os dados foram restaurados. Recarregando a aplicação...",
      });

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
      const backupData = JSON.parse(fileContent) as any;
      
      if (!backupData?.version || !backupData?.data) {
        throw new Error('Arquivo de backup inválido - estrutura incorreta');
      }

      const confirmImport = window.confirm(
        `Tem certeza que deseja importar este backup?\n\n` +
        `Data do backup: ${new Date(backupData.timestamp || Date.now()).toLocaleString()}\n` +
        `Versão: ${backupData.version}\n\n` +
        `ATENÇÃO: Isso irá substituir todos os dados atuais!`
      );

      if (!confirmImport) {
        setIsImporting(false);
        return;
      }

      const tablesDetected: TableName[] = [];
      if (backupData.data.clients) tablesDetected.push('clients');
      if (backupData.data.projects) tablesDetected.push('projects');
      if (backupData.data.teams) tablesDetected.push('teams');
      if (backupData.data.quotes) tablesDetected.push('quotes');

      const { deleteOrder, insertOrder } = getTableOrders(tablesDetected as string[]);
      const insertedCounts: Record<string, number> = {};

      console.info('[Import] Ordem de deleção:', deleteOrder);
      // 1) Deletar filhos -> pais
      for (const tableName of deleteOrder) {
        try {
          console.info(`[Import] Limpando tabela: ${tableName}`);
          const { error: deleteError } = await supabase
            .from(tableName)
            .delete()
            .not('id', 'is', null);

          if (deleteError) {
            console.error(`Erro ao limpar ${tableName}:`, deleteError);
          } else {
            console.info(`[Import] Tabela ${tableName} limpa`);
          }
        } catch (tableError) {
          console.error(`Erro ao limpar tabela ${tableName}:`, tableError);
        }
      }

      console.info('[Import] Ordem de inserção:', insertOrder);
      // 2) Inserir pais -> filhos
      for (const tableName of insertOrder) {
        try {
          const tableData = backupData.data[tableName];
          if (tableData && Array.isArray(tableData) && tableData.length > 0) {
            const processedData = processDataForInsert(tableData, tableName);
            console.info(`[Import] Inserindo ${processedData.length} registros em ${tableName}`);
            const { error: insertError } = await supabase
              .from(tableName)
              .insert(processedData);

            if (insertError) {
              console.error(`Erro ao inserir em ${tableName}:`, insertError);
              throw insertError;
            }

            const { count } = await supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true });

            insertedCounts[tableName] = count ?? 0;
            console.info(`[Import] Tabela ${tableName} agora possui ${insertedCounts[tableName]} registros`);
          } else {
            insertedCounts[tableName] = 0;
            console.info(`[Import] Nenhum dado para inserir em ${tableName}`);
          }
        } catch (tableError) {
          console.error(`Erro ao processar inserção da tabela ${tableName}:`, tableError);
        }
      }

      // 3) company_settings (objeto único)
      if (backupData.data.companySettings) {
        try {
          console.info('[Import] Restaurando company_settings');
          await supabase.from('company_settings').delete().not('id', 'is', null);

          const settingsData = { ...backupData.data.companySettings };
          delete (settingsData as any).created_at;
          delete (settingsData as any).updated_at;

          const { error } = await supabase.from('company_settings').insert(settingsData);
          if (error) throw error;
          console.info('[Import] company_settings restaurado');
        } catch (settingsError) {
          console.error('Erro ao importar configurações:', settingsError);
        }
      }

      toast({
        title: "Backup importado com sucesso",
        description: "Os dados foram restaurados. Recarregando a aplicação...",
      });

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

