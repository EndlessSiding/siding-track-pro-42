
import { useTheme } from "@/contexts/ThemeContext";
import { useSettings } from "@/contexts/SettingsContext";

export function useLogo() {
  const { theme } = useTheme();
  const { settings } = useSettings();

  const getCurrentLogo = () => {
    if (theme === 'dark' && settings.darkLogo) {
      return settings.darkLogo;
    }
    return settings.logo;
  };

  return {
    currentLogo: getCurrentLogo(),
    hasLogo: !!(theme === 'dark' ? settings.darkLogo || settings.logo : settings.logo)
  };
}
