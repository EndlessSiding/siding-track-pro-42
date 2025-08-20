
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Team {
  id: string;
  name: string;
  members: Array<{ name: string; role: string }>;
  specialties: string[];
  currentProject?: string;
  availability: 'available' | 'busy' | 'off';
  performance: {
    efficiency: number;
    quality: number;
    safety: number;
  };
}

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedTeams: Team[] = (data || []).map(team => ({
        id: team.id,
        name: team.name,
        members: Array.isArray(team.members) ? team.members : [],
        specialties: Array.isArray(team.specialties) ? team.specialties : [],
        currentProject: team.current_project || undefined,
        availability: team.availability as 'available' | 'busy' | 'off',
        performance: {
          efficiency: team.efficiency || 0,
          quality: team.quality || 0,
          safety: team.safety || 0,
        },
      }));

      setTeams(mappedTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as equipes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTeam = async (teamData: Omit<Team, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          name: teamData.name,
          members: teamData.members,
          specialties: teamData.specialties,
          current_project: teamData.currentProject,
          availability: teamData.availability,
          efficiency: teamData.performance.efficiency,
          quality: teamData.performance.quality,
          safety: teamData.performance.safety,
        })
        .select()
        .single();

      if (error) throw error;

      const newTeam: Team = {
        id: data.id,
        name: data.name,
        members: Array.isArray(data.members) ? data.members : [],
        specialties: Array.isArray(data.specialties) ? data.specialties : [],
        currentProject: data.current_project || undefined,
        availability: data.availability as 'available' | 'busy' | 'off',
        performance: {
          efficiency: data.efficiency || 0,
          quality: data.quality || 0,
          safety: data.safety || 0,
        },
      };

      setTeams(prev => [newTeam, ...prev]);

      toast({
        title: "Sucesso",
        description: "Equipe adicionada com sucesso",
      });
    } catch (error) {
      console.error('Error adding team:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a equipe",
        variant: "destructive",
      });
    }
  };

  const updateTeam = async (id: string, teamData: Partial<Team>) => {
    try {
      const { error } = await supabase
        .from('teams')
        .update({
          name: teamData.name,
          members: teamData.members,
          specialties: teamData.specialties,
          current_project: teamData.currentProject,
          availability: teamData.availability,
          efficiency: teamData.performance?.efficiency,
          quality: teamData.performance?.quality,
          safety: teamData.performance?.safety,
        })
        .eq('id', id);

      if (error) throw error;

      setTeams(prev => prev.map(team => 
        team.id === id ? { ...team, ...teamData } : team
      ));

      toast({
        title: "Sucesso",
        description: "Equipe atualizada com sucesso",
      });
    } catch (error) {
      console.error('Error updating team:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a equipe",
        variant: "destructive",
      });
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTeams(prev => prev.filter(team => team.id !== id));

      toast({
        title: "Sucesso",
        description: "Equipe removida com sucesso",
      });
    } catch (error) {
      console.error('Error deleting team:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a equipe",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return {
    teams,
    isLoading,
    addTeam,
    updateTeam,
    deleteTeam,
    refetch: fetchTeams,
  };
};
