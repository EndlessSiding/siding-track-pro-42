
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Quote } from "@/types/financial";

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchQuotes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedQuotes: Quote[] = (data || []).map(quote => ({
        id: quote.id,
        clientId: quote.client_id || '',
        projectName: quote.project_name,
        status: quote.status as "draft" | "sent" | "approved" | "rejected" | "expired",
        totalAmount: Number(quote.total_amount),
        validUntil: quote.valid_until || '',
        createdDate: quote.created_at.split('T')[0], // Extract date from timestamp
        items: Array.isArray(quote.items) ? quote.items : [],
      }));

      setQuotes(mappedQuotes);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os orçamentos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addQuote = async (quoteData: Omit<Quote, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .insert({
          id: `QT-${Date.now()}`,
          client_id: quoteData.clientId,
          project_name: quoteData.projectName,
          status: quoteData.status,
          total_amount: quoteData.totalAmount,
          valid_until: quoteData.validUntil,
          items: quoteData.items,
        })
        .select()
        .single();

      if (error) throw error;

      const newQuote: Quote = {
        id: data.id,
        clientId: data.client_id || '',
        projectName: data.project_name,
        status: data.status as "draft" | "sent" | "approved" | "rejected" | "expired",
        totalAmount: Number(data.total_amount),
        validUntil: data.valid_until || '',
        createdDate: data.created_at.split('T')[0],
        items: Array.isArray(data.items) ? data.items : [],
      };

      setQuotes(prev => [newQuote, ...prev]);

      toast({
        title: "Sucesso",
        description: "Orçamento adicionado com sucesso",
      });
    } catch (error) {
      console.error('Error adding quote:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o orçamento",
        variant: "destructive",
      });
    }
  };

  const updateQuote = async (id: string, quoteData: Partial<Quote>) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({
          client_id: quoteData.clientId,
          project_name: quoteData.projectName,
          status: quoteData.status,
          total_amount: quoteData.totalAmount,
          valid_until: quoteData.validUntil,
          items: quoteData.items,
        })
        .eq('id', id);

      if (error) throw error;

      setQuotes(prev => prev.map(quote => 
        quote.id === id ? { ...quote, ...quoteData } : quote
      ));

      toast({
        title: "Sucesso",
        description: "Orçamento atualizado com sucesso",
      });
    } catch (error) {
      console.error('Error updating quote:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o orçamento",
        variant: "destructive",
      });
    }
  };

  const deleteQuote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setQuotes(prev => prev.filter(quote => quote.id !== id));

      toast({
        title: "Sucesso",
        description: "Orçamento removido com sucesso",
      });
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o orçamento",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return {
    quotes,
    isLoading,
    addQuote,
    updateQuote,
    deleteQuote,
    refetch: fetchQuotes,
  };
};
