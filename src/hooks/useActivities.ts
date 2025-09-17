import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Activity, CreateActivityData } from '@/types/activity';

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      setActivities(data || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activityData: CreateActivityData) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([activityData])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setActivities(prev => [data, ...prev.slice(0, 9)]);
      
      return data;
    } catch (err) {
      console.error('Error creating activity:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchActivities();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('activities_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activities'
        },
        (payload) => {
          console.log('New activity:', payload);
          setActivities(prev => [payload.new as Activity, ...prev.slice(0, 9)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    activities,
    loading,
    error,
    fetchActivities,
    createActivity,
  };
};

export const useActivityTracker = () => {
  const { createActivity } = useActivities();

  const trackProjectCreated = async (projectName: string, clientName: string, projectId?: string) => {
    return createActivity({
      type: 'project_created',
      title: `New project created: ${projectName}`,
      description: `Project for ${clientName}`,
      project_id: projectId,
    });
  };

  const trackProjectProgress = async (projectName: string, progress: number, projectId?: string) => {
    return createActivity({
      type: 'project_progress',
      title: `${projectName} progress updated`,
      description: `Project is now ${progress}% complete`,
      project_id: projectId,
      metadata: { progress },
    });
  };

  const trackProjectUpdated = async (projectName: string, projectId?: string) => {
    return createActivity({
      type: 'project_updated',
      title: `${projectName} updated`,
      description: `Project details have been modified`,
      project_id: projectId,
    });
  };

  const trackClientCreated = async (clientName: string, clientId?: string) => {
    return createActivity({
      type: 'client_created',
      title: `New client added: ${clientName}`,
      description: `Client profile created`,
      client_id: clientId,
    });
  };

  const trackQuoteCreated = async (projectName: string, amount: number, clientId?: string) => {
    return createActivity({
      type: 'quote_created',
      title: `Quote created for ${projectName}`,
      description: `Quote value: $${amount.toLocaleString()}`,
      client_id: clientId,
      metadata: { amount },
    });
  };

  const trackTeamAssigned = async (teamName: string, projectName: string, projectId?: string) => {
    return createActivity({
      type: 'team_assigned',
      title: `Team assigned to project`,
      description: `${teamName} assigned to ${projectName}`,
      project_id: projectId,
      metadata: { teamName },
    });
  };

  const trackChecklistUpdated = async (projectName: string, completedItems: number, totalItems: number, projectId?: string) => {
    return createActivity({
      type: 'checklist_updated',
      title: `${projectName} checklist updated`,
      description: `${completedItems} of ${totalItems} tasks completed`,
      project_id: projectId,
      metadata: { completedItems, totalItems },
    });
  };

  return {
    trackProjectCreated,
    trackProjectProgress,
    trackProjectUpdated,
    trackClientCreated,
    trackQuoteCreated,
    trackTeamAssigned,
    trackChecklistUpdated,
  };
};