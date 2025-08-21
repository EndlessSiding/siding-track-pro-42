
import { useTheme } from "@/contexts/ThemeContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useMemo } from "react";

export function useLogo() {
  const { theme } = useTheme();
  const { settings } = useSettings();

  const getCurrentLogo = useMemo(() => {
    // Verificar se settings existe e não é null
    if (!settings) {
      return '';
    }
    
    if (theme === 'dark' && settings.darkLogo) {
      return settings.darkLogo;
    }
    return settings.logo || '';
  }, [settings, theme]);

  const hasLogo = useMemo(() => {
    return !!(settings && (theme === 'dark' ? settings.darkLogo || settings.logo : settings.logo));
  }, [settings, theme]);

  return {
    currentLogo: getCurrentLogo,
    hasLogo
  };
}
