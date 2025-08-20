
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
    clients: Client[];
    projects: Project[];
    teams: any[];
    quotes: Quote[];
    companySettings: any;
  };
}

export const useBackup = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const exportBackup = async (): Promise<void> => {
    try {
      setIsExporting(true);
      
      // Buscar todos os dados das tabelas
      const [clientsResult, projectsResult, teamsResult, quotesResult, settingsResult] = await Promise.all([
        supabase.from('clients').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('teams').select('*'),
        supabase.from('quotes').select('*'),
        supabase.from('company_settings').select('*').limit(1).single()
      ]);

      // Verificar erros
      if (clientsResult.error) throw clientsResult.error;
      if (projectsResult.error) throw projectsResult.error;
      if (teamsResult.error) throw teamsResult.error;
      if (quotesResult.error) throw quotesResult.error;
      // Settings pode não existir ainda, então ignoramos o erro

      const backupData: BackupData = {
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        data: {
          clients: clientsResult.data || [],
          projects: projectsResult.data || [],
          teams: teamsResult.data || [],
          quotes: quotesResult.data || [],
          companySettings: settingsResult.data || null
        }
      };

      // Criar e baixar o arquivo
      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-sidingtrack-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup criado com sucesso",
        description: "O arquivo de backup foi baixado para seu computador",
      });
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
      const { data, error: deleteClientsError } = await supabase.from('clients').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { data: data2, error: deleteProjectsError } = await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { data: data3, error: deleteTeamsError } = await supabase.from('teams').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { data: data4, error: deleteQuotesError } = await supabase.from('quotes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // Inserir novos dados
      if (backupData.data.clients.length > 0) {
        const { error: clientsError } = await supabase.from('clients').insert(backupData.data.clients);
        if (clientsError) throw clientsError;
      }

      if (backupData.data.projects.length > 0) {
        const { error: projectsError } = await supabase.from('projects').insert(backupData.data.projects);
        if (projectsError) throw projectsError;
      }

      if (backupData.data.teams.length > 0) {
        const { error: teamsError } = await supabase.from('teams').insert(backupData.data.teams);
        if (teamsError) throw teamsError;
      }

      if (backupData.data.quotes.length > 0) {
        const { error: quotesError } = await supabase.from('quotes').insert(backupData.data.quotes);
        if (quotesError) throw quotesError;
      }

      // Importar configurações da empresa se existirem
      if (backupData.data.companySettings) {
        // Primeiro, deletar configurações existentes
        await supabase.from('company_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        
        // Inserir configurações do backup
        const { error: settingsError } = await supabase.from('company_settings').insert(backupData.data.companySettings);
        if (settingsError) throw settingsError;
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
    isExporting,
    isImporting,
  };
};
