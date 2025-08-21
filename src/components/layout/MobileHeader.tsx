
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Sun, Moon, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useLogo } from "@/hooks/useLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MobileHeader() {
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();
  const { currentLogo, hasLogo } = useLogo();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card/50 backdrop-blur-sm px-3">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="h-8 w-8" />
        
        {hasLogo && (
          <div className="flex items-center">
            <img 
              src={currentLogo} 
              alt={settings.name}
              className="h-6 w-6 object-contain"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 text-xs">
            3
          </Badge>
        </Button>

        <Button variant="ghost" size="sm" onClick={toggleTheme} className="h-8 w-8 p-0">
          {theme === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
