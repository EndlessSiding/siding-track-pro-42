
import {
  Calendar,
  Home,
  Users,
  FolderOpen,
  DollarSign,
  BarChart3,
  MapPin,
  UserCheck,
  Database,
  Settings,
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

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
import { cn } from "@/lib/utils"

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

export function MobileSidebar() {
  const { currentLogo, hasLogo } = useLogo()
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigation = (url: string) => {
    navigate(url)
  }

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
            {hasLogo ? (
              <img 
                src={currentLogo} 
                alt="Logo" 
                className="h-12 w-auto max-w-[100px] object-contain"
              />
            ) : (
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Home className="h-6 w-6 text-primary" />
              </div>
            )}
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url || 
                  (item.url !== "/" && location.pathname.startsWith(item.url))
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => handleNavigation(item.url)}
                      className={cn(
                        "w-full justify-start px-4 py-3 text-sm",
                        isActive && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
