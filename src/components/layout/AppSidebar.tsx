
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Users,
  FolderOpen,
  DollarSign,
  BarChart3,
  MapPin,
  UserCheck,
  Database,
  Coins,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useLogo } from "@/hooks/useLogo"
import { useLanguage } from "@/contexts/LanguageContext"

export function AppSidebar() {
  const { currentLogo, hasLogo } = useLogo()
  const { t } = useLanguage()

  const items = [
    {
      title: t('nav.dashboard'),
      url: "/",
      icon: Home,
    },
    {
      title: t('nav.clients'),
      url: "/clients",
      icon: Users,
    },
    {
      title: t('nav.projects'),
      url: "/projects",
      icon: FolderOpen,
    },
    {
      title: t('nav.teams'),
      url: "/teams",
      icon: UserCheck,
    },
    {
      title: t('nav.quotes'),
      url: "/quotes",
      icon: DollarSign,
    },
    {
      title: t('nav.financial'),
      url: "/financial",
      icon: Coins,
    },
    {
      title: t('nav.reports'),
      url: "/reports",
      icon: BarChart3,
    },
    {
      title: t('nav.map'),
      url: "/map",
      icon: MapPin,
    },
    {
      title: t('nav.backup'),
      url: "/backup",
      icon: Database,
    },
    {
      title: t('nav.settings'),
      url: "/settings",
      icon: Settings,
    },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-6 border-b">
          <div className="flex items-center justify-center">
            {hasLogo ? (
              <img 
                src={currentLogo} 
                alt="Logo" 
                className="h-16 w-auto max-w-[120px] object-contain"
              />
            ) : (
              <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <Home className="h-8 w-8 text-primary" />
              </div>
            )}
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Aplicação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
