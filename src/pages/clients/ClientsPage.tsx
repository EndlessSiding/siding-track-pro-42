
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Mail, Phone, MapPin, Eye, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { ClientForm } from "@/components/forms/ClientForm";
import { useApp } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  potential: "bg-blue-100 text-blue-800",
};

export default function ClientsPage() {
  const { clients, addClient } = useApp();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateClient = (clientData: any) => {
    addClient({
      ...clientData,
      createdAt: new Date().toISOString(),
      projects: [],
      totalProjectsValue: 0,
      preferredContact: "email",
    });
    setIsDialogOpen(false);
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('clients.title')}</h1>
          <p className="text-muted-foreground">
            {t('clients.subtitle')}
          </p>
        </div>
        <ClientForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleCreateClient}
          onCancel={() => setIsDialogOpen(false)}
          trigger={
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t('clients.newClient')}
            </Button>
          }
        />
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('clients.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {client.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{client.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={statusColors[client.status]}>
                      {t(`clients.status.${client.status}`)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{client.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{client.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">{client.projects.length}</p>
                  <p className="text-muted-foreground">{t('clients.projects')}</p>
                </div>
                <div>
                  <p className="font-medium">${client.totalProjectsValue.toLocaleString()}</p>
                  <p className="text-muted-foreground">{t('clients.totalValue')}</p>
                </div>
              </div>

              {client.lastContact && (
                <div className="text-sm">
                  <p className="text-muted-foreground">{t('clients.lastContact')}:</p>
                  <p className="font-medium">{new Date(client.lastContact).toLocaleDateString('pt-BR')}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Link to={`/clients/${client.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Eye className="h-4 w-4" />
                    {t('clients.viewProfile')}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {t('clients.contact')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
