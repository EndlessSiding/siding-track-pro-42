
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
  const { addProject, addClient } = useApp();

  const handleCreateProject = (projectData: any) => {
    addProject(projectData);
    setIsProjectDialogOpen(false);
  };

  const handleCreateClient = (clientData: any) => {
    addClient(clientData);
    setIsClientDialogOpen(false);
  };

  const handleCreateQuote = (quoteData: any) => {
    console.log("Novo orçamento:", quoteData);
    setIsQuoteDialogOpen(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Novo Projeto */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogTrigger asChild>
          <Button className="h-16 gap-3 text-left justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200">
            <div className="p-2 bg-blue-500 text-white rounded-lg">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Novo Projeto</p>
              <p className="text-sm opacity-75">Criar um novo projeto</p>
            </div>
          </Button>
        </DialogTrigger>
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setIsProjectDialogOpen(false)}
        />
      </Dialog>

      {/* Novo Cliente */}
      <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
        <DialogTrigger asChild>
          <Button className="h-16 gap-3 text-left justify-start bg-green-50 hover:bg-green-100 text-green-700 border-green-200">
            <div className="p-2 bg-green-500 text-white rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Novo Cliente</p>
              <p className="text-sm opacity-75">Cadastrar novo cliente</p>
            </div>
          </Button>
        </DialogTrigger>
        <ClientForm
          onSubmit={handleCreateClient}
          onCancel={() => setIsClientDialogOpen(false)}
        />
      </Dialog>

      {/* Novo Orçamento */}
      <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
        <DialogTrigger asChild>
          <Button className="h-16 gap-3 text-left justify-start bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200">
            <div className="p-2 bg-purple-500 text-white rounded-lg">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Novo Orçamento</p>
              <p className="text-sm opacity-75">Criar um orçamento</p>
            </div>
          </Button>
        </DialogTrigger>
        <QuoteForm
          onSubmit={handleCreateQuote}
          onCancel={() => setIsQuoteDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
}
