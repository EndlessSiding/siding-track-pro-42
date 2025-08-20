
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CompanySettingsData {
  id?: string;
  name?: string;
  logo?: string;
  dark_logo?: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export const useCompanySettings = () => {
  const [data, setData] = useState<CompanySettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCompanySettings = async () => {
    try {
      setIsLoading(true);
      const { data: settings, error } = await supabase
        .from('company_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setData(settings || null);
    } catch (error) {
      console.error('Error fetching company settings:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações da empresa",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCompanySettings = async (updates: Partial<CompanySettingsData>) => {
    try {
      if (data?.id) {
        // Update existing settings
        const { data: updatedSettings, error } = await supabase
          .from('company_settings')
          .update(updates)
          .eq('id', data.id)
          .select()
          .single();

        if (error) throw error;
        setData(updatedSettings);
      } else {
        // Create new settings
        const { data: newSettings, error } = await supabase
          .from('company_settings')
          .insert(updates)
          .select()
          .single();

        if (error) throw error;
        setData(newSettings);
      }

      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso",
      });
    } catch (error) {
      console.error('Error updating company settings:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCompanySettings();
  }, []);

  return {
    data,
    isLoading,
    updateCompanySettings,
    refetch: fetchCompanySettings,
  };
};
