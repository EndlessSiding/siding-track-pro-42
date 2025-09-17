
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Project, ProjectChecklistItem } from "@/types/project";
import { useActivityTracker } from "./useActivities";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { trackProjectCreated, trackProjectUpdated, trackProjectProgress, trackChecklistUpdated } = useActivityTracker();

  const calculateProgressFromChecklist = (checklist: ProjectChecklistItem[]): number => {
    if (!checklist || checklist.length === 0) return 0;
    const completed = checklist.filter(item => item.completed).length;
    return Math.round((completed / checklist.length) * 100);
  };

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedProjects: Project[] = (data || []).map(project => {
        const checklist = Array.isArray(project.checklist) ? project.checklist : [];
        const calculatedProgress = calculateProgressFromChecklist(checklist);
        
        return {
          id: project.id,
          name: project.name || '',
          client: project.client_name || '',
          clientId: project.client_id || '',
          address: project.address || '',
          status: project.status as "planning" | "in-progress" | "completed" | "on-hold",
          progress: calculatedProgress, // Usa o progresso calculado do checklist
          budget: Number(project.budget) || 0,
          spent: Number(project.spent) || 0,
          dueDate: project.due_date || '',
          startDate: project.start_date || '',
          team: Array.isArray(project.team) ? project.team : [],
          sidingType: project.siding_type || undefined,
          checklist: checklist,
        };
      });

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
  }, [toast]);

  const addProject = useCallback(async (projectData: Omit<Project, 'id'>) => {
    try {
      const checklist = projectData.checklist || [];
      const calculatedProgress = calculateProgressFromChecklist(checklist);

      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: projectData.name,
          client_name: projectData.client,
          client_id: projectData.clientId,
          address: projectData.address,
          status: projectData.status,
          progress: calculatedProgress,
          budget: projectData.budget,
          spent: projectData.spent,
          due_date: projectData.dueDate,
          start_date: projectData.startDate,
          team: projectData.team,
          siding_type: projectData.sidingType,
          checklist: checklist,
        })
        .select()
        .single();

      if (error) throw error;

      const newProject: Project = {
        id: data.id,
        name: data.name || '',
        client: data.client_name || '',
        clientId: data.client_id || '',
        address: data.address || '',
        status: data.status as "planning" | "in-progress" | "completed" | "on-hold",
        progress: calculatedProgress,
        budget: Number(data.budget) || 0,
        spent: Number(data.spent) || 0,
        dueDate: data.due_date || '',
        startDate: data.start_date || '',
        team: Array.isArray(data.team) ? data.team : [],
        sidingType: data.siding_type || undefined,
        checklist: checklist,
      };

      setProjects(prev => [newProject, ...prev]);

      // Track activity
      try {
        await trackProjectCreated(newProject.name, newProject.client, newProject.id);
      } catch (activityError) {
        console.error('Error tracking project creation:', activityError);
      }

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
  }, [toast, trackProjectCreated]);

  const updateProject = useCallback(async (id: string, projectData: Partial<Project>) => {
    try {
      // Get the current project to compare changes
      const currentProject = projects.find(p => p.id === id);
      
      const updateData: any = {};
      if (projectData.name !== undefined) updateData.name = projectData.name;
      if (projectData.client !== undefined) updateData.client_name = projectData.client;
      if (projectData.clientId !== undefined) updateData.client_id = projectData.clientId;
      if (projectData.address !== undefined) updateData.address = projectData.address;
      if (projectData.status !== undefined) updateData.status = projectData.status;
      if (projectData.budget !== undefined) updateData.budget = projectData.budget;
      if (projectData.spent !== undefined) updateData.spent = projectData.spent;
      if (projectData.dueDate !== undefined) updateData.due_date = projectData.dueDate;
      if (projectData.startDate !== undefined) updateData.start_date = projectData.startDate;
      if (projectData.team !== undefined) updateData.team = projectData.team;
      if (projectData.sidingType !== undefined) updateData.siding_type = projectData.sidingType;
      
      // Atualiza checklist e calcula progresso automaticamente
      if (projectData.checklist !== undefined) {
        updateData.checklist = projectData.checklist;
        const calculatedProgress = calculateProgressFromChecklist(projectData.checklist);
        updateData.progress = calculatedProgress;
        projectData.progress = calculatedProgress; // Atualiza também no estado local
      }

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setProjects(prev => prev.map(project => 
        project.id === id ? { ...project, ...projectData } : project
      ));

      // Track activities based on what changed
      try {
        if (currentProject) {
          const updatedProject = { ...currentProject, ...projectData };
          
          // Track progress change if it changed significantly (more than 5%)
          if (projectData.progress !== undefined && Math.abs(projectData.progress - (currentProject.progress || 0)) >= 5) {
            await trackProjectProgress(updatedProject.name, projectData.progress, updatedProject.id);
          }
          
          // Track checklist update if checklist was modified
          if (projectData.checklist && JSON.stringify(projectData.checklist) !== JSON.stringify(currentProject.checklist)) {
            const completedItems = projectData.checklist.filter(item => item.completed).length;
            await trackChecklistUpdated(updatedProject.name, completedItems, projectData.checklist.length, updatedProject.id);
          }
          
          // Track general project update for other changes
          const otherFields = Object.keys(projectData).filter(key => key !== 'checklist' && key !== 'progress');
          if (otherFields.length > 0) {
            await trackProjectUpdated(updatedProject.name, updatedProject.id);
          }
        }
      } catch (activityError) {
        console.error('Error tracking project update:', activityError);
      }

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
  }, [toast, projects, trackProjectUpdated, trackProjectProgress, trackChecklistUpdated]);

  const deleteProject = useCallback(async (id: string) => {
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
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    addProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
};
