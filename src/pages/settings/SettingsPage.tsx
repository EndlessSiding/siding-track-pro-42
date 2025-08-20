import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings } from "@/contexts/SettingsContext";
import { useFeatures } from "@/contexts/FeaturesContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LogoUpload } from "@/components/settings/LogoUpload";
import { DarkLogoUpload } from "@/components/settings/DarkLogoUpload";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Building2,
  Users,
  DollarSign,
  BarChart3,
  UserCog,
  MapPin,
  Calculator,
  Save,
  Globe
} from "lucide-react";

const featureCategories = {
  core: {
    title: "settings.features.core",
    icon: Building2,
    features: [
      { id: "projects", name: "nav.projects", description: "Gerenciamento de projetos", icon: Building2 },
      { id: "clients", name: "nav.clients", description: "Gestão de clientes", icon: Users },
      { id: "quotes", name: "nav.quotes", description: "Sistema de orçamentos", icon: Calculator },
    ]
  },
  management: {
    title: "settings.features.management",
    icon: BarChart3,
    features: [
      { id: "financial", name: "nav.financial", description: "Controle financeiro", icon: DollarSign },
      { id: "reports", name: "nav.reports", description: "Relatórios e análises", icon: BarChart3 },
      { id: "teams", name: "nav.teams", description: "Gerenciamento de equipes", icon: UserCog },
    ]
  },
  tools: {
    title: "settings.features.tools",
    icon: MapPin,
    features: [
      { id: "map", name: "nav.map", description: "Visualização em mapa", icon: MapPin },
    ]
  }
};

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { features, toggleFeature } = useFeatures();
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => {
    console.log("Configurações salvas");
  };

  const tabs = [
    { id: "general", label: "settings.general", icon: Settings },
    { id: "features", label: "settings.features", icon: Building2 },
    { id: "language", label: "settings.language", icon: Globe },
    { id: "notifications", label: "settings.notifications", icon: Bell },
    { id: "security", label: "settings.security", icon: Shield },
    { id: "appearance", label: "settings.appearance", icon: Palette },
  ];

  return (
    <div className="w-full h-full p-4 lg:p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
          <p className="text-muted-foreground">
            {t('settings.subtitle')}
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          {t('settings.saveChanges')}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Tabs */}
        <div className="lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-muted/50 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {t(tab.label)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t('settings.company.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('settings.company.subtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-4">Logo Modo Claro</h4>
                      <LogoUpload />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-4">Logo Modo Escuro</h4>
                      <DarkLogoUpload />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">{t('settings.company.name')}</Label>
                      <Input
                        id="companyName"
                        value={settings.name}
                        onChange={(e) => updateSettings({ name: e.target.value })}
                        placeholder={t('settings.company.name')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('common.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email || ""}
                        onChange={(e) => updateSettings({ email: e.target.value })}
                        placeholder="contato@empresa.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('common.phone')}</Label>
                      <Input
                        id="phone"
                        value={settings.phone || ""}
                        onChange={(e) => updateSettings({ phone: e.target.value })}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">{t('settings.company.cnpj')}</Label>
                      <Input
                        id="cnpj"
                        value={settings.cnpj || ""}
                        onChange={(e) => updateSettings({ cnpj: e.target.value })}
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">{t('common.address')}</Label>
                    <Input
                      id="address"
                      value={settings.address || ""}
                      onChange={(e) => updateSettings({ address: e.target.value })}
                      placeholder={t('common.address')}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "features" && (
            <div className="space-y-6">
              {Object.entries(featureCategories).map(([categoryKey, category]) => (
                <Card key={categoryKey}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <category.icon className="h-5 w-5" />
                      {t(category.title)}
                    </CardTitle>
                    <CardDescription>
                      {t('settings.features.configure')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.features.map((feature) => (
                        <div
                          key={feature.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50 hover:bg-card transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <feature.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{t(feature.name)}</h3>
                                <Badge variant={features[feature.id] ? "default" : "secondary"}>
                                  {features[feature.id] ? t('settings.features.active') : t('settings.features.inactive')}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={features[feature.id]}
                            onCheckedChange={() => toggleFeature(feature.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "language" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {t('settings.language.title')}
                </CardTitle>
                <CardDescription>{t('settings.language.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">{t('settings.language')}</Label>
                    <Select value={language} onValueChange={(value: 'pt' | 'en') => setLanguage(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt">{t('settings.language.portuguese')}</SelectItem>
                        <SelectItem value="en">{t('settings.language.english')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.notifications')}</CardTitle>
                <CardDescription>Configure suas preferências de notificação</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Configurações de notificação em desenvolvimento...</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.security')}</CardTitle>
                <CardDescription>Gerencie configurações de segurança</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Configurações de segurança em desenvolvimento...</p>
              </CardContent>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.appearance')}</CardTitle>
                <CardDescription>Personalize a aparência do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Configurações de aparência em desenvolvimento...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
