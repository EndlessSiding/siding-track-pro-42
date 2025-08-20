
import { useTheme } from "@/contexts/ThemeContext";
import { useSettings } from "@/contexts/SettingsContext";

export function useLogo() {
  const { theme } = useTheme();
  const { settings } = useSettings();

  const getCurrentLogo = () => {
    // Verificar se settings existe e não é null
    if (!settings) {
      return '';
    }
    
    if (theme === 'dark' && settings.darkLogo) {
      return settings.darkLogo;
    }
    return settings.logo || '';
  };

  return {
    currentLogo: getCurrentLogo(),
    hasLogo: !!(settings && (theme === 'dark' ? settings.darkLogo || settings.logo : settings.logo))
  };
}
