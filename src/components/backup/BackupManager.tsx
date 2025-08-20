
import { useState, useRef } from "react";
import { useBackup } from "@/hooks/useBackup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Upload, Database, AlertTriangle } from "lucide-react";

export const BackupManager = () => {
  const { exportBackup, importBackup, isExporting, isImporting } = useBackup();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
          Os backups incluem todos os dados de clientes, projetos, equipes, orçamentos e configurações da empresa. 
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
              Exporta todos os dados do sistema para um arquivo JSON seguro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                O backup incluirá:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Todos os clientes e informações de contato</li>
                <li>• Projetos e seu progresso</li>
                <li>• Equipes e suas especializações</li>
                <li>• Orçamentos e propostas</li>
                <li>• Configurações da empresa</li>
              </ul>
              <Button 
                onClick={exportBackup} 
                disabled={isExporting}
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
              Restaura dados de um arquivo de backup anteriormente criado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>ATENÇÃO:</strong> Importar um backup irá substituir TODOS os dados atuais. 
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
                {isImporting ? 'Importando...' : 'Importar Backup'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
              <strong>Armazenamento:</strong> Mantenha backups em locais seguros (nuvem, HD externo) e nunca apenas no computador local.
            </div>
            <div>
              <strong>Nomenclatura:</strong> Os backups são nomeados automaticamente com a data (ex: backup-sidingtrack-2024-01-15.json).
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
