
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

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Clientes",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Projetos",
    url: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Equipes",
    url: "/teams",
    icon: UserCheck,
  },
  {
    title: "Orçamentos",
    url: "/quotes",
    icon: DollarSign,
  },
  {
    title: "Financeiro",
    url: "/financial",
    icon: BarChart3,
  },
  {
    title: "Relatórios",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "Mapa",
    url: "/map",
    icon: MapPin,
  },
  {
    title: "Backup",
    url: "/backup",
    icon: Database,
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { currentLogo, hasLogo } = useLogo()

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
