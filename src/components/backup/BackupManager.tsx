
import { useState, useRef } from "react";
import { useBackup } from "@/hooks/useBackup";
import { BackupHistory } from "./BackupHistory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Upload, Database, AlertTriangle, Settings } from "lucide-react";

const AVAILABLE_TABLES = [
  { id: 'clients', label: 'Clientes', description: 'Todos os dados de clientes' },
  { id: 'projects', label: 'Projetos', description: 'Projetos e seu progresso' },
  { id: 'quotes', label: 'Orçamentos', description: 'Orçamentos e propostas' },
  { id: 'teams', label: 'Equipes', description: 'Equipes e especializações' },
  { id: 'company_settings', label: 'Configurações', description: 'Configurações da empresa' },
];

export const BackupManager = () => {
  const { exportBackup, importBackup, isExporting, isImporting } = useBackup();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTables, setSelectedTables] = useState<string[]>(['clients', 'projects', 'quotes', 'teams', 'company_settings']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é um arquivo JSON
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        setSelectedFile(file);
      } else {
        alert('Por favor, selecione um arquivo JSON válido.');
        event.target.value = '';
      }
    }
  };

  const handleImport = async () => {
    if (selectedFile) {
      await importBackup(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExport = async () => {
    if (selectedTables.length === 0) {
      alert('Selecione pelo menos uma tabela para incluir no backup.');
      return;
    }
    await exportBackup(selectedTables);
  };

  const handleTableToggle = (tableId: string, checked: boolean) => {
    if (checked) {
      setSelectedTables(prev => [...prev, tableId]);
    } else {
      setSelectedTables(prev => prev.filter(id => id !== tableId));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Database className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Gerenciar Backups</h2>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Os backups são armazenados internamente e incluem apenas os dados selecionados. 
          Mantenha seus backups seguros, pois contêm informações sensíveis.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Criar Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Criar Backup
            </CardTitle>
            <CardDescription>
              Selecione quais dados incluir no backup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Selecionar Dados para Backup:
                </h4>
                <div className="space-y-3">
                  {AVAILABLE_TABLES.map((table) => (
                    <div key={table.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={table.id}
                        checked={selectedTables.includes(table.id)}
                        onCheckedChange={(checked) => handleTableToggle(table.id, checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={table.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {table.label}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {table.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleExport} 
                disabled={isExporting || selectedTables.length === 0}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? 'Criando backup...' : 'Criar Backup'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Importar Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Importar Backup
            </CardTitle>
            <CardDescription>
              Restaura dados de um arquivo de backup externo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>ATENÇÃO:</strong> Importar um backup externo irá substituir TODOS os dados atuais. 
                  Esta ação não pode ser desfeita.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  disabled={isImporting}
                />
                {selectedFile && (
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Arquivo selecionado:</strong> {selectedFile.name}</p>
                    <p><strong>Tamanho:</strong> {formatFileSize(selectedFile.size)}</p>
                    <p><strong>Modificado:</strong> {new Date(selectedFile.lastModified).toLocaleString()}</p>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleImport}
                disabled={!selectedFile || isImporting}
                variant="destructive"
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isImporting ? 'Importando...' : 'Importar Backup Externo'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Backups */}
      <BackupHistory />

      <Card>
        <CardHeader>
          <CardTitle>Recomendações de Backup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <strong>Frequência:</strong> Recomendamos criar backups semanalmente ou sempre que fizer mudanças importantes.
            </div>
            <div>
              <strong>Armazenamento:</strong> Os backups são salvos internamente. Use a opção de download para manter cópias externas.
            </div>
            <div>
              <strong>Seletividade:</strong> Você pode escolher quais dados incluir em cada backup conforme sua necessidade.
            </div>
            <div>
              <strong>Segurança:</strong> Os arquivos de backup contêm dados sensíveis dos clientes. Proteja-os adequadamente.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
