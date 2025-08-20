import { NavLink, useLocation } from "react-router-dom";
import {
  Building2,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  Home,
  UserCog,
  MapPin,
  Calculator
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useFeatures } from "@/contexts/FeaturesContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLogo } from "@/hooks/useLogo";

const navigationItems = [
  { title: "nav.dashboard", url: "/", icon: Home, featureId: null },
  { title: "nav.projects", url: "/projects", icon: Building2, featureId: "projects" },
  { title: "nav.clients", url: "/clients", icon: Users, featureId: "clients" },
  { title: "nav.teams", url: "/teams", icon: UserCog, featureId: "teams" },
  { title: "nav.quotes", url: "/quotes", icon: Calculator, featureId: "quotes" },
  { title: "nav.financial", url: "/financial", icon: DollarSign, featureId: "financial" },
  { title: "nav.reports", url: "/reports", icon: BarChart3, featureId: "reports" },
  { title: "nav.map", url: "/map", icon: MapPin, featureId: "map" },
];

const secondaryItems = [
  { title: "nav.settings", url: "/settings", icon: Settings, featureId: null },
];

export function AppSidebar() {
  const location = useLocation();
  const { isFeatureEnabled } = useFeatures();
  const { settings } = useSettings();
  const { t } = useLanguage();
  const { state } = useSidebar();
  const { currentLogo, hasLogo } = useLogo();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    if (path === "/map") {
      return location.pathname === "/map";
    }
    return location.pathname.startsWith(path);
  };

  const filteredNavigationItems = navigationItems.filter(item => 
    item.featureId === null || isFeatureEnabled(item.featureId)
  );

  return (
    <Sidebar className="border-r bg-card/30 backdrop-blur-sm">
      {/* Header com Logo */}
      <SidebarHeader className="border-b border-border/50">
        <div className="flex items-center justify-center p-4">
          {hasLogo ? (
            <div className="w-full flex justify-center">
              <img 
                src={currentLogo} 
                alt={settings.name}
                className={`object-contain transition-all duration-200 ${
                  state === "collapsed" ? "h-8 w-8" : "h-16 w-full max-w-[200px]"
                }`}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div className={`p-2 rounded-lg bg-primary text-primary-foreground transition-all duration-200 ${
                state === "collapsed" ? "p-2" : "p-3"
              }`}>
                <Building2 className={`${state === "collapsed" ? "h-4 w-4" : "h-6 w-6"}`} />
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('nav.mainMenu')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigationItems.map((item, index) => (
                <SidebarMenuItem key={item.title} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="flex items-center gap-3 transition-all hover:scale-105">
                      <item.icon className="h-4 w-4" />
                      <span>{t(item.title)}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t('nav.system')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="flex items-center gap-3 transition-all hover:scale-105">
                      <item.icon className="h-4 w-4" />
                      <span>{t(item.title)}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
