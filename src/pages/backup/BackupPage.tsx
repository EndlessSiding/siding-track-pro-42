
import { useLanguage } from "@/contexts/LanguageContext";
import { BackupManager } from "@/components/backup/BackupManager";

const BackupPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="w-full h-full p-4 lg:p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">{t('backup.title')}</h1>
        <p className="text-muted-foreground">
          {t('backup.subtitle')}
        </p>
      </div>
      
      <BackupManager />
    </div>
  );
};

export default BackupPage;
