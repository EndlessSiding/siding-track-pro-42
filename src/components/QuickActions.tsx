
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Users, Building2, FileText } from "lucide-react";
import { useState } from "react";
import ProjectForm from "@/components/forms/ProjectForm";
import { ClientForm } from "@/components/forms/ClientForm";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { useApp } from "@/contexts/AppContext";

export default function QuickActions() {
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const { addProject, addClient, addQuote } = useApp();

  const handleCreateProject = (projectData: any) => {
    addProject(projectData);
    setIsProjectDialogOpen(false);
  };

  const handleCreateClient = (clientData: any) => {
    addClient(clientData);
    setIsClientDialogOpen(false);
  };

  const handleCreateQuote = (quoteData: any) => {
    addQuote(quoteData);
    setIsQuoteDialogOpen(false);
  };

  return (
    <div className="flex gap-2 mb-6">
      {/* Novo Projeto */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Building2 className="h-4 w-4" />
            Novo Projeto
          </Button>
        </DialogTrigger>
        {isProjectDialogOpen && (
          <ProjectForm
            onSubmit={handleCreateProject}
            onCancel={() => setIsProjectDialogOpen(false)}
          />
        )}
      </Dialog>

      {/* Novo Cliente */}
      <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Users className="h-4 w-4" />
            Novo Cliente
          </Button>
        </DialogTrigger>
        {isClientDialogOpen && (
          <ClientForm
            onSubmit={handleCreateClient}
            onCancel={() => setIsClientDialogOpen(false)}
          />
        )}
      </Dialog>

      {/* Novo Orçamento */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            Novo Orçamento
          </Button>
        </DialogTrigger>
        {isQuoteDialogOpen && (
          <QuoteForm
            onSubmit={handleCreateQuote}
            onCancel={() => setIsQuoteDialogOpen(false)}
          />
        )}
      </Dialog>
    </div>
  );
}
