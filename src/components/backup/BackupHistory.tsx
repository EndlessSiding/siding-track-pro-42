
import { useEffect } from "react";
import { useBackup } from "@/hooks/useBackup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, RotateCcw, Clock, HardDrive } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const BackupHistory = () => {
  const { 
    backupHistory, 
    fetchBackupHistory, 
    downloadBackup, 
    deleteBackup, 
    restoreBackup, 
    isLoadingHistory,
    isImporting 
  } = useBackup();

  useEffect(() => {
    fetchBackupHistory();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDelete = async (backupId: string, backupName: string) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja deletar o backup "${backupName}"?\n\nEsta ação não pode ser desfeita.`
    );
    
    if (confirmDelete) {
      await deleteBackup(backupId);
    }
  };

  if (isLoadingHistory) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico de Backups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Carregando histórico...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Histórico de Backups
        </CardTitle>
      </CardHeader>
      <CardContent>
        {backupHistory.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhum backup encontrado. Crie seu primeiro backup acima.
          </p>
        ) : (
          <div className="space-y-4">
            {backupHistory.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-medium">{backup.name}</h4>
                    <Badge variant="outline">v{backup.version}</Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      Criado em: {format(new Date(backup.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                    <p>Tamanho: {formatFileSize(backup.file_size)}</p>
                    <div className="flex items-center gap-1 flex-wrap">
                      <span>Inclui:</span>
                      {backup.included_tables.map((table) => (
                        <Badge key={table} variant="secondary" className="text-xs">
                          {table === 'clients' && 'Clientes'}
                          {table === 'projects' && 'Projetos'}
                          {table === 'quotes' && 'Orçamentos'}
                          {table === 'teams' && 'Equipes'}
                          {table === 'company_settings' && 'Configurações'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadBackup(backup.id)}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => restoreBackup(backup.id)}
                    disabled={isImporting}
                    className="flex items-center gap-1"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restaurar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(backup.id, backup.name)}
                    className="flex items-center gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Deletar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
