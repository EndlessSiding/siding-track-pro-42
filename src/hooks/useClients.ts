
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/types/client";
import { useActivityTracker } from "./useActivities";

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { trackClientCreated } = useActivityTracker();

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedClients: Client[] = (data || []).map(client => ({
        id: client.id,
        name: client.name,
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        status: client.status as "active" | "inactive" | "potential",
        preferredContact: client.preferred_contact as "email" | "phone" | "text",
        totalProjectsValue: Number(client.total_projects_value) || 0,
        lastContact: client.last_contact || undefined,
        createdAt: client.created_at,
        projects: [], // Will be populated from projects table
      }));

      setClients(mappedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          address: clientData.address,
          status: clientData.status,
          preferred_contact: clientData.preferredContact,
          total_projects_value: clientData.totalProjectsValue,
          last_contact: clientData.lastContact,
        })
        .select()
        .single();

      if (error) throw error;

      const newClient: Client = {
        id: data.id,
        name: data.name,
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        status: data.status as "active" | "inactive" | "potential",
        preferredContact: data.preferred_contact as "email" | "phone" | "text",
        totalProjectsValue: Number(data.total_projects_value) || 0,
        lastContact: data.last_contact || undefined,
        createdAt: data.created_at,
        projects: [],
      };

      setClients(prev => [newClient, ...prev]);
      
      // Track activity
      try {
        await trackClientCreated(newClient.name, newClient.id);
      } catch (activityError) {
        console.error('Error tracking client creation:', activityError);
      }
      
      toast({
        title: "Sucesso",
        description: "Cliente adicionado com sucesso",
      });
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o cliente",
        variant: "destructive",
      });
    }
  };

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          address: clientData.address,
          status: clientData.status,
          preferred_contact: clientData.preferredContact,
          total_projects_value: clientData.totalProjectsValue,
          last_contact: clientData.lastContact,
        })
        .eq('id', id);

      if (error) throw error;

      setClients(prev => prev.map(client => 
        client.id === id ? { ...client, ...clientData } : client
      ));

      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso",
      });
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cliente",
        variant: "destructive",
      });
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClients(prev => prev.filter(client => client.id !== id));

      toast({
        title: "Sucesso",
        description: "Cliente removido com sucesso",
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o cliente",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    isLoading,
    addClient,
    updateClient,
    deleteClient,
    refetch: fetchClients,
  };
};
