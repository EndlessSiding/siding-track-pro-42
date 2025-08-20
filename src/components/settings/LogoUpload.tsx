
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useLanguage } from "@/contexts/LanguageContext";

export function LogoUpload() {
  const { settings, updateSettings } = useSettings();
  const { t } = useLanguage();
  const [previewUrl, setPreviewUrl] = useState<string | null>(settings.logo || null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        updateSettings({ logo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setPreviewUrl(null);
    updateSettings({ logo: "" });
  };

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url);
    updateSettings({ logo: url });
  };

  return (
    <div className="space-y-4">
      <Label>{t('logo.title')}</Label>
      
      {previewUrl ? (
        <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card/50">
          <div className="flex-shrink-0">
            <img 
              src={previewUrl} 
              alt="Logo preview" 
              className="h-16 w-16 object-contain border border-border rounded-lg"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              {t('logo.success')}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveLogo}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <Image className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            {t('logo.dragDrop')}
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="logo-upload"
              />
              <Label htmlFor="logo-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {t('logo.upload')}
                  </span>
                </Button>
              </Label>
            </div>
            
            <div className="text-xs text-muted-foreground">ou</div>
            
            <div className="flex gap-2">
              <Input
                placeholder={t('logo.urlPlaceholder')}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        {t('logo.formats')}
      </p>
    </div>
  );
}
