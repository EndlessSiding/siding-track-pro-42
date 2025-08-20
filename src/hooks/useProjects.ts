
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@/types/project";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedProjects: Project[] = (data || []).map(project => ({
        id: project.id,
        name: project.name,
        client: project.client_name,
        clientId: project.client_id || '',
        address: project.address,
        status: project.status as "planning" | "in-progress" | "completed" | "on-hold",
        progress: project.progress || 0,
        budget: Number(project.budget),
        spent: Number(project.spent) || 0,
        dueDate: project.due_date || '',
        startDate: project.start_date || '',
        team: Array.isArray(project.team) ? project.team : [],
        sidingType: project.siding_type || undefined,
      }));

      setProjects(mappedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os projetos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: projectData.name,
          client_name: projectData.client,
          client_id: projectData.clientId,
          address: projectData.address,
          status: projectData.status,
          progress: projectData.progress,
          budget: projectData.budget,
          spent: projectData.spent,
          due_date: projectData.dueDate,
          start_date: projectData.startDate,
          team: projectData.team,
          siding_type: projectData.sidingType,
        })
        .select()
        .single();

      if (error) throw error;

      const newProject: Project = {
        id: data.id,
        name: data.name,
        client: data.client_name,
        clientId: data.client_id || '',
        address: data.address,
        status: data.status as "planning" | "in-progress" | "completed" | "on-hold",
        progress: data.progress || 0,
        budget: Number(data.budget),
        spent: Number(data.spent) || 0,
        dueDate: data.due_date || '',
        startDate: data.start_date || '',
        team: Array.isArray(data.team) ? data.team : [],
        sidingType: data.siding_type || undefined,
      };

      setProjects(prev => [newProject, ...prev]);

      toast({
        title: "Sucesso",
        description: "Projeto adicionado com sucesso",
      });
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o projeto",
        variant: "destructive",
      });
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: projectData.name,
          client_name: projectData.client,
          client_id: projectData.clientId,
          address: projectData.address,
          status: projectData.status,
          progress: projectData.progress,
          budget: projectData.budget,
          spent: projectData.spent,
          due_date: projectData.dueDate,
          start_date: projectData.startDate,
          team: projectData.team,
          siding_type: projectData.sidingType,
        })
        .eq('id', id);

      if (error) throw error;

      setProjects(prev => prev.map(project => 
        project.id === id ? { ...project, ...projectData } : project
      ));

      toast({
        title: "Sucesso",
        description: "Projeto atualizado com sucesso",
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o projeto",
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(prev => prev.filter(project => project.id !== id));

      toast({
        title: "Sucesso",
        description: "Projeto removido com sucesso",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o projeto",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    isLoading,
    addProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
};
