
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ClientForm } from "@/components/forms/ClientForm";

export default function ClientEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { clients, updateClient } = useApp();
  const { t } = useLanguage();

  const client = clients.find(c => c.id === id);

  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('clients.notFound')}</h1>
          <p className="text-muted-foreground mb-4">{t('clients.notFoundDesc')}</p>
          <Button onClick={() => navigate('/clients')}>
            {t('clients.backToClients')}
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (clientData: any) => {
    updateClient(client.id, clientData);
    navigate(`/clients/${client.id}`);
  };

  const handleCancel = () => {
    navigate(`/clients/${client.id}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/clients/${client.id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('clients.editClient')}</h1>
          <p className="text-muted-foreground">
            {t('clients.editClient')} "{client.name}"
          </p>
        </div>
      </div>

      <ClientForm
        client={client}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
